import React, { Component } from "react";
import "./DashboardSidePanel.css";
import { connect } from "react-redux";
import TutorView from "./TutorView.js";
import FavoriteIcon from '@material-ui/icons/Favorite';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { ThemeProvider } from "@material-ui/core/styles";
import customTheme from "../../styles/materialUiTheme";
import TodayIcon from '@material-ui/icons/Today';
import AppointmentView from "./AppointmentView";
import moment from "moment";
import ScheduleMetrics from "./ScheduleMetrics.js";
import { isTutee } from "../../util/authenticationFunctions";
import ShowChartIcon from '@material-ui/icons/ShowChart';
import DoneIcon from '@material-ui/icons/Done';

class DashboardSidePanel extends Component {

  state = { tabValue: 0 };

  render() {
    return (
      <div className="favoriteContainer">
        <ThemeProvider theme={customTheme}>
          <AppBar position="static">
            <Tabs onChange={(e, newTabValue) => this.setState({ ...this.state, tabValue: newTabValue })}
              value={this.state.tabValue} variant="fullWidth">

              {isTutee()
                ? <Tab label="Favorites" icon={<FavoriteIcon />} />
                : <Tab label="Metrics" icon={<ShowChartIcon />} />}
              <Tab label="Upcoming" icon={<TodayIcon />} />
              <Tab label="Previous" icon={<DoneIcon />} />
            </Tabs>
          </AppBar>
        </ThemeProvider>

        <div className="sideContainer">
          <div className="favTutorGridContainer">
            {(this.state.tabValue === 0 && isTutee()) && this.displayTutors()}
          </div>

          {(this.state.tabValue === 0 && !isTutee()) && <ScheduleMetrics />}

          {this.state.tabValue === 1 && this.displayAppointments(false)}

          {this.state.tabValue === 2 && this.displayAppointments(true)}
        </div>

      </div>
    );
  }

  displayAppointments(isBefore) {
    let appointments = this.props.appointments.slice();
    let filteredAppointments = [];
    appointments.sort((apt1, apt2) => moment(apt1.time.start).diff(moment(apt2.time.start)));
    for (let i = 0; i < appointments.length; i++) {
      let timeCondition = isBefore ? moment(appointments[i].time.end).isBefore(moment()) : moment(appointments[i].time.end).isAfter(moment());
      if (timeCondition)
        filteredAppointments.push(<AppointmentView appointment={appointments[i]} />);
    }
    return filteredAppointments.length === 0 ? <p>{`No ${isBefore ? "previous" : "upcoming"} appointments`}</p> : filteredAppointments;
  }

  displayTutors() {
    // Tutee has no favorites
    if (this.props.favoriteTutors.length === 0) {
      return (
        <div className="tutorRowContainer">
          <p>
            You don't have any tutors in your favorites list yet, try <a href="/search">searching</a> for one.
          </p>
        </div>);
    } else { // If the tutee has favorites display them
      let tutors = [];
      for (let tutor of this.props.favoriteTutors)
        tutors.push(<TutorView tutor={tutor} />);

      return tutors;
    }
  }
}

function mapStateToProps(state) {
  return {
    appointments: state.user.user.appointments,
    favoriteTutors: state.user.user.favorites,
  };
}

export default connect(mapStateToProps)(DashboardSidePanel);
