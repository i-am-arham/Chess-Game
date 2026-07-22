import { useState } from "react";
import type { Color, PieceSymbol, Square } from "chess.js"; // Use 'import type'

const PIECE_SYMBOLS: Record<PieceSymbol, Record<Color, string>> = {
  p: { w: "♙", b: "♟" },
  r: { w: "♖", b: "♜" },
  n: { w: "♘", b: "♞" },
  b: { w: "♗", b: "♝" },
  q: { w: "♕", b: "♛" },
  k: { w: "♔", b: "♚" },
};

type ChessBoardProps = {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  onMove: (from: Square, to: Square) => void;
  playerColor?: Color | null;
  turn: Color;
};

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function ChessBoard({
  board,
  onMove,
  playerColor,
  turn,
}: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  const isFlipped = playerColor === "b";
  const rowIndices = isFlipped
    ? [0, 1, 2, 3, 4, 5, 6, 7]
    : [7, 6, 5, 4, 3, 2, 1, 0];
  const colIndices = isFlipped
    ? [7, 6, 5, 4, 3, 2, 1, 0]
    : [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div style={{ display: "inline-block" }}>
      {rowIndices.map((rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {colIndices.map((colIndex) => {
            const square = `${files[colIndex]}${8 - rowIndex}` as Square;
            const piece = board[rowIndex][colIndex];
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isSelected = selectedSquare === square;
            const canSelect =
              piece?.color === turn && piece?.color === playerColor;

            return (
              <div
                key={square}

                onClick={() => {
                  console.log(
                    "Click:",
                    square,
                    "Turn:",
                    turn,
                    "PlayerColor:",
                    playerColor,
                  );

                  if (turn !== playerColor) {
                    console.log("Not your turn or color not set!");
                    return;
                  }

                  if (!playerColor) {
                    console.log("Player color not set yet");
                    return;
                  }

                  if (!selectedSquare) {
                    if (!piece || !canSelect) return;
                    setSelectedSquare(square);
                    return;
                  }

                  if (selectedSquare === square) {
                    setSelectedSquare(null);
                    return;
                  }

                  onMove(selectedSquare, square);
                  setSelectedSquare(null);
                }}
                style={{
                  width: 64,
                  height: 64,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: canSelect || selectedSquare ? "pointer" : "default",
                  backgroundColor: isSelected
                    ? "#a8d5a2"
                    : isLight
                      ? "#f0d9b5"
                      : "#b58863",
                  fontSize: "40px",
                  userSelect: "none",
                }}
              >
                {piece ? PIECE_SYMBOLS[piece.type][piece.color] : ""}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
