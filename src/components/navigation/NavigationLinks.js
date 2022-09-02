import React from "react";
import { NavLink } from "react-router-dom";
import "./NavigationLinks.css";
import { CSSTransition } from "react-transition-group";
const NavigationLinks = (props) => {
  return (
    <CSSTransition
      in={props}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <ul className="navigation-link">
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
      </ul>
    </CSSTransition>
  );
};

export default NavigationLinks;
