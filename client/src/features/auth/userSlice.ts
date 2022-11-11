import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface stateInterface {
  user: object | null,
  accessToken: string | null;
}

const initialState: stateInterface = { user: null, accessToken: null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<stateInterface>) => {
      const { user, accessToken } = action.payload;
      if (user) state.user = user;
      if (accessToken) state.accessToken = accessToken;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
    }
  }
});

export const { setCredentials, clearCredentials } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;