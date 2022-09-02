import React, { Component } from "react";
import { connect } from "react-redux";
import {
  calcTotalAppointmentHours,
  sumAllAppointmentHours,
  calcTotalAppointmentHoursPerMonth,
} from "../../util/scheduleFunctions.js";
import "./ScheduleMetrics.css";
import AppointmentsGraph from "../graph/AppointmentsGraph";

class ScheduleMetrics extends Component {

  render() {
    return (
      <div className="scheduleMetricsContainer">
        <h4>Your Tutoring Stats</h4>
        <p>
          Number of booked appointment hours this week:
          <b>{` ${calcTotalAppointmentHours(this.props.appointments, "week")}`}</b>
        </p>
        <p>
          Number of booked appointment hours this month:
          <b>{` ${calcTotalAppointmentHours(this.props.appointments, "month")}`}</b>
        </p>
        <p>
          Number of booked appointment hours (all time):
          <b>{` ${sumAllAppointmentHours(this.props.appointments)}`}</b>
        </p>
        <AppointmentsGraph appointments={this.props.appointments} />
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    appointments: state.user.user.appointments,
    availableHours: state.user.user.availableHours,
  };
}

export default connect(mapStateToProps)(ScheduleMetrics);
