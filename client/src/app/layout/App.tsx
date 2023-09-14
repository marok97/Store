import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Container, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <>
    <ToastContainer position="bottom-right" theme="colored"/>
      <CssBaseline />
      <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}

export default App;
