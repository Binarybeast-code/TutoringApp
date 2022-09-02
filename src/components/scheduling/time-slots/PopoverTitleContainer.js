import React, { Component } from "react";
import Popover from "react-bootstrap/Popover";
import { displayHour12Format } from "../../../util/scheduleFunctions";

export default class TutorOpenTimeSlotPopover extends Component {

    render() {
        return (
            <Popover.Title>
                <div className="popoverTitleContainer">
                    <div>
                        <img className="timeIcon" src={require("../../../images/time-icon.png")}></img>
                        {displayHour12Format(this.props.time.start.hours()) +
                            "-" +
                            displayHour12Format(this.props.time.end.hours())}
                    </div>
                </div>
            </Popover.Title>
        );
    }

}
