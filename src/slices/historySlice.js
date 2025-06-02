import { createSlice } from "@reduxjs/toolkit";
import { initialState as gameInitialState } from "./gameSlice";
import gameReducer, * as gameActions from "./gameSlice";
import { current } from "@reduxjs/toolkit";

const initialState = {
    past: [],
    present: structuredClone(gameInitialState),
    future: []
}

const checkUndoRedoReset = (state) => {
    state.present.undoActive = state.past.length > 1;
    state.present.redoActive = state.future.length > 0;
    state.present.resetActive = state.past.length > 0;
}

const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        undo: (state) => {
                if (state.past.length > 0) {
                const clonedPresent = JSON.parse(JSON.stringify(current(state.present)));
                state.future.push(clonedPresent);

                const previousState = JSON.parse(JSON.stringify(state.past.pop()));
                Object.assign(state.present, previousState);
                checkUndoRedoReset(state);
            } else {
                state.present.undoActive = false;
            }
            window.navigator.vibrate(75);
        },
        redo: (state) => {
            if (state.future.length > 0) {
                const clonedPresent = JSON.parse(JSON.stringify(current(state.present)));
                state.past.push(clonedPresent);

                const nextState = JSON.parse(JSON.stringify(state.future.pop()));
                Object.assign(state.present, nextState);
                checkUndoRedoReset(state);
            } else {
                state.present.redoActive = false;
            }
            window.navigator.vibrate(100);
        },
        reset: (state) => {
            const clonedPresent = JSON.parse(JSON.stringify(current(state.present)));
            state.past.push(clonedPresent);

            const { startingLifeTotal, players } = clonedPresent;
            const numPlayers = players.length;

            state.present = gameReducer(
                gameInitialState,
                gameActions.setGameSettings({ numPlayers, startingLifeTotal })
            );

            state.future = [];
            checkUndoRedoReset(state);
            window.navigator.vibrate(50);
        },
        dispatchGameAction: (state, action) => {
            console.log(action.payload.type);
            if(action.payload.type === "game/setSettingsMenuState" ||action.payload.type === "game/setConfig" || action.payload.type === "game/setGameId" || action.payload.type === "game/setGameSettings") {
                state.present = gameReducer(current(state.present), action.payload);
                return;
            };
            const clonedPresent = JSON.parse(JSON.stringify(current(state.present)));
            const newState = gameReducer(clonedPresent, action.payload);

            if (JSON.stringify(newState) !== JSON.stringify(clonedPresent)) {
                state.past.push(clonedPresent);
                Object.assign(state.present, newState);
                state.future = [];

                checkUndoRedoReset(state);
            }
        },
    }
});

export const { undo, redo, reset, dispatchGameAction } = historySlice.actions;
export default historySlice.reducer;
export {gameActions};