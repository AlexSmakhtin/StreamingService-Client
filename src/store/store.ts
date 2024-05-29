import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import userReducer from "./userStore.ts";
import alertReducer from "./alertStore.ts"
import appReducer from "./appStore.ts"
import playlistReducer from "./playlistStore.ts"

const store = configureStore({
    reducer: {
        user: userReducer,
        alert: alertReducer,
        app: appReducer,
        playlist: playlistReducer
    },
});
type AppState = ReturnType<typeof store.getState>;
type AddDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AddDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export default store;