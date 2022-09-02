import React, { Component } from "react";
import PersonalSummary from "../../components/profile/PersonalSummary.js";
import "./ProfilePage.css";
import { connect } from "react-redux";
import { store } from "../../store/configureStore.js";

class ProfilePage extends Component {
  render() {
    return (
      <div className="profilePageContainer">
        <PersonalSummary person={this.props.user} isUser={true} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.user,
    viewedTutor: state.viewedTutor,
  };
}

export default connect(mapStateToProps)(ProfilePage);
