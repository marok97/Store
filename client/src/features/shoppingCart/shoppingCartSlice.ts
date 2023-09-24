import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ShoppingCart } from "../../app/models/shoppingcart";
import agent from "../../app/api/agent";

interface ShoppingCartState {
  shoppingCart: ShoppingCart | null;
  status: string;
}

const initialState: ShoppingCartState = {
  shoppingCart: null,
  status: "idle",
};

export const addShoppingCartItemAsync = createAsyncThunk<
  ShoppingCart,
  { productId: number; quantity?: number }
>(
  "shoppingCart/addShoppingCartItemAsync",
  async ({ productId, quantity = 1 }) => {
    try {
      return await agent.ShoppingCart.postItemToShoppingCart(
        productId,
        quantity
      );
    } catch (error) {
      console.log(error);
    }
  }
);
export const removeShoppingCartItemAsync = createAsyncThunk<
  void,
  { productId: number; quantity: number; name?: string }
>(
  "shoppingCart/removeShoppingCartItemAsync",
  async ({ productId, quantity }) => {
    try {
      await agent.ShoppingCart.removeShoppingCartItem(productId, quantity);
    } catch (error) {
      console.log(error);
    }
  }
);

export const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    setShoppingCart: (state, action: PayloadAction<ShoppingCart>) => {
      state.shoppingCart = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addShoppingCartItemAsync.pending, (state, action) => {
      state.status = "pendingAddItem" + action.meta.arg.productId;
    });
    builder.addCase(addShoppingCartItemAsync.fulfilled, (state, action) => {
      state.shoppingCart = action.payload;
      state.status = "idle";
    });
    builder.addCase(addShoppingCartItemAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(removeShoppingCartItemAsync.pending, (state, action) => {
      state.status =
        "pendingRemoveItem" + action.meta.arg.productId + action.meta.arg.name;
    });
    builder.addCase(removeShoppingCartItemAsync.fulfilled, (state, action) => {
      const { productId, quantity } = action.meta.arg;
      const itemIndex = state.shoppingCart?.items.findIndex(
        (i) => i.productId === productId
      );

      if (itemIndex === -1 || itemIndex === undefined) {
        return;
      }

      state.shoppingCart!.items[itemIndex].quantityInCart -= quantity;

      if (state.shoppingCart?.items[itemIndex].quantityInCart === 0) {
        state.shoppingCart.items.splice(itemIndex, 1);
      }
      state.status = "idle";
    });
    builder.addCase(removeShoppingCartItemAsync.rejected, (state) => {
      state.status = "idle";
    });
  },
});

export const { setShoppingCart } = shoppingCartSlice.actions;
