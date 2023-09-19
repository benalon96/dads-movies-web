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
    registerNewUser(newUser.email, newUser.password)
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
        className="position-absolute top-50 start-50 translate-middle "
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          borderRadius: "8px",
          padding: "80px",
          height: "70%",
          width: "70%",
          zIndex: "2",
        }}>
        {loginOrRegister ? (
          <form>
            <div className="d-flex flex-row align-items-center justify-content-center justify-content-sm-start">
              <p className="lead fw-normal mb-0 me-2 small">Sign up with</p>
              <button
                type="button"
                className="btn btn-primary btn-floating mx-1"
                style={{ backgroundColor: "#4E387E" }}>
                <FontAwesomeIcon icon={faFacebookF} />
              </button>

              <button
                type="button"
                className="btn btn-primary btn-floating mx-1"
                style={{ backgroundColor: "#4E387E" }}>
                <FontAwesomeIcon icon={faTwitter} />
              </button>

              <button
                type="button"
                className="btn btn-primary btn-floating mx-1"
                style={{ backgroundColor: "#4E387E" }}>
                <FontAwesomeIcon icon={faGoogle} />
              </button>
            </div>

            <div className="divider d-flex align-items-center my-3">
              <p
                className="text-center fw-bold mx-3 mb-0"
                style={{ color: "white" }}>
                Or
              </p>
            </div>

            {/* Registration form */}
            <div className="form-outline mb-2">
              <input
                type="text"
                id="name"
                name="name"
                className="form-control form-control-sm"
                placeholder="Enter your name"
                style={{ backgroundColor: "darkgrey", color: "white" }}
                value={newUser.name}
                onChange={handleNewUserChange}
              />
            </div>
            <div className="form-outline mb-2">
              <input
                type="email"
                id="email"
                name="email"
                className="form-control form-control-sm"
                placeholder="Enter a valid email address"
                style={{ backgroundColor: "darkgrey", color: "white" }}
                value={newUser.email}
                onChange={handleNewUserChange}
              />
            </div>

            <div className="form-outline mb-2">
              <input
                type="password"
                id="password"
                name="password"
                className="form-control form-control-sm"
                placeholder="Enter password"
                style={{ backgroundColor: "darkgrey", color: "white" }}
                value={newUser.password}
                onChange={handleNewUserChange}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="form-check mb-0">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  value=""
                  id="form2Example3"
                />
                <label
                  className="form-check-label"
                  htmlFor="form2Example3"
                  style={{ color: "white" }}>
                  Remember me
                </label>
              </div>
              <a href="#!" className="text-body small">
                Forgot password?
              </a>
            </div>

            <div className="text-center text-sm-start mt-2">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{
                  paddingLeft: "2rem",
                  paddingRight: "2rem",
                  backgroundColor: "",
                }}
                onClick={() => registerNewUserHandler()}>
                Register
              </button>
              <p className="small fw-bold mt-2 mb-0">
                Already have an account?{" "}
                <a
                  className="link-danger"
                  onClick={() => setLoginOrRegister(false)}>
                  Login
                </a>
              </p>
            </div>
          </form>
        ) : (
          <form>
            <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
              <p className="lead fw-normal mb-0 me-2 small">Sign in with</p>
              <button
                type="button"
                className="btn btn-primary btn-floating mx-1"
                style={{ backgroundColor: "#4E387E" }}>
                <FontAwesomeIcon icon={faFacebookF} />
              </button>

              <button
                type="button"
                className="btn btn-primary btn-floating mx-1"
                style={{ backgroundColor: "#4E387E" }}>
                <FontAwesomeIcon icon={faTwitter} />
              </button>

              <button
                type="button"
                className="btn btn-primary btn-floating mx-1"
                style={{ backgroundColor: "#4E387E" }}>
                <FontAwesomeIcon icon={faGoogle} />
              </button>
            </div>

            <div className="divider d-flex align-items-center my-3">
              <p
                className="text-center fw-bold mx-3 mb-0"
                style={{ color: "white" }}>
                Or
              </p>
            </div>

            {/* Login form */}
            <div className="form-outline mb-2">
              <input
                type="email"
                id="email"
                name="email"
                className="form-control form-control-sm"
                placeholder="Enter a valid email address"
                style={{ backgroundColor: "darkgrey", color: "white" }}
                value={user.email}
                onChange={handleUserChange}
              />
            </div>

            <div className="form-outline mb-2">
              <input
                type="password"
                id="password"
                name="password"
                className="form-control form-control-sm"
                placeholder="Enter password"
                style={{ backgroundColor: "darkgrey", color: "white" }}
                value={user.password}
                onChange={handleUserChange}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="form-check mb-0">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  value=""
                  id="form2Example3"
                />
                <label
                  className="form-check-label"
                  htmlFor="form2Example3"
                  style={{ color: "white" }}>
                  Remember me
                </label>
              </div>
              <a href="#!" className="text-body small">
                Forgot password?
              </a>
            </div>

            <div className="text-center text-sm-start mt-2">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{
                  paddingLeft: "2rem",
                  paddingRight: "2rem",
                  backgroundColor: "#4E387E",
                }}
                onClick={() => loginUserHandler()}>
                Login
              </button>
              <p className="small fw-bold mt-2 mb-0">
                Don't have an account?{" "}
                <a
                  className="link-danger"
                  onClick={() => setLoginOrRegister(true)}>
                  Register
                </a>
              </p>
            </div>
          </form>
        )}
      </div>

      {/* Footer above the image */}
      <Footer />
    </section>
  );
};

export default LoginPage;
