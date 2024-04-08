import React, { Component } from "react";
import "./App.css";
import Scheduler from "./scheduler/Scheduler";
import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Main from "./pages/Main";

const App = () => {
  const [currentTab, setCurrentTab] = React.useState("/calendar");
  const handleSearchInputChange = (event) => {
    // Implement your search logic here
    console.log("Search query:", event.target.value);
  };

  const generateInitials = (name) => {
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Router>
      <Routes>
        <Route index element={<Main />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
