import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginBackground from "../images/login-background.png";
import { useNavigate } from "react-router-dom";
import $ from "jquery"; // Import jQuery
import {
  faFacebookF,
  faGoogle,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import "./Login.css";
import { registerNewUser, loginUser } from "../FirebaseService"; // Import Firebase functions
import Footer from "../models/Footer";
import { useAuth } from "../AuthContext";

const LoginandRegisterPage = () => {
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

  useEffect(() => {
    $("#signUp").click(() => {
      $("#container").addClass("right-panel-active");
    });

    $("#signIn").click(() => {
      $("#container").removeClass("right-panel-active");
    });

    // Remove event listeners when the component unmounts
    return () => {
      $("#signUp").off("click");
      $("#signIn").off("click");
    };
  }, []); // Empty dependency array to run this effect once

  const handleUserChange = (e: any) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleNewUserChange = (e: any) => {
    const { name, value } = e.target;
    setNewUser((prevNewUser) => ({
      ...prevNewUser,
      [name]: value,
    }));
  };

  function registerNewUserHandler() {
    registerNewUser(newUser.email, newUser.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Registered user:", user);
        setNewUser({ email: "", password: "", name: "" });
        navigate("/home");
      })
      .catch((error) => {
        console.error("Registration error:", error);
      });
  }

  function loginUserHandler() {
    loginUser(user.email, user.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Logged in user:", user);
        navigate("/home");
        setUser({ email: "", password: "" });
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  }

  return (
    <div style={{ backgroundImage: `${LoginBackground}`, margin: "100px" }}>
      <div
        className="container"
        id="container"
        style={{
          backgroundImage: `url${LoginBackground}`,
        }}>
        <div className="form-container sign-up-container">
          <form action="#">
            <h1>Create Account</h1>
            <div className="social-container">
              <a
                href="#"
                className="social"
                style={{ backgroundColor: "#3F51B5" }}>
                <FontAwesomeIcon icon={faFacebookF} color="white" />
              </a>
              <a
                href="#"
                className="social"
                style={{ backgroundColor: "#F4511E" }}>
                <FontAwesomeIcon icon={faGoogle} color="white" />
              </a>
              <a
                href="#"
                className="social"
                style={{ backgroundColor: "#0288D1" }}>
                <FontAwesomeIcon icon={faLinkedinIn} color="white" />
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => handleNewUserChange(e)}
              name="name"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => handleNewUserChange(e)}
              name="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => handleNewUserChange(e)}
              name="password"
            />
            <button
              style={{ marginTop: "10px" }}
              type="button"
              onClick={() => registerNewUserHandler()}>
              Sign Up
            </button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="#">
            <h1>Sign in</h1>
            <div className="social-container">
              <a
                href="#"
                className="social"
                style={{ backgroundColor: "#3F51B5" }}>
                <FontAwesomeIcon icon={faFacebookF} color="white" />
              </a>
              <a
                href="#"
                className="social"
                style={{ backgroundColor: "#F4511E" }}>
                <FontAwesomeIcon icon={faGoogle} color="white" />
              </a>
              <a
                href="#"
                className="social"
                style={{ backgroundColor: "#0288D1" }}>
                <FontAwesomeIcon icon={faLinkedinIn} color="white" />
              </a>
            </div>
            <span>or use your account</span>
            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => handleUserChange(e)}
              name="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => handleUserChange(e)}
              name="password"
            />
            <a href="#">Forgot your password?</a>
            <button type="button" onClick={() => loginUserHandler()}>
              Sign In
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => setLoginOrRegister(false)}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start the journey with us</p>
              <button
                className="ghost"
                id="signUp"
                onClick={() => setLoginOrRegister(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer></footer>
    </div>
  );
};

export default LoginandRegisterPage;
