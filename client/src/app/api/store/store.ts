import { configureStore } from "@reduxjs/toolkit";
import { shoppingCartSlice } from "../../../features/shoppingCart/shoppingCartSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { catalogSlice } from "../../../features/catalog/catalogSlice";

export const store = configureStore({
  reducer: {
    shoppingCart: shoppingCartSlice.reducer,
    catalog: catalogSlice.reducer
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

