import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

type newsType = {
  title: string;
  slug: string;
  description: string;
  image: string;
};
type initialStateType = {
  news: newsType[] | null;
  error: unknown | string | null;
  loading: boolean;
};
const initialState: initialStateType = {
  news: null,
  error: null,
  loading: false,
};
export const getArticles = createAsyncThunk(
  "news/getNews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/articles`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.errors
          ? error.response.data.errors
          : error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);
export const newsSlice = createSlice({
  name: "news/getNews",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("user");
      // state.user = null;
      // state.loggedIn = false;
    },
    clearError: (state) => {
      // state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getArticles.pending, (state, action) => {
      state.loading = true;
      state.news = null;
      state.error = null;
    });
    builder.addCase(
      getArticles.fulfilled,
      (state, action: PayloadAction<newsType[]>) => {
        state.loading = false;
        state.news = action.payload.map((news) => ({
          ...news,
          image: process.env.REACT_APP_BACKEND + news.image,
        }));
        state.error = null;
      }
    );
    builder.addCase(getArticles.rejected, (state, action) => {
      state.news = null;
      state.loading = false;
      state.error = action.payload;
    });
  },
});
export const { clearError } = newsSlice.actions;

export default newsSlice.reducer;
