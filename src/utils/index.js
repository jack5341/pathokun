import fs from "fs-extra";
import { MongoClient } from "mongodb"
import path from "path";

export function createDatabase() {
  console.log("Creating the database...");

  const BASE_DIR = path.join(__dirname, "../../master/db");
  const FILE_PATH = path.join(BASE_DIR, "db.json");

  if (!fs.existsSync(FILE_PATH)) {
    fs.mkdirpSync(BASE_DIR);
    fs.writeFileSync(FILE_PATH, '{"endpoint":[]}');
  }

  console.log("Created the database...");
}

export function checkEnv() {
  const { DATABASE, DB_STRING, SECRET_KEY } = process.env;

  if (!DATABASE && !DB_STRING && !SECRET_KEY) {
    console.log("Missing environment variables");
    process.exit(1);
  }

  switch (DATABASE) {
    case "MONGODB":
      MongoClient.connect(DB_STRING, (err, _) => {
        if (err) {
          console.log(err);
          process.exit(1);
        }
        console.log("Connected to MongoDB");
      });
      break;

    case "POSTGRESQL":
      console.log("Not implemented yet");
      break;

    default:
      console.log("While check environments something went wrong...");
      break;
  }
}
