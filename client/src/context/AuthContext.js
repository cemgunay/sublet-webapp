import { createContext, useEffect, useReducer, useState } from "react";
import AuthReducer from "./AuthReducer";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const location = useLocation();
  const role = location.pathname.includes("/host/") ? "tenant" : "subtenant"

  // Create a new socket connection
  const socket = io("http://localhost:8080");

  // Listen for 'userUpdated' events
  useEffect(() => {
    console.log('runnning update user')
    socket.on("userUpdated", (updatedUser) => {
      console.log(updatedUser)
      // If the updated user is the same as the logged in user, update local storage and state
      if (state.user && state.user._id === updatedUser._id) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        dispatch({ type: "UPDATE_USER", payload: updatedUser });
      }
    });

    // Clean up function to remove the listener when the component unmounts
    return () => {
      socket.off("userUpdated");
    };
  }, [state.user, socket, dispatch]);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
