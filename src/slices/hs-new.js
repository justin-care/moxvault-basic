import { createSlice } from "@reduxjs/toolkit";
import { initialState as gameInitialState } from "./gameSlice";
import gameReducer, * as gameActions from "./gameSlice";

const initialState = {
  past: [],
  present: gameInitialState,
  future: [],
};

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    undo(state) {
      if (state.past.length === 0) return state;
      const newFuture = [clone(state.present), ...state.future];
      const newPresent = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    },
    redo(state) {
      if (state.future.length === 0) return state;
      const newPast = [...state.past, clone(state.present)];
      const newPresent = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    },
    reset(state) {
      return {
        past: [...state.past, clone(state.present)],
        present: clone(gameInitialState),
        future: [],
      };
    },
    dispatchGameAction(state, action) {
      const currentPresent = state.present;
      const newPresent = gameReducer(currentPresent, action.payload);

      if (JSON.stringify(newPresent) !== JSON.stringify(currentPresent)) {
        return {
          past: [...state.past, clone(currentPresent)],
          present: newPresent,
          future: [],
        };
      } else {
        return state;
      }
    },
  },
});

export const { undo, redo, reset, dispatchGameAction } = historySlice.actions;
export default historySlice.reducer;
export { gameActions };
