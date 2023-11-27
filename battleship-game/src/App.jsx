import { useState } from 'react';
import './App.css';
import { Board } from './components/Board/Board';

const initializeBoard = () => {
  return Array.from({ length: 10 }, () => Array(10).fill(null));
};

const App = () => {
  const [board, setBoard] = useState(initializeBoard);

  const handleClick = (row, col) => {
    // TODO: Implementar logica clickear celdas.
  };

  return (
    <div className="App">
      <h1>Battleship Game</h1>
      <Board board={board} onClick={handleClick} />
    </div>
  );
};

export default App;
