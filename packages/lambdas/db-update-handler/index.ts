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
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    // Create a new PostgreSQL client using the connection string from the environment.
    const client = new Client({
      connectionString: process.env.DB_CONNECTION_STRING,
    });
    console.log("Connecting to PostgreSQL database...");
    await client.connect();
    console.log("Connected to PostgreSQL database.");

    // Process each SQS record.
    for (const record of event.Records) {
      console.log("Processing SQS record with messageId:", record.messageId);
      const parsedBody: SQSTaskMessage = JSON.parse(record.body);
      console.log("Parsed SQS record body:", parsedBody);
      const {
        user_id,
        name,
        duration,
        due_date,
        reminder_time,
        repeat_rule,
        is_complete,
      } = parsedBody;

      const upsertUserQuery = `
    INSERT INTO users (id, stripe_customer_id)
    VALUES ($1, NULL)
    ON CONFLICT (id) DO NOTHING;
  `;
      console.log("Executing upsert for user_id:", user_id);
      await client.query(upsertUserQuery, [user_id]);

      const taskInsertQuery = `
    INSERT INTO tasks (user_id, name, duration, due_date, reminder_time, repeat_rule, is_complete, priority)
    VALUES ($1, $2, $3, $4, $5, $6, $7, null);
  `;
      const taskQueryParams = [
        user_id,
        name,
        duration,
        due_date,
        reminder_time,
        repeat_rule,
        is_complete,
      ];

      console.log(
        "Executing INSERT query for task with parameters:",
        taskQueryParams
      );
      await client.query(taskInsertQuery, taskQueryParams);
    }
    
    console.log("All records processed. Closing database connection.");
    await client.end();
    console.log("Database connection closed. Returning success response.");

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
