import React, { Component } from 'react';
import './CreateProfilePage.css';
import LinearProgress from '@material-ui/core/LinearProgress';
import { store } from "../../store/configureStore";
import { USER_WITHOUT_PROFILE_LOGGED_IN } from "../../store/user/userActions";
import Button from '@material-ui/core/Button';

export default class EmailConfirmationPage extends Component {

    state = { status: 0 };

    render() {
        return (
            <div className="pageContainer">
                <div className="createProfileContainer">
                    {this.state.status === 200 &&
                        <h4>Email Confirmed. <a href="/login">Please Login.</a></h4>}
                    {this.state.status === 401 &&
                        <>
                            <h4>Invalid Token.</h4>
                            <Button>Send another email</Button>
                        </>}
                </div>
            </div>
        );
    }

    componentDidMount() {
        let url = new URL(window.location.href);
        let token = url.searchParams.get("token");

        fetch(`api/users/confirmation/${token}`)
            .then((response) => this.setState({ status: response.status }));
    }

}
