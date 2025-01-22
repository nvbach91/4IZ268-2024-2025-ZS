import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid2,
} from "@mui/material";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const Login = ({ togglePage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-credential":
          setError("Incorrect email or password. Please try again.");
          break;
        case "auth/too-many-requests":
          setError("Too many requests. Try again later.");
          break;
        default:
          setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            variant="standard"
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            variant="standard"
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Grid2 container>
            <Grid2>
              <Typography variant="p">
                No account?{" "}
                <a
                  href="#"
                  onClick={togglePage}
                  style={{ textDecoration: "none", color: "blue" }}
                >
                  Sign up here!
                </a>
              </Typography>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
