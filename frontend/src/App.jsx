import React from "react";
import AddGroup from "./pages/AddGroup";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import { Navigate, Route, Routes } from "react-router";

import { useUser } from "@clerk/clerk-react";

const App = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={!isSignedIn ? <HomePage /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={
            isSignedIn ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/group/new"
          element={isSignedIn ? <AddGroup /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
};

export default App;
