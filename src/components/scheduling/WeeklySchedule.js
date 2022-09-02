import React, { Component } from "react";
import "./WeeklySchedule.css";
import moment from "moment";
import { connect } from "react-redux";
import { displayHour12Format } from "../../util/scheduleFunctions.js";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@material-ui/icons/ArrowForwardIosOutlined";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import { isTutee, isViewedTutorSet } from "../../util/authenticationFunctions";
import { saveTutorAvailableHours } from "../../util/apiCallFunctions";
import WeeklyScheduleTable from "./WeeklyScheduleTable";
import customTheme from "../../styles/materialUiTheme";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import AlertSnackbar from "./AlertSnackbar";

function createSliderHours() {
  let sliderHours = [];
  for (let hour = 1; hour <= 23; hour = hour + 3)
    sliderHours[hour] = { value: hour, label: displayHour12Format(hour) }
  return sliderHours;
}

const sliderHours = createSliderHours();

class WeeklySchedule extends Component {

  state = {
    weekStart: moment().startOf("week"),
    chosenDay: moment(),
    isSaving: false,
    showSnackbar: false,
    hourRange: [this.props.minRange, this.props.maxRange]
  };

  render() {
    return (
      <div className="weekScheduleContainer">

        <div className="weekControlSection">

          <div className="weekControlSectionTop">

            <div className="weekNavigator">
              <ArrowBackIosOutlinedIcon className="weekChangeIcons"
                onClick={() => this.setState({ weekStart: this.state.weekStart.clone().subtract(1, "week").startOf("week"), })} />
              <h5>Week starting on {this.state.weekStart.format("MMM DD YYYY")}</h5>
              <ArrowForwardIosOutlinedIcon className="weekChangeIcons"
                onClick={() => this.setState({ weekStart: this.state.weekStart.clone().add(1, "week").startOf("week"), })} />
            </div>

            <ThemeProvider theme={customTheme}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker disableToolbar variant="inline" format="DD/MM/yyyy" value={this.state.chosenDay}
                  onChange={(date) => {
                    if (date !== null && date.isValid())
                      this.setState({ weekStart: date.clone().startOf("week"), chosenDay: date, });
                  }} />
              </MuiPickersUtilsProvider>
            </ThemeProvider>

            {!isTutee() &&
              <ThemeProvider theme={customTheme}>
                <Button color="primary" variant="contained" startIcon={<SaveAltIcon />} disabled={this.state.isSaving}
                  onClick={() => {
                    if (!this.state.isSaving) {
                      this.setState({ ...this.state, isSaving: true });
                      saveTutorAvailableHours({ hours: this.props.userAvailableHours })
                        .then(() => this.setState({ ...this.state, isSaving: false, showSnackbar: true }));
                    }
                  }}>
                  {this.state.isSaving ? "Saving..." : "Save Available Hours"}
                </Button>
              </ThemeProvider>}

          </div>
          <h6>Display range</h6>
          <>
            <ThemeProvider theme={customTheme}>
              <Slider value={this.state.hourRange} marks={sliderHours} min={0} max={23}
                valueLabelFormat={(value) => moment().set("minute", 0).set("hour", value).format("ha")}
                onChange={(e, newValue) => this.setState({ ...this.state, hourRange: newValue })}
                valueLabelDisplay="auto"
              />
            </ThemeProvider>
            <AlertSnackbar open={this.state.showSnackbar} onClose={() => this.setState({ ...this.state, showSnackbar: false })}
              snackbarMsg="Available Hours Saved" />
          </>
        </div>

        <WeeklyScheduleTable weekStart={this.state.weekStart} hourRange={this.state.hourRange} />

      </div >
    );
  }

}

function mapStateToProps(state) {
  return {
    minRange: state.user.user.bookingRange.minimum,
    maxRange: state.user.user.bookingRange.maximum,
    userAvailableHours: state.user.user.availableHours,
  };
}

export default connect(mapStateToProps)(WeeklySchedule);