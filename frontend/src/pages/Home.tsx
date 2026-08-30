import { Link } from "react-router-dom";
import { Button } from "@mui/material";

function Home() {
  return (
    <>
      <h1>Schedulix</h1>

      <Button component={Link} to="/login" variant="contained">
        Login
      </Button>

      <Button component={Link} to="/register" variant="outlined">
        Register
      </Button>
    </>
  );
}

export default Home;
