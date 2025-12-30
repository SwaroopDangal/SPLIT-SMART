import React from "react";
import AddGroup from "./pages/AddGroup";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import { Navigate, Route, Routes } from "react-router";
import toast, { Toaster } from "react-hot-toast";

import { useUser } from "@clerk/clerk-react";
import GroupDetails from "./pages/GroupDetails";

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
        <Route
          path="/group/:id"
          element={
            isSignedIn ? (
              <Layout>
                <GroupDetails />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
