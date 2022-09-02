import React, { Component } from 'react';
import '../create-profile/CreateProfilePage.css';
import { logout } from "../../store/user/userActions";

export default class LogoutPage extends Component {

    render() {
        return (
            <div className="pageContainer">
                <div className="createProfileContainer">
                    <h4>You are logged out. <a href="/login">Log back in</a></h4>
                </div>
            </div>
        );
    }

    componentDidMount() {
        logout();
    }

}
