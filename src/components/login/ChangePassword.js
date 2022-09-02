import React, { Component } from "react";
import { Form, Modal } from "react-bootstrap";

import { resetForgottenPassword } from "../../util/apiCallFunctions";
import CustomButton from "./CustomButton.js";
import { checkURLtokenExpiry } from "../../util/apiCallFunctions.js";
import "./Login.css";
let tokenValidator;
let modalMessage =
  "Ops! something went wrong try reseting your password again";
let token;
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      password: "",
      showModal: false,
      email: "", //if the token nod valid user will enter the email again to get another email
      errors: {
        password: "",
        login: "",
        password2: "",
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async componentDidMount() {
    let url = new URL(window.location.href);
    token = url.searchParams.get("token");
    tokenValidator = await checkURLtokenExpiry(token);
    console.log("Component did mount says: " + tokenValidator);
    tokenValidator === `{"msg":"Token is not valid!","valid":false}`
      ? (this.state.showModal = true): (modalMessage = "Your password was changed, you are ready to log in!")
  }

  handleInputChange(event) {
    event.preventDefault();
    console.log("HandleInputChange says: the token is valid " + tokenValidator);
    if (tokenValidator) {
      const { name, value } = event.target;
      let errors = this.state.errors;

      switch (name) {
        case "password":
          errors.password =
            value.length < 8
              ? "password can't be shotrer then 8 characters"
              : "";
          if (value.length > 30) {
            errors.password = "password can be maximum 30 characters";
          }
          break;
        case "password2":
          errors.password2 =
            this.state.password === this.state.password2
              ? ""
              : "passwords do not match!";
          break;
        default:
          break;
      }

      this.setState({ errors, [name]: value }, () => {});
    }
  }
  // **************************************************HANDLE SUBMIT
  async handleSubmit(event) {
    event.preventDefault();
    console.log("I am in submit");
    console.log(this.state.errors);
    console.log(this.state.password);
    console.log(this.state.password2);
    if (this.state.errors && this.state.password && this.state.password2) {
      console.info("HANDLE SUBMIT SAYS: Valid Form");
      let resetPassword = await resetForgottenPassword(this.state.password,token);
      console.log("function resetForgottenPassword in submit " + resetPassword);
      console.log(typeof resetPassword )
      console.log("this is the reset passwd string: " +resetPassword )
      if (resetPassword===`{"message":"Pasword updated"}`) {
        this.setState({ ...this.state, showModal: true });
        console.log("HANDLE SUBMIT SAYS: reset successful");
      } else {
        document.getElementById("submittion-error").innerHTML = resetPassword;
        console.error("HANDLE SUBMIT SAYS: invalid Form");
      }
    }
  }

  render() {
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
          <Modal.Body id="modal-body">
            {modalMessage}
          </Modal.Body>
        </Modal>
        <form
          className="parentLoginFormBoxContainer"
          onSubmit={this.handleSubmit}
        >
          <div className="loginFormBoxContainer">
            <h3 className="welcomeSign" style={{ textAlign: "center" }}>
              Reset your password
            </h3>
            <div className="form-group">
              <label>Password</label>
              <input
                onBlur={this.handleInputChange}
                onChange={this.handleInputChange}
                name="password"
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter password"
              />
              {errors.password.length > 0 && (
                <Form.Text className="error">{errors.password}</Form.Text>
              )}
            </div>
            <div className="form-group">
              <input
                onBlur={this.handleInputChange}
                onChange={this.handleInputChange}
                name="password2"
                id="password2"
                type="password"
                className="form-control"
                placeholder="repeat your password"
              />
              {errors.password2.length > 0 && (
                <Form.Text className="error">{errors.password2}</Form.Text>
              )}
            </div>
            <Form.Text id="submittion-error" className="error">
              {errors.login}
            </Form.Text>
            <div>
              <CustomButton
                name="login"
                type="submit"
              >
                reset
              </CustomButton>
            </div>
          </div>
        </form>
      </>
    );
  }
}

export default ChangePassword;
