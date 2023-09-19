import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faGoogle,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer
      className="w-100 py-3 px-4"
      style={{
        backgroundColor: "rgba(78, 56, 126, 0.9)",
        color: "white",
        zIndex: "2",
        position: "fixed",
        bottom: "0",
        left: "0",
      }}
    >
      {/* Copyright */}
      <div className="text-white">Copyright © 2020. All rights reserved.</div>
      {/* Social icons */}
      <div className="mt-2">
        <a href="#!" className="text-white me-3">
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        <a href="#!" className="text-white me-3">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a href="#!" className="text-white me-3">
          <FontAwesomeIcon icon={faGoogle} />
        </a>
        <a href="#!" className="text-white">
          <FontAwesomeIcon icon={faLinkedinIn} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
