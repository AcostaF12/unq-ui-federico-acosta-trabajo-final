import { Cell } from '../Cell/Cell';
import './Board.css';

export const Board = ({ cells, onClick, isMyBoard }) => {
  return (
    <div className={`board ${isMyBoard ? 'my-board' : 'enemy-board'}`}>
      {cells.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((value, colIndex) => (
            <Cell key={colIndex} value={value} onClick={() => onClick(rowIndex, colIndex)} />
          ))}
        </div>
      ))}
    </div>
  );
};