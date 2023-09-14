using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("ShoppingCartItems")]
    public class ShoppingCartItem
    {
        public int Id { get; set; }
        public int Quantity { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int ShoppingCartId { get; set; }
        public ShoppingCart ShoppingCart { get; set; }
    }
}