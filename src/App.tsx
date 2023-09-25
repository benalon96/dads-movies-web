// App.js
import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import { AuthProvider } from "./AuthContext"; // Import the AuthProvider
import LoginandRegisterPage from "./components/LoginandRegisterpage";
import MoviePage from "./components/MoviePage";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/movie/:movieName" element={<MoviePage />} />
          <Route path="/login" element={<LoginandRegisterPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
