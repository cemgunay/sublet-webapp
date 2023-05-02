import { createContext, useEffect, useReducer, useState } from "react";
import AuthReducer from "./AuthReducer";
import React from 'react';

const INITIAL_STATE = {
  user:JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  
  const [role, setRole] = useState("subtenant")

  useEffect(()=>{
    localStorage.setItem("user", JSON.stringify(state.user))
  },[state.user])
  
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
        role,
        setRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};