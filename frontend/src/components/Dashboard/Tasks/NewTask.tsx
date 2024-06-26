import {
  Modal,
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Button,
  FormControl,
  Input,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAITaskRecommendation, postNewTask } from "../../../services/api";
import { useAppDispatch } from "../../../store/store";
import { getAllTasks } from "../../../services/api";
import { alertSlice } from "../../../store/alertSlice";

type NewTaskModalProps = {
  open: boolean;
  handleClose: () => void;
};

const NewTask: React.FC<NewTaskModalProps> = ({ open, handleClose }) => {
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [taskName, setTaskName] = useState("");
  const [loading, setLoading] = useState(false);

  const { openAlert } = alertSlice.actions;
  const dispatch = useAppDispatch();

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, ""]);
  };

  const handleSubtaskChange = (index: number, value: string) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index] = value;
    setSubtasks(updatedSubtasks);
  };

  const handleGenerateAISubtasks = () => {
    setSubtasks([]);
    setLoading(true);
    getAITaskRecommendation(taskName)
      .then((data) => {
        setSubtasks(data);
      })
      .then(() => {
        setLoading(false);
      });
  };

  const handleDeleteSubtask = (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks.splice(index, 1);
    setSubtasks(updatedSubtasks);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTaskName(value);
  };

  useEffect(() => {
    setSubtasks([]);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postNewTask(taskName, subtasks)
      .then((response) => {
        if (response.status === 200) {
          dispatch(openAlert({ title: "Task saved!", severity: "success", open: true }));
          dispatch(getAllTasks());
          handleClose();
        }
      })
      .catch((error) => {
        console.error(error);
        dispatch(openAlert({ title: "Error saving task", severity: "error", open: true }));
      });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box sx={{ width: 600, p: 2, backgroundColor: "#f5f5f5" }}>
          <Card>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  New Task
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Type up the task name and subtasks. You can also let the AI
                  help!
                </Typography>

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel htmlFor="task-name">Task Name</InputLabel>
                  <Input
                    id="task-name"
                    type="text"
                    value={taskName}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Typography variant="h6" sx={{ mt: 2 }}>
                  Subtasks
                </Typography>
                {!loading ? (
                  subtasks.map((subtask, index) => (
                    <div
                      key={index}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel htmlFor={`subtask-${index}`}>
                          Subtask
                        </InputLabel>
                        <Input
                          id={`subtask-${index}`}
                          type="text"
                          value={subtask}
                          onChange={(e) =>
                            handleSubtaskChange(index, e.target.value)
                          }
                        />
                      </FormControl>
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ mt: 2, ml: 2 }}
                        onClick={() => handleDeleteSubtask(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))
                ) : (
                  <div>Loading...</div>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleAddSubtask}
                >
                  Add Subtask
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 2,
                    ml: 2,
                    backgroundImage:
                      "radial-gradient(at top left, #F0ACE0, transparent),radial-gradient(at top right, #FFA4B2, transparent),radial-gradient(at bottom left, #A7D3F2, transparent);",
                  }}
                  onClick={() => handleGenerateAISubtasks()}
                >
                  Let AI Recommend
                </Button>
              </CardContent>
              <CardActionArea
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button color="primary" sx={{ mr: 1 }} type="submit">
                  Save
                </Button>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
              </CardActionArea>
            </form>
          </Card>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewTask;
