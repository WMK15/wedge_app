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
import { getAITaskRecommendation, updateTask } from "../../../services/api";
import { useAppDispatch } from "../../../store/store";
import { getAllTasks } from "../../../services/api";
import { Subtask, Task } from "../../../services/taskInterfaces";
import { alertSlice } from "../../../store/alertSlice";

type EditTaskModalProps = {
    open: boolean;
    handleClose: () => void;
    data: Task;
};

const EditTask: React.FC<EditTaskModalProps> = ({
    open,
    handleClose,
    data,
}) => {
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);
    const [taskName, setTaskName] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const { openAlert } = alertSlice.actions;

    const handleAddSubtask = () => {
        setSubtasks([
            ...subtasks,
            {
                subTaskId: data.taskId.substring(0, 10),
                name: "",
                source: "self",
            },
        ]);
    };

    const handleSubtaskChange = (index: number, value: string) => {
        // Create a shallow copy of the subtasks array
        const updatedSubtasks = [...subtasks];

        // Create a deep copy of the subtask object at the specified index
        const updatedSubtask = { ...updatedSubtasks[index] };

        // Modify the properties of the deep-copied subtask object
        updatedSubtask.name = value;
        updatedSubtask.subTaskId += `_${index + 1}`;

        // Replace the original subtask object with the modified deep copy in the array
        updatedSubtasks[index] = updatedSubtask;

        // Update the state with the modified array of subtasks
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
        if (data.subtasks) {
            setSubtasks(data.subtasks);
        }
        setTaskName(data.task);
    }, [data]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const taskData = {
            _id: data.taskId,
            taskId: data.taskId,
            task: taskName,
            subtasks: subtasks,
            subtask_order_matters: false,
            subtask_dependencies: [],
            completed: data.completed,
        };
        dispatch(updateTask(taskData))
            .then(() => {
                dispatch(getAllTasks());
                dispatch(
                    openAlert({ title: "Task saved!", severity: "success", open: true })
                );
            })
            .then(() => {
                handleClose();
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
                        {/* <form onSubmit={handleSubmit}> */}
                        <form onSubmit={handleSubmit}>
                            <CardContent>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    New Task
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
                                                <InputLabel htmlFor={subtask.subTaskId}>
                                                    Subtask
                                                </InputLabel>
                                                <Input
                                                    id={subtask.subTaskId}
                                                    type="text"
                                                    value={subtask.name}
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

export default EditTask;
