import "./Cell.css";

export const Cell = ({ value, onClick }) => {
  const hasShip = value === "Ship";
  const isMiss = value === "Miss";
  const isHit = value === "Hit";
  const isSunk = value === "Sunk";
  const isEmpty = value === "Empty";

  const cellClasses = {
    myCell: true,
    "my-cell-notHit": isEmpty,
    "my-cell-ship": hasShip,
    "my-cell-miss": isMiss,
    "my-cell-hit": isHit,
    "my-cell-sunk": isSunk,
  };

  const handleClick = () => {
    if (!isMiss && !isHit && !isSunk) {
      onClick();
    }
  };

  return (
    <div
      className={Object.keys(cellClasses).filter((key) => cellClasses[key]).join(" ")}
      onClick={handleClick}
    >
    </div>
  );
};