import tmi from "tmi.js";
import { credentials } from "./config.js";
import { tabien } from "./ascii.js";
import { v4 } from "uuid";

import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

await db.read()
db.data ||= { chistes: [] }; // Node >= 15.x
await db.write();

const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: credentials.username,
    password: credentials.password,
  },
  channels: ["fazttech"],
});

client.connect();

client.on("message", async (channel, tags, message, self) => {
  // Ignore echoed messages.
  if (self) return;

  if (message.toLowerCase() === "!hello") {
    // "@alca, heya!"
    client.say(channel, `@${tags.username}, heya!`);
  }

  if (message.toLowerCase() === "!tabien") {
    client.say(channel, tabien);
  }

  if (message.toLowerCase() === "!redes") {
    client.say(
      channel,
      "Sígueme en mis redes sociales: https://faztweb.com/social"
    );
  }

  if (message.toLowerCase() === "!redes") {
    client.say(
      channel,
      "Sígueme en mis redes sociales: https://faztweb.com/social"
    );
  }

  if (message.toLowerCase().includes("!add")) {
    const params = message.toLocaleLowerCase().split(" ");
    const num1 = parseInt(params[1]);
    const num2 = parseInt(params[2]);
    client.say(channel, `@${tags.username}: ${num1 + num2}`);
  }

  //chistes command
  if (message.toLowerCase().includes("!chiste")) {
    const params = message.toLocaleLowerCase().split(" ");

    if (params.length === 1) {
      const random = Math.floor(Math.random() * db.data.chistes.length);
      return client.say(channel, `@${tags.username}: ${db.data.chistes[random].chiste}`);
    }

    const words = params.slice(1);
    const chiste = words.join(" ");

    db.data.chistes.push({
      id: v4(),
      chiste,
      comediante: tags.username,
    });
    await db.write();
    client.say(channel, `tu chiste fue guardado, @${tags.username}`);
  }
});
