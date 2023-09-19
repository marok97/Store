import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
  Container,
} from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { useStoreContext } from "../../app/context/StoreContext";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [loading, setLoading] = useState(false);
  const { setShoppingCart } = useStoreContext();

  function addItemToCart() {
    setLoading(true);
    agent.ShoppingCart.postItemToShoppingCart(product.id, 1)
      .then((shoppingCart) => setShoppingCart(shoppingCart))
      .then(() => toast.success(`${product.name} added to cart.`))
      .finally(() => setLoading(false));
  }

  return (
    <Container>
      <Card>
        <CardHeader
          titleTypographyProps={{
            sx: { fontWeight: "bold", color: "primary.main" },
          }}
          avatar={
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              {product.name.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={product.name}
        />
        <CardMedia
          sx={{
            height: 140,
            backgroundSize: "contain",
            bgcolor: "primary.light",
          }}
          image={product.pictureUrl}
          title={product.name}
        />
        <CardContent>
          <Typography gutterBottom color={"secondary"} variant="h5">
            ${(product.price / 100).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.brand} / {product.type}
          </Typography>
        </CardContent>
        <CardActions>
          <LoadingButton loading={loading} size="small" onClick={addItemToCart}>
            Add to cart
          </LoadingButton>
          <Button component={Link} to={`/catalog/${product.id}`} size="small">
            View
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
