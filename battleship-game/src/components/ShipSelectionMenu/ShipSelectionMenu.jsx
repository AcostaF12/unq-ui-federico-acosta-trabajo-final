import { useState } from "react";
import "./ShipSelectionMenu.css";

import battleshipCarrierImage from "../../assets/battleship-carrier-image.webp";
import battleshipCruiserImage from "../../assets/battleship-cruiser-image.jpg";
import battleshipSubmarineImage from "../../assets/battleship-submarine-image.png";
import battleshipBoatImage from "../../assets/battleship-boat-image.jpeg";

export const ShipSelectionMenu = ({
  onSelectShip,
  onSelectOrientation,
  onRandomBoard,
  onResetBoard,
  placedShips,
  gameHasStarted
}) => {
  const [selectedShip, setSelectedShip] = useState("None");
  const [selectedOrientation, setSelectedOrientation] = useState("None");

  const shipTypes = [
    {
      type: "carrier",
      image: battleshipCarrierImage,
      length: 5,
      description: "Carrier (5 Cells)",
    },
    {
      type: "cruiser",
      image: battleshipCruiserImage,
      length: 4,
      description: "Cruiser (4 Cells)",
    },
    {
      type: "submarine",
      image: battleshipSubmarineImage,
      length: 3,
      description: "Submarine (3 Cells)",
    },
    {
      type: "boat",
      image: battleshipBoatImage,
      length: 2,
      description: "Boat (2 Cells)",
    },
  ];

  return (
    <div className="my-ship-selection-container">
      <div className="my-ship-selection-menu">
        <h3>Select a Ship:</h3>
        <div className="my-orientation-buttons">
          <button
            className={`my-orientation-button ${
              selectedOrientation === "Horizontal" ? "selected" : ""
            }`}
            onClick={() => {
              setSelectedOrientation("Horizontal");
              onSelectOrientation("Horizontal");
            }}
          >
            Horizontal
          </button>
          <button
            className={`my-orientation-button ${
              selectedOrientation === "Vertical" ? "selected" : ""
            }`}
            onClick={() => {
              setSelectedOrientation("Vertical");
              onSelectOrientation("Vertical");
            }}
          >
            Vertical
          </button>
        </div>
        <ul className="my-ship-list">
          {shipTypes.map((ship) => (
            <li
              key={ship.type}
              className={`my-ship-list-item ${
                selectedShip === ship.type ? "selected" : ""
              } ${
                placedShips.some((placedShip) => placedShip.type === ship.type)
                  ? "disabled"
                  : ""
              }`}
              onClick={() => {
                setSelectedShip(ship.type);
                onSelectShip({
                  type: ship.type,
                  length: ship.length,
                  orientation: selectedOrientation,
                });
              }}
            >
              <div
                className="my-ship-image"
                style={{ backgroundImage: `url(${ship.image})` }}
              ></div>
              {ship.description}
            </li>
          ))}
        </ul>
        {!gameHasStarted && (
          <div className="my-button-container">
            <button className="my-reset-button" onClick={onResetBoard}>
              <img
                src="../src/assets/battleship-deleteBoard-icon.png"
                className="my-reset-icon"
                alt="Reset"
              />
              Reset
            </button>
            <button className="my-random-button" onClick={onRandomBoard}>
              <img
                src="../src/assets/battleship-randomBoard-icon.png"
                className="my-random-icon"
                alt="Random"
              />
              Random
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
