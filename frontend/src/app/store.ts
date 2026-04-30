import { configureStore } from "@reduxjs/toolkit"
import productReducer from "../features/products/productSlice"
import categoryReducer from "../features/category/categorySlice"
import authReducer from "../features/auth/authSlice"
import cartReducer from "../features/cart/cartSlice"

export const store = configureStore({
  reducer: {
    product: productReducer,
    category: categoryReducer,
    auth: authReducer,
    cart: cartReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
