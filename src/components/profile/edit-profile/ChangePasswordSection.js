import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import { logout } from "../../../store/user/userActions";
import { ThemeProvider } from "@material-ui/core/styles";
import customTheme from "../../../styles/materialUiTheme";
import { changePassword } from "../../../util/apiCallFunctions";
import Button from '@material-ui/core/Button';

export default class ChangePasswordSection extends Component {

    state = { currentPassword: "", newPassword: "", newPasswordRetyped: "" }

    render() {
        return (
            <>
                <Form.Group>
                    <Form.Label>Type Current Password</Form.Label>
                    <Form.Control type="password" value={this.state.currentPassword}
                        onChange={(e) => this.setState({ ...this.state, currentPassword: e.target.value })} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Type New Password</Form.Label>
                    <Form.Control type="password" value={this.state.newPassword}
                        onChange={(e) => this.setState({ ...this.state, newPassword: e.target.value })} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Retype New Password</Form.Label>
                    <Form.Control type="password" value={this.state.newPasswordRetyped}
                        onChange={(e) => this.setState({ ...this.state, newPasswordRetyped: e.target.value })} />
                </Form.Group>
                <ThemeProvider theme={customTheme} >
                    <Button color="primary" variant="contained"
                        onClick={this.handleChangePassword}>
                        UPDATE PASSWORD
                </Button>
                </ThemeProvider>
            </>
        );
    }

    handleChangePassword = () => {
        if (this.state.newPassword !== this.state.newPasswordRetyped) {
            this.props.setErrorMessage("New passwords don't match exactly");
        } else {
            this.props.toggleSaving(true);
            changePassword(this.state.currentPassword, this.state.newPassword)
                .then((response) => {
                    if (response.errors === undefined) { // No errors occurred when updating
                        this.props.setErrorMessage("Password updated successfully logging out..."); // Not sure what to do
                        setTimeout(() => window.location.href = "/logout", 2000);
                    } else {
                        this.props.setErrorMessage(response.errors[0].msg); // Notify users of errors 
                    }
                    this.props.toggleSaving(false);
                });
        }

    }

}