
import {
    persistReducer,
} from "redux-persist";

import authReducer from "./slices/authSlice";
import storage from "./storage";

export const authPersistConfig = {

    key: "auth",

    storage,

};

export const persistedAuthReducer =
    persistReducer(

        authPersistConfig,

        authReducer,

    );