import type { Color, PieceSymbol, Square } from "chess.js";

type ChessBoardProps = {
  board: {
    square: Square;
    type: PieceSymbol;
    color: Color;
  }[][];
};

export default function ChessBoard({ board }: ChessBoardProps) {
  return (
    <div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((piece, colIndex) => (
            <div
              key={colIndex}
              style={{
                width: 60,
                height: 60,
                border: "1px solid black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {piece?.type}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
