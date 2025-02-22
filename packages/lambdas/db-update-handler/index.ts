import { Client } from "pg";
import { SQSEvent, APIGatewayProxyResult } from "aws-lambda";

interface SQSTaskMessage {
  user_id: string;
  name: string;
  duration: number;
  due_date?: string | null;
  reminder_time?: string | null;
  repeat_rule: "None" | "Daily" | "Weekly" | "Monthly";
  is_complete: boolean;
}

export const handler = async (
  event: SQSEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Create a new PostgreSQL client using the connection string from the environment.
    const client = new Client({
      connectionString: process.env.DB_CONNECTION_STRING,
    });
    await client.connect();

    // Process each SQS record.
    for (const record of event.Records) {
      const parsedBody: SQSTaskMessage = JSON.parse(record.body);
      const {
        user_id,
        name,
        duration,
        due_date,
        reminder_time,
        repeat_rule,
        is_complete,
      } = parsedBody;

      // Insert a new task record.
      // The id column is omitted so that the default value (gen_random_uuid()) is used.
      await client.query(
        `INSERT INTO tasks (user_id, name, duration, due_date, reminder_time, repeat_rule, is_complete, priority)
         VALUES ($1, $2, $3, $4, $5, $6, $7, null)`,
        [
          user_id,
          name,
          duration,
          due_date,
          reminder_time,
          repeat_rule,
          is_complete,
        ]
      );
    }

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "DB update complete" }),
    };
  } catch (error: any) {
    console.error("Error in db-update lambda:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
