import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginBackground from "../images/login-background.png";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import {
  faFacebookF,
  faGoogle,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import "./Login.css";
import { registerNewUser, loginUser } from "../FirebaseService";
import { useAuth } from "../AuthContext";
import avatar1 from "../images/avatar-1.jpg";
import avatar2 from "../images/avatar-2.jpg";
import avatar3 from "../images/avatar-3.jpg";
import avatar4 from "../images/avatar-4.jpg";
import avatar5 from "../images/avatar-5.jpg";
import { Avatar } from "@mui/material";
import LoadingPage from "../models/LoadingPage";

const LoginandRegisterPage = () => {
  const [loginOrRegister, setLoginOrRegister] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
    avatar: `avatar1`,
  });
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkIsMobile = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    checkIsMobile();

    $("#signUp").click(() => {
      $("#container").addClass("right-panel-active");
      console.log(loginOrRegister, "sign in");
      setLoginOrRegister(true);
    });

    $("#signIn").click(() => {
      $("#container").removeClass("right-panel-active");
      setLoginOrRegister(false);
    });

    // Simulate loading for demonstration
    setTimeout(() => {
      setIsLoading(false);
    }, 4000); // Adjust the time as needed

    // Remove event listeners when the component unmounts
    return () => {
      $("#signUp").off("click");
      $("#signIn").off("click");
    };
  }, []);

  const handleAvatarClick = (index: any) => {
    setSelectedAvatar(index);
    setNewUser((prevNewUser) => ({
      ...prevNewUser,
      avatar: `avatar${index + 1}`,
    }));
  };

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
    registerNewUser(newUser)
      .then((userCredential: any) => {
        const user = userCredential.user;
        console.log("Registered user:", user);

        setNewUser({
          email: "",
          password: "",
          name: "",
          avatar: `avatar${selectedAvatar + 1}`,
        });

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
    <div id="animatedBackground">
      {isLoading ? (
        <LoadingPage />
      ) : isMobile ? (
        <div>
          {loginOrRegister ? (
            <div
              className="form-container sign-in-container"
              style={{ height: "100%", width: "100%" }}>
              <div className="overlay-container-mobile">
                <div className="overlay" style={{ position: "static" }}>
                  <div className="overlay-panel" style={{ padding: "20px" }}>
                    <h1>Welcome Back!</h1>
                    <p>
                      To keep connected with us please login with your personal
                      info
                    </p>
                    <button
                      className="ghost"
                      onClick={() => setLoginOrRegister(false)}>
                      Sign In
                    </button>
                  </div>
                </div>
              </div>

              <form
                style={{
                  zIndex: "1000",
                  justifyContent: "flex-start",
                  paddingTop: "40px",
                }}>
                <h1 className="text-focus-in">Create Account</h1>
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
                  className="text-focus-in"
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => handleNewUserChange(e)}
                  name="password"
                />
                <p>Select Avatar:</p>
                <div
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    padding: "20px",
                  }}>
                  {avatars.map((avatar, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleAvatarClick(index)}>
                      <Avatar
                        src={avatar}
                        style={{
                          width: "70px",
                          height: "70px",
                          transition: "transform 0.2s",
                          transform:
                            selectedAvatar === index
                              ? "scale(1.2)"
                              : "scale(1)",
                        }}
                      />
                      {selectedAvatar === index && (
                        <div
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            backgroundColor: "none",
                            borderRadius: "50%",
                            padding: "2px",
                            color: "white",
                          }}>
                          ✅
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  style={{ marginTop: "20px" }}
                  type="button"
                  onClick={() => registerNewUserHandler()}>
                  Sign Up
                </button>
              </form>
            </div>
          ) : (
            <div
              className="form-container sign-in-container"
              style={{ height: "100%", width: "100%" }}>
              <div className="overlay-container-mobile">
                <div className="overlay" style={{ position: "static" }}>
                  <div className="overlay-panel ">
                    <h1>Hello, Friend!</h1>
                    <p>
                      Enter your personal details and start the journey with us
                    </p>
                    <button
                      className="ghost"
                      onClick={() => setLoginOrRegister(true)}>
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
              <form
                style={{ justifyContent: "flex-start", paddingTop: "40px" }}>
                <h1 style={{ marginTop: "5px" }}>Sign in</h1>
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
                  className="text-focus-in"
                  value={user.email}
                  onChange={(e) => handleUserChange(e)}
                  name="email"
                />
                <input
                  type="password"
                  className="text-focus-in"
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
          )}
        </div>
      ) : (
        <div
          className="container"
          id="container"
          style={{
            backgroundImage: `url(${LoginBackground})`,
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
              <p>Select Avatar:</p>
              <div
                style={{
                  display: "flex",
                  marginBottom: "10px",
                }}>
                {avatars.map((avatar, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleAvatarClick(index)}>
                    <Avatar
                      src={avatar}
                      style={{
                        width: "70px",
                        height: "70px",
                        transition: "transform 0.2s",
                        transform:
                          selectedAvatar === index ? "scale(1.2)" : "scale(1)",
                      }}
                    />
                    {selectedAvatar === index && (
                      <div
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          backgroundColor: "none",
                          borderRadius: "50%",
                          padding: "2px",
                          color: "white",
                        }}>
                        ✅
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                style={{ marginTop: "20px" }}
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
                className="text-focus-in"
                value={user.email}
                onChange={(e) => handleUserChange(e)}
                name="email"
              />
              <input
                type="password"
                placeholder="Password"
                className="text-focus-in"
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
      )}
    </div>
  );
};

export default LoginandRegisterPage;
