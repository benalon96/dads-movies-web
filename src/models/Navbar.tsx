import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../AuthContext";
import "firebase/firestore"; // Import Firestore
import "firebase/auth"; // Import Firebase Auth

import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth"; // Import signOut
import { Avatar, Button, Menu, MenuItem } from "@mui/material"; // Import Menu and MenuItem
import avatar1 from "../images/avatar-1.jpg";
import avatar2 from "../images/avatar-2.jpg";
import avatar3 from "../images/avatar-3.jpg";
import avatar4 from "../images/avatar-4.jpg";
import avatar5 from "../images/avatar-5.jpg";
import { useNavigate } from "react-router";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.08),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.2),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Navbar = ({ onSearchInputChange }: any) => {
  const { currentUser } = useAuth(); // Get the current user from your Firebase Auth context
  const [userData, setUserData] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    onSearchInputChange(inputValue);
  };

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        try {
          // Initialize Firestore and Auth
          const db = getFirestore();
          const auth = getAuth();

          // Get user document
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            setUserData(userDocSnapshot.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

  const getSelectedAvatar = (userData: any) => {
    // Check if userData is available and contains avatar information
    if (userData && userData.avatar) {
      switch (userData.avatar) {
        case "avatar1":
          return avatar1;
        case "avatar2":
          return avatar2;
        case "avatar3":
          return avatar3;
        case "avatar4":
          return avatar4;
        case "avatar5":
          return avatar5;
        default:
          // If the avatar value doesn't match any expected value, you can return a default avatar or handle it as needed
          return avatar1;
      }
    }
    // If userData is not available or doesn't contain avatar information, return a default avatar or handle it as needed
    return avatar1;
  };

  const selectedAvatar = getSelectedAvatar(userData);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      // Handle any additional logout actions if needed
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: alpha("#0000", 0.85),
        }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 0,
              color: "#1E90FF",
              justifyContent: "center",
              display: { xs: "none", sm: "block" },
            }}>
            D
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={handleInputChange}
            />
          </Search>
          {currentUser && (
            <>
              <Avatar
                aria-controls="avatar-menu"
                aria-haspopup="true"
                onClick={handleClick}
                style={{
                  width: "45px",
                  height: "45px",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  marginRight: "10px",
                  marginLeft: "auto", // Push the Avatar to the right
                }}
                src={selectedAvatar}></Avatar>
              <Menu
                style={{ marginRight: "10px" }}
                id="avatar-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
