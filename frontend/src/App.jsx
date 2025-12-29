import React from "react";
import Navbar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <div>
      <Layout>
        <Dashboard />
      </Layout>
    </div>
  );
};

export default App;
