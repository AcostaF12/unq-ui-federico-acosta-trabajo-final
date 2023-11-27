import { Cell } from '../Cell/Cell';
import './Board.css';

export const Board = ({ board, onClick }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((value, colIndex) => (
            <Cell key={colIndex} value={value} onClick={() => onClick(rowIndex, colIndex)} />
          ))}
        </div>
      ))}
    </div>
  );
};