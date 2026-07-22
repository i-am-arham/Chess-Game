import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager.js";
const wss = new WebSocketServer({ port: 8000 });
const gameManager = new GameManager();
wss.on("connection", (ws) => {
    console.log("CONNECTED");
    ws.on("close", () => {
        console.log("DISCONNECTED");
    });
    ws.on("error", console.error);
    gameManager.addUser(ws);
    ws.on("close", () => gameManager.removeUser(ws));
});
//# sourceMappingURL=index.js.map