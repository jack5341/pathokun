import fs from "fs-extra";
import crypto from "crypto";
import figlet from "figlet";
import path from "path";
import inquirer from "inquirer";

const BLUE = `\x1b[1;34m`;
const OWN_COLOR = `\x1b[0m`;

(async() => {
  console.clear();
  console.log(`${BLUE} ${figlet.textSync("Pathokun !", { horizontalLayout: "full" })}
${OWN_COLOR} Pathokun, a endpoint generater, update your content just with your frontend by HTTP GET Request!
`)
  const answers = await inquirer.prompt({name: "secretkey", type: "password", message: "Enter you SUPER SECRET KEY :"})
  fs.mkdirpSync(path.join(__dirname, "..", "master", ".", "db"))
  fs.writeJSON(path.join(__dirname, "..", "master", ".", "db", "db.json"), {
    uuid: crypto.randomUUID(),
    secret_key: answers.secretkey,
  });
  console.log("\n Database created succesfully ! \n")
})();
