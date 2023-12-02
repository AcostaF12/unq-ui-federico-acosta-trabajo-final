import { useState } from "react";
import { Board } from "./components/Board/Board";
import { ShipSelectionMenu } from "./components/ShipSelectionMenu/ShipSelectionMenu";
import "./App.css";

const initializeBoard = () => {
  return Array.from({ length: 10 }, () => Array(10).fill(null));
};

const App = () => {
  const [myBoard, setMyBoard] = useState(initializeBoard);
  const [enemyBoard, setEnemyBoard] = useState(initializeBoard);
  const [selectedShip, setSelectedShip] = useState('None');
  const [selectedOrientation, setSelectedOrientation] = useState('None');
  const [ships, setShips] = useState({
    carrier: { length: 5, positions: [] },
    cruiser: { length: 4, positions: [] },
    submarine: { length: 3, positions: [] },
    boat: { length: 2, positions: [] },
  });

  const handleMyBoardClick = (row, col) => {
    if (selectedShip) {
      const shipType = selectedShip.type;
      const shipLength = selectedShip.length;
      const orientation = selectedOrientation;
      
      const isValidPlacement = validateShipPlacement(row, col, shipLength, orientation, myBoard);
      
      if (isValidPlacement) {
        const updatedBoard = updateBoardWithShip(row, col, shipLength, orientation, myBoard);
        const updatedShips = { ...ships, [shipType]: { ...ships[shipType], positions: updatedBoard.positions } };
  
        setMyBoard(updatedBoard.board);
        setShips(updatedShips);
      }
    }
  };

  const validateShipPlacement = (startRow, startCol, length, orientation, board) => {
    if (
      startRow < 0 || startRow >= board.length ||
      startCol < 0 || startCol >= board[0].length
    ) {
      return false;
    }
  
    for (let i = 0; i < length; i++) {
      let newRow, newCol;
  
      if (orientation === "Vertical") {
        newRow = startRow;
        newCol = startCol + i;
      } else if (orientation === "Horizontal") {
        newRow = startRow + i;
        newCol = startCol;
      }
  
      if (newRow < 0 || newRow >= board.length || newCol < 0 || newCol >= board[0].length) {
        return false;
      }
  
      if (board[newRow][newCol] && board[newRow][newCol].value === "Ship") {
        return false;
      }
    }
  
    return true;
  };

  const updateBoardWithShip = (startRow, startCol, length, orientation, board) => {
    const newBoard = [...board];
    const positions = [];
  
    if (orientation === "Vertical") {
      for (let i = 0; i < length; i++) {
        const newRow = startRow;
        const newCol = startCol + i;
        positions.push({ row: newRow, col: newCol });
  
        newBoard[newRow][newCol] = { value: "Ship" };
      }
    } else if (orientation === "Horizontal") {
      for (let i = 0; i < length; i++) {
        const newRow = startRow + i;
        const newCol = startCol;
        positions.push({ row: newRow, col: newCol });
  
        newBoard[newRow][newCol] = { value: "Ship" };
      }
    }
    return { board: newBoard, positions };
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
            ships={null}
          />
        </div>
      </div>
      <ShipSelectionMenu
        onSelectShip={(ship) => setSelectedShip(ship)}
        onSelectOrientation={(orientation) => setSelectedOrientation(orientation)}
      />
    </div>
  );
};

export default App;
