import "./Cell.css";

export const Cell = ({ value, onClick }) => {
  const hasShip = value === "Ship";
  const isMiss = value === "Miss";
  const isHit = value === "Hit";
  const isSunk = value === "Sunk";
  const isEmpty = value === "Empty";

  const cellClasses = {
    cell: true,
    "cell-notHit": isEmpty,
    "cell-ship": hasShip,
    "cell-miss": isMiss,
    "cell-hit": isHit,
    "cell-sunk": isSunk,
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