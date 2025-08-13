import { Logs } from "@/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type WSStatus = "connected" | "reconnecting" | "disconnected";

interface LogsState {
  logs: Logs[];
  mode: boolean;
  wsstatus: WSStatus;
  refresh: boolean;
}

const initialState: LogsState = {
  logs: [],
  mode: false,
  wsstatus: "disconnected",
  refresh: true,
};

const logSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    setLogs: (state, action: PayloadAction<Logs[]>) => {
      state.logs = action.payload;
    },
    addLog: (state, action: PayloadAction<Logs>) => {
      state.logs.unshift(action.payload);
      state.logs = state.logs.slice(0, 100);
    },
    setMode: (state, action: PayloadAction<boolean>) => {
      state.mode = action.payload;
    },
    setWsStatus: (state, action: PayloadAction<WSStatus>) => {
      state.wsstatus = action.payload;
    },
    clearLogs: (state) => {
      state.logs = [];
    },
    triggerRefresh: (state, action) => {
      state.refresh = action.payload;
    },
  },
});

export const {
  setLogs,
  addLog,
  setMode,
  setWsStatus,
  clearLogs,
  triggerRefresh,
} = logSlice.actions;
export default logSlice.reducer;
export type { WSStatus };
