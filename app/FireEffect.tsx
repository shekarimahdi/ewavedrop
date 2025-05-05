import React from "react";
import "./fire-advanced.css";

export const FireEffect = () => {
  return (
    <div className="fire-container">
      <div className="fire">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="flame" />
        ))}
      </div>
      <div className="smoke-layer" />
      <div className="glow-layer" />
    </div>
  );
};
