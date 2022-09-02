import React, { Component } from "react";
import { openAvailabilityHour } from "../../../store/user/userActions";

export default class TutorOpenableTimeSlot extends Component {

  render() {
    return (
      <td
        className="openableSlot"
        onClick={() => openAvailabilityHour(this.props.date)}
        onMouseOver={(e) => {
          if (e.buttons === 1) // If left button was clicked when mouse went over cell (drag event)       
            openAvailabilityHour(this.props.date);
        }}
        onMouseDown={(e) => {
          if (e.buttons === 1) // Only want this behavior for left mouse button down
            openAvailabilityHour(this.props.date);
        }}
      ></td>
    );
  }

}
