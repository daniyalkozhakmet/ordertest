import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import orderReducer from "./features/order/orderSlice";
import filterProfileReducer from "./features/filter/filterSlice";
import newsReducer from "./features/news/newsSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    order: orderReducer,
    filterUser: filterProfileReducer,
    news: newsReducer,
  },
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
