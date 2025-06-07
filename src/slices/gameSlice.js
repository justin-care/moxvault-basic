import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    players: [],
    startingLifeTotal: 40,
    gameActive: false,
    gameId: null,
    showGameId: false,
    resetActive: false,
    redoActive: false,
    undoActive: false
  };

const poisonCounters = {
    min: 0,
    max: 9
}

const commanderDamageMax = 21;

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        incrementCommanderDamage: (state, action) => {
            const {attackerId, defenderId} = action.payload;
            const defender = state.players.find(player => player.id === defenderId);
            if (defender) {
                if(!defender.commanderDamage[attackerId]) {
                    defender.commanderDamage[attackerId] = 0;
                }
                if(defender.commanderDamage[attackerId] < commanderDamageMax) {
                    defender.commanderDamage[attackerId] += 1;
                } else {
                    //TODO: Trigger player death
                }
            }
        },
        decrementCommanderDamage: (state, action) => {
            const {attackerId, defenderId} = action.payload;
            
            const defender = state.players.find(player => player.id === defenderId);
            if (defender) {
                if(!defender.commanderDamage[attackerId]) {
                    defender.commanderDamage[attackerId] = 0;
                }
                if(defender.commanderDamage[attackerId] > 0) {
                    defender.commanderDamage[attackerId] -= 1;
                }
            }
        },
        setConfig: (state, action) => {
            const config = action.payload;
            for (const key in config) {
                if (key in state) {
                state[key] = config[key];
                }
            }
        },
        setRedoState: (state, action) => {
            const {undo, redo, reset} = action.payload;
            state.undoActive = undo;
            state.redoActive = redo;
            state.resetActive = reset;
        },
        setGameId: (state, action) => {
            state.gameId = action.payload;
        },
        setGameActive: (state, action) => {
            state.gameActive = action.payload;
        },
        setGameSettings: (state, action) => {
            const {numPlayers, startingLifeTotal} = action.payload;
            state.startingLifeTotal = startingLifeTotal;
            state.players = Array.from({ length: numPlayers }, (_, index) => ({
                id: index + 1,
                name: `Player ${index + 1}`,
                lifeTotal: startingLifeTotal,
                poisonCounters: 0,
                commanderDamage: {},
                color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            }))
        },
        incrementLifeTotal: (state, action) => {
            const player = state.players.find(player => player.id === action.payload.id);
            if (player) {
                player.lifeTotal += 1;
                window.navigator.vibrate(100);
            }
        },
        decrementLifeTotal: (state, action) => {
            const player = state.players.find(player => player.id === action.payload.id);
            if (player) {
                if(player.lifeTotal > 1) {
                    player.lifeTotal -= 1;
                } else {
                    player.lifeTotal -= 1;
                    //TODO: Trigger player death
                }
                window.navigator.vibrate(75);
            }
        },
        setLifeTotal: (state, action) => {
            const player = state.players.find(player => player.id === action.payload.id);
            if (player) {
                player.lifeTotal = action.payload.lifeTotal;
            }
        },
        incrementPoisonCounters: (state, action) => {
            const player = state.players.find(player => player.id === action.payload.id);
            if (player) {
                if(player.poisonCounters === poisonCounters.max) {
                    //TODO: Trigger player death
                } else {
                    player.poisonCounters += 1;
                }
                window.navigator.vibrate(100);
            }
        },
        decrementPoisonCounters: (state, action) => {
            const player = state.players.find(player => player.id === action.payload.id);
            if (player) {
                if(player.poisonCounters > poisonCounters.min) {
                    player.poisonCounters -= 1;
                }
                window.navigator.vibrate(75);
            }
        },
        setPoisonCounters: (state, action) => {
            const player = state.players.find(player => player.id === action.payload.id);
            if (player) {
                player.poisonCounters = action.payload.poisonCounters;
            }
        }
    }
});

export const { incrementLifeTotal, decrementLifeTotal, setLifeTotal, incrementPoisonCounters, decrementPoisonCounters, setPoisonCounters, setGameSettings, setGameActive, setGameId, incrementCommanderDamage, decrementCommanderDamage, setSettingsMenuState, setConfig, setRedoState } = gameSlice.actions;
export default gameSlice.reducer;