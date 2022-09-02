import React, { Component } from "react";
import "./time-slots/timeSlotStyles.css";
import BookedTimeSlot from "./time-slots/BookedTimeSlot";
import OpenTimeSlot from "./time-slots/OpenTimeSlot";
import TutorOpenableTimeSlot from "./time-slots/TutorOpenableTimeSlot";
import moment from "moment";
import { connect } from "react-redux";
import {
    convertSingleHoursToTimeSlots, removeSlotConflict, convertDateStringsToDates,
    combineSingleSlots, displayHour12Format, fallsOnSameDay
} from "../../util/scheduleFunctions.js";
import { isTutee, isViewedTutorSet } from "../../util/authenticationFunctions";
import { updateViewedTutorAvailability } from "../../store/viewed-tutor/viewedTutorActions";
import { updateAvailability, updateAppointments } from "../../store/user/userActions";
import socketIOClient from "socket.io-client";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

class WeeklyScheduleTable extends Component {

    render() {
        return (
            <div className="scheduleScrollContainer">
                <table className="weeklySchedule">
                    <thead>
                        <tr>
                            <th></th>
                            {this.makeDayHeaderCells()}
                        </tr>
                    </thead>
                    <tbody>
                        {this.fillRows()}
                    </tbody>
                </table>
            </div>
        );
    }

    // Listen for availability and appointment changes
    componentDidMount() {
        const socket = socketIOClient("http://localhost:5000");

        if (isTutee() && isViewedTutorSet()) { // Checking for changes in the viewed tutor's availability
            socket.on(`availableHours-${this.props.viewedTutor._id}`, availableHours => {
                updateViewedTutorAvailability(availableHours);
            });

        } else if (!isTutee()) { // Checking for changes in the user's availability (if the user is a tutor)
            socket.on(`availableHours-${this.props.user._id}`, availableHours => {
                updateAvailability(availableHours);
            });
        }

        // Checking for changes in the user's appointments (for tutees and tutors)
        socket.on(`appointments-${this.props.user._id}`, appointments => {
            updateAppointments(appointments)
        });
    }

    makeDayHeaderCells() {
        let headerCells = [];
        for (let day = 0; day < DAYS_OF_WEEK.length; day++)
            headerCells[day] = (
                <th>
                    {`${DAYS_OF_WEEK[day]}`}<br />{this.props.weekStart.clone().add(day, "day").format("DD/MM/YYYY")}
                </th>);
        return headerCells;
    }

    fillRows() {
        let appointments = convertDateStringsToDates(this.props.user.appointments); // User's appointments (can be tutee or tutor)
        let availableHours = []; // The available hours of a tutor (either the user or a viewed tutor)
        if (!isTutee())  // User is a tutor
            availableHours = this.props.user.availableHours;
        else if (isViewedTutorSet()) // If the tutee user is viewing a tutor show the viewed tutors available hours
            availableHours = this.props.viewedTutor.availableHours;

        availableHours = convertSingleHoursToTimeSlots(availableHours);
        removeSlotConflict(availableHours, appointments); // This will remove any tutor open hours that cant be booked because of pre-existing conflicts
        combineSingleSlots(availableHours);

        let table = [];
        for (let hour = this.props.hourRange[0]; hour <= this.props.hourRange[1]; hour++) {
            let row = [];
            for (let day = 0; day < 7; day++) {
                let appointmentSlot = this.findTimeSlot(day, hour, appointments);
                let availableHourSlot = this.findTimeSlot(day, hour, availableHours);

                if (appointmentSlot !== undefined) {
                    if (hour === appointmentSlot.time.start.hours() || hour === this.props.hourRange[0])
                        row[day] = <BookedTimeSlot appointment={appointmentSlot} displayRange={this.props.hourRange} />;

                } else if (availableHourSlot !== undefined) {   // Display user available hours (only if user is tutor)
                    if (hour === availableHourSlot.time.start.hours() || hour === this.props.hourRange[0])
                        row[day] = <OpenTimeSlot timeSlot={availableHourSlot} displayRange={this.props.hourRange} />;

                } else { // No available hours or appointments to display for this hour
                    if (this.props.weekStart.clone().add(day, "day").hours(hour).isBefore(moment()))  // The past is highlighted visually and cannot be interacted with
                        row[day] = <td className="pastSlot"></td>;
                    else  // Tutor's can interact with empty cells and open them, tutees cannot
                        row[day] = isTutee() ? <td></td> : <TutorOpenableTimeSlot date={this.props.weekStart.clone().add(day, "days").add(hour, "hours")} />;
                }
            }

            let displayHour = hour !== this.props.hourRange[0] ? displayHour12Format(hour) : "";
            row.unshift(<td className="time"> {`${displayHour}`} </td>);
            table.push(<tr>{row}</tr>);
        }
        return table;
    }

    // Finds and returns the single point (or undefined) in a collection of slots that meet the condition of day and hour
    findTimeSlot(day, hour, slots) {
        for (let i = 0; i < slots.length; i++) {
            if (slots[i].time.end.hours() === 0) {
                if (slots[i].time.end.isAfter(moment()) && fallsOnSameDay(this.props.weekStart.clone().add(day, "day"), moment(slots[i].time.start))
                    && hour >= slots[i].time.start.hours() && hour < 24) {
                    return slots[i];
                }
            } else {
                if (slots[i].time.end.isAfter(moment()) && fallsOnSameDay(this.props.weekStart.clone().add(day, "day"), moment(slots[i].time.start))
                    && hour >= slots[i].time.start.hours() && hour < slots[i].time.end.hours()) {
                    return slots[i];
                }
            }
        }
    }

}

function mapStateToProps(state) {
    return {
        user: state.user.user,
        viewedTutor: state.viewedTutor.viewedTutor,
    };
}

export default connect(mapStateToProps)(WeeklyScheduleTable);


