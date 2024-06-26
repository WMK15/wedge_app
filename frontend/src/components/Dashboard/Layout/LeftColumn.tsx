import { Box, Grid } from "@mui/material";
import TaskList from "../Tasks/TaskList";

const LeftDashboardColumn: React.FC = () => {
  return (
    <Box
      sx={{
        mt: 2,
        bgcolor: "rgb(0,0,0,0.5)",
        height: "100%",
      }}
    >
      <Grid container direction="column" spacing={2} px={2}>
        <Grid item>
          <TaskList />
        </Grid>
        <Grid item></Grid>
      </Grid>
    </Box>
  );
};

export default LeftDashboardColumn;
