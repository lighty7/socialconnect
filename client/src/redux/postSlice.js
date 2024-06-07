import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../utils";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

// Async thunk to fetch posts
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (token, { rejectWithValue }) => {
    try {
      const response = await apiRequest({
        uri: '/posts',
        token,
        method: 'GET',
      });
      if (response?.status === 'failed') {
        return rejectWithValue(response);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload;
    },
    addPost(state, action) {
      state.posts = [action.payload, ...state.posts];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPosts, addPost } = postSlice.actions;

export default postSlice.reducer;
