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
  const [player1Board, setPlayer1Board] = useState(initializeBoard);
  const [player2Board, setPlayer2Board] = useState(initializeBoard);
  const [player1Ships, setPlayer1Ships] = useState([]);
  const [player2Ships, setPlayer2Ships] = useState([]);

  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedOrientation, setSelectedOrientation] = useState(null);

  const [gameHasStarted, setGameHasStarted] = useState(false);

  const ships = {
    carrier: { length: 5 },
    cruiser: { length: 4 },
    submarine: { length: 3 },
    boat: { length: 2 },
  };

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
        player1Board
      );

      if (isValidPlacement && !player1Ships.some((ship) => ship.type === shipType)) {
        const updatedBoard = updateBoardWithShip(
          row,
          col,
          shipLength,
          orientation,
          player1Board
        );

        setPlayer1Board(updatedBoard.board);
        setPlayer1Ships([...player1Ships, { type: shipType, initialPosition: {col, row}, orientation: selectedOrientation, isSunk: false }]);
      }
    }
  };

  function isReady() {
    return player1Ships.length === 4;
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
    if (gameHasStarted) {
      const isHit = player2Board[row][col].value === "Ship";
      const newBoard = [...player2Board];
      newBoard[row][col].value = isHit ? "Hit" : "Miss";
      setPlayer2Board(newBoard);

      if (isHit) {
        const ship = player2Ships.find((ship) => {
          if (ship.orientation === "Vertical") {
            return (
              ship.initialPosition.col === col &&
              ship.initialPosition.row <= row &&
              ship.initialPosition.row + ship.type.length - 1 >= row
            );
          } else if (ship.orientation === "Horizontal") {
            return (
              ship.initialPosition.row === row &&
              ship.initialPosition.col <= col &&
              ship.initialPosition.col + ship.type.length - 1 >= col
            );
          }
        });

        const isSunk = checkIfShipIsSunk(ship, newBoard);
        if (isSunk) {
          const newShips = player2Ships.map((ship) => {
            if (ship.type === ship.type) {
              return { ...ship, isSunk: true };
            } else {
              return ship;
            }
          });
          setPlayer2Ships(newShips);
        }
      }
    }
  }

  const checkIfShipIsSunk = (ship, board) => {
    if (ship.orientation === "Vertical") {
      for (let i = 0; i < ship.type.length; i++) {
        const newRow = ship.initialPosition.row + i;
        const newCol = ship.initialPosition.col;

        if (board[newRow][newCol].value !== "Hit") {
          return false;
        }
      }
    } else if (ship.orientation === "Horizontal") {
      for (let i = 0; i < ship.type.length; i++) {
        const newRow = ship.initialPosition.row;
        const newCol = ship.initialPosition.col + i;

        if (board[newRow][newCol].value !== "Hit") {
          return false;
        }
      }
    }
    return true;
  }

  const placeRandomShips = (board) => {
    const placedShips = [];
  
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
          board
        );
      }
  
      const updatedBoard = updateBoardWithShip(
        randomRow,
        randomCol,
        ships[shipType].length,
        randomOrientation,
        board
      );
  
      board = updatedBoard.board;
  
      placedShips.push({
        type: shipType,
        initialPosition: { col: randomCol, row: randomRow },
        orientation: randomOrientation,
        isSunk: false,
      });
    });
  
    return { board, placedShips };
  };
  
  const handlePlayer1RandomBoard = () => {
    const { board, placedShips } = placeRandomShips(initializeBoard());
    setPlayer1Board(board);
    setPlayer1Ships(placedShips);
  };
  
  const handlePlayer2RandomBoard = () => {
    const { board, placedShips } = placeRandomShips(initializeBoard());
    setPlayer2Board(board);
    setPlayer2Ships(placedShips);
  };

  const getRandomPosition = () => {
    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);
    return { row, col };
  };

  const handlePlayer1ResetBoard = () => {
    setPlayer1Board(initializeBoard());
    setPlayer1Ships([]);
  };

  const handlePlayButtonClick = () => {
    setGameHasStarted(true);

    handlePlayer2RandomBoard();
  };

  return (
    <div>
      <h1 className="mainTitle-text">Battleship Game</h1>
      {isReady() && !gameHasStarted && (
        <button className="play-button" onClick={handlePlayButtonClick}>
          Play
        </button>
      )}
      <div className="boards-container">
        <div className="board-column">
          <h2 className="secondaryTitle-text secondaryTitle-text-myBoard">
            My Board
          </h2>
          <Board
            cells={player1Board}
            onClick={handleMyBoardClick}
            isMyBoard={true}
            ships={player1Ships}
          />
          {!gameHasStarted && (
            <ShipSelectionMenu
              onSelectShip={(ship) => setSelectedShip(ship)}
              onSelectOrientation={(orientation) =>
                setSelectedOrientation(orientation)
              }
              placedShips={player1Ships}
            />
          )}
          <div className="button-container">
            <button className="reset-button" onClick={handlePlayer1ResetBoard}>
              <img
                src="../src/assets/battleship-deleteBoard-icon.png"
                className="reset-icon"
              />
              Reset
            </button>
            <button className="random-button" onClick={handlePlayer1RandomBoard}>
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
            cells={player2Board}
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
