import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AIState } from "../services/botInterface";
import { getAIResponse } from "../services/api";

export const aiSlice = createSlice({
    name: 'ai',
    initialState: {
      message: "",
      fetchStatus: ""
    } as AIState,
    reducers:{},
    extraReducers: (builder) => {
        builder.addCase(getAIResponse.fulfilled, (state, action : PayloadAction<AIState>) => {
            state.message = action.payload.message;
            state.fetchStatus = 'success';
          }).addCase(getAIResponse.pending, (state) => {
            state.fetchStatus = 'loading';
          }).addCase(getAIResponse.rejected, (state) => {
            state.fetchStatus = 'error';
          })
    }
});