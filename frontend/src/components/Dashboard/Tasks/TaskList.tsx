import { useSelector } from "react-redux";
import { selectTasks, useAppDispatch } from "../../../store/store";
import React, { useState } from "react";
import { getAllTasks, getBot, putCompleteTask } from "../../../services/api";
import {
  Card,
  CardHeader,
  IconButton,
  CardContent,
  Checkbox,
  FormGroup,
  Typography,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import NewTask from "./NewTask";
import { Task } from "../../../services/taskInterfaces";
import { botJump } from "../Wedge/Bot";
import EditTask from "./EditTask";
import { alertSlice } from "../../../store/alertSlice";

const TaskList: React.FC = () => {
  const { tasks, fetchStatus } = useSelector(selectTasks);
  const dispatch = useAppDispatch();

  const { openAlert } = alertSlice.actions;

  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const handleNewTaskOpen = () => setNewTaskOpen(true);
  const handleNewTaskClose = () => setNewTaskOpen(false);

  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [editData, setEditData] = useState<Task>({
    taskId: "",
    task: "",
    completed: false,
    subtask_dependencies: [],
    subtask_order_matters: false,
    subtasks: [],
    _id: "",
  });
  const handleEditTaskOpen = async (task: Task) => {
    setEditData(task);
    setEditTaskOpen(true);
  };
  const handleEditTaskClose = () => setEditTaskOpen(false);

  const handleComplete = (task: Task) => {
    dispatch(putCompleteTask(task))
      .then(() => {
        dispatch(getAllTasks());
      })
      .then(() => {
        dispatch(getBot("abc123"));
      })
      .then(async () => {
        dispatch(openAlert({ title: "Task completed!", severity: "success", open: true }));
        await botJump();
      })
      .catch((error) => {
        dispatch(openAlert({ title: "Error completing task", severity: "error", open: true }));
        console.error(error);
      });
  };

  return (
    <React.Fragment>
      <NewTask open={newTaskOpen} handleClose={handleNewTaskClose} />
      <EditTask
        open={editTaskOpen}
        handleClose={handleEditTaskClose}
        data={editData}
      />
      <Card>
        <CardHeader
          title="Tasks"
          action={
            <IconButton onClick={handleNewTaskOpen}>
              <Add />
            </IconButton>
          }
        />
        <CardContent sx={{
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
        }}>
          {fetchStatus === "loading" ? (
            <Typography>Loading...</Typography>
          ) : tasks.length !== 0 ? (
            <>
              {tasks.map(
                (task) =>
                  !task.completed && (
                    <FormGroup key={task.taskId} sx={{ mb: 2 }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Checkbox onClick={() => handleComplete(task)} />
                        <Typography>{task.task}</Typography>
                        <div style={{ marginLeft: "auto" }}>
                          <IconButton onClick={() => handleEditTaskOpen(task)}>
                            <Edit />
                          </IconButton>
                        </div>
                      </div>
                    </FormGroup>
                  )
              )}{" "}
            </>
          ) : (
            <Typography>No tasks. Add some!</Typography>
          )}
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default TaskList;
