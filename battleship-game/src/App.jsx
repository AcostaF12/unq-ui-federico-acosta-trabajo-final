import { useState, useEffect } from "react";
import { Board } from "./components/Board/Board";
import { ShipSelectionMenu } from "./components/ShipSelectionMenu/ShipSelectionMenu";
import "./App.css";

const initializeBoard = () => {
  return Array.from({ length: 10 }, () => {
    return Array.from({ length: 10 }, () => {
      return {
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

  const [player1Turn, setPlayer1Turn] = useState(false);
  const [player2Turn, setPlayer2Turn] = useState(false);

  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedOrientation, setSelectedOrientation] = useState(null);

  const [gameHasStarted, setGameHasStarted] = useState(false);

  const ships = {
    carrier: { length: 5 },
    cruiser: { length: 4 },
    submarine: { length: 3 },
    boat: { length: 2 },
  };

  useEffect(() => {
    setTimeout(() => {
      handleComputerAttack();
    }, 1800);
  }, [player2Turn]);

  function isReady() {
    return player1Ships.length === 4;
  }

  const handleMyBoardClick = (col, row) => {
    if (selectedShip && selectedOrientation) {
      const shipType = selectedShip.type;
      const shipLength = selectedShip.length;
      const orientation = selectedOrientation;

      const isValidPlacement = validateShipPlacement(
        col,
        row,
        shipLength,
        orientation,
        player1Board
      );

      if (
        isValidPlacement &&
        !player1Ships.some((ship) => ship.type === shipType)
      ) {
        const updatedBoard = updateBoardWithShip(
          col,
          row,
          shipLength,
          orientation,
          player1Board
        );

        setPlayer1Board(updatedBoard);
        setPlayer1Ships([
          ...player1Ships,
          {
            type: shipType,
            initialPosition: { col: col, row: row },
            length: shipLength,
            orientation: selectedOrientation,
            isSunk: false,
          },
        ]);
      }
    }
  };

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

    if (orientation === "Vertical") {
      for (let i = 0; i < length; i++) {
        const newRow = startRow;
        const newCol = startCol + i;

        newBoard[newRow][newCol] = { value: "Ship" };
      }
    } else if (orientation === "Horizontal") {
      for (let i = 0; i < length; i++) {
        const newRow = startRow + i;
        const newCol = startCol;

        newBoard[newRow][newCol] = { value: "Ship" };
      }
    }
    return newBoard;
  };

  const handleEnemyBoardClick = (row, col) => {
    if (gameHasStarted && player1Turn) {
      const newBoard = handleAttack(player2Board, row, col, player2Ships, setPlayer2Ships);
      setPlayer2Board(newBoard);
      setPlayer1Turn(false);
      setPlayer2Turn(true);
    }
  };

  const handleComputerAttack = () => {
    if (gameHasStarted && player2Turn) {
      const { row, col } = getRandomPosition();
      const newBoard = handleAttack(player1Board, row, col, player1Ships, setPlayer1Ships);
      setPlayer1Board(newBoard);
      setPlayer2Turn(false);
      setPlayer1Turn(true);
    }
  };

  const handleAttack = (board, row, col, playerShips, playerShipsSetter) => {
    const cellValue = board[row][col].value;
    const isHit = cellValue === "Ship";
    const newBoard = [...board];
    newBoard[row][col].value = isHit ? "Hit" : "Miss";

    return newBoard;
  };

  const checkIfShipIsSunk = (ship, board) => {
  };

  const markShipAsSunk = (ship, board, playerShips, playerShipsSetter) => {
  };

  const placeRandomShips = (board) => {
    const placedShips = [];

    Object.keys(ships).forEach((shipType) => {
      let isValidPlacement = false;
      let randomRow, randomCol, randomOrientation;

      while (!isValidPlacement) {
        randomCol = getRandomPosition().col;
        randomRow = getRandomPosition().row;
        randomOrientation = Math.random() < 0.5 ? "Vertical" : "Horizontal";

        isValidPlacement = validateShipPlacement(
          randomCol,
          randomRow,
          ships[shipType].length,
          randomOrientation,
          board
        );
      }
      const updatedBoard = updateBoardWithShip(
        randomCol,
        randomRow,
        ships[shipType].length,
        randomOrientation,
        board
      );

      board = updatedBoard;

      placedShips.push({
        type: shipType,
        length: ships[shipType].length,
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
    handlePlayer2RandomBoard();
    setGameHasStarted(true);
    setPlayer1Turn(true);
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
            isPlayerTurn={player1Turn}
            gameStarted={gameHasStarted}
          />
          {!gameHasStarted && (
            <ShipSelectionMenu
              onSelectShip={(ship) => setSelectedShip(ship)}
              onSelectOrientation={(orientation) =>
                setSelectedOrientation(orientation)
              }
              onRandomBoard={handlePlayer1RandomBoard}
              onResetBoard={handlePlayer1ResetBoard}
              placedShips={player1Ships}
              gameHasStarted={gameHasStarted}
            />
          )}
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
            isPlayerTurn={player2Turn}
            gameStarted={gameHasStarted}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
