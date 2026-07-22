import type WebSocket from "ws";
import { INIT_GAME, MOVE } from "./messages.js";
import { Game } from "./Game.js";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);

    const gameIndex = this.games.findIndex(
      (g) => g.player1 === socket || g.player2 === socket,
    );

    if (gameIndex !== -1) {
      const game = this.games[gameIndex]; // Safe now, but add check anyway
      if (game) {
        game.disconnect(socket);
        this.games.splice(gameIndex, 1);
      }
    }

    if (this.pendingUser === socket) {
      this.pendingUser = null;
    }
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === INIT_GAME) {
          if (this.pendingUser && this.pendingUser !== socket) {
            const game = new Game(this.pendingUser, socket);
            this.games.push(game);
            this.pendingUser = null;
          } else {
            this.pendingUser = socket;
          }
        }

        if (message.type === MOVE) {
          const game = this.games.find(
            (g) => g.player1 === socket || g.player2 === socket,
          );
          game?.makeMove(socket, message.payload); // Optional chaining handles undefined
        }
      } catch (e) {
        console.error("Error parsing message:", e);
      }
    });
  }
}
