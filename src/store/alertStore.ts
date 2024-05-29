import {createSlice} from "@reduxjs/toolkit";

export enum AlertStatuses {
    info = "info",
    success = "success",
    warning = "warning",
    error = "error",
    loading = "loading"
}

export interface AlertState {
    status: AlertStatuses;
    description: string;
    guid: string;
}

const initialState: AlertState[] = [];

const alertSlice = createSlice({
    name: 'alertSlice',
    initialState,
    reducers: {
        addAlert(state, action) {
            state.push(action.payload);
        },
        changeAlert(state, action) {
            const {guid, description, status} = action.payload;
            const alertToChangeIndex = state.findIndex(alert => alert.guid === guid);
            if (alertToChangeIndex !== -1) {
                state[alertToChangeIndex].description = description;
                state[alertToChangeIndex].status = status;
            }
        },
        removeAlert(state, action) {
            const alertIdToRemove = action.payload;
            return state.filter(alert => alert.guid !== alertIdToRemove);
        },
    },
});

export const {
    addAlert,
    removeAlert,
    changeAlert
} = alertSlice.actions;
export default alertSlice.reducer;