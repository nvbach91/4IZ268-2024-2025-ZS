import {
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import LogoutIcon from "@mui/icons-material/Logout";

export function AppHeader() {
  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "#3E7B27" }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Lists
          </Typography>
          <Tooltip
            title={
              auth.currentUser
                ? `Login email: ${auth.currentUser.email}`
                : "No user logged in"
            }
          >
            <Typography variant="p" component="div" sx={{ mr: 4 }}>
              Currently logged-in as:{" "}
              <b>{auth.currentUser?.displayName || "Guest"}</b>
            </Typography>
          </Tooltip>
          <Tooltip text="Log-out">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="add new list button"
              onClick={() => {
                signOut(auth);
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </>
  );
}
