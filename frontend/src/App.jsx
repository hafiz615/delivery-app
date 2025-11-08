import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import DeliveryPreference from "./components/DeliveryPreference";
import Signup from "./components/SignUp";
import Summary from "./components/Summary";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? (
    <React.Fragment>{children}</React.Fragment>
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/delivery"
        element={
          <ProtectedRoute>
            <DeliveryPreference />
          </ProtectedRoute>
        }
      />
      <Route
        path="/summary"
        element={
          <ProtectedRoute>
            <Summary />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
