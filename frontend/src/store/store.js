import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./users";
import { productsReducer } from "./products";
import { categoriesReducer } from "./categories";
import { ordersReducer } from "./orders";

export const store = configureStore({
  reducer: {
    user_store: userReducer,
    products_store: productsReducer,
    categories_store: categoriesReducer,
    orders_store: ordersReducer,
  },
});
