import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager.js";

const wss = new WebSocketServer({ port: 8000 });

const gameManager = new GameManager();

wss.on("connection", function connection(ws) {
  console.log("connected");

  gameManager.addUser(ws);

  ws.on("close", () => gameManager.removeUser(ws));
});
