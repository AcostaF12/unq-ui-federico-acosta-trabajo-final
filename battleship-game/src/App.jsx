import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Board } from "./components/Board/Board";
import { ShipSelectionMenu } from "./components/ShipSelectionMenu/ShipSelectionMenu";
import "bootstrap/dist/css/bootstrap.min.css";
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
  const [player1ShipsRemaining, setPlayer1ShipsRemaining] = useState(4);
  const [player2ShipsRemaining, setPlayer2ShipsRemaining] = useState(4);

  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedOrientation, setSelectedOrientation] = useState(null);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const ships = {
    carrier: { length: 5 },
    cruiser: { length: 4 },
    submarine: { length: 3 },
    boat: { length: 2 },
  };

  useEffect(() => {
    if(gameHasStarted && player2Turn && !gameOver) {
      setTimeout(() => {
        handleComputerAttack();
      }, 1500);
    }
  }, [player2Turn]);

  useEffect(() => {
    if (player1ShipsRemaining === 0 || player2ShipsRemaining === 0) {
      setGameOver(true);
      setPlayer1Turn(false);
      setPlayer2Turn(false);
      handleShow();

      if (player2ShipsRemaining === 0) {
        setScore(score + 1);
      }
    }
  }, [player1ShipsRemaining, player2ShipsRemaining]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleRestartGame = () => {
    setPlayer1Board(initializeBoard());
    setPlayer2Board(initializeBoard());
    setPlayer1Ships([]);
    setPlayer2Ships([]);
    setPlayer1Turn(false);
    setPlayer2Turn(false);
    setPlayer1ShipsRemaining(4);
    setPlayer2ShipsRemaining(4);
    setSelectedShip(null);
    setSelectedOrientation(null);
    setGameHasStarted(false);
    setGameOver(false);
    setShowModal(false);
  };

  function isReady() {
    return player1Ships.length === 4;
  }

  const handleMyBoardClick = (col, row) => {
    if (selectedShip && selectedOrientation) {
      const shipType = selectedShip.type;

      const shipLength = selectedShip.length;
      const shipPositions = calculateShipPositions(
        col,
        row,
        shipLength,
        selectedOrientation
      );

      const isValidPlacement = validateShipPositions(
        shipPositions,
        player1Board
      );

      if (
        isValidPlacement &&
        !player1Ships.some((ship) => ship.type === shipType)
      ) {
        const updatedBoard = updateBoardWithShip(shipPositions, player1Board);

        setPlayer1Board(updatedBoard);
        setPlayer1Ships([
          ...player1Ships,
          {
            type: shipType,
            positions: shipPositions,
          },
        ]);
      }
    }
  };

  const calculateShipPositions = (startCol, startRow, length, orientation) => {
    const positions = [];

    for (let i = 0; i < length; i++) {
      const newCol = orientation === "Vertical" ? startCol : startCol + i;
      const newRow = orientation === "Horizontal" ? startRow : startRow + i;

      positions.push({ col: newCol, row: newRow });
    }

    return positions;
  };

  const validateShipPositions = (positions, board) => {
    return positions.every(
      (pos) =>
        pos.row >= 0 &&
        pos.row < board.length &&
        pos.col >= 0 &&
        pos.col < board[0].length &&
        board[pos.col][pos.row].value === "Empty"
    );
  };

  const updateBoardWithShip = (positions, board) => {
    const newBoard = [...board];

    positions.forEach(({ col, row }) => {
      newBoard[col][row] = { value: "Ship" };
    });

    return newBoard;
  };

  const handleEnemyBoardClick = (col, row) => {
    if (gameHasStarted && player1Turn && !gameOver) {
      const newBoard = handleAttack(
        player2Board,
        col,
        row,
        player2Ships,
        setPlayer2Ships
      );
      setPlayer2Board(newBoard);
      setPlayer1Turn(false);
      setPlayer2Turn(true);
    }
  };

  const handleComputerAttack = () => {
    if (gameHasStarted && player2Turn && !gameOver) {
      let { col, row } = getRandomPosition();

      while (
        player1Board[col][row].value !== "Empty" &&
        player1Board[col][row].value !== "Ship"
      ) {
        ({ col, row } = getRandomPosition());
      }

      const newBoard = handleAttack(
        player1Board,
        col,
        row,
        player1Ships,
        setPlayer1Ships
      );
      setPlayer1Board(newBoard);
      setPlayer2Turn(false);
      setPlayer1Turn(true);
    }
  };

  const handleAttack = (board, col, row, playerShips) => {
    const cellValue = board[col][row].value;
    const isHit = cellValue === "Ship";
    const newBoard = markCell(board, col, row, isHit);

    if (isHit) {
      const ship = findShipByCoordinates(playerShips, col, row);

      if (ship && isShipFullyHit(newBoard, ship)) {
        markShipAsSunk(newBoard, ship);

        if (playerShips === player1Ships) {
          setPlayer1ShipsRemaining(player1ShipsRemaining - 1);
        } else if (playerShips === player2Ships) {
          setPlayer2ShipsRemaining(player2ShipsRemaining - 1);
        }
      }
    }

    return newBoard;
  };

  const markCell = (board, col, row, isHit) => {
    const newBoard = [...board];
    newBoard[col][row].value = isHit ? "Hit" : "Miss";
    return newBoard;
  };

  const findShipByCoordinates = (playerShips, col, row) => {
    return playerShips.find((ship) =>
      ship.positions.some((pos) => pos.col === col && pos.row === row)
    );
  };

  const isShipFullyHit = (board, ship) => {
    return ship.positions.every(
      (pos) => board[pos.col][pos.row].value === "Hit"
    );
  };

  const markShipAsSunk = (board, ship) => {
    ship.positions.forEach(({ col, row }) => {
      board[col][row].value = "Sunk";
    });
  };

  const placeRandomShips = (board) => {
    const placedShips = [];

    Object.keys(ships).forEach((shipType) => {
      let isValidPlacement = false;
      let randomCol, randomRow, randomOrientation;

      while (!isValidPlacement) {
        randomCol = getRandomPosition().col;
        randomRow = getRandomPosition().row;
        randomOrientation = Math.random() < 0.5 ? "Vertical" : "Horizontal";

        const shipLength = ships[shipType].length;
        const shipPositions = calculateShipPositions(
          randomCol,
          randomRow,
          shipLength,
          randomOrientation
        );

        isValidPlacement = validateShipPositions(shipPositions, board);
      }

      const shipPositions = calculateShipPositions(
        randomCol,
        randomRow,
        ships[shipType].length,
        randomOrientation
      );

      board = updateBoardWithShip(shipPositions, board);

      placedShips.push({
        type: shipType,
        positions: shipPositions,
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
      <h1 className="my-mainTitle-text">Battleship Game</h1>
      <p className="my-victoryCounter-text">Wins: {score}</p>
      {isReady() && !gameHasStarted && (
        <button className="my-play-button" onClick={handlePlayButtonClick}>
          Play
        </button>
      )}
      {gameOver && (
        <div className="my-play-again-button-container">
          <Button variant="secondary" onClick={handleRestartGame}>
            Play Again
          </Button>
        </div>
      )}
      <div className="my-boards-container">
        <div className="my-board-column">
          <h2 className="my-secondaryTitle-text my-secondaryTitle-text-myBoard">
            My Board
          </h2>
          <Board
            cells={player1Board}
            onClick={handleMyBoardClick}
            isMyBoard={true}
            ships={player1Ships}
            isPlayerTurn={player1Turn}
            gameStarted={gameHasStarted}
            gameOver={gameOver}
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
        <div className="my-board-column">
          <h2 className="my-secondaryTitle-text my-secondaryTitle-text-enemyBoard">
            Enemy Board
          </h2>
          <Board
            cells={player2Board}
            onClick={handleEnemyBoardClick}
            isMyBoard={false}
            ships={null}
            isPlayerTurn={player2Turn && !gameOver}
            gameStarted={gameHasStarted}
            gameOver={gameOver}
          />
        </div>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="my-modalTitle-text">Game Over</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {player1ShipsRemaining === 0 && (
            <p className="my-modalBody-text">You Lose... </p>
          )}
          {player2ShipsRemaining === 0 && (
            <p className="my-modalBody-text">You Win!</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default App;
