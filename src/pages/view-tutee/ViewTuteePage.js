import React, { Component } from "react";
import PersonalSummary from "../../components/profile/PersonalSummary.js";
import "./ViewTuteePage.css";
import { connect } from "react-redux";
import ViewedTuteeHistory from "../../components/view-tutee/ViewedTuteeHistory";
import OpinionArea from "../../components/profile/OpinionArea";

class ViewTuteePage extends Component {

  render() {
    return (
      <div className="profilePage">
        <div className="viewTuteeContainer">
          <div className="tuteeHistoryContainer">
            <ViewedTuteeHistory />
          </div>
          <div className="tuteeProfileContainer">
            <OpinionArea />
            <PersonalSummary person={this.props.viewedTutee} isUser={false} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    viewedTutee: state.viewedTutee.viewedTutee,
  };
}

export default connect(mapStateToProps)(ViewTuteePage);
