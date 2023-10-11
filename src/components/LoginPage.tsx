import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginBackground from "../images/login-background.png";
import { useNavigate } from "react-router-dom";
import {
  faFacebookF,
  faTwitter,
  faGoogle,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import "./Login.css";
import { registerNewUser, loginUser } from "../FirebaseService"; // Import Firebase functions
import Footer from "../models/Footer";
import { useAuth } from "../AuthContext";

const LoginPage = () => {
  const [loginOrRegister, setLoginOrRegister] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  if (currentUser) {
    navigate("/home");
  }
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  function registerNewUserHandler(): void {
    registerNewUser(newUser)
      .then((userCredential: any) => {
        const user = userCredential.user;
        console.log("Registered user:", user);
        setNewUser({ email: "", password: "", name: "" });
        navigate("/home");
      })
      .catch((error: any) => {
        console.error("Registration error:", error);
      });
  }

  function loginUserHandler(): void {
    loginUser(user.email, user.password)
      .then((userCredential: any) => {
        const user = userCredential.user;
        console.log("Logged in user:", user);
        navigate("/home");
        setUser({ email: "", password: "" });
      })
      .catch((error: any) => {
        console.error("Login error:", error);
      });
  }

  return (
    <section className="vh-100 position-relative">
      {/* Background image covering the entire page */}
      <div
        className="position-absolute top-0 start-0 end-0 bottom-0"
        style={{
          backgroundImage: `url(${LoginBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: "1",
        }}></div>

      {/* Login dialog */}
      <div
        className="position-absolute top-0 start-0 end-0 bottom-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          zIndex: "2",
        }}>
        <div className="container">
          {loginOrRegister ? (
            // Registration form
            <form className="form-container">
              {/* ... (your registration form content) */}
            </form>
          ) : (
            // Login form
            <form className="form-container">
              {/* ... (your login form content) */}
            </form>
          )}
        </div>
      </div>

      {/* Footer above the image */}
      <Footer />
    </section>
  );
};

export default LoginPage;
