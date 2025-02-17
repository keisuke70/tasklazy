// packages/lambdas/update-task-handler/index.js
import { Client } from "pg";

export const handler = async (event) => {
  try {
    // Expect a JSON body: { "taskId": "...", "updateFields": { ... } }
    const { taskId, updateFields } = JSON.parse(event.body);
    if (!taskId || !updateFields) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing taskId or updateFields" }),
      };
    }

    const client = new Client({
      connectionString: process.env.DB_CONNECTION_STRING,
    });
    await client.connect();

    // Dynamically build the UPDATE query.
    const setClauses = [];
    const params = [];
    let idx = 1;
    for (const key in updateFields) {
      setClauses.push(`${key} = $${idx}`);
      params.push(updateFields[key]);
      idx++;
    }
    params.push(taskId);
    const query = `UPDATE tasks SET ${setClauses.join(
      ", "
    )} WHERE id = $${idx}`;

    await client.query(query, params);
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Task updated successfully" }),
    };
  } catch (error) {
    console.error("Error updating task:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
