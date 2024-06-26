import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskState } from '../services/taskInterfaces';
import { getAllTasks, getTask, putCompleteTask, updateTask } from '../services/api';


export const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: [] ,
    fetchStatus: ''
  } as TaskState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks = [action.payload, ...state.tasks];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
      state.fetchStatus = 'success';
    }).addCase(getAllTasks.pending, (state) => {
      state.fetchStatus = 'loading';
    }).addCase(getAllTasks.rejected, (state) => {
      state.fetchStatus = 'error';
    }).addCase(getTask.fulfilled, (state, action) => {
      state.tasks = [action.payload];
      state.fetchStatus = 'success';
    }).addCase(getTask.pending, (state) => {
      state.fetchStatus = 'loading';
    }).addCase(getTask.rejected, (state) => {
      state.fetchStatus = 'error';
    }).addCase(putCompleteTask.fulfilled, (state, action) => {
      state.fetchStatus = 'success';
    }).addCase(putCompleteTask.pending, (state) => {
      state.fetchStatus = 'loading';
    }).addCase(putCompleteTask.rejected, (state) => {
      state.fetchStatus = 'error';
    }).addCase(updateTask.fulfilled, (state, action) => {
      state.fetchStatus = 'success';
    }).addCase(updateTask.pending, (state) => {
      state.fetchStatus = 'loading';
    }).addCase(updateTask.rejected, (state) => {
      state.fetchStatus = 'error';
    });
  }
}); 