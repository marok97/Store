using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ShoppingCartController : BaseApiController
    {
        private readonly StoreContext _storeContext;
        public ShoppingCartController(StoreContext storeContext)
        {
            _storeContext = storeContext;

        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<ShoppingCartDto>> GetShoppingCart()
        {
            var shoppingCart = await GetShoppingCartFromCookie();
            return MapShoppingCartToDto(shoppingCart);
        }



        [HttpPost]
        public async Task<ActionResult<ShoppingCartDto>> AddItemToShoppingCart(int productId, int quantity)
        {
            // get shoppingcart 
            var shoppingCart = await GetShoppingCartFromCookie();
            //create shoppingcart if it does not exist (is null)
            if (shoppingCart == null) shoppingCart = CreateShoppingCart();

            // get product
            var product = await _storeContext.Products.FindAsync(productId);
            if (product == null) return NotFound();
            // add the item to the cart
            shoppingCart.AddItem(product, quantity);
            // save the changes
            var result = await _storeContext.SaveChangesAsync() > 0;
            if (result) return CreatedAtRoute("GetBasket", MapShoppingCartToDto(shoppingCart));

            return BadRequest(new ProblemDetails { Title = "Problem saving to cart." });
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveItemFromShoppingCart(int productId, int quantity)
        {
            // get shoppingcart
            var shoppincart = await GetShoppingCartFromCookie();
            // check that shoppingcart exists
            if (shoppincart == null) return NotFound();
            // reduce quantity or remove item
            shoppincart.RemoveItem(productId, quantity);
            // save changes and get result
            var result = await _storeContext.SaveChangesAsync() > 0;
            // check that result is true
            if (result) return Ok();

            //if result is false return bad request with a new ProblemDetails
            return BadRequest(new ProblemDetails { Title = "Problem removing item from cart" });

        }

        private async Task<ShoppingCart> GetShoppingCartFromCookie()
        {
            return await _storeContext.
                ShoppingCarts
                .Include(shoppingCartItem => shoppingCartItem.Items)
                .ThenInclude(product => product.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }


        private ShoppingCart CreateShoppingCart()
        {
            // create buyerId with Guid
            var buyerId = Guid.NewGuid().ToString();
            // create cookie options thats says IsEssential and expires in 30 days from now
            var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            // append the buyerId as a Cookie
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            //create a new shoppincart with the buyerid
            var shoppingCart = new ShoppingCart { BuyerId = buyerId };
            //Track shoppingcart (does not save to DB untill SaveChanges method is called)
            _storeContext.Add(shoppingCart);

            return shoppingCart;
        }

        private ShoppingCartDto MapShoppingCartToDto(ShoppingCart shoppingCart)
        {

            // Maps shoppingcart entity with shoppingcartdto
            return new ShoppingCartDto
            {
                Id = shoppingCart.Id,
                BuyerId = shoppingCart.BuyerId,
                Items = shoppingCart.Items
                        .Select(item => new ShoppingCartItemDto
                        {
                            ProductId = item.ProductId,
                            Name = item.Product.Name,
                            Brand = item.Product.Brand,
                            PictureUrl = item.Product.PictureUrl,
                            QuantityInStock = item.Quantity,
                            Price = item.Product.Price,
                            Type = item.Product.Type
                        }).ToList()
            };
        }

    }
}