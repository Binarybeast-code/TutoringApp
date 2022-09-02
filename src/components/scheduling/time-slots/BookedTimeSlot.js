import React, { Component } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { displayHour12Format } from "../../../util/scheduleFunctions";
import BookedTimeSlotPopover from "./BookedTimeSlotPopover";
import moment from "moment";

export default class BookedTimeSlot extends Component {

  render() {
    return (
      <OverlayTrigger trigger="click" placement="auto" overlay={<BookedTimeSlotPopover appointment={this.props.appointment} />}>
        <td
          rowSpan={
            parseInt(this.props.appointment.time.end.hours()) === 0 ? 24 -
              this.lowerBounds() :
              parseInt(this.props.appointment.time.end.hours()) -
              this.lowerBounds()
          }
          className="booked"
        >
          {moment().isAfter(moment(this.props.appointment.time.start))
            ? "Appointment has started"
            : displayHour12Format(this.props.appointment.time.start.hours()) +
            "-" +
            displayHour12Format(this.props.appointment.time.end.hours())}
          <br />
          <i>{this.isPartlyHidden() ? "(Partly Hidden)" : ""}</i>
        </td>
      </OverlayTrigger>
    );
  }

  lowerBounds() {
    return parseInt(this.props.displayRange[0]) < parseInt(this.props.appointment.time.start.hours()) ? parseInt(this.props.appointment.time.start.hours()) : parseInt(this.props.displayRange[0]);
  }

  isPartlyHidden() {
    return this.props.appointment.time.start.hours() < this.props.displayRange[0]
      || this.props.appointment.time.end.hours() > this.props.displayRange[1] + 1;
  }

}


