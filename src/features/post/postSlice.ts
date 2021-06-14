import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { NEWPOST, COMMENT, LIKED, DELETEPOST } from "../../types/types";



const URL = process.env.REACT_APP_API_ENDPOINT;

export const fetchAsyncGetPosts = createAsyncThunk(
    "post/get",
    async () => {
        const res = await axios.get(`${URL}/post/Post/`, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
);

export const fetchAsyncDeletePost = createAsyncThunk(
    "post/delete",
    async (deletePost: DELETEPOST ) => {
        const res = await axios.delete(`${URL}/post/Post/${deletePost.id}`, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`,
            }
        })
    }
)

export const fetchAsyncNewPost = createAsyncThunk(
    "post/Post",
    async (newPost: NEWPOST) => {
        const uploadData = new FormData();
        uploadData.append("body", newPost.body);
        newPost.image && uploadData.append("image", newPost.image, newPost.image.name);
        const res = await axios.post(`${URL}/post/Post/`, uploadData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`,
            }
        });
        return res.data;
    }
);

export const fetchAsyncPatchLiked = createAsyncThunk(
    "post/liked",
    async (liked: LIKED) => {
        const currentLiked = liked.liked;
        const uploadData = new FormData();

        let isOverLapped = false;
        currentLiked.forEach((current) => {
            if (current === liked.user_profile) {
                isOverLapped = true;
            } else {
                uploadData.append("liked", String(current));
            }
        });

        if (!isOverLapped) {
            uploadData.append("liked", String(liked.user_profile));
        } else if (currentLiked.length === 1) {
            uploadData.append("body", liked.body);
            const res = await axios.put(`${URL}/post/Post/${liked.id}/`, uploadData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `JWT ${localStorage.localJWT}`
                },
            });
            return res.data;
        }
        const res = await axios.patch(`${URL}/post/Post/${liked.id}/`, uploadData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
);

export const fetchAsyncGetComments = createAsyncThunk(
    "comments/get",
    async () => {
        const res = await axios.get(`${URL}/post/Comment/`, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
);

export const fetchAsyncPostComment = createAsyncThunk(
    "commetn/post",
    async (comment: COMMENT) => {
        const res = await axios.post(`${URL}/post/Comment/`, comment, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`
            },
        });
        return res.data;
    }
)


export const postSlice = createSlice({
    name: "post",
    initialState: {
        isLoadingPost: false,
        openNewPost: false,
        posts: [
            {
                id: 0,
                user_post: 0,
                body: "",
                created: "",
                image: "",
                liked: [0],
            },
        ],
        comments: [
            {
                id: 0,
                user_comment: 0,
                post: 0,
                body: "",
                created: ""
            },
        ],
    },

    reducers: {
        fetchPostStart(state) {
            state.isLoadingPost = true;
        },
        fetchPostEnd(state) {
            state.isLoadingPost = false;
        },
        setOpenNewPost(state) {
            state.openNewPost = true;
        },
        resetOpenNewPost(state) {
            state.openNewPost = false
        }
    },

    extraReducers: (builder) => {
        builder.addCase(fetchAsyncGetPosts.fulfilled, (state, action) => {
            return {
                ...state,
                posts: action.payload,
            }; 
        });
        builder.addCase(fetchAsyncNewPost.fulfilled, (state, action) => {
            return {
                ...state,
                posts: [...state.posts, action.payload]
            };
        });
        builder.addCase(fetchAsyncGetComments.fulfilled, (state, action) => {
            return {
                ...state,
                comments: [...state.comments, action.payload],
            };
        });
        builder.addCase(fetchAsyncPostComment.fulfilled, (state, action) => {
            return {
                ...state,
                comments: [...state.comments, action.payload],
            };
        });
        builder.addCase(fetchAsyncPatchLiked.fulfilled, (state, action) => {
            return {
                ...state,
                posts: state.posts.map((post) => 
                    post.id === action.payload.id ? action.payload : post
                ),
            };
        });
    }
});

export const {
    fetchPostStart,
    fetchPostEnd,
    setOpenNewPost,
    resetOpenNewPost,
} =  postSlice.actions;

export const selectIsLoadingPost = (state: RootState) => state.post.isLoadingPost;
export const selectOpenNewPost = (state: RootState) => state.post.openNewPost;
export const selectPosts = (state: RootState) => state.post.posts;
export const selectComments= (state: RootState) => state.post.comments;


export default postSlice.reducer;