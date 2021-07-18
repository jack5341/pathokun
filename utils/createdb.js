import fs from "fs-extra";
import crypto from "crypto";
import figlet from "figlet";
import path from "path";
import inquirer from "inquirer";

(async() => {
  console.clear();
  console.log(`\x1b[34m ${figlet.textSync("Pathokun !", { horizontalLayout: "full" })} \x1b[34m
\x1b[0m Pathokun, a endpoint generater, update your content just with your frontend by HTTP GET Request!
`)
  const answers = await inquirer.prompt({name: "secretkey", type: "password", message: "Enter you SUPER SECRET KEY :"})
  fs.writeJSON(path.join(__dirname, "..", "master", ".", "db", "db.json"), {
    uuid: crypto.randomUUID(),
    secret_key: answers.secretkey,
  });
  console.log("\n Database created succesfully ! \n")
})();
