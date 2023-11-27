import "./Cell.css"

export const Cell = ({ value, onClick }) => {

  return (
    <button className="board-cell" onClick={onClick}>
      {value}
    </button>
  );
};