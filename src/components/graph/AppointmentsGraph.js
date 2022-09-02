import React, { Component } from "react";
import { calcTotalAppointmentHoursPerMonth } from "../../util/scheduleFunctions.js";
import Chart from "chart.js";
import moment from "moment";
import { Line } from "react-chartjs-2";

export default class AppointmentsGraph extends Component {

    render() {
        return (
            <Line width="400" height="250" data={this.createChartData()} />
        );
    }

    createChartData() {
        let months = [];
        let appointmentHoursPerMonth = [];

        for (let i = 0; i < 6; i++) {
            months[i] = moment().startOf("month").subtract(i, "month").format("MMMM");
            appointmentHoursPerMonth[i] = calcTotalAppointmentHoursPerMonth(this.props.appointments, i);
        }

        let data = {
            labels: months.reverse(),
            datasets: [
                {
                    label: "Appointment Hours",
                    backgroundColor: "#ADBF6C",
                    borderColor: "#c1d579",
                    data: appointmentHoursPerMonth.reverse(),
                    fill: false,
                }
            ],
        };

        return data;
    }
}
