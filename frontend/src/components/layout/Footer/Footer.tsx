import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";

export const Footer: React.FC = () => {
  return (
    <Box className="footer">
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center">
          <Grid item xs={12}>
            <Typography color="white" variant="h5">
              Wedge
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="white" variant="subtitle1">
              {`${new Date().getFullYear()} © W-15 Interactive. All rights reserved.`}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
