import { useEffect, useState } from "react";
import ChessBoard from "../componenst/chessboard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "GAME_OVER";

function Game() {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess.board());
          console.log("Game Initialized");

          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("Move made");

          break;
        case GAME_OVER:
          console.log("Game over");

          break;
      }
    };
  }, [socket]);

  if (!socket) return <div>Connecting...</div>;
  return (
    <>
      <div>
        <div>
          <ChessBoard board={board} />
        </div>
        <div>
          <button
            onClick={() => {
              socket.send(
                JSON.stringify({
                  type: INIT_GAME,
                }),
              );
            }}
            className="cursor-pointer"
          >
            Play
          </button>
        </div>
      </div>
    </>
  );
}

export default Game;
