import { Client } from "discord.js"
import { io, Socket } from "socket.io-client";

export class ShardixClient {
  discordClient: Client
  discordToken: string
  shardixAddress: string

  socketClient: Socket

  constructor (discordClient: Client, discordToken: string, shardixAddress: string) {
    this.discordClient = discordClient
    this.discordToken = discordToken
    this.shardixAddress = shardixAddress

    this.socketClient = io(this.shardixAddress, { autoConnect: false })

    this.registerSocketEvents()
    this.registerDiscordEvents()
  }

  connect () {
    this.socketClient.connect()


  }

  private registerSocketEvents () {
    this.socketClient.on("connect", () => {
      console.log(`Connected to shardix, got ID ${this.socketClient.id}`)
    })

    this.socketClient.on("disconnect", () => {
      console.log(`Connection lost`)
    })

    this.socketClient.on("shards", shards => {
      const decoded = JSON.parse(shards)
      console.log(`Got shard IDs from server: ${decoded}`)
      this.discordClient.options.shards = decoded
    })

    this.socketClient.on("login", () => {
      console.log(`Server told us to login to Discord`)
      this.discordClient.login(this.discordToken)
    })

    this.socketClient.on("shardCount", count => {
      console.log(`Got shard count from server: ${count}`)
      this.discordClient.options.shardCount = count
    })
  }

  private registerDiscordEvents () {
    this.discordClient.on("shardDisconnect", (id) => {
      this.socketClient.emit("shardDisconnect", id)
    })

    this.discordClient.on("shardError", (id) => {
      this.socketClient.emit("shardError", id)
    })

    this.discordClient.on("shardReady", (id) => {
      this.socketClient.emit("shardReady", id)
    })

    this.discordClient.on("shardReconnecting", (id) => {
      this.socketClient.emit("shardReconnecting", id)
    })

    this.discordClient.on("shardResume", (id) => {
      this.socketClient.emit("shardResume", id)
    })
  }
}