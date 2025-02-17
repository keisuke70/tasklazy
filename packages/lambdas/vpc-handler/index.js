// packages/lambdas/vpc-handler/index.js
import { Client } from "pg";

export const handler = async (event) => {
  try {
    // Connect to the Aurora database using the connection string.
    const client = new Client({
      connectionString: process.env.DB_CONNECTION_STRING,
    });
    await client.connect();

    // Query for incomplete tasks ordered by priority.
    const res = await client.query(
      "SELECT * FROM tasks WHERE is_complete = false ORDER BY priority ASC"
    );
    const tasks = res.rows;

    // Compute a simple schedule.
    const schedule = computeSchedule(tasks);

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(schedule),
    };
  } catch (error) {
    console.error("Error in generate-schedule lambda:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function computeSchedule(tasks) {
  // For demonstration: start the day at 08:00 (480 minutes from midnight)
  const baseTimeMinutes = 8 * 60;
  let currentTime = baseTimeMinutes;
  return tasks.map((task) => {
    const startTime = minutesToTime(currentTime);
    currentTime += task.duration;
    const endTime = minutesToTime(currentTime);
    return {
      taskId: task.id,
      taskName: task.name,
      startTime,
      endTime,
      priority: task.priority,
    };
  });
}

function minutesToTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (totalMinutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}
