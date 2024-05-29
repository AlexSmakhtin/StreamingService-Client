import {createSlice} from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: "appSlice",
    initialState: {
        isOpenDrawer: false,
        menuWindow: null,
    },
    reducers: {
        changeOpenDrawer(state, action) {
            state.isOpenDrawer = action.payload;
        },
        changeMenuWindow(state, action) {
            state.menuWindow = action.payload;
            const newURL = new URL(`http://localhost:5173${action.payload}`);
            window.history.replaceState(null, '', newURL.toString());
        }
    }
});

export default appSlice.reducer;
export const {
    changeOpenDrawer,
    changeMenuWindow,
} = appSlice.actions;