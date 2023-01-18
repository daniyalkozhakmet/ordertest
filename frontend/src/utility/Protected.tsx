import React from "react";
import { Navigate } from "react-router-dom";
type ProtectedProp = {
  isLoggedIn: boolean;
  children: JSX.Element;
};
export const Protected = ({ isLoggedIn, children }: ProtectedProp) => {
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  return children;
};
export const LoggedIn = ({ isLoggedIn, children }: ProtectedProp) => {
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }
  return children;
};
