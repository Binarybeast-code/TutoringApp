import React, { Component } from "react";
import AddBoxIcon from '@material-ui/icons/AddBox';
import { ThemeProvider } from "@material-ui/core/styles";
import customTheme from "../../../styles/materialUiTheme";
import Chip from '@material-ui/core/Chip';
import Form from 'react-bootstrap/Form';

export default class ListUpdateArea extends Component {

  render() {
    return (
      <>
        <Form.Label>{this.props.label}</Form.Label>
        <div className="myAddInputRow">
          <Form.Control id={`${this.props.type}Input`} type="text" placeholder={`Add a ${this.props.type}`} />
          <AddBoxIcon fontSize="large" className="editFormAddIcon" onClick={() => {
            let updatedList = this.props.list.slice();
            let newValue = document.getElementById(`${this.props.type}Input`).value.trim();

            if (!this.props.list.includes(newValue) && newValue !== "") { // Only add non empty unique values
              updatedList.push(newValue);
              this.props.setList(updatedList);
            }
            document.getElementById(`${this.props.type}Input`).value = ""; // Reset input
          }} />
        </div>

        <div className="removableBoxHolder">
          {this.props.list.map((item) =>
            <ThemeProvider theme={customTheme}>
              <Chip className="editChips" color="primary" label={item} onDelete={() => {
                let updatedList = this.props.list.slice();
                updatedList.splice(updatedList.indexOf(item), 1);
                this.props.setList(updatedList);
              }} />
            </ThemeProvider>)}
        </div>
      </>
    );
  }

}
