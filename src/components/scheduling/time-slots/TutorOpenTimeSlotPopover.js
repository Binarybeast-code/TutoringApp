import React, { Component } from "react";
import Popover from "react-bootstrap/Popover";
import { store } from "../../../store/configureStore.js";
import { AVAILABILITY_CANCELED } from "../../../store/user/userActions";
import { convertTimeSlotToSingleHours } from "../../../util/scheduleFunctions.js";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { displayHour12Format } from "../../../util/scheduleFunctions";
import PopoverTitleContainer from "./PopoverTitleContainer";

export default class TutorOpenTimeSlotPopover extends Component {

    state = {
        start: this.props.timeSlot.time.start.hours(),
        end: this.props.timeSlot.time.end.hours() === 0 ? 24 : this.props.timeSlot.time.end.hours()
    }

    render() {
        return (
            <Popover {...this.props} id="popover-basic">
                <PopoverTitleContainer time={this.props.timeSlot.time} />
                <Popover.Content>
                    <Select value={this.state.start} onChange={(e) => this.setState({ ...this.state, start: e.target.value })}>
                        {this.makeMenuItems(this.props.timeSlot.time.start.hours(), this.state.end - 1)}
                    </Select>
                    <Select value={this.state.end} onChange={(e) => this.setState({ ...this.state, end: e.target.value })}>
                        {this.makeMenuItems(this.state.start + 1, this.props.timeSlot.time.end.hours() === 0 ? 24 : this.props.timeSlot.time.end.hours())}
                    </Select>
                    <img className="cancelIcon" src={require("../../../images/cancel-icon.png")} onClick={() => this.cancelAvailability()}>
                    </img>
                </Popover.Content>
            </Popover >
        );
    }

    makeMenuItems(start, end) {
        let menuItems = [];
        for (let hour = start; hour <= end; hour++)
            menuItems.push(<MenuItem value={hour}>{displayHour12Format(hour)}</MenuItem>);
        return menuItems;
    }

    cancelAvailability() {
        store.dispatch({
            type: AVAILABILITY_CANCELED,
            payload: convertTimeSlotToSingleHours({
                time:
                {
                    end: this.state.end === 24 ? this.props.timeSlot.time.end : this.props.timeSlot.time.end.set("hours", this.state.end),
                    start: this.props.timeSlot.time.start.set("hours", this.state.start)
                }
            }),
        });
    }

}
