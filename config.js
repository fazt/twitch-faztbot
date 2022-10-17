import { config } from "dotenv";

config();

export const credentials = {
  username: process.env.TWITCH_USERNAME,
  password: process.env.TWITCH_OAUTH_TOKEN,
};
