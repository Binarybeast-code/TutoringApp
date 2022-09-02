import React, { Component } from "react";
import Popover from "react-bootstrap/Popover";
import PopoverTitleContainer from "./PopoverTitleContainer";
import { cancelAppointment } from "../../../store/user/userActions";
import { deleteAppointment } from "../../../util/apiCallFunctions";
import moment from "moment";

export default class BookedTimeSlotPopover extends Component {

    render() {
        return (
            <Popover {...this.props} id="popover-basic">
                <PopoverTitleContainer time={this.props.appointment.time} />
                <Popover.Content>
                    Tutor: <strong>{this.props.appointment.tutor.name}</strong><br />
                    Tutee: <strong>{this.props.appointment.tutee.name}</strong><br />
                    Subject: <strong>{this.props.appointment.subject}</strong><br />
                    Notes: <strong>{this.props.appointment.note}</strong>

                    {moment().isBefore(moment(this.props.appointment.time.start)) &&
                        <div>
                            Cancel?
                        <img className="cancelIcon" src={require("../../../images/cancel-icon.png")}
                                onClick={() => {
                                    deleteAppointment(this.props.appointment._id); // Delete the appointment on the server
                                    cancelAppointment(this.props.appointment); // Remove the appointment from the store
                                }}></img>
                        </div>}
                </Popover.Content>
            </Popover>
        );
    }

}