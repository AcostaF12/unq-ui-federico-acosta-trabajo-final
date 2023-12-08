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
        {cells.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            <div className="letter-cell">{alphabet[rowIndex]}</div>
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
