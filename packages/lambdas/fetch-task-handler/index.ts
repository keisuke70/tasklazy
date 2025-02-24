import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Client, types } from "pg";

// Set parsers to return raw string values for date and timestamp types
types.setTypeParser(1082, (val) => val); // date
types.setTypeParser(1114, (val) => val); // timestamp without time zone

interface Task {
  id: string;
  user_id: string;
  name: string;
  duration: number;
  due_date: string | null;
  reminder_time: string | null;
  repeat_rule: string;
  is_complete: boolean;
  priority: number | null;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Extract userId from query string parameters or from the request body
    const userId =
      event.queryStringParameters?.userId ||
      (event.body ? JSON.parse(event.body).userId : undefined);
    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "false",
        },
        body: JSON.stringify({ error: "Missing userId" }),
      };
    }

    // Create a new PostgreSQL client using the DB connection string from environment variables.
    const client = new Client({
      connectionString: process.env.DB_CONNECTION_STRING,
    });
    await client.connect();

    // Retrieve all tasks for the given userId.
    const result = await client.query<Task>(
      "SELECT * FROM tasks WHERE user_id = $1",
      [userId]
    );
    const tasks = result.rows;

    await client.end();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "false",
      },
      body: JSON.stringify({ tasks }),
    };
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "false",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
