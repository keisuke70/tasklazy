import fs from "fs";
import path from "path";
import { Client } from "pg";

export const handler = async (event) => {
  try {
    // Read the initialization SQL file packaged with your Lambda.
    // (Make sure that db-init.sql is included in your deployment bundle.)
    const initSqlPath = path.join(__dirname, "db-init.sql");
    const initSql = fs.readFileSync(initSqlPath, "utf-8");

    // Connect to your Aurora PostgreSQL DB. (Ideally, fetch the connection info from Secrets Manager)
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
