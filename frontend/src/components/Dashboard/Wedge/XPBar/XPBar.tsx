import { Typography } from "@mui/material";
import "./styles.css";
import React from "react";

const XPBar = ({ maxXP = 100, xp = 100 } = {}) => {
  const barWidth = (xp / maxXP) * 100;
  // setHitWidth((damage / hp) * 100);
  // setBarWidth((hpLeft / maxHp) * 100);
  return (
    <React.Fragment>
      <div className="health-bar">
        <div className="bar" style={{ width: `${barWidth}%` }}></div>
        <div className="hit" style={{ width: `${0}%` }}></div>

        <div
          style={{
            position: "absolute",
            top: "5px",
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          {xp} / {maxXP}
        </div>
      </div>

      <br />
    </React.Fragment>
  );
};

export default XPBar;
