
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    settingsMenuOpen: false,
  },
  reducers: {
    setSettingsMenuState: (state, action) => {
      state.settingsMenuOpen = action.payload;
    },
  },
});

export const { setSettingsMenuState } = uiSlice.actions;
export default uiSlice.reducer;
