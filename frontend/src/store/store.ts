import { configureStore } from "@reduxjs/toolkit";

import { taskSlice } from "./taskSlice";
import { useDispatch } from "react-redux";
import { botSlice } from "./botSlice";
import { alertSlice } from "./alertSlice";
import { aiSlice } from "./aiSlice";

const store = configureStore({
    reducer: {
        tasks: taskSlice.reducer,
        bot: botSlice.reducer,
        alert: alertSlice.reducer,
        ai: aiSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;

export const selectTasks = (state: RootState) => state.tasks;
export const selectBot = (state: RootState) => state.bot;
export const selectAlert = (state: RootState) => state.alert;
export const selectAI = (state: RootState) => state.ai;

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>() // Export a hook that can be reused to resolve types

export default store;