import React from "react";

import "./MainHeader.css";

const MainHeader = (props) => {
  return (
    <div id="menu-outer">
      <ul id="horizontal-list"></ul>
      <header className="main-header">{props.children}</header>
    </div>
  );
};

export default MainHeader;
