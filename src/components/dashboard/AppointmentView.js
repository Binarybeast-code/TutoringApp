import React, { Component } from "react";
import moment from "moment";
import { displayHour12Format, appointmentLengthInHours } from "../../util/scheduleFunctions.js";
import TodayIcon from '@material-ui/icons/Today';
import { getAndSetViewedTutee, getAndSetViewedTutor } from "../../util/apiCallFunctions.js";
import { isTutee } from "../../util/authenticationFunctions.js";

export default class AppointmentView extends Component {

    render() {
        return (
            <div tabIndex="0" className="appointmentView" >
                <h5><TodayIcon /> {`${displayHour12Format(moment(this.props.appointment.time.start).hours())} 
                ${moment(this.props.appointment.time.start).format("DD MMM")} - ${appointmentLengthInHours(this.props.appointment)} hour(s)`}</h5>

                {isTutee()
                    ? <>Tutor: <a href="/viewTutor" onClick={(e) => this.viewTutor(e)}>
                        {this.props.appointment.tutor.name}</a><br /></>

                    : <>Tutee: <a href="/viewTutee" onClick={(e) => this.viewTutee(e)}>
                        {this.props.appointment.tutee.name}</a><br /></>}

                {`Subject:  ${this.props.appointment.subject}`}
                <br />
                {`Notes:  ${this.props.appointment.note}`}
            </div>
        );
    }

    async viewTutor(e) {
        e.preventDefault();
        await getAndSetViewedTutor(this.props.appointment.tutor.id);
        window.location.href = "/viewTutor";
    }

    async viewTutee(e) {
        e.preventDefault();
        await getAndSetViewedTutee(this.props.appointment.tutee.id);
        window.location.href = "/viewTutee";
    }

}
