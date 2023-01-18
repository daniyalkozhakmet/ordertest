import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export type orderType = {
  title: string;
  description: string;
  status?: string;
  access?: string;
};
type OrdersType = {
  per_page: number;
  total_page: number;
  current_page: number;
  orders: orderType[];
};
export type initialStateType = {
  order: orderType | null;
  orders: OrdersType | null;
  error: unknown | any[] | string;
  loading: boolean;
  success: boolean;
};
type dataType = {
  qty: number;
  current: number;
  access?: string;
};
const initialState: initialStateType = {
  order: null,
  orders: null,
  error: null,
  loading: false,
  success: false,
};

export const getOrders = createAsyncThunk(
  "order/getOrders",
  async (data: dataType, { rejectWithValue }) => {
    try {
      if (data.access) {
        let config = {
          headers: {
            Authorization: `Bearer ${data.access}`,
          },
        };
        const response = await axios.get(`/api/order?qty=${data.qty}&current=${data.current}`, config);
        return response.data;
      }
      const response = await axios.get(`/api/order?qty=${data.qty}&current=${data.current}`);
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
export const orderCreate = createAsyncThunk(
  "order/create",
  async (data: orderType, { rejectWithValue }) => {
    try {
      if (data.access) {
        let config = {
          headers: {
            Authorization: `Bearer ${data.access}`,
          },
        };
        const response = await axios.post("/api/order", data, config);
        return response.data;
      }
      const response = await axios.post("/api/order", data);
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
export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    makeUnsuccessful: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(orderCreate.pending, (state, action) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(orderCreate.fulfilled, (state, action) => {
      state.order = action.payload;
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(orderCreate.rejected, (state, action) => {
      state.order = null;
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });
    builder.addCase(getOrders.pending, (state, action) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
      state.order = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    });
    builder.addCase(getOrders.rejected, (state, action) => {
      state.order = null;
      state.orders = null;
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });
  },
});
export const { makeUnsuccessful, clearError } = orderSlice.actions;

export default orderSlice.reducer;
