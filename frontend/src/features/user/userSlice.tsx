import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// import * as dotenv from 'dotenv'
// dotenv.config()
type loginData = { email: string; password: string };
type profileImageData = {
  image: any;
  access?: string;
};
type updateDataType = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  access: string;
  confirm_password: string;
};
type registerData = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  birth: string;
};
type actionType = {
  email: string;
  access: string;
  first_name: string;
  last_name: string;
  birth: string;
  image: string;
};
export const userLogin = createAsyncThunk(
  "users/loginUser",
  async (data: loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/user/login", data);
      localStorage.setItem("user", JSON.stringify(response.data));
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
export const userProfileUpdate = createAsyncThunk(
  "users/updateUser",
  async (data: updateDataType, { rejectWithValue }) => {
    try {
      let config = {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      };
      const response = await axios.put("/api/user/profile", data, config);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      let errorData: any[] = [];
      if (typeof error.response.data == "object") {
        for (const key in error.response.data) {
          errorData.push(error.response.data[key][0]);
        }
      }
      return rejectWithValue(
        error.response.data.detail
          ? error.response.data.detail
          : error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);
export const userRegister = createAsyncThunk(
  "users/regsiterUser",
  async (data: registerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/register",
        data
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      let errorData: any[] = [];
      if (typeof error.response.data == "object") {
        for (const key in error.response.data) {
          errorData.push(error.response.data[key][0]);
        }
      }
      return rejectWithValue(
        error.response.data.message ? error.response.data.message : errorData
      );
    }
  }
);
export const userProfileImageUpload = createAsyncThunk(
  "users/profileImageUpload",
  async (data: profileImageData, { rejectWithValue }) => {
    try {
      let config = {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      };
      const uploadData = new FormData();
      if (data.access) uploadData.append("access", data.access);
      uploadData.append("image", data.image);
      const response = await axios.put("/api/user/profile", uploadData, config);
      return response.data;
    } catch (error: any) {
      let errorData: any[] = [];
      if (typeof error.response.data == "object") {
        for (const key in error.response.data) {
          errorData.push(error.response.data[key][0]);
        }
      }
      return rejectWithValue(
        error.response.data.message ? error.response.data.message : errorData
      );
    }
  }
);
export const getProfile = createAsyncThunk(
  "users/getProfile",
  async (data: { access: string }, { rejectWithValue }) => {
    try {
      let config = {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      };
      const response = await axios.get("/api/user/my/profile", config);
      let userLocalStorage = localStorage.getItem("user");
      if (userLocalStorage) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error: any) {
      let errorData: any[] = [];
      if (typeof error.response.data == "object") {
        for (const key in error.response.data) {
          errorData.push(error.response.data[key][0]);
        }
      }
      return rejectWithValue(
        error.response.data.message ? error.response.data.message : errorData
      );
    }
  }
);
interface initialStateType {
  user: {
    email: string;
    access: string;
    first_name: string;
    last_name: string;
    birth: string;
    image: string;
  } | null;
  error: unknown | any[] | string;
  loading: boolean;
  loggedIn: boolean;
}
const userInitialState = () => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    return {
      user: JSON.parse(savedUser),
      error: null,
      loading: false,
      loggedIn: true,
    };
  } else {
    return {
      user: null,
      error: null,
      loading: false,
      loggedIn: false,
    };
  }
};
const initialState: initialStateType = userInitialState();
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("user");
      state.user = null;
      state.loggedIn = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state, action) => {
      state.loading = true;
      state.error = null;
      state.loggedIn = false;
    });
    builder.addCase(
      userLogin.fulfilled,
      (state, action: PayloadAction<actionType>) => {
        state.user = action.payload;
        state.user.image = process.env.REACT_APP_BACKEND + action.payload.image;
        state.loading = false;
        state.error = null;
        state.loggedIn = true;
      }
    );
    builder.addCase(userLogin.rejected, (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
      state.loggedIn = false;
    });
    builder.addCase(userRegister.pending, (state, action) => {
      state.loading = true;
      state.loggedIn = false;
      state.error = null;
    });
    builder.addCase(userRegister.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.loggedIn = true;
    });
    builder.addCase(userRegister.rejected, (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
      state.loggedIn = false;
    });
    builder.addCase(userProfileUpdate.pending, (state, action) => {
      state.loading = true;
      state.loggedIn = true;
      state.error = null;
    });
    builder.addCase(userProfileUpdate.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.loggedIn = true;
    });
    builder.addCase(userProfileUpdate.rejected, (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
      state.loggedIn = false;
    });
    builder.addCase(userProfileImageUpload.pending, (state, action) => {
      state.loading = true;
      state.loggedIn = true;
      state.error = null;
    });
    builder.addCase(userProfileImageUpload.fulfilled, (state, action) => {
      if (state.user) state.user.image = action.payload;
      state.loading = false;
      state.error = null;
      state.loggedIn = true;
    });
    builder.addCase(userProfileImageUpload.rejected, (state, action) => {
      // state.user = null;
      state.loading = false;
      state.error = action.payload;
      state.loggedIn = true;
    });
    builder.addCase(getProfile.pending, (state, action) => {
      state.loading = true;
      state.loggedIn = true;
      state.error = null;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.loggedIn = true;
    });
    builder.addCase(getProfile.rejected, (state, action) => {
      // state.user = null;
      state.loading = false;
      state.error = action.payload;
      state.loggedIn = true;
    });
  },
});

// Action creators are generated for each case reducer function
export const { logout, clearError } = userSlice.actions;

export default userSlice.reducer;
