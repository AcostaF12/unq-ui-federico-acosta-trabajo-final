import { Cell } from '../Cell/Cell';
import './Board.css';

export const Board = ({ cells, onClick, isMyBoard, ships }) => {
  const getShipType = (row, col) => {
    if (isMyBoard) {
      for (const ship in ships) {
        if (ships[ship].positions.some(([shipRow, shipCol]) => shipRow === row && shipCol === col)) {
          return ship;
        }
      }
    }
    return null;
  };

  return (
    <div className={`board ${isMyBoard ? 'my-board' : 'enemy-board'}`}>
      {cells.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <Cell
              key={colIndex}
              value={cell}
              onClick={() => onClick(rowIndex, colIndex, selectedShip, selectedOrientation)}
              isShip={isMyBoard ? getShipType(rowIndex, colIndex) !== null : false}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
