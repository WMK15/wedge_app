import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlertState } from "../services/alertInterface";

export const alertSlice = createSlice({
    name: 'alert',
    initialState: {
      title: "",
      severity: "",
      open: true
    } as AlertState,
    reducers: {
        openAlert: (state, action: PayloadAction<AlertState>) => {
            state.open = false;
            state.title = action.payload.title;
            state.severity = action.payload.severity;
            state.open = true;
        },
        closeAlert: (state) => {
            state.open = false;
        }
    },
});