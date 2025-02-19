import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "pg";

// Define __dirname for ESM modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handler = async (event) => {
  try {
    // Read the initialization SQL file packaged with your Lambda.
    const initSqlPath = path.join(__dirname, "db-init.sql");
    const initSql = fs.readFileSync(initSqlPath, "utf-8");

    // Connect to your Aurora PostgreSQL DB. (Ensure DB_CONNECTION_STRING is set.)
    const client = new Client({
      connectionString: process.env.DB_CONNECTION_STRING,
    });
    await client.connect();

    // Execute the SQL script.
    await client.query(initSql);

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Database initialized successfully." }),
    };
  } catch (error) {
    console.error("Error initializing database:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
