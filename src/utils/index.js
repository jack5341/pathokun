import { MongoClient } from "mongodb";

export function connectDB() {
  const { DB_STRING, SECRET_KEY } = process.env;

  if (!DB_STRING && !SECRET_KEY) {
    throw "Missing environment variables";
  }

  const connect = MongoClient.connect(DB_STRING, {useNewUrlParser: true, useUnifiedTopology: true })
  return connect
}
