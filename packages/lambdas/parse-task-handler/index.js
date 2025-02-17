// packages/lambdas/parse-task-handler/index.js
import fetch from "node-fetch";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export const handler = async (event) => {
  try {
    // Expect a POST with JSON body: { "taskDescription": "..." }
    const { taskDescription } = JSON.parse(event.body);

    // Call the external Gemini API
    const geminiResponse = await fetch("https://api.gemini.example.com/parse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({ text: taskDescription }),
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }
    const parsedTasks = await geminiResponse.json();

    // Publish parsed tasks to SQS
    const sqsClient = new SQSClient({ region: process.env.AWS_REGION });
    const command = new SendMessageCommand({
      QueueUrl: process.env.SQS_GEMINI_RESULTS_URL,
      MessageBody: JSON.stringify(parsedTasks),
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
