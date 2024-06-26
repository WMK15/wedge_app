import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Home } from "@mui/icons-material";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <Box sx={{
      color: "white",
      mt: 5,
      px: 5
    }}>
      <Typography variant="h2">Welcome to Wedge - Your Ultimate Productivity Partner!</Typography>
      <Typography variant="h6">Maximize Your Efficiency and Achieve Your Goals with Wedge</Typography>
      <br /> <br />

      <Typography variant="h4">What is Wedge?</Typography>
      <Typography>Wedge is an advanced AI-driven productivity platform designed to revolutionize how you manage your tasks, track your habits, and optimize your personal productivity. By combining cutting-edge AI technology with engaging gamification elements, Wedge makes staying productive more enjoyable and effective.</Typography>

      <br /> <br />

      <Typography variant="h4">Key Features</Typography>
      <Typography variant="h6">Task Management</Typography>
      <ul>
        <li>Easily organize, prioritize, and track your tasks.
          Break down complex tasks into manageable subtasks.
        </li>
        <li>Break down complex tasks into manageable subtasks.</li>
        <li>Ask Wedge to help you generate subtasks.</li>
      </ul>

      <br /> <br />

      <Typography variant="h4">AI Chat Feature</Typography>
      <ul>
        <li>Have a productivity-related question? Just ask Wedge!</li>
        <li>Use our chat feature to get real-time answers and advice from our AI.</li>
        <li>Get tips on task management, habit formation, time management, and more.</li>
      </ul>

      <br /> <br />

      <Button component={Link} to="/dashboard" variant="contained" color="primary" size="large">
        Go to Dashboard
      </Button>

    </Box>
  );
};

export default LandingPage;
