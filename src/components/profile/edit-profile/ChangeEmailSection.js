import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import { updateUser, logout } from "../../../store/user/userActions";
import { ThemeProvider } from "@material-ui/core/styles";
import customTheme from "../../../styles/materialUiTheme";
import { updateEmail } from "../../../util/apiCallFunctions";
import Button from '@material-ui/core/Button';

export default class ChangeEmailSection extends Component {

    state = { newEmail: "", password: "" }

    render() {
        return (
            <>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" value={this.props.email} disabled />
                </Form.Group>
                <Form.Group>
                    <Form.Label>New Email address</Form.Label>
                    <Form.Control type="email" value={this.state.newEmail}
                        onChange={(e) => this.setState({ ...this.state, newEmail: e.target.value })} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={this.state.password}
                        onChange={(e) => this.setState({ ...this.state, password: e.target.value })} />
                </Form.Group>
                <ThemeProvider theme={customTheme} >
                    <Button color="primary" variant="contained"
                        onClick={this.handleUpdateEmail}>
                        UPDATE EMAIL
                </Button>
                </ThemeProvider>
            </>
        );
    }

    handleUpdateEmail = () => {
        this.props.toggleSaving(true);
        updateEmail(this.state.newEmail, this.state.password)
            .then((response) => {
                if (response.errors === undefined) { // No errors occurred when updating
                    this.props.setErrorMessage(response.message); // Not sure what to do
                } else {
                    this.props.setErrorMessage(response.errors[0].msg); // Notify users of errors 
                }
                this.props.toggleSaving(false);
            });
    }

}