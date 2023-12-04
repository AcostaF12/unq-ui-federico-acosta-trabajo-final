import { useState } from 'react';
import './ShipSelectionMenu.css';

import battleshipCarrierImage from '../../assets/battleship-carrier-image.webp';
import battleshipCruiserImage from '../../assets/battleship-cruiser-image.jpg';
import battleshipSubmarineImage from '../../assets/battleship-submarine-image.png';
import battleshipBoatImage from '../../assets/battleship-boat-image.jpeg';

export const ShipSelectionMenu = ({ onSelectShip, onSelectOrientation, placedShips }) => {
  const [selectedShip, setSelectedShip] = useState('None');
  const [selectedOrientation, setSelectedOrientation] = useState('None');

  const shipTypes = [
    { type: 'Carrier (5 cells)', image: battleshipCarrierImage, length: 5 },
    { type: 'Cruiser (4 cells)', image: battleshipCruiserImage, length: 4 },
    { type: 'Submarine (3 cells)', image: battleshipSubmarineImage, length: 3 },
    { type: 'Boat (2 cells)', image: battleshipBoatImage, length: 2 },
  ];

  return (
    <div className="ship-selection-container">
      <div className="ship-selection-menu">
      <h3>Select a Ship:</h3>
      <div className="orientation-buttons">
        <button
          className={`orientation-button ${selectedOrientation === 'Horizontal' ? 'selected' : ''}`}
          onClick={() => {
            setSelectedOrientation('Horizontal');
            onSelectOrientation('Horizontal');
          }}
        >
          Horizontal
        </button>
        <button
          className={`orientation-button ${selectedOrientation === 'Vertical' ? 'selected' : ''}`}
          onClick={() => {
            setSelectedOrientation('Vertical');
            onSelectOrientation('Vertical');
          }}
        >
          Vertical
        </button>
      </div>
      <ul className="ship-list">
          {shipTypes.map((ship) => (
            <li
              key={ship.type}
              className={`ship-list-item ${selectedShip === ship.type ? 'selected' : ''} ${placedShips.includes(ship.type) ? 'disabled' : ''}`}
              onClick={() => {
                setSelectedShip(ship.type);
                onSelectShip({ type: ship.type, length: ship.length, orientation: selectedOrientation });
              }}
              disabled={placedShips.includes(ship.type)}
            >
            <div
              className="ship-image"
              style={{ backgroundImage: `url(${ship.image})` }}
            ></div>
            {ship.type}
          </li>
        ))}
      </ul>
      </div>
    </div>
  );  
};
