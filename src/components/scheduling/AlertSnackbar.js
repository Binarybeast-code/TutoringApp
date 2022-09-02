import React, { Component } from "react";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

export default class AlertSnackbar extends Component {

    render() {
        return (
            <Snackbar open={this.props.open} autoHideDuration={3000} anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={this.props.onClose}>
                <Alert severity="success">
                    {this.props.snackbarMsg}
                </Alert>
            </Snackbar>
        );
    }

}




