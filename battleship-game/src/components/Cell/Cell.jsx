import "./Cell.css"

export const Cell = ({ value, onClick, isShip }) => {
  return (
    <div
      className={`cell ${isShip ? 'ship-cell' : ''}`}
      onClick={onClick}
    >
      {value}
    </div>
  );
};