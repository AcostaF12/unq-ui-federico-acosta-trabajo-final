import { useState } from "react";
import "./App.css";
import { Board } from "./components/Board/Board";
import { ShipSelectionMenu } from "./components/ShipSelectionMenu/ShipSelectionMenu";

const initializeBoard = () => {
  return Array.from({ length: 10 }, () => Array(10).fill(null));
};

const App = () => {
  const [myBoard, setMyBoard] = useState(initializeBoard);
  const [enemyBoard, setEnemyBoard] = useState(initializeBoard);

  const [ships, setShips] = useState({
    carrier: { length: 5, positions: [], isSunk: false },
    cruiser: { length: 4, positions: [], isSunk: false },
    submarine: { length: 3, positions: [], isSunk: false },
    boat: { length: 2, positions: [], isSunk: false },
  });
  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedOrientation, setSelectedOrientation] = useState("horizontal");

  const handleShipSelection = (shipType) => {
    setSelectedShip(shipType);
  };

  const handleOrientationChange = (orientation) => {
    setSelectedOrientation(orientation);
  };

  const handleMyBoardClick = (row, col) => {
    if (selectedShip) {
      const { length, positions } = ships[selectedShip];

      if (isValidShipPlacement(myBoard, row, col, length, selectedOrientation)) {
        const updatedShips = { ...ships };
        updatedShips[selectedShip].positions = calculateShipPositions(
          row,
          col,
          length,
          selectedOrientation
        );
        setShips(updatedShips);

        const updatedBoard = [...myBoard];
        placeShipOnBoard(
          updatedBoard,
          selectedShip,
          row,
          col,
          length,
          selectedOrientation
        );
        setMyBoard(updatedBoard);
      }
    }
  };

  const calculateShipPositions = (startRow, startCol, length, orientation) => {
    const positions = [];
    for (let i = 0; i < length; i++) {
      positions.push(
        orientation === "horizontal"
          ? [startRow, startCol + i]
          : [startRow + i, startCol]
      );
    }
    return positions;
  };

  const handleEnemyBoardClick = (row, col) => {
    // TODO: Implementar logica atacar.
  };

  return (
    <div>
      <h1 className="mainTitle-text">Battleship Game</h1>
      <div className="boards-container">
        <div className="board-column">
          <h2 className="secondaryTitle-text secondaryTitle-text-myBoard">
            My Board
          </h2>
          <Board
            cells={myBoard}
            onClick={handleMyBoardClick}
            isMyBoard={true}
            ships={ships}
          />
        </div>
        <div className="board-column">
          <h2 className="secondaryTitle-text secondaryTitle-text-enemyBoard">
            Enemy Board
          </h2>
          <Board
            cells={enemyBoard}
            onClick={handleEnemyBoardClick}
            isMyBoard={false}
          />
        </div>
      </div>
      <ShipSelectionMenu onSelect={handleShipSelection} onChangeOrientation={handleOrientationChange} />
    </div>
  );
};

export default App;
