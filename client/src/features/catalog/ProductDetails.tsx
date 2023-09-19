import {
  Button,
  Container,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { ShoppingCart } from "@mui/icons-material";
import { useStoreContext } from "../../app/context/StoreContext";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState({
    loading: true,
    name: "get",
  });

  const { setShoppingCart } = useStoreContext();

  function addItemToCart() {
    setStatus({ loading: true, name: "add" });
    agent.ShoppingCart.postItemToShoppingCart(product!.id, 1)
      .then((shoppingCart) => setShoppingCart(shoppingCart))
      .then(() => toast.success(`${product!.name} added to cart.`))
      .finally(() => setStatus({ loading: false, name: "" }));
  }

  useEffect(() => {
    id &&
      agent.Catalog.details(parseInt(id))
        .then((product) => setProduct(product))
        .catch((error) => console.log(error))
        .finally(() => setStatus({ loading: false, name: "" }));
  }, [id]);

  if (status.loading && status.name === "get")
    return <LoadingComponent message="Retrieving product..." />;

  if (!product) return <Navigate replace to={"/not-found"} />;
  return (
    <Container>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <img
            src={product.pictureUrl}
            alt={product.name}
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h3">{product.name}</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h5" color={"secondary"}>
            ${(product.price / 100).toFixed(2)}
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>{product.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>{product.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Brand</TableCell>
                  <TableCell>{product.brand}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>{product.type}</TableCell>
                </TableRow>
                <TableRow>
                  <LoadingButton
                    loading={status.loading && status.name === "add"}
                    sx={{ display: "flex", mt: 5, borderRadius: 5, width: 180 }}
                    variant="contained"
                    endIcon={<ShoppingCart />}
                    onClick={addItemToCart}
                  >
                    Add to cart
                  </LoadingButton>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
}
