import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    role: string | null;
    user: any;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    role: null,
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {

        setAuth: (state, action: PayloadAction<AuthState>) => {

            state.accessToken =
                action.payload.accessToken;

            state.refreshToken =
                action.payload.refreshToken;

            state.role =
                action.payload.role;

            state.user =
                action.payload.user;

            state.isAuthenticated =
                true;

        },

        logout: (state) => {

            state.accessToken = null;
            state.refreshToken = null;
            state.role = null;
            state.user = null;
            state.isAuthenticated = false;

        },

    },

});

export const {
    setAuth,
    logout,
} = authSlice.actions;

export default authSlice.reducer;