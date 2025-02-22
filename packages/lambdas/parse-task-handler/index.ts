import { GoogleGenerativeAI, ObjectSchema, SchemaType } from "@google/generative-ai";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// Define the expected shape of the incoming request body.
interface LambdaRequestBody {
  taskDescription: string;
  userTimezone: string;
  userId: string; // provided from your frontend context
}

// Define the structure expected from the generative AI parser.
interface TaskInput {
  name: string;
  duration: number;
  due_date?: string | null;
  reminder_time?: string | null;
  repeat_rule: "None" | "Daily" | "Weekly" | "Monthly";
}

interface SQSTaskMessage extends TaskInput {
  user_id: string;
  is_complete: boolean;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    // Parse the incoming request.
    const requestBody: LambdaRequestBody = JSON.parse(event.body);
    const { taskDescription, userTimezone, userId } = requestBody;

    if (!taskDescription || !userTimezone || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Compute the user's local date in YYYY-MM-DD format using their timezone.
    const todayLocal = new Date().toLocaleDateString("en-CA", {
      timeZone: userTimezone,
    });

    // Build the prompt for the generative AI with explicit instructions.
    const prompt = `
You are an expert task parser. Parse the following task description into a JSON object that strictly adheres to the provided schema.
User's local date: "${todayLocal}".
Task Description: ${taskDescription}
`;

    const taskSchema: ObjectSchema = {
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
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

    // Get the generative model with a response configuration enforcing JSON output.
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: taskSchema,
      },
    });

    // Generate the structured content.
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    const parsedTask: TaskInput = JSON.parse(responseText);

    // Build the SQS message, including the user ID (renamed to user_id) and setting is_complete to false.
    const taskMessage: SQSTaskMessage = {
      user_id: userId,
      name: parsedTask.name,
      duration: parsedTask.duration,
      due_date: parsedTask.due_date ?? null,
      reminder_time: parsedTask.reminder_time ?? null,
      repeat_rule: parsedTask.repeat_rule || "None",
      is_complete: false,
    };

    // Publish the message to SQS.
    const sqsClient = new SQSClient({
      region: process.env.AWS_REGION,
    });
    const command = new SendMessageCommand({
      QueueUrl: process.env.SQS_GEMINI_RESULTS_URL as string,
      MessageBody: JSON.stringify(taskMessage),
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
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};
