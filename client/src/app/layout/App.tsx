import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Container, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStoreContext } from "../context/StoreContext";
import { useEffect, useState } from "react";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const [loading, setLoading] = useState(true);
  const { setShoppingCart } = useStoreContext();

  useEffect(() => {
    const buyerId = getCookie("buyerId");
    if (buyerId) {
      agent.ShoppingCart.getShoppingCart()
        .then((cart) => setShoppingCart(cart))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }
    else{
      setLoading(false)
    }
  }, [setShoppingCart]);

  if (loading) return <LoadingComponent message="Initalizing ..." />;

  return (
    <>
      <ToastContainer position="bottom-right" theme="colored" />
      <CssBaseline />
      <Header />
      <Container maxWidth={false}>
        <Outlet />
      </Container>
    </>
  );
}

export default App;
