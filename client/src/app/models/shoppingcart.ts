export interface ShoppingCartItem {
  productId: number;
  name: string;
  price: number;
  pictureUrl: string;
  brand: string;
  type: string;
  quantityInCart: number;
}

export interface ShoppingCart {
  id: number;
  buyerId: string;
  items: ShoppingCartItem[];
}
