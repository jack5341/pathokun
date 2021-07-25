import fs from "fs-extra";
import path from "path";

export function createDatabase() {
  console.log("Creating the database...")

  const BASE_DIR = path.join(__dirname, "../../master/db")
  const FILE_PATH = path.join(BASE_DIR, "db.json")

  if (!fs.existsSync(FILE_PATH)) {
    fs.mkdirpSync(BASE_DIR)
    fs.writeFileSync(FILE_PATH, '{"endpoint":[]}')
  }

  console.log("Created the database...")
}