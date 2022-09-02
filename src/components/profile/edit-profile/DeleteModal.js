import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { logout } from "../../../store/user/userActions";
import { deleteUser } from "../../../util/apiCallFunctions";
import Button from '@material-ui/core/Button';
import ModalFooter from 'react-bootstrap/ModalFooter';

export default class DeleteModal extends Component {

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} animation={false} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="deleteConfirm">
                        Are you sure you want to delete your account?
              <Form.Check size="large" inline type="checkbox" label="Confirm" size="lg" id="deleteConfirmCheckBox" />
                    </div>
                </Modal.Body>
                <ModalFooter>
                    <Button color="secondary" variant="contained" onClick={() => {
                        if (document.getElementById("deleteConfirmCheckBox").checked)
                            deleteUser(this.props.type) // Delete then log out
                                .then((response) => {
                                    window.location.href = "/logout";
                                });
                    }}>DELETE</Button>
                </ModalFooter>
            </Modal>
        );

    }

}