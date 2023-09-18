import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom"; // Import from 'react-router-dom'
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
