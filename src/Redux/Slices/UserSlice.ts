import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialLocation = window.localStorage.getItem("locationPath") || "Stall";

//Get Theme From Local Storage ==============
const initialUser = localStorage.getItem("bs-sessions-persit");
const initialSavedWorkspaces = localStorage.getItem("saved_workspces");

interface InitialStateType {
  user: any;
  saved_workspaces: any[];
  routeLocation: any;
  current_workspace: string | any;
}

const initialState: InitialStateType = {
  user: initialUser ? JSON.parse(initialUser) : null,
  saved_workspaces: initialSavedWorkspaces ? JSON.parse(initialSavedWorkspaces) : null,
  routeLocation: initialLocation,
  current_workspace: localStorage.getItem("current_workspace"),
};

export const UserSlice = createSlice({
  name: "UserInfo",
  initialState,
  reducers: {
    updateUserData: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    saveWorkSpaces: (state, action: PayloadAction<any>) => {
      state.saved_workspaces = action.payload;
    },
    changeLocation: (state, action: PayloadAction<any>) => {
      state.routeLocation = action.payload;
    },
    setCurrent_workspace: (state, action: PayloadAction<string | null>) => {
      state.current_workspace = action.payload;
    },
  },
});

export const {
  updateUserData,
  saveWorkSpaces,
  changeLocation,
  setCurrent_workspace,
} = UserSlice.actions;

export default UserSlice.reducer;
