import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import SendSharpIcon from "@material-ui/icons/SendSharp";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import "../style/navbar.css";

function Navbar() {
  return (
    <div className="app-header">
      <img
        className="logo"
        src="https://www.logo.wine/a/logo/Instagram/Instagram-Wordmark-Black-Logo.wine.svg"
        alt="instagram-wordmark"
      />

      <input className="search-box" type="text" placeholder="search" />

      <div className="icons-box">
        <HomeIcon fontSize="large" />
        <SendSharpIcon fontSize="large" />
        <ExploreOutlinedIcon fontSize="large" />
        <FavoriteBorderIcon fontSize="large" />
      </div>
    </div>
  );
}

export default Navbar;
