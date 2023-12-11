import { Cell } from "../Cell/Cell";
import "./Board.css";

export const Board = ({ cells, isMyBoard, onClick, isPlayerTurn, gameStarted, gameOver }) => {
  const alphabet = "ABCDEFGHIJ";
  const numberSequence = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div
      className={`my-boards-container 
    ${
      (!isMyBoard && !gameStarted) ||
      (gameStarted && isPlayerTurn) ||
      (!isMyBoard && isPlayerTurn) ||
      gameOver
        ? "my-inactive-board"
        : ""
    } 
    ${gameStarted && isMyBoard || !isMyBoard && isPlayerTurn || gameOver ? "my-notClickable-board" : ""}`}
    >
      <div className="my-number-column">
        {numberSequence.map((number, index) => (
          <div key={index} className="my-number-cell">
            {number}
          </div>
        ))}
      </div>
      <div
        className={`my-board ${isMyBoard ? "my-my-board" : "my-enemy-board"}`}
      >
        {cells.map((row, colIndex) => (
          <div key={colIndex} className="my-row">
            <div className="my-letter-cell">{alphabet[colIndex]}</div>
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
