import React, { useState } from "react";
import { Link } from "react-router-dom";

import SideDrawer from "./SideDrawer";
import MainHeader from "./MainHeader";
import NavigationLinks from "./NavigationLinks";
import Backdrop from "../../UIElements/Backdrop";
import "./MainNavigation.css";

const MainNavigation = (props) => {
  const [draverIsOpen, SetDraverIsOpen] = useState(false);
  const openDraverHandler = () => {
    SetDraverIsOpen(true);
  };
  const closeDrawerHandler = () => {
    SetDraverIsOpen(false);
  };
  return (
    <React.Fragment>
      {/* checks if the draver is open */}
      {draverIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={draverIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__draver-nav">
          <NavigationLinks />
        </nav>{" "}
      </SideDrawer>
      
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDraverHandler}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/" style={{ textDecoration: 'none', color: 'white', fontSize: 25 }}>TutorMi</Link>
          
        </h1>
        <nav>
          <NavigationLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
