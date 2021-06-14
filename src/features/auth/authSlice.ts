import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { CRED, JWT, POST_PROFILE, PROF_CRE } from "../../types/types";

const URL = process.env.REACT_APP_API_ENDPOINT;


export const fetchAsyncLogin = createAsyncThunk(
    "auth/login",
    async (auth: CRED) => {
        const res = await axios.post(`${URL}/authen/jwt/create/`, auth, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    }
);

export const fetchAsyncRegister = createAsyncThunk(
    "auth/register",
    async (auth: CRED) => {
        const res = await axios.post(`${URL}/accounts/create/`, auth, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    }
);

export const fetchAsyncCreateProf = createAsyncThunk(
    "profile/post",
    async (profile: PROF_CRE) => {
        const res = await axios.post(`${URL}/accounts/profile/`, profile, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
);


export const fetchAsyncUpdateProf = createAsyncThunk(
    "profile/put",
    async (profile: POST_PROFILE) => {
        const uploadData = new FormData();
        uploadData.append("user_name", profile.user_name);
        profile.bio && uploadData.append("bio", profile.bio);
        profile.avatar && uploadData.append("avatar", profile.avatar, profile.avatar.name)
        const res = await axios.put(`${URL}/accounts/profile/${profile.id}/`, uploadData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`,
        },
    });
        return res.data;
    }
);

export const fetchAsyncGetMyProf = createAsyncThunk(
    "profile/get",
    async () => {
        const res = await axios.get(`${URL}/accounts/yourProfile/`, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`
            },
        });
        return res.data[0];
    }
);

export const fetchAsyncGetProfs = createAsyncThunk(
    "profiles/get",
    async () => {
        const res = await axios.get(`${URL}/accounts/profile/`, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`
            },
        });
        return res.data;
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        openSignIn: true,
        openSignUp: false,
        openProfile: false,
        isLoadingAuth: false,
        myProfile: {
            id: 0,
            user_profile: 0,
            user_name: "",
            created: "",
            avatar: "",
            bio: ""
        },
        profiles: [
            {
            id: 0,
            user_profile: 0,
            user_name: "",
            created: "",
            avatar: "",
            bio: ""
        },
     ],
    },
    reducers: {
        fetchCreadStart(state) {
            state.isLoadingAuth = true;
        },
        fetchCreadEnd(state) {
            state.isLoadingAuth = false;
        },
        setOpenSignIn(state) {
            state.openSignIn = true;
        },
        resetOpenSignIn(state) {
            state.openSignIn = false;
        },
        setOpenSignUp(state) {
            state.openSignUp = true;
        },
        resetOpenSignUp(state) {
            state.openSignUp = false;
        },
        setOpenProfile(state) {
            state.openProfile = true;
        },
        resetOpenProfile(state) {
            state.openProfile = false;
        },
        editUserName(state, action) {
            state.myProfile.user_name = action.payload
        }
    },

    extraReducers: (builder) => {
        builder.addCase(fetchAsyncLogin.fulfilled, (state, action: PayloadAction<JWT>) => {
            localStorage.setItem("localJWT", action.payload.access);
            // action.payload.access && (window.location.href = "/home")
        });
        builder.addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
            state.myProfile = action.payload;
        });
        builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
            state.myProfile = action.payload;
        });
        builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
            state.profiles = action.payload;
        });
        builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
            state.myProfile = action.payload;
            state.profiles = state.profiles.map((prof) => 
            prof.id === action.payload.id ? action.payload : prof
            );
        });

    },
});

export const { 
    fetchCreadStart, 
    fetchCreadEnd,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    setOpenProfile,
    resetOpenProfile,
    editUserName,
} =  authSlice.actions;

export const selectIsLoadingAuth = (state: RootState) => state.auth.isLoadingAuth;
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp;
export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectMyProfile = (state: RootState) => state.auth.myProfile;
export const selectProfiles = (state: RootState) => state.auth.profiles;


export default authSlice.reducer;