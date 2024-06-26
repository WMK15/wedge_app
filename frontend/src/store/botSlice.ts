import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bot, BotState } from "../services/botInterface";
import { getBot } from "../services/api";

export const botSlice = createSlice({
    name: 'bot',
    initialState: {
      bot: {},
      fetchStatus: ''
    } as BotState,
    reducers: {
        updateBot: (state, action: PayloadAction<Bot>) => {
            state.bot = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getBot.fulfilled, (state, action) => {
            state.bot = action.payload;
            state.fetchStatus = 'success';
          }).addCase(getBot.pending, (state) => {
            state.fetchStatus = 'loading';
          }).addCase(getBot.rejected, (state) => {
            state.fetchStatus = 'error';
          })
    }
});