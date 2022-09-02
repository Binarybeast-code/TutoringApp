import React, { Component } from "react";
import WeeklySchedule from "../../components/scheduling/WeeklySchedule.js";
import "./DashboardPage.css";
import DashboardSidePanel from "../../components/dashboard/DashboardSidePanel";
import { clearViewedTutor } from "../../store/viewed-tutor/viewedTutorActions";

export default class DashboardPage extends Component {

  render() {
    return (
      <div className="dashboardContainer">
        <div className="weekScheduleContainer">
          <WeeklySchedule />
        </div>
        <div className="sidePanelContainer">
          <DashboardSidePanel />
        </div>
      </div>
    );
  }

  componentDidMount() {
    clearViewedTutor(); // When viewing the tutees dashboard by default no tutor schedule should be shown
  }

}

