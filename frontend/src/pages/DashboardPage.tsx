import React, { useEffect } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import LeftDashboardColumn from "../components/Dashboard/Layout/LeftColumn";
import Bot from "../components/Dashboard/Wedge/Bot";
import { RootState, useAppDispatch } from "../store/store";
import { getAllTasks, getBot } from "../services/api";
import AIChat from "../components/Dashboard/AIChat/AIChat";
import { AxiosError } from "axios";
import { useSelector } from "react-redux";
import CustomAlert from "../components/layout/Alerts/CustomAlert";

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { bot, tasks } = useSelector((state: RootState) => state);

  useEffect(() => {
    dispatch(getAllTasks())
      .then(() => dispatch(getBot("abc123")))
      .catch((error: AxiosError) => {
        console.error(error);
      });
    // eslint-disable-next-line
  }, []);

  return bot.fetchStatus === "loading" || tasks.fetchStatus === "loading" ? <Container sx={{
    alignContent: "center",
    height: "100%",
  }}><Typography variant="h3" color={"white"} textAlign={"center"}>Loading...</Typography></Container> :
    <Box sx={{
      display: "flex",
      height: "100%",
    }}>
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          height: "100%"
        }}
      >
        <Box textAlign={"center"}><CustomAlert /></Box>
        <Grid item xs={3}>
          <LeftDashboardColumn />
        </Grid>
        <Grid item xs={6}>
          <Grid container direction="column" spacing={2}>
            <Bot />
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <AIChat />
        </Grid>
      </Grid></Box>

};

export default DashboardPage;
