import { Cell } from "../Cell/Cell";
import "./Board.css";

export const Board = ({ cells, isMyBoard, onClick, isPlayerTurn, gameStarted }) => {
  const alphabet = "ABCDEFGHIJ";
  const numberSequence = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className={`boards-container ${gameStarted && isPlayerTurn ? 'inactive-board' : ''}`}>
      <div className="number-column">
        {numberSequence.map((number, index) => (
          <div key={index} className="number-cell">{number}</div>
        ))}
      </div>
      <div className={`board ${isMyBoard ? "my-board" : "enemy-board"}`}>
        {cells.map((row, colIndex) => (
          <div key={colIndex} className="row">
            <div className="letter-cell">{alphabet[colIndex]}</div>
            {row.map((cell, rowIndex) => (
              <Cell
                key={rowIndex}
                value={
                  cells[colIndex][rowIndex] &&
                  cells[colIndex][rowIndex].value !== null
                    ? cells[colIndex][rowIndex].value
                    : "Empty"
                }
                onClick={() => onClick(colIndex, rowIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
