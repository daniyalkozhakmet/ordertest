import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
type usersType = {
  first_name: string;
  age: number;
  image: string;
};
type initialStateType = {
  users: usersType[] | null;
  error: unknown | string | null;
  loading: boolean;
};
type dataType = {
  search: string;
  access: string;
};
const initialState: initialStateType = {
  users: null,
  error: null,
  loading: false,
};

export const getProfileFilter = createAsyncThunk(
  "user/profile/filter",
  async (data: dataType, { rejectWithValue }) => {
    try {
      if (data.access) {
        let config = {
          headers: {
            Authorization: `Bearer ${data.access}`,
          },
        };
        const response = await axios.get(
          `/api/user/profile?search=${data.search}`,
          config
        );
        return response.data;
      }
      const response = await axios.get(
        `/api/user/profile?search=${data.search}`
      );
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
export const userProfileFilterSlice = createSlice({
  name: "user/profile/filter",
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
    builder.addCase(getProfileFilter.pending, (state, action) => {
      state.loading = true;
      state.users = [];
      state.error = null;
    });
    builder.addCase(
      getProfileFilter.fulfilled,
      (state, action: PayloadAction<usersType[]>) => {
        state.loading = false;
        state.users = action.payload.map((user) => ({
          ...user,
          image: process.env.REACT_APP_BACKEND + user.image,
        }));
        state.error = null;
      }
    );
    builder.addCase(getProfileFilter.rejected, (state, action) => {
      state.users = [];
      state.loading = false;
      state.error = action.payload;
    });
  },
});
export const { clearError } = userProfileFilterSlice.actions;

export default userProfileFilterSlice.reducer;
