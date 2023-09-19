// App.js
import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import { AuthProvider } from "./AuthContext"; // Import the AuthProvider

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
