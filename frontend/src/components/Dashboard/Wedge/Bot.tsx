import React from "react";

import WedgeIdle from "../../../assets/gifs/Wedge/Wedge_Idle.gif";
import WedgeJump from "../../../assets/gifs/Wedge/Wedge_Jump.gif";
import XPBar from "./XPBar/XPBar";
import { Box, Typography } from "@mui/material";
import { selectBot } from "../../../store/store";
import { useSelector } from "react-redux";

export const botJump = async () => {
  // Code to make the bot jump twice
  const botImage = document.getElementById("bot-image") as HTMLImageElement;
  botImage.src = WedgeJump;

  setTimeout(() => {
    botImage.src = WedgeIdle;
  }, 695); // Decreased the timeout to make the bot jump faster
};

const Bot: React.FC = () => {
  const { bot } = useSelector(selectBot);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
      onClick={botJump}
    >
      <Box sx={{ mt: "10rem" }}>
        <XPBar xp={bot.xp} maxXP={bot.levelMaxXP} />
      </Box>

      <img id="bot-image" src={WedgeIdle} alt="GIF" />

      <Box sx={{ mt: "1rem", textAlign: "center", color: "white" }}>
        <Typography variant="h3">Wedge</Typography>
        <Typography variant="subtitle1">Level: {bot.level}</Typography>
      </Box>
    </div>
  );
};

export default Bot;
