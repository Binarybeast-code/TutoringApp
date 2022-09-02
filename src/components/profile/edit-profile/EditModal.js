import React, { Component } from 'react';
import './EditModal.css';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { connect } from "react-redux";
import { updateUser } from "../../../store/user/userActions";
import ListUpdateArea from './ListUpdateArea';
import DeleteModal from './DeleteModal';
import ChangeEmailSection from './ChangeEmailSection';
import ChangePasswordSection from './ChangePasswordSection';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { ThemeProvider } from "@material-ui/core/styles";
import customTheme from "../../../styles/materialUiTheme";
import EditSocialArea from "./EditSocialArea";
import ChangeUserImagesArea from "./ChangeUserImagesArea";
import { updateUserInformation, deleteUser } from "../../../util/apiCallFunctions";
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import ModalFooter from 'react-bootstrap/ModalFooter';

class EditModal extends Component {

  constructor(props) {
    super(props);
    this.state = { showEditModal: false, user: this.props.user, tabValue: 0, isSaving: false, errors: "", showDeleteModal: false }
    this.updateSocialAccount = this.updateSocialAccount.bind(this);
  }

  render() {
    return (
      <>
        <img className="editIcon" src={require("../../../images/edit-icon.png")} onClick={() => this.handleShow()} ></img>
        <Modal show={this.state.showEditModal} onHide={() => this.setState({ ...this.state, showEditModal: false })} animation={false} centered dialogClassName="editProfileModal">
          <Modal.Header closeButton>
            <Modal.Title>Edit Information</Modal.Title>
          </Modal.Header>

          <div className="editProfileModal">
            <Modal.Body>
              <ThemeProvider theme={customTheme}>
                <AppBar position="static">
                  <Tabs onChange={this.changeTab} value={this.state.tabValue} variant="fullWidth">
                    <Tab label="Main Information" />
                    <Tab label="Secondary Information" />
                    <Tab label="Change Email" />
                    <Tab label="Change Password" />
                  </Tabs>
                </AppBar>
              </ThemeProvider>
              <br />

              {this.state.tabValue === 0 &&
                <Form>
                  <ChangeUserImagesArea profilePic={this.props.user.profilePic} coverPic={this.props.user.coverPic}
                    userType={this.props.user.user.type} />

                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={this.state.user.user.name}
                      onChange={(e) => this.setState({ ...this.state, user: { ...this.state.user, user: { ...this.state.user.user, name: e.target.value } } })} />
                  </Form.Group>



                  {this.props.user.user.type === "tutor" &&
                    <ListUpdateArea list={this.state.user.courses} label="Courses" type="course" setList={this.setCourses} />}

                  <ListUpdateArea list={this.state.user.languages} label="Languages" type="language" setList={this.setLanguages} />
                </Form>
              }

              {this.state.tabValue === 1 &&
                <Form>
                  <Form.Group >
                    <Form.Label>Bio</Form.Label>
                    <Form.Control as="textarea" rows="3" value={this.state.user.bio}
                      onChange={(e) => this.setState({ ...this.state, user: { ...this.state.user, bio: e.target.value } })} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Form.Control type="text" value={this.state.user.location}
                      onChange={(e) => this.setState({ ...this.state, user: { ...this.state.user, location: e.target.value } })} />
                  </Form.Group>

                  <EditSocialArea updateSocialAccount={this.updateSocialAccount} social={this.state.user.social} />
                </Form>}

              {this.state.tabValue === 2 &&
                <ChangeEmailSection email={this.props.user.user.email} toggleSaving={this.toggleSaving}
                  setErrorMessage={this.setErrorMessage} />}

              {this.state.tabValue === 3 &&
                <ChangePasswordSection toggleSaving={this.toggleSaving} setErrorMessage={this.setErrorMessage} />}

              <div className="editProfileLoadingContainer">
                {this.state.isSaving &&
                  <ThemeProvider theme={customTheme}>
                    <LinearProgress />
                  </ThemeProvider >}
                {this.state.errors !== "" && <h6 className="editFormErrorMessage">{this.state.errors}</h6>}
              </div>

            </Modal.Body>
          </div>

          <Modal.Footer>
            <ThemeProvider theme={customTheme} >
              <Button id="editProfileSaveBtn" color="primary" variant="contained" onClick={this.submitUserInfo}>Save Changes</Button>
              <Button color="secondary" variant="contained" onClick={() => this.setState({ ...this.state, showDeleteModal: true, showEditModal: false })}>
                DELETE PROFILE
                </Button>
            </ThemeProvider>
          </Modal.Footer>
        </Modal>

        <DeleteModal show={this.state.showDeleteModal} type={this.props.user.user.type}
          onHide={() => this.setState({ ...this.state, showDeleteModal: false, showEditModal: true })} />
      </>
    );

  }

  toggleSaving = (isSaving) => {
    this.setState({ ...this.state, isSaving: isSaving });
  }

  setErrorMessage = (errorMessage) => {
    this.setState({ ...this.state, errors: errorMessage });
    setTimeout(() => this.setState({ ...this.state, errors: null }), 2000); // Stop showing error after 2 seconds
  }

  submitUserInfo = () => {
    this.toggleSaving(true);
    this.setState({ ...this.state, isSaving: true });
    let editInformation = {
      name: this.state.user.user.name,
      bio: this.state.user.bio,
      languages: this.state.user.languages,
      location: this.state.user.location,
      courses: this.state.user.courses,
      social: this.state.user.social
    };
    updateUserInformation(editInformation, this.state.user.user.type)  // Update the server with the new user information
      .then((updateResponse) => {
        if (updateResponse.errors === undefined) { // No errors occurred when updating
          updateUser(editInformation);
          this.setState({ ...this.state, isSaving: false, showEditModal: false }); // Close the modal 
        } else {
          this.setErrorMessage(updateResponse.errors[0].msg); // Notify users of errors
        }
        this.toggleSaving(false);
      });
  }

  handleShow = () => {
    this.setState({ showEditModal: true, user: this.props.user, tabValue: 0, errors: "" }); // The modal needs to always have the most up to date courses and languages on show
  };

  changeTab = (e, newTabValue) => {
    this.setState({ ...this.state, tabValue: newTabValue });
  }

  setCourses = (courses) => {
    this.setState({ ...this.state, user: { ...this.state.user, courses: courses } });
  }

  setLanguages = (languages) => {
    this.setState({ ...this.state, user: { ...this.state.user, languages: languages } });
  }

  updateSocialAccount(event, socialType) {
    this.setState({
      ...this.state,
      user: {
        ...this.state.user,
        social: { ...this.state.user.social, [socialType]: event.target.value }
      }
    });
  }

}

function mapStateToProps(state) {
  return {
    user: state.user.user,
    token: state.user.token
  };
}

export default connect(mapStateToProps)(EditModal);