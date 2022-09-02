import React, { Component } from "react";
import "./ViewedTuteeHistory.css";
import { connect } from "react-redux";
import {
    calcTotalAppointmentHours,
    sumAllAppointmentHours,
    calcTotalAppointmentHoursPerMonth,
    calcAverageAppointmentLength
} from "../../util/scheduleFunctions.js";
import AppointmentsGraph from "../graph/AppointmentsGraph";


class ViewedTuteeHistory extends Component {

    state = {
        appointmentsWithTutee: this.props.tutor.appointments.filter((appointment) => appointment.tutee.id === this.props.viewedTutee._id)
    };

    render() {
        return (
            <div className="tuteeHistoryArea">
                <h3>Your history with {this.props.viewedTutee.user.name}</h3>
                <br />
                <p>Total hours taught: {sumAllAppointmentHours(this.state.appointmentsWithTutee)}</p>
                <p>Total number of appointments booked: {this.state.appointmentsWithTutee.length}</p>
                <p>Average appointment length: {calcAverageAppointmentLength(this.state.appointmentsWithTutee)} hours</p>
                <p>Courses taught: {this.getCoursesTaught()}</p> {/* Implement later */}

                <AppointmentsGraph appointments={this.state.appointmentsWithTutee} />
            </div>
        );
    }

    getCoursesTaught() {
        let courseNames = new Set();
        this.state.appointmentsWithTutee.forEach((appointment) => courseNames.add(appointment.subject));
        return courseNames;
    }

}

function mapStateToProps(state) {
    return {
        tutor: state.user.user,
        viewedTutee: state.viewedTutee.viewedTutee
    };
}

export default connect(mapStateToProps)(ViewedTuteeHistory);
