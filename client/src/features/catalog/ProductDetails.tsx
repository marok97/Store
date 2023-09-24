import {
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
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { ShoppingCart } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/api/store/store";
import { addShoppingCartItemAsync } from "../shoppingCart/shoppingCartSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";
import NotFound from "../../app/errors/NotFound";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  const product = useAppSelector((state) =>
    productSelectors.selectById(state, parseInt(id!))
  );
  const { status } = useAppSelector((state) => state.shoppingCart);
  const dispatch = useAppDispatch();

  const { status: productStatus } = useAppSelector((state) => state.catalog);

  function addItemToCart() {
    dispatch(addShoppingCartItemAsync({ productId: product!.id }));
  }

  useEffect(() => {
    if (!product) dispatch(fetchProductAsync(parseInt(id!)));
  }, [id, dispatch, product]);

  if (productStatus.includes("pending"))
    return <LoadingComponent message="Retrieving product..." />;

  if (!product) return <NotFound />;

  return (
    <Container>
      {product && (
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
                </TableBody>
              </Table>
            </TableContainer>
            <LoadingButton
              loading={status === "pendingAddItem" + product.id}
              sx={{
                display: "flex",
                mt: 5,
                borderRadius: 5,
                width: 180,
              }}
              variant="contained"
              endIcon={<ShoppingCart />}
              onClick={addItemToCart}
            >
              Add to cart
            </LoadingButton>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
