import { PropsWithChildren, createContext, useContext, useState } from "react";
import { ShoppingCart } from "../models/shoppingcart";

interface StorContextValue {
  shoppingCart: ShoppingCart | null;
  setShoppingCart: (shoppingCart: ShoppingCart) => void;
  removeItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StorContextValue | undefined>(
  undefined
);

export function useStoreContext() {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw Error("oops- soadpadp");
  }

  return context;
}

export function StoreProvider({ children }: PropsWithChildren<any>) {
  const [shoppingCart, setShoppingCart] = useState<ShoppingCart | null>(null);

  function removeItem(productId: number, quantity: number) {
    if (!shoppingCart) return;

    // Copy of shoppingcart items
    const items = [...shoppingCart.items];

    const itemIndex = items.findIndex((i) => i.productId === productId);
    if (itemIndex >= 0) {
      items[itemIndex].quantityInCart -= quantity;

      if (items[itemIndex].quantityInCart === 0) {
        items.splice(itemIndex, 1);
        setShoppingCart((prevState) => {
          return { ...prevState!, items };
        });
      }
    }
  }

  return (
    <StoreContext.Provider
      value={{ shoppingCart, setShoppingCart, removeItem }}
    >
      {children}
    </StoreContext.Provider>
  );
}
