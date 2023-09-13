import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Container, CssBaseline } from "@mui/material";

function App() {
  return (
    <>
      <CssBaseline />
      <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}

export default App;
