import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE, INVALID_MOVE } from "./messages.js";
export class Game {
    player1;
    player2;
    board;
    moves;
    startTime;
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date();
        this.player1.send(JSON.stringify({ type: INIT_GAME, payload: { color: "w" } }));
        this.player2.send(JSON.stringify({ type: INIT_GAME, payload: { color: "b" } }));
    }
    getOpponent(socket) {
        if (socket === this.player1)
            return this.player2;
        if (socket === this.player2)
            return this.player1;
        return null;
    }
    makeMove(socket, move) {
        if (this.board.turn() === "w" && socket !== this.player1)
            return;
        if (this.board.turn() === "b" && socket !== this.player2)
            return;
        try {
            this.board.move(move);
        }
        catch {
            socket.send(JSON.stringify({
                type: INVALID_MOVE,
                payload: { message: "Illegal move" },
            }));
            return;
        }
        const message = JSON.stringify({ type: MOVE, payload: move });
        this.player1.send(message);
        this.player2.send(message);
        if (this.board.isGameOver()) {
            let winner;
            if (this.board.isCheckmate()) {
                winner = this.board.turn() === "w" ? "Black" : "White";
            }
            else {
                winner = "Draw";
            }
            const gameOverMessage = JSON.stringify({
                type: GAME_OVER,
                payload: { winner },
            });
            this.player1.send(gameOverMessage);
            this.player2.send(gameOverMessage);
        }
    }
    disconnect(socket) {
        const opponent = this.getOpponent(socket);
        if (opponent && opponent.readyState === 1) {
            const winner = socket === this.player1 ? "Black" : "White";
            opponent.send(JSON.stringify({
                type: GAME_OVER,
                payload: { winner: `${winner} (opponent disconnected)` },
            }));
        }
    }
}
//# sourceMappingURL=Game.js.map