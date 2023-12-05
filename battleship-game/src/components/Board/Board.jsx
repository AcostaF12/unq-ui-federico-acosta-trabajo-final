import { Cell } from "../Cell/Cell";
import "./Board.css";

export const Board = ({ cells, isMyBoard, onClick }) => {
  const alphabet = "ABCDEFGHIJ";
  const numberSequence = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div>
      <div className={`board ${isMyBoard ? "my-board" : "enemy-board"}`}>
        {cells.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            <div className="number-cell">{alphabet[rowIndex]}</div>
            {row.map((cell, colIndex) => (
              <Cell
                key={colIndex}
                value={
                  cells[rowIndex][colIndex] &&
                  cells[rowIndex][colIndex].value !== null
                    ? cells[rowIndex][colIndex].value
                    : "Empty"
                }
                onClick={() => onClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
