// login.js contains form for the user to login
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Modal } from "react-bootstrap";


import CustomButton from "./CustomButton.js";
import {
  authenticateAndLoginUser,
  changeForgottenPassword,
} from "../../util/apiCallFunctions";
import { isProfileSetUp } from "../../util/authenticationFunctions";

import "./Login.css";

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      userType: "",
      showModal: false,
      forgottenEmail:"", //email that was entered in the modal
      errors: {
        email: "",
        password: "",
        login: "",
        forgottenEmail: "",
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleInputChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case "email":
        this.setState({ ...this.state, email: event.target.value });
        errors.email = !this.state.email ? "email can't be empty!" : "";
        if (this.state.email) {
          errors.email = validEmailRegex.test(value)
            ? ""
            : "email is not valid!";
        }
        if (value.length > 30) {
          errors.email = "email is to long!";
        }
        break;
        case "forgottenEmail":
          this.setState({ ...this.state, forgottenEmail: event.target.value });
          errors.forgottenEmail = !this.state.forgottenEmail ? "email can't be empty!" : "";
          if (this.state.forgottenEmail) {
            errors.forgottenEmail = validEmailRegex.test(value)
              ? ""
              : "email is not valid!";
          }
          if (value.length > 30) {
            errors.forgottenEmail = "email is to long!";
          }
          break;
      case "password":
        this.setState({ ...this.state, password: event.target.value });
        errors.password =
          value.length < 8 ? "password can't be shotrer then 8 characters" : "";
        if (value.length > 30) {
          errors.password = "password can be maximum 30 characters";
        }
        break;
      default:
        break;
    }
  }

  async handleSubmit(event) {
    console.log(
      "Handle Submit says: this is a user type: " + this.state.userType
    );
    event.preventDefault();
    //if the type wasn't set execute forgort email function
    if (this.state.forgottenEmail !== "") {
      let emailSent = "";
      if (this.state.errors && this.state.forgottenEmail) {
        console.log(emailSent)
        emailSent = await changeForgottenPassword(this.state.forgottenEmail);
      }
      //if no error message change modal body
      if (!emailSent) {
      console.log(emailSent)
      document.getElementById("title").innerHTML = "<p>almost done...</p>";
      document.getElementById("modal-body").innerHTML = "<p>Check your email to reset your password</p>";
      } else {
        document.getElementById("submittion-error").innerHTML = emailSent;
        console.error("HANDLE SUBMIT SAYS: invalid Form");
      }
    }else{
      console.error("HANDLE SUBMIT SAYS: invalid Form");
    }
    //if the type is set and no error ocured execute login function
    if (
      this.state.errors &&
      this.state.email &&
      this.state.password
    ) {
      //console.info("HANDLE SUBMIT SAYS: Valid Form");
      let login = await authenticateAndLoginUser(
        this.state.email,
        this.state.password,
        this.state.userType
      );
      //console.log("value of LOGIN returned is: ", login);
      if (!login) {
        if (isProfileSetUp())
          // User who has created their account previously should be sent to profile
          window.location.href = "/profile";
        // redirect tutor to create account page
        else window.location.href = "/createProfile";
      } else {
        document.getElementById("submittion-error").innerHTML = login;
        console.error("HANDLE SUBMIT SAYS: invalid Form");
      }
    }
  }

  render() {
    // console.log("most up to date state is: ", this.state); //to check the most up to date state
    const { errors } = this.state;
    return (
      <>
        <Modal
          centered="true"
          show={this.state.showModal}
          onHide={() => {
            this.setState({ ...this.state, showModal: false });
            window.location.href = "/login";
          }}
        >
                    <Modal.Header closeButton>
            <Modal.Title id ="title">Forgot your password? We got you!</Modal.Title>
          </Modal.Header>      
          <Modal.Body id = "modal-body">
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  onBlur={this.handleInputChange}
                  onChange={this.handleInputChange}
                  name="forgottenEmail"
                  placeholder="Enter your email"
                />
                {errors.forgottenEmail.length > 0 && (<Form.Text className="error">{errors.forgottenEmail}</Form.Text>)}
              </Form.Group>
              <Form.Text id="submittion-error" className="error">
                {errors.login}
              </Form.Text>
              <div style={{ textAlign: "center", alignItems: "right" }}>
                <CustomButton
                  name="login"
                  type="submit"
                  onClick={() => {
                    console.log("I am in the Modal");
                    this.setState({ ...this.state, forgottenEmail: this.state.forgottenEmail });                
                  }}
                >reset password</CustomButton>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        <div className="parentLoginFormBoxContainer">
          <div className="loginFormBoxContainer">
            <h3 className="welcomeSign">Sign In</h3>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  onBlur={this.handleInputChange}
                  onChange={this.handleInputChange}
                  name="email"
                  placeholder="Enter email"
                />
                {errors.email.length > 0 && (
                  <Form.Text className="error">{errors.email}</Form.Text>
                )}
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  onBlur={this.handleInputChange}
                  onChange={this.handleInputChange}
                  name="password"
                  type="password"
                  placeholder="Password"
                />
                {errors.password.length > 0 && (
                  <Form.Text className="error">{errors.password}</Form.Text>
                )}
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check
                  name="rememberMe"
                  type="checkbox"
                  label="Remember me"
                />
              </Form.Group>
              <Form.Text id="submittion-error" className="error">
                {errors.login}
              </Form.Text>
              <CustomButton
                name="login"
                type="submit"
                onClick={() => {
                  console.log("you clicked the button tutor");
                  this.setState({ ...this.state, userType: "tutor" });
                }}
              >Login as a tutor</CustomButton>
              <CustomButton
                type="submit"
                name="login"
                onClick={() => {
                  this.setState({ ...this.state, userType: "tutee" });
                }}
              >Login as a tutee</CustomButton>
            </Form>
             {/* forgot password, click on the link shows a modal */}
            <Form.Text
              style={{ alignSelf: "flex-end" }}
              className="forgot-password"
            >Forgot{" "}<a
                href="/login"
                id="myButton"
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ ...this.state, showModal: true });
                }}
              >password?</a>
            </Form.Text>
            <br />
            {/* Sign up for TutorMi redirection to sign up page */}
            <Form.Text style={{ fontSize: "15px" }}>
              Not a member yet?
            </Form.Text>
            <CustomButton
              name="buttonSignUp"
              onClick={() => {
                   window.location.href = "/signup";
              }}
            > sign up </CustomButton>
          </div>
        </div>
      </>
    );
  }
}

export default Login;
