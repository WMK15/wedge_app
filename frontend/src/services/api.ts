import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Task } from "./taskInterfaces";

const api = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:8000" : "https://dgoves6kzxlzbug-api.jollycoast-9050559d.eastus.azurecontainerapps.io",
});

export const getAllTasks = createAsyncThunk("getAllTasks", async () => {
  const response = await api.get("/tasks");
  return response.data;
});

export const getTask = createAsyncThunk("getTask", async (taskId: string) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
});

export const putCompleteTask = createAsyncThunk("completeTask", async (task: Task, {rejectWithValue}) => {
  try{
    const response = await api.put(`/tasks/${task.taskId}`, {
      taskId: task.taskId,
      task: task.task,
      subtasks: task.subtasks,
      subtask_order_matters: task.subtask_order_matters,
      subtask_dependencies: task.subtask_dependencies,
      completed: true,
    });
  
    // Convert Axios headers to a plain object
    const headers = { ...response.headers };
    return { ...response.data, headers };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data);
    }

    return rejectWithValue(`An unknown error occurred. Please try again.\n${error}`);
  }
});

export const updateTask = createAsyncThunk("updateTask", async (task: Task, {rejectWithValue}) => {

  try {
    const response = await api.put(`/tasks/${task.taskId}`, {
      taskId: task.taskId,
      task: task.task,
      subtasks: task.subtasks,
      subtask_order_matters: task.subtask_order_matters,
      subtask_dependencies: task.subtask_dependencies,
      completed: task.completed,
    });
    // Convert Axios headers to a plain object
    const headers = { ...response.headers };
    return { ...response.data, headers };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data);
    }

    return rejectWithValue(`An unknown error occurred. Please try again.\n${error}`);
  }
});

export const getAITaskRecommendation = async (taskName: string) => {
  const response = await api.post("/tasks/ai", { 
    session_id: "abc123",
    task_name: taskName,
  });
  return response.data;
}

export const postNewTask = async (taskName: string, subtasks: string[]) => {
  const subtasksDict = subtasks.map((subtask) => ({ 
    id: `subTaskIdPlaceholder`,
    name: subtask,
    source: "AI",
   }));

  const response = await api.post("/tasks", {
    task: taskName,
    subtasks: subtasksDict,
    subtask_order_matters: false,
    subtasks_dependencies: [],
  });

  return response;
};

export const getBot = createAsyncThunk("getBot", async (session_id: string) => {
  const response = await api.get(`/bots/${session_id}`);
  return response.data;
})

export const getAIResponse = createAsyncThunk("getAIResponse", async (prompt: string, {rejectWithValue}) => {
  try {
    const response = await api.post("/ai", {
      session_id: "abc123",
      prompt,
    });

    return response.data.message;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data);
    }

    return rejectWithValue(`An unknown error occurred. Please try again.\n${error}`);
  }
});