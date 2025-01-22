import { useState, useEffect } from "react";
import { Box, CssBaseline, LinearProgress } from "@mui/material";
import { AppState } from "../providers/AppState.jsx";

import { AppHeader } from "./AppHeader.jsx";
import { AllTodoLists } from "./AllTodoLists.jsx";
import { CurrentTodoList } from "./CurrentTodoList.jsx";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

import Login from "../auth/login/Login.jsx";
import Signup from "../auth/signup/Signup.jsx";

export function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  const [showLogin, setShowLogin] = useState(true);

  if (!authChecked) {
    return <LinearProgress color="success" />;
  }

  if (!user) {
    return (
      <div>
        <CssBaseline />
        {showLogin ? (
          <Login togglePage={() => setShowLogin(false)} />
        ) : (
          <Signup togglePage={() => setShowLogin(true)} />
        )}
      </div>
    );
  }

  return (
    <AppState>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppHeader />
        <AllTodoLists />
        <CurrentTodoList />
      </Box>
    </AppState>
  );
}
