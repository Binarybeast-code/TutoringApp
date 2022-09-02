import React, { Component } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { displayHour12Format } from "../../../util/scheduleFunctions";
import TutorOpenTimeSlotPopover from "./TutorOpenTimeSlotPopover";
import TuteeOpenTimeSlotPopover from "./TuteeOpenTimeSlotPopover";
import { connect } from "react-redux";

class OpenTimeSlot extends Component {

  render() {
    return (
      <OverlayTrigger trigger="click" placement="auto" id="idk"
        overlay={this.props.type === "tutor" ? <TutorOpenTimeSlotPopover timeSlot={this.props.timeSlot} />
          : <TuteeOpenTimeSlotPopover timeSlot={this.props.timeSlot} viewedTutor={this.props.viewedTutor}
            tuteeId={this.props.tuteeId} />} >
        <td className="open"
          rowSpan={
            parseInt(this.props.timeSlot.time.end.hours()) === 0 ? 24 -
              this.lowerBounds() :
              parseInt(this.props.timeSlot.time.end.hours()) -
              this.lowerBounds()
          }>
          {displayHour12Format(this.props.timeSlot.time.start.hours()) +
            "-" +
            displayHour12Format(this.props.timeSlot.time.end.hours())}
          <br />
          <i>{this.isPartlyHidden() ? "(Partly Hidden)" : ""}</i>
        </td>
      </OverlayTrigger>
    );
  }

  lowerBounds() {
    return parseInt(this.props.displayRange[0]) < parseInt(this.props.timeSlot.time.start.hours()) ? parseInt(this.props.timeSlot.time.start.hours()) : parseInt(this.props.displayRange[0]);
  }

  isPartlyHidden() {
    return this.props.timeSlot.time.start.hours() < this.props.displayRange[0]
      || this.props.timeSlot.time.end.hours() > this.props.displayRange[1] + 1;
  }

}

function mapStateToProps(state) {
  return {
    type: state.user.user.user.type,
    tuteeId: state.user.user._id,
    viewedTutor: state.viewedTutor.viewedTutor
  };
}

export default connect(mapStateToProps)(OpenTimeSlot);
