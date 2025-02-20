const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

exports.handler = async function (event) {
  try {
    // __dirname is natively available in CommonJS modules.
    const initSqlPath = path.join(__dirname, "db-init.sql");
    const initSql = fs.readFileSync(initSqlPath, "utf-8");

    // Connect to your Aurora PostgreSQL DB.
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
