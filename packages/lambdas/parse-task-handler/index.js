import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export const handler = async (event) => {
  try {
    // Expect a POST with JSON body: { "taskDescription": "...", "userTimezone": "America/New_York" }
    const { taskDescription, userTimezone } = JSON.parse(event.body);

    // Compute the user's local date in YYYY-MM-DD format using their timezone.
    const todayLocal = new Date().toLocaleDateString("en-CA", {
      timeZone: userTimezone,
    });

    // Build a detailed prompt with explicit instructions including default values.
    const prompt = `
You are an expert task parser. Parse the following task description into a JSON object that strictly adheres to the provided schema.
User's local date: "${todayLocal}".
Task Description: ${taskDescription}
`;

    const taskSchema = {
      description: "Structured task information",
      type: SchemaType.OBJECT,
      properties: {
        name: {
          type: SchemaType.STRING,
          description: "Task name",
          nullable: false,
        },
        duration: {
          type: SchemaType.INTEGER,
          description: "Duration in minutes (default 0 if unspecified)",
          nullable: false,
        },
        due_date: {
          type: SchemaType.STRING,
          description: "Due date in YYYY-MM-DD format or null if not provided",
          nullable: true,
        },
        reminder_time: {
          type: SchemaType.STRING,
          description:
            "Reminder time as ISO 8601 timestamp or null if not provided",
          nullable: true,
        },
        repeat_rule: {
          type: SchemaType.STRING,
          description:
            'Repeat rule: one of "None", "Daily", "Weekly", or "Monthly" (default "None")',
          nullable: false,
        },
      },
      required: ["name"],
    };

    // Instantiate the Gemini client using the SDK.
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Get the generative model with the response configuration to enforce structured JSON output.
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: taskSchema,
      },
    });

    // Generate the structured content based on the prompt.
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    const parsedTask = JSON.parse(responseText);

    // Publish the parsed task to SQS.
    const sqsClient = new SQSClient({ region: process.env.AWS_REGION });
    const command = new SendMessageCommand({
      QueueUrl: process.env.SQS_GEMINI_RESULTS_URL,
      MessageBody: JSON.stringify(parsedTask),
    });
    await sqsClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Task parsed and queued successfully.",
      }),
    };
  } catch (error) {
    console.error("Error in parse-task lambda:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
