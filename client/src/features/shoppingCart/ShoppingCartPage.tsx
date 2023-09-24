import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/api/store/store";
import {
  addShoppingCartItemAsync,
  removeShoppingCartItemAsync,
} from "./shoppingCartSlice";

export default function ShoppingCartPage() {
  const dispatch = useAppDispatch();
  const { shoppingCart, status } = useAppSelector(
    (state) => state.shoppingCart
  );
  const itemCount = shoppingCart?.items.reduce(
    (sum, item) => sum + item.quantityInCart,
    0
  );

  const totalPrice =
    shoppingCart?.items.reduce(
      (priceSum, item) => priceSum + item.price * item.quantityInCart,
      0
    ) ?? 0;

  const [deliveryFee, setDeliveryFee] = useState<number>(0);

  useEffect(() => {
    if (itemCount! <= 0) {
      setDeliveryFee(0);
    } else if (totalPrice / 100 >= 150) {
      setDeliveryFee(0);
    } else {
      setDeliveryFee(14.99);
    }
  }, [totalPrice]);

  function addItem(productId: number) {
    dispatch(addShoppingCartItemAsync({ productId: productId }));
  }

  function removeAllItems(productId: number, quantity: number) {
    dispatch(
      removeShoppingCartItemAsync({
        productId: productId,
        quantity: quantity,
        name: "del",
      })
    );
  }

  function removeOneItem(productId: number, quantity = 1) {
    dispatch(
      removeShoppingCartItemAsync({
        productId: productId,
        quantity: quantity,
        name: "rem",
      })
    );
  }
  if (!shoppingCart) return <Typography>Shopping cart empty</Typography>;
  return (
    <Grid container spacing={6}>
      <Grid item xs={8}>
        <Typography
          gutterBottom
          sx={{ mb: 4, fontWeight: "bold" }}
          variant="h5"
        >
          Shopping Cart ${(totalPrice! / 100).toFixed(2)}
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            {/* <TableHead>
              <TableRow>
                <TableCell align="left">Product</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Subtotal</TableCell>
                <TableCell align="center">Remove</TableCell>
              </TableRow>
            </TableHead> */}
            <TableBody>
              {shoppingCart.items.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell component="th" scope="item">
                    <Box display={"flex"} alignItems={"center"}>
                      <img
                        src={item.pictureUrl}
                        style={{ height: 55, marginRight: 20 }}
                      />
                      <span>{item.name}</span>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    ${(item.price / 100).toFixed(2)}
                  </TableCell>

                  <TableCell align="center">
                    <Box border={1} borderRadius={5} borderColor={"green"}>
                      <LoadingButton
                        size="small"
                        color="success"
                        loading={status === "pendingAddItem" + item.productId}
                        onClick={() => addItem(item.productId)}
                      >
                        <Add />
                      </LoadingButton>
                      {item.quantityInCart}
                      <LoadingButton
                        loading={
                          status ===
                          "pendingRemoveItem" + item.productId + "rem"
                        }
                        color="error"
                        size="small"
                        onClick={() => removeOneItem(item.productId)}
                      >
                        <Remove />
                      </LoadingButton>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    ${((item.price / 100) * item.quantityInCart).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <LoadingButton
                      loading={
                        status === "pendingRemoveItem" + item.productId + "del"
                      }
                      color="error"
                      onClick={() =>
                        removeAllItems(item.productId, item.quantityInCart)
                      }
                    >
                      <Delete />
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={4}>
        <Typography
          gutterBottom
          sx={{ mb: 4, fontWeight: "bold" }}
          variant="h5"
        >
          Item(s) in cart {itemCount}
        </Typography>

        <Divider sx={{ mb: 3 }} />
        <Typography variant="h6" gutterBottom>
          Products: ${(totalPrice! / 100).toFixed(2)}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Delivery fee: ${deliveryFee}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Total: ${(totalPrice! / 100 + deliveryFee).toFixed(2)}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography sx={{ fontStyle: "italic" }}>
          Total over $250 qualify for free delivery
        </Typography>
        <Divider />
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{ mt: 4 }}
        >
          <Button
            sx={{ borderRadius: 5 }}
            variant="contained"
            component={NavLink}
            to={"/catalog"}
          >
            Back to shopping
          </Button>
          <Button sx={{ borderRadius: 5 }} variant="contained">
            Check out
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
