import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "./NavigationBar.css";
import { connect } from "react-redux";
import { isLoggedIn, isProfileSetUp, isTutee } from "../../util/authenticationFunctions";

class NavigationBar extends Component {

  render() {
    return (
      <Navbar className="customNavBar" variant="dark" expand="lg">
        <Navbar.Brand href="/">Tutormi</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {isLoggedIn() && isProfileSetUp() &&
              <>
                <Nav.Link href="/profile">Profile</Nav.Link>
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                {isTutee() && <Nav.Link href="/search">Search</Nav.Link>}
              </>}

            {!isLoggedIn() &&
              <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/signup">Signup</Nav.Link>
              </>}

          </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse className="justify-content-end">

          {isLoggedIn() && isProfileSetUp() &&
            <Navbar.Text>
              Signed in as: <a href="/logout">{this.props.name}</a>
            </Navbar.Text>}

          {isLoggedIn() && !isProfileSetUp() &&
            <Navbar.Text>
              <a href="/logout">Logout</a>
            </Navbar.Text>}

        </Navbar.Collapse>
      </Navbar>
    );
  }

}

function mapStateToProps(state) {
  return {
    name: isLoggedIn() ? state.user.user.user.name : null,
    profilePic: isLoggedIn() && isProfileSetUp() ? state.user.user.profilePic : null,
  };
}

export default connect(mapStateToProps)(NavigationBar);
