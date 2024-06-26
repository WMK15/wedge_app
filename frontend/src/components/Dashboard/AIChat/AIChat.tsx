import React, { useState } from "react";
import {
  IconButton,
  Grid,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  Input,
  FormControl,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { getAIResponse } from "../../../services/api";
import { SmartToy } from "@mui/icons-material";
import { selectAI, useAppDispatch } from "../../../store/store";
import { useSelector } from "react-redux";

const AIChat = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [responses, setResponses] = useState<string[]>([]);

  const { fetchStatus } = useSelector(selectAI);
  const dispatch = useAppDispatch();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputMessage(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(getAIResponse(inputMessage)).then((response) => {
      setResponses([response.payload, ...responses]);
    }).then(() => setInputMessage(""));
  }

  return (
    <Box
      sx={{
        bgcolor: "rgb(255,255,255,0.5)",
        height: "100%",
        borderRadius: "0px",
      }}
    >
      <Card
        sx={{
          bgcolor: "rgb(0,0,0,0.5)",
          borderRadius: "0px",
          height: "100%",
        }}
      >
        <CardHeader
          title="Ask Wedge"
          sx={{
            color: "white",
            bgcolor: "rgb(0,0,0,0.5)",
            fontWeight: "ligher",
          }}
        />
        <Box sx={{ mt: 1, mx: 1 }}>
          <form onSubmit={handleSubmit}>
            <CardActionArea sx={{ bgcolor: "white", borderRadius: "10px" }}>
              <Grid
                container
                sx={{
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              >
                <Grid item xs={12} sm={10}>
                  <FormControl fullWidth sx={{ pl: 1 }}>
                    <Input
                      id="message"
                      type="text"
                      value={inputMessage}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={2}
                  textAlign={"right"}
                  alignContent={"center"}
                >
                  <IconButton color="primary" type="submit">
                    <SendIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </CardActionArea>
            <CardContent>
              <Grid
                container
                direction="column"
                spacing={2}
                my={3}
                sx={{
                  my: 3,
                  display: "flex",
                  height: "100%",
                  overflowY: "auto",
                }}
              >
                <Grid
                  item
                  direction="column"
                  sx={{
                    maxHeight: "700px",
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#888",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      background: "#555",
                    },
                  }}
                >
                  {fetchStatus === "loading" && (
                    <Typography color={"white"}>Loading...</Typography>
                  )}
                  {responses.map((response, index) => (
                    <Box key={index}>
                      <Typography
                        variant="subtitle1"
                        textAlign={"left"}
                        color={"white"}
                      >
                        <span>
                          <SmartToy />
                        </span>{" "}
                        Wedge
                      </Typography>
                      <Typography
                        sx={{
                          minWidth: "inherit",
                          borderRadius: "10px",
                          border: "1px solid #ccc",
                          margin: "3px",
                          padding: "10px",
                          bgcolor: "#f9f9f9",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {response}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Box>
      </Card>
    </Box>
  );
};

export default AIChat;
