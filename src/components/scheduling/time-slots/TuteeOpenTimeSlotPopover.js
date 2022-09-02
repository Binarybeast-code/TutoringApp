import React, { Component } from "react";
import Popover from "react-bootstrap/Popover";
import { bookAppointment } from "../../../store/user/userActions";
import { updateViewedTutorSchedule } from "../../../store/viewed-tutor/viewedTutorActions";
import Form from "react-bootstrap/Form";
import PopoverTitleContainer from "./PopoverTitleContainer";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { displayHour12Format } from "../../../util/scheduleFunctions";
import { saveAppointment } from "../../../util/apiCallFunctions";
import CircularProgress from '@material-ui/core/CircularProgress';
import { isViewedTutorSet } from "../../../util/authenticationFunctions";
import AlertSnackbar from "../AlertSnackbar";


export default class TuteeOpenTimeSlotPopover extends Component {

  state = {
    start: this.props.timeSlot.time.start.hours(),
    end: this.props.timeSlot.time.end.hours() === 0 ? 24 : this.props.timeSlot.time.end.hours(),
    isSaving: false,
    showSnackbar: false
  }

  render() {
    return (
      <Popover {...this.props} id="popover-basic" >
        <PopoverTitleContainer time={this.props.timeSlot.time} />
        <Popover.Content>
          {this.state.isSaving ?
            <div className="savingAppointmentArea">
              <h6>Saving Appointment...</h6>
              <CircularProgress size={60} color={"inherit"} />
            </div>
            :
            <>
              {`Tutor: ${this.props.viewedTutor.user.name}`} <br />
              <Form.Label>Course</Form.Label>
              <Form.Control size="sm" as="select" id="coursesSelect">
                {this.props.viewedTutor.courses.map((course) => <option value={course}>{course}</option>)}
              </Form.Control>

              <Form.Control size="sm" type="text" placeholder="Notes" id="notesInput" />

              <Select value={this.state.start} onChange={(e) => this.setState({ ...this.state, start: e.target.value })}>
                {this.makeMenuItems(this.props.timeSlot.time.start.hours(), this.state.end - 1)}
              </Select>
              <Select value={this.state.end} onChange={(e) => this.setState({ ...this.state, end: e.target.value })}>
                {this.makeMenuItems(this.state.start + 1, this.props.timeSlot.time.end.hours() === 0 ? 24 : this.props.timeSlot.time.end.hours())}
              </Select>
              <button
                onClick={() => {
                  this.setState({ ...this.state, isSaving: true });
                  let newAppointment = {
                    tutorid: this.props.viewedTutor._id,
                    tuteeid: this.props.tuteeId,
                    end: this.state.end === 24 ? this.props.timeSlot.time.end : this.props.timeSlot.time.end.set("hours", this.state.end),
                    start: this.props.timeSlot.time.start.set("hours", this.state.start),
                    subject: document.getElementById("coursesSelect").value,
                    note: document.getElementById("notesInput").value,
                  }
                  saveAppointment(newAppointment) // Save appointment server side
                    .then((bookedAppointment) => {
                      bookAppointment(bookedAppointment); // Update the user (tutee) state
                      if (isViewedTutorSet())
                        updateViewedTutorSchedule(bookedAppointment); // Update the viewed tutor state if they are currently set
                      this.setState({ ...this.state, isSaving: false, showSnackbar: true });
                    });
                }
                }>Book Appointment </button>
              <AlertSnackbar open={this.state.showSnackbar} onClose={() => this.setState({ ...this.state, showSnackbar: false })}
                snackbarMsg="Appointment Saved" />
            </>
          }
        </Popover.Content>
      </Popover>
    );
  }

  makeMenuItems(start, end) {
    let menuItems = [];
    for (let hour = start; hour <= end; hour++)
      menuItems.push(<MenuItem value={hour}>{displayHour12Format(hour)}</MenuItem>);
    return menuItems;
  }

}
