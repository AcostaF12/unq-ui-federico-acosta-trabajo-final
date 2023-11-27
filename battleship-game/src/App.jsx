import { useState } from 'react';
import './App.css';
import { Board } from './components/Board/Board';

const initializeBoard = () => {
  return Array.from({ length: 10 }, () => Array(10).fill(null));
};

const App = () => {
  const [myBoard, setMyBoard] = useState(initializeBoard);
  const [enemyBoard, setEnemyBoard] = useState(initializeBoard);

  const handleMyBoardClick = (row, col) => {
    // TODO: Implementar logica clickear .
  };

  const handleEnemyBoardClick = (row, col) => {
    // TODO: Implementar logica clickear.
  };

  return (
    <div>
      <h1 className="mainTitle-text">Battleship Game</h1>
      <div className="boards-container">
        <div className="board-column">
          <h2 className="secondaryTitle-text secondaryTitle-text-myBoard">My Board</h2>
          <Board cells={myBoard} onClick={handleMyBoardClick} isMyBoard={true} />
        </div>
        <div className="board-column">
          <h2 className="secondaryTitle-text secondaryTitle-text-enemyBoard">Enemy Board</h2>
          <Board cells={enemyBoard} onClick={handleEnemyBoardClick} isMyBoard={false} />
        </div>
      </div>
    </div>
  );
};

export default App;
