import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface stateInterface {
  user: userInterface | null;
  accessToken: string | null;
}

export interface userInterface {
  profilePicture: string | null;
  _id: string;
  email: string;
  userName: string;
  verified: boolean;
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
      state = initialState;
    }
  }
});

export const { setCredentials, clearCredentials } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export default userSlice.reducer;