import { configureStore } from '@reduxjs/toolkit';
import cartSliceReducer from './redux/cartSlice';
import authReducer from './redux/authSlice'; // add this line

const store = configureStore({
  reducer: {
    cart: cartSliceReducer,
    auth: authReducer, // add this line
  }
});

export default store;
