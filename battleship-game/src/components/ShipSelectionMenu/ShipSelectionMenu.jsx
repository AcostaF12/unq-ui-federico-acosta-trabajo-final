import { useState } from 'react';
import './ShipSelectionMenu.css';

import battleshipCarrierImage from '../../assets/battleship-carrier-image.webp';
import battleshipCruiserImage from '../../assets/battleship-cruiser-image.jpg';
import battleshipSubmarineImage from '../../assets/battleship-submarine-image.png';
import battleshipBoatImage from '../../assets/battleship-boat-image.jpeg';

export const ShipSelectionMenu = ({ onSelect, onChangeOrientation }) => {
  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedOrientation, setSelectedOrientation] = useState("horizontal");

  const shipTypes = [
    { type: 'Carrier (5 cells)', image: battleshipCarrierImage, length: 5 },
    { type: 'Cruiser (4 cells)', image: battleshipCruiserImage, length: 4 },
    { type: 'Submarine (3 cells)', image: battleshipSubmarineImage, length: 3 },
    { type: 'Boat (2 cells)', image: battleshipBoatImage, length: 2 },
  ];

  return (
    <div className="ship-selection-container">
      <div className="ship-selection-menu">
    <div className="ship-selection-menu">
      <h3>Select a Ship:</h3>
      <div className="orientation-buttons">
        <button
          className={`orientation-button ${selectedOrientation === 'horizontal' ? 'selected' : ''}`}
          onClick={() => {
            setSelectedOrientation('horizontal');
            onChangeOrientation('horizontal');
          }}
        >
          Horizontal
        </button>
        <button
          className={`orientation-button ${selectedOrientation === 'vertical' ? 'selected' : ''}`}
          onClick={() => {
            setSelectedOrientation('vertical');
            onChangeOrientation('vertical');
          }}
        >
          Vertical
        </button>
      </div>
      <ul className="ship-list">
        {shipTypes.map((ship) => (
          <li
            key={ship.type}
            className={`ship-list-item ${selectedShip === ship.type ? 'selected' : ''}`}
            onClick={() => {
              setSelectedShip(ship.type);
              onSelect({ type: ship.type, orientation: selectedOrientation });
            }}
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
    </div>
  );  
};
