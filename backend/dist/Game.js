import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages.js";
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
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white",
            },
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black",
            },
        }));
    }
    makeMove(socket, move) {
        // Validations Here
        if (this.board.turn() === "w" && socket !== this.player1) {
            return;
        }
        if (this.board.turn() === "b" && socket !== this.player2) {
            return;
        }
        // IS it this users move
        // Is the move Valid
        try {
            this.board.move(move);
        }
        catch (error) {
            return;
        }
        // Update the board
        // Push the move
        // Check if the game is Over
        if (this.board.isGameOver()) {
            const message = JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            });
            this.player1.send(message);
            this.player2.send(message);
            return;
        }
        if (this.board.turn() === "b") {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move,
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move,
            }));
        }
        // Send the update board to both players
    }
}
//# sourceMappingURL=Game.js.map