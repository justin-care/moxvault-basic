
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    settingsMenuOpen: false,
    toasts : [],
  },
  reducers: {
    setSettingsMenuState: (state, action) => {
      state.settingsMenuOpen = action.payload;
    },
    updateToasts: (state, action) => {
        state.toasts.push(action.payload);
    },
    removeToast: (state, action) => {
        state.toasts = state.toasts.slice(1);
    }
  },
});

export const { setSettingsMenuState, updateToasts, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
