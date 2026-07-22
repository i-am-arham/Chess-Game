import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import type { Color } from "chess.js"; // Use 'import type'
import ChessBoard from "../componenst/chessboard";
import { useSocket } from "../hooks/useSocket";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "GAME_OVER";
export const INVALID_MOVE = "INVALID_MOVE";

export default function Game() {
  const socket = useSocket();
  const chess = useRef(new Chess());
  const [board, setBoard] = useState(chess.current.board());
  const [playerColor, setPlayerColor] = useState<Color | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          chess.current = new Chess();
          setPlayerColor(message.payload.color);
          setBoard(chess.current.board());
          setGameStarted(true);
          setGameOver(null);
          break;

        case MOVE:
          chess.current.move(message.payload);
          setBoard(chess.current.board());
          break;

        case GAME_OVER:
          setGameOver(message.payload.winner);
          break;

        case INVALID_MOVE:
          setBoard(chess.current.board());
          console.warn("Invalid move:", message.payload.message);
          break;
      }
    };
  }, [socket]);

  if (!socket) {
    return <div>Connecting to server...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "16px" }}>
        {gameOver ? (
          <h2>Game Over! Winner: {gameOver}</h2>
        ) : gameStarted ? (
          <h2>
            You are playing as{" "}
            <strong>{playerColor === "w" ? "White" : "Black"}</strong>
            {" | "}
            Turn: {chess.current.turn() === "w" ? "White" : "Black"}
          </h2>
        ) : (
          <h2>Click "Play" to find an opponent</h2>
        )}
      </div>

      <ChessBoard
        board={board}
        onMove={(from, to) => {
          socket.send(
            JSON.stringify({
              type: MOVE,
              payload: { from, to },
            }),
          );
        }}
        playerColor={playerColor}
        turn={chess.current.turn()}
      />

      <button
        onClick={() => {
          socket.send(JSON.stringify({ type: INIT_GAME }));
        }}
        disabled={gameStarted && !gameOver}
        style={{
          marginTop: "16px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: gameStarted && !gameOver ? "not-allowed" : "pointer",
          opacity: gameStarted && !gameOver ? 0.5 : 1,
        }}
      >
        {gameStarted ? "In Game..." : "Play"}
        {/*{console.log("Game started")}*/}
      </button>
    </div>
  );
}
