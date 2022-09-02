import React, { Component } from 'react';
import './CreateProfilePage.css';
import Form from 'react-bootstrap/Form';
import { connect } from "react-redux";
import { logIn } from "../../util/apiCallFunctions";
import ListUpdateArea from '../../components/profile/edit-profile/ListUpdateArea';
import { ThemeProvider } from "@material-ui/core/styles";
import customTheme from "../../styles/materialUiTheme";
import EditSocialArea from "../../components/profile/edit-profile/EditSocialArea";
import { updateUserInformation, uploadProfilePicture, uploadCoverPicture } from "../../util/apiCallFunctions";
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { userWithProfileLoggedIn } from "../../store/user/userActions";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import ProfileImageArea from "../../components/profile/ProfileImagesArea"

class CreateProfilePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profilePic: "default-profile-pic.png",
            coverPic: "default-cover-pic.png",
            uploadedProfilePic: false,
            uploadedCoverPic: false,
            profilePicFile: null,
            coverPicFile: null,
            bio: "",
            courses: [],
            languages: [],
            location: null,
            social: {
                linkedin: null,
                twitter: null,
                facebook: null,
                instagram: null,
                youtube: null
            },
            isSaving: false,
            errors: null,
            activeStep: 1
        }
        this.updateSocialAccount = this.updateSocialAccount.bind(this);
    }

    render() {
        return (
            <>
                <div className="pageContainer">
                    <div className="createProfileContainer">
                        <ThemeProvider theme={customTheme}>
                            <Stepper activeStep={this.state.activeStep}>
                                <Step key={0} >
                                    <StepLabel >Set up basic account</StepLabel>
                                </Step>
                                <Step key={1} >
                                    <StepLabel >Main information</StepLabel>
                                </Step>
                                <Step key={3} >
                                    <StepLabel >Extra information</StepLabel>
                                </Step>
                            </Stepper>
                            <div className="stepperButtons">
                                <div>
                                    <Button disabled={this.state.activeStep === 1} color="primary" variant="contained" onClick={this.stepBack}>
                                        Back</Button>
                                    <Button disabled={this.state.activeStep === 2} color="primary" variant="contained" onClick={this.stepForward}>
                                        Next</Button>
                                </div>
                                <Button disabled={this.state.activeStep !== 2} color="primary" variant="contained" onClick={(e) => this.createProfile(e)}>
                                    Create Profile</Button>
                            </div>
                        </ThemeProvider>

                        <Form>
                            <Form.Text >
                                Fields marked with a star <b>*</b> are mandatory
                            </Form.Text>
                            <ThemeProvider theme={customTheme}>
                                {this.state.isSaving && <LinearProgress />}
                            </ThemeProvider >
                            {this.state.errors !== "" && <h6 className="editFormErrorMessage">{this.state.errors}</h6>}

                            {this.state.activeStep === 1 &&
                                <>
                                    <div className="imageUpdateAreaContainer">
                                        <Form.Label>Profile Images</Form.Label>

                                        <div className="imageUploadContainer">

                                            <div className="imageUploadButtonsContainer">
                                                <div className="imageUploadButtons">
                                                    <h6>Profile Picture</h6>
                                                    <input type="file" id="changeProfilePictureUpload" hidden accept="image/*"
                                                        onChange={e => this.updatePicturePreview(e, true)} />
                                                    <label htmlFor="changeProfilePictureUpload">
                                                        <ThemeProvider theme={customTheme}>
                                                            <Button color="primary" aria-label="upload profile picture" component="span" variant="contained" startIcon={<PhotoCamera />}>
                                                                Upload</Button>
                                                        </ThemeProvider>

                                                    </label>
                                                </div>

                                                <div className="imageUploadButtons">
                                                    <h6>Cover Picture</h6>
                                                    <input type="file" id="changeCoverPictureUpload" hidden accept="image/*"
                                                        onChange={e => this.updatePicturePreview(e, false)} />
                                                    <label htmlFor="changeCoverPictureUpload">
                                                        <ThemeProvider theme={customTheme}>
                                                            <Button color="primary" aria-label="upload profile picture" component="span" variant="contained" startIcon={<PhotoCamera />}>
                                                                Upload</Button>
                                                        </ThemeProvider>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="imagePreviewContainer">
                                                <ProfileImageArea profilePic={this.state.profilePic} coverPic={this.state.coverPic}
                                                    uploadedProfilePic={this.state.uploadedProfilePic} uploadedCoverPic={this.state.uploadedCoverPic}
                                                    width={"17vw"} height={"20vh"} />
                                            </div>
                                        </div>
                                    </div>

                                    <Form.Group >
                                        <Form.Label>Bio</Form.Label>
                                        <Form.Control as="textarea" rows="3" value={this.state.bio} placeholder="Give a brief description about yourself"
                                            onChange={(e) => this.setState({ ...this.state, bio: e.target.value })} />
                                    </Form.Group>

                                    {this.props.type === "tutor" &&
                                        <ListUpdateArea list={this.state.courses} label="Courses*" type="course" setList={this.setCourses} />}

                                    <ListUpdateArea list={this.state.languages} label="Languages*" type="language" setList={this.setLanguages} />
                                </>
                            }

                            {this.state.activeStep === 2 &&
                                <>
                                    <Form.Group>
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control type="text" value={this.state.location} placeholder="Where you live"
                                            onChange={(e) => this.setState({ ...this.state, location: e.target.value })} />
                                    </Form.Group>

                                    <EditSocialArea updateSocialAccount={this.updateSocialAccount} social={this.state.social} />
                                </>}

                        </Form>
                    </div>
                </div >
            </>
        );
    }

    async createProfile(e) {
        e.preventDefault();
        this.setState({ ...this.state, isSaving: true })
        let editInformation = {
            bio: this.state.bio,
            languages: this.state.languages,
            location: this.state.location,
            courses: this.state.courses,
            social: this.state.social
        };
        let updateResponse = await updateUserInformation(editInformation, this.props.type);  // Update the server with the new user information
        if (updateResponse.errors === undefined) { // No errors occurred when updating
            if (this.state.uploadedProfilePic) // Upload a new profile pic if the user has chosen one
                await uploadProfilePicture(this.state.profilePicFile, this.props.type); // Send image to the server

            if (this.state.uploadedCoverPic) // Upload a new cover pic if the user has chosen one
                await uploadCoverPicture(this.state.coverPicFile, this.props.type);

            const user = await logIn(this.props.token, this.props.type);

            userWithProfileLoggedIn(user); // Update global state
            window.location.href = "/profile";
        } else {
            this.setState({ ...this.state, isSaving: false, errors: updateResponse.errors[0].msg }); // Notify users of errors 
            setTimeout(() => this.setState({ ...this.state, isSaving: false, errors: null }), 2000); // Stop showing error after 2 seconds
        }
    }

    updatePicturePreview(e, isProfilePic) {
        const setState = this.setState.bind(this); // Need a reference to the function inside onload
        const reader = new FileReader();
        reader.onload = (onLoadEvent) => {
            setState({
                ...this.state,
                [isProfilePic ? "profilePic" : "coverPic"]: onLoadEvent.target.result, // New picture is set for preview
                [isProfilePic ? "uploadedProfilePic" : "uploadedCoverPic"]: true,
                [isProfilePic ? "profilePicFile" : "coverPicFile"]:
                    document.getElementById(isProfilePic ? "changeProfilePictureUpload" : "changeCoverPictureUpload").files[0]
            });
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    stepForward = () => {
        this.setState({ ...this.state, activeStep: (this.state.activeStep + 1) })
    }

    stepBack = () => {
        this.setState({ ...this.state, activeStep: (this.state.activeStep - 1) })
    }

    setCourses = (courses) => {
        this.setState({ ...this.state, courses: courses });
    }

    setLanguages = (languages) => {
        this.setState({ ...this.state, languages: languages });
    }

    updateSocialAccount(event, socialType) {
        this.setState({
            ...this.state,
            social: { ...this.state.social, [socialType]: event.target.value }
        }
        );
    }

}

function mapStateToProps(state) {
    return {
        type: state.user.user.user.type,
        token: state.user.token
    };
}

export default connect(mapStateToProps)(CreateProfilePage);