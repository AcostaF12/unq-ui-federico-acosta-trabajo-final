import { useEffect, useState } from "react";
import "./Cell.css"

export const Cell = ({ value, onClick }) => {

  const hasShip = value === "Ship";

  return (
    <div className={`cell ${hasShip ? 'cell-ship' : ''}`} onClick={onClick}>
    </div>
  );
};
