import { Client } from "discord.js"
import * as dotenv from "dotenv"
import { ShardixClient } from "./ShardixClient";
dotenv.config()



const discordClient = new Client()
const shardix = new ShardixClient(discordClient, process.env.DISCORD_TOKEN!, "http://localhost:3000")

shardix.connect()