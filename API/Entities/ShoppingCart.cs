namespace API.Entities
{
    public class ShoppingCart
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<ShoppingCartItem> Items { get; set; } = new List<ShoppingCartItem>();


        public void AddItem(Product product, int quantity)
        {
            if (Items.All(item => item.ProductId != product.Id))
            {
                Items.Add(new ShoppingCartItem { Product = product, Quantity = quantity });
            }

            var existingProducts = Items.FirstOrDefault(item => item.ProductId == product.Id);

            if (existingProducts != null) existingProducts.Quantity += quantity;
        }

        public void RemoveItem(int productId, int quantity)
        {
            var existingProducts = Items.FirstOrDefault(item => item.ProductId == productId);

            if (existingProducts != null) existingProducts.Quantity -= quantity;
            if (existingProducts.Quantity == 0) Items.Remove(existingProducts);
        }
    }

}