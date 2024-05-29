import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios, {AxiosError, HttpStatusCode} from "axios";
import {serverUrls} from "../constants/serverUrl.ts";
import {addAlert, AlertStatuses, changeAlert} from "./alertStore.ts";
import {v4 as Guid} from 'uuid';

const userSlice = createSlice({
    name: "userSlice",
    initialState: {
        name: localStorage.getItem("userName"),
        jwtToken: localStorage.getItem("jwtToken"),
        isAuthLoading: false,
        isRegLoading: false,
        isAvatarLoading: false,
        role: localStorage.getItem("role"),
        error: "",
        userId: localStorage.getItem("userId")
    },
    reducers: {
        removeJwtToken(state) {
            state.jwtToken = null;
            state.name = null;
            state.userId = null;
            state.role = null;
            localStorage.setItem("userName", "");
            localStorage.setItem("jwtToken", "");
            localStorage.setItem("role", "");
            localStorage.setItem("userId", "");
            axios.defaults.headers.common['Authorization'] = "";
        }
    },
    extraReducers: (builder) => {
        builder.addCase(authenticate.pending, (state) => {
            state.isAuthLoading = true;
        });
        builder.addCase(authenticate.fulfilled, (state, action) => {
            state.jwtToken = action.payload.jwtToken;
            state.name = action.payload.userName;
            state.isAuthLoading = false;
            state.role = action.payload.role;
            state.error = "";
            localStorage.setItem("role", action.payload.role);
            localStorage.setItem("jwtToken", action.payload.jwtToken);
            localStorage.setItem("userName", action.payload.userName);
            localStorage.setItem("userId", action.payload.userId);
            axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.jwtToken}`;
            state.userId = action.payload.userId;
        });
        builder.addCase(authenticate.rejected, (state, action) => {
            state.error = action.payload;
            state.isAuthLoading = false;
            state.role = null;
            state.jwtToken = null;
            state.name = null;
            state.userId = null;
            localStorage.setItem("role", "");
            localStorage.setItem("userId", "");
            localStorage.setItem("jwtToken", "");
            localStorage.setItem("userName", "");
            axios.defaults.headers.common['Authorization'] = "";
        });

        builder.addCase(register.pending, (state) => {
            state.isRegLoading = true;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.jwtToken = action.payload.jwtToken;
            state.name = action.payload.userName;
            state.isRegLoading = false;
            state.error = "";
            state.role = action.payload.role;
            state.userId = action.payload.userId;
            localStorage.setItem("role", action.payload.role);
            localStorage.setItem("userId", action.payload.userId);
            localStorage.setItem("jwtToken", action.payload.jwtToken);
            localStorage.setItem("userName", action.payload.userName);
            axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.jwtToken}`;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.error = action.payload;
            state.isRegLoading = false;
            state.jwtToken = null;
            state.name = null;
            state.role = null;
            state.userId = null;
            localStorage.setItem("role", "");
            localStorage.setItem("userId", "");
            localStorage.setItem("jwtToken", "");
            localStorage.setItem("userName", "");
            axios.defaults.headers.common['Authorization'] = "";
        });

        builder.addCase(changeAvatarAction.pending, (state) => {
            state.isAvatarLoading = true;
        });
        builder.addCase(changeAvatarAction.fulfilled, (state, _) => {
            state.isAvatarLoading = false;
            state.error = "";
        });
        builder.addCase(changeAvatarAction.rejected, (state, action) => {
            state.error = action.payload;
            state.isAvatarLoading = false;
        });
    }
});

export const authenticate = createAsyncThunk(
    "userSlice/auth",
    async function (formData: string, {rejectWithValue, dispatch}) {
        const newGUID = Guid();
        try {
            dispatch(addAlert({
                status: AlertStatuses.loading,
                description: 'Authentication in progress',
                guid: newGUID
            }));
            const response =
                await axios.post(serverUrls.auth, formData, {headers: {'Content-Type': 'application/json'}});
            if (response.status == HttpStatusCode.Ok) {
                dispatch(changeAlert({
                    status: AlertStatuses.success,
                    description: 'Authentication success',
                    guid: newGUID
                }));
                return response.data;
            }
        } catch (error: AxiosError) {
            console.log(error);
            dispatch(changeAlert({
                status: AlertStatuses.error,
                description: 'Authentication error: ' + error.message + '. ' + error.response?.data,
                guid: newGUID
            }));
            return rejectWithValue(error.message + ". " + error.response?.data)
        }
    }
);

export const register = createAsyncThunk(
    "userSlice/register",
    async function (formData: string, {rejectWithValue, dispatch}) {
        const newGUID = Guid();
        try {
            dispatch(addAlert({
                status: AlertStatuses.loading,
                description: 'Registration in progress',
                guid: newGUID
            }));
            const response =
                await axios.post(serverUrls.register, formData, {headers: {'Content-Type': 'application/json'}});
            if (response.status == HttpStatusCode.Ok) {
                dispatch(changeAlert({
                    status: AlertStatuses.success,
                    description: 'Registration success',
                    guid: newGUID
                }));
                return response.data;
            }
        } catch (error: AxiosError) {
            console.log(error);
            dispatch(changeAlert({
                status: AlertStatuses.error,
                description: 'Registration error: ' + error.message + '. ' + error.response?.data,
                guid: newGUID
            }));
            return rejectWithValue(error.message + ". " + error.response?.data)
        }
    }
);

export const changeAvatarAction = createAsyncThunk(
    "userSlice/changeAvatar",
    async function (avatar: FormData, {rejectWithValue}) {
        try {
            const response =
                await axios.post(
                    serverUrls.changeAvatar,
                    avatar,
                    {headers: {'Content-Type': 'multipart/form-data'}});
            if (response.status == HttpStatusCode.Ok) {
                return response.data;
            }
        } catch (error: AxiosError) {
            console.log(error);
            return rejectWithValue(error.message + ". " + error.response?.data)
        }
    }
);

export default userSlice.reducer;

export const {
    removeJwtToken
} = userSlice.actions;
