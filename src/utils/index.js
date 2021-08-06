import fs from "fs-extra";
import { MongoClient } from "mongodb"
import path from "path";

export function createDatabase() {
  console.log("Checking the database...");

  const BASE_DIR = path.join(__dirname, "../../master/db");
  const FILE_PATH = path.join(BASE_DIR, "db.json");

  if (!fs.existsSync(FILE_PATH)) {
    fs.mkdirpSync(BASE_DIR);
    fs.writeFileSync(FILE_PATH, '{"endpoint":[]}');
    console.log("Created the database...");
  }

  console.log("Database settings are completed.")
}

export function checkEnv() {
  const { DB, DB_STRING, SECRET_KEY } = process.env;

  if (!DB && !DB_STRING && !SECRET_KEY) {
    throw "Missing environment variables"
  }

  switch (DB) {
    case "MONGODB":
      MongoClient.connect(DB_STRING, (err, _) => {
        if (err) {
          throw err
        }
        console.log("Connected to MongoDB");
      });
      break;

    case "POSTGRESQL":
      throw "Not implemented yet"

    default:
      throw "While check environments something went wrong..."
  }

  return createDatabase()
}
