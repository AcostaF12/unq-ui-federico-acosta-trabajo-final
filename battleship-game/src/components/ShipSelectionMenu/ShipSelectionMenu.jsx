// ShipSelectionMenu.js

import React, { useState } from 'react';
import './ShipSelectionMenu.css';

export const ShipSelectionMenu = ({ onSelect }) => {
  const [selectedShip, setSelectedShip] = useState(null);

  const shipTypes = ['carrier', 'cruiser', 'submarine', 'boat'];

  return (
    <div className="ship-selection-menu">
      <h3>Select a Ship:</h3>
      <ul className="ship-list">
        {shipTypes.map((shipType) => (
          <li
            key={shipType}
            className={`ship-list-item ${selectedShip === shipType ? 'selected' : ''}`}
            onClick={() => {
              setSelectedShip(shipType);
              onSelect(shipType);
            }}
          >
            {shipType}
          </li>
        ))}
      </ul>
    </div>
  );
};
