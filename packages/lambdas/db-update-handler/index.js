// packages/lambdas/db-update-handler/index.js
import { Client } from "pg";

export const handler = async (event) => {
  try {
    const client = new Client({
      connectionString: process.env.DB_CONNECTION_STRING,
    });
    await client.connect();

    for (const record of event.Records) {
      const parsedBody = JSON.parse(record.body);
      const { taskId, name, duration, dueDate, reminderTime, repeatRule } =
        parsedBody;

      // Upsert task record.
      await client.query(
        `INSERT INTO tasks (id, name, duration, due_date, reminder_time, repeat_rule, is_complete)
         VALUES ($1, $2, $3, $4, $5, $6, false)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           duration = EXCLUDED.duration,
           due_date = EXCLUDED.due_date,
           reminder_time = EXCLUDED.reminder_time,
           repeat_rule = EXCLUDED.repeat_rule`,
        [taskId, name, duration, dueDate, reminderTime, repeatRule]
      );
    }

    await client.end();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "DB update complete" }),
    };
  } catch (error) {
    console.error("Error in db-update lambda:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
