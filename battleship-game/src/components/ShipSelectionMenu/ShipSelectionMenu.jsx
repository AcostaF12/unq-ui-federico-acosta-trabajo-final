import { useState } from 'react';
import './ShipSelectionMenu.css';

import battleshipCarrierImage from '../../assets/battleship-carrier-image.webp';
import battleshipCruiserImage from '../../assets/battleship-cruiser-image.jpg';
import battleshipSubmarineImage from '../../assets/battleship-submarine-image.png';
import battleshipBoatImage from '../../assets/battleship-boat-image.jpeg';

export const ShipSelectionMenu = ({ onSelect }) => {
  const [selectedShip, setSelectedShip] = useState(null);

  const shipTypes = [
    { type: 'Carrier', image: battleshipCarrierImage },
    { type: 'Cruiser', image: battleshipCruiserImage },
    { type: 'Submarine', image: battleshipSubmarineImage },
    { type: 'Boat', image: battleshipBoatImage },
  ];

  return (
    <div className="ship-selection-menu">
      <h3>Select a Ship:</h3>
      <ul className="ship-list">
        {shipTypes.map((ship) => (
          <li
            key={ship.type}
            className={`ship-list-item ${selectedShip === ship.type ? 'selected' : ''}`}
            onClick={() => {
              setSelectedShip(ship.type);
              onSelect(ship.type);
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
  );
};
