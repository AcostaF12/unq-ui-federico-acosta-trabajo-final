import { useState } from "react";
import { Board } from "./components/Board/Board";
import { ShipSelectionMenu } from "./components/ShipSelectionMenu/ShipSelectionMenu";
import "./App.css";

const initializeBoard = () => {
  return Array.from({ length: 10 }, (_, rowIndex) => {
    return Array.from({ length: 10 }, (_, colIndex) => {
      return {
        row: rowIndex,
        col: colIndex,
        value: "Empty",
      };
    });
  });
};

const App = () => {
  const [myBoard, setMyBoard] = useState(initializeBoard);
  const [enemyBoard, setEnemyBoard] = useState(initializeBoard);
  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedOrientation, setSelectedOrientation] = useState(null);
  const [placedShips, setPlacedShips] = useState([]);
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

      const isValidPlacement = validateShipPlacement(
        row,
        col,
        shipLength,
        orientation,
        myBoard
      );

      if (isValidPlacement && !placedShips.includes(shipType)) {
        const updatedBoard = updateBoardWithShip(
          row,
          col,
          shipLength,
          orientation,
          myBoard
        );
        const updatedShips = {
          ...ships,
          [shipType]: { ...ships[shipType], positions: updatedBoard.positions },
        };

        setMyBoard(updatedBoard.board);
        setShips(updatedShips);
        setPlacedShips([...placedShips, shipType]);
      }
    }
  };

  function isReady() {
    return placedShips.length === 4;
  }

  const validateShipPlacement = (
    startRow,
    startCol,
    length,
    orientation,
    board
  ) => {
    if (
      startRow < 0 ||
      startRow >= board.length ||
      startCol < 0 ||
      startCol >= board[0].length
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

      if (
        newRow < 0 ||
        newRow >= board.length ||
        newCol < 0 ||
        newCol >= board[0].length
      ) {
        return false;
      }

      if (board[newRow][newCol] && board[newRow][newCol].value === "Ship") {
        return false;
      }
    }

    return true;
  };

  const updateBoardWithShip = (
    startRow,
    startCol,
    length,
    orientation,
    board
  ) => {
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

  const getRandomPosition = () => {
    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);
    return { row, col };
  };

  const handleResetBoard = () => {
    setMyBoard(initializeBoard());
    setPlacedShips([]);
    setShips({
      carrier: { length: 5, positions: [] },
      cruiser: { length: 4, positions: [] },
      submarine: { length: 3, positions: [] },
      boat: { length: 2, positions: [] },
    });
  };

  const handleRandomBoard = () => {
    let newBoard = initializeBoard();
    let newPlacedShips = []; 
    
    Object.keys(ships).forEach((shipType) => {
      let isValidPlacement = false;
      let randomRow, randomCol, randomOrientation;
  
      while (!isValidPlacement) {
        randomRow = getRandomPosition().row;
        randomCol = getRandomPosition().col;
        randomOrientation = Math.random() < 0.5 ? "Horizontal" : "Vertical";
  
        isValidPlacement = validateShipPlacement(
          randomRow,
          randomCol,
          ships[shipType].length,
          randomOrientation,
          newBoard
        );
      }
  
      const updatedBoard = updateBoardWithShip(
        randomRow,
        randomCol,
        ships[shipType].length,
        randomOrientation,
        newBoard
      );
  
      newBoard = updatedBoard.board;
      newPlacedShips.push(shipType);
    });  
  
    setMyBoard(newBoard); 
    setPlacedShips(newPlacedShips); 
  };
  
  return (
    <div>
      <h1 className="mainTitle-text">Battleship Game</h1>
      {isReady() && (
        <button className="play-button" onClick={null}>
          Play
        </button>
      )}
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
          <ShipSelectionMenu
            onSelectShip={(ship) => setSelectedShip(ship)}
            onSelectOrientation={(orientation) =>
              setSelectedOrientation(orientation)
            }
            placedShips={placedShips}
          />
          <div className="button-container">
            <button className="reset-button" onClick={handleResetBoard}>
              <img
                src="../src/assets/battleship-deleteBoard-icon.png"
                className="reset-icon"
              />
              Reset
            </button>
            <button className="random-button" onClick={handleRandomBoard(myBoard)}>
              <img
                src="../src/assets/battleship-randomBoard-icon.png"
                className="random-icon"
              />
              Random
            </button>
          </div>
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
    </div>
  );
};

export default App;
