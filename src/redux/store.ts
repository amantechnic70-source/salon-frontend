import {
    configureStore,
} from "@reduxjs/toolkit";

import themeReducer
    from "./slices/themeSlice";

import {
    persistedAuthReducer,
} from "./persist";


export const store =
    configureStore({

        reducer: {

            auth:
                persistedAuthReducer,

            theme:
                themeReducer,

        },

        middleware: (getDefaultMiddleware) =>

            getDefaultMiddleware({

                serializableCheck: false,

            }),

    });


export type RootState =
    ReturnType<
        typeof store.getState
    >;


export type AppDispatch =
    typeof store.dispatch;