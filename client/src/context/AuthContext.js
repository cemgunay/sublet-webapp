import { createContext, useEffect, useReducer, useState } from "react";
import AuthReducer from "./AuthReducer";
import { useLocation } from "react-router-dom";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const location = useLocation();
  const [role, setRole] = useState("subtenant");

  useEffect(() => {
    if (location.pathname.includes("/host/")) {
      setRole("tenant");
    } else {
      setRole("subtenant");
    }
  }, [location]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
        role,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
