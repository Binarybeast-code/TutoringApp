import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Form from 'react-bootstrap/Form';
import { changeUserImage, changeUserCoverImage, changeProfileAndCoverImage } from "../../../store/user/userActions";
import { uploadProfilePicture, uploadCoverPicture } from "../../../util/apiCallFunctions";
import { isProfileSetUp } from "../../../util/authenticationFunctions";
import { ThemeProvider } from "@material-ui/core/styles";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import customTheme from "../../../styles/materialUiTheme";
import ProfileImageArea from "../ProfileImagesArea";
import "./ChangeUserImagesArea.css";

export default class ChangeUserImagesArea extends Component {

    state = {
        profilePic: this.props.profilePic,
        coverPic: this.props.coverPic,
        uploadedProfilePic: false,
        uploadedCoverPic: false,
        profilePicFile: null,
        coverPicFile: null
    }

    render() {
        console.log(this.state)
        return (
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

                        <div className="saveImagesButtonContainer">
                            <ThemeProvider theme={customTheme}>
                                <Button color="primary" variant="contained" startIcon={<SaveAltIcon />}
                                    onClick={(e) => this.uploadImages(e)}>Save</Button>
                            </ThemeProvider>
                        </div>


                    </div>

                    <div className="imagePreviewContainer">
                        <ProfileImageArea profilePic={this.state.profilePic} coverPic={this.state.coverPic}
                            uploadedProfilePic={this.state.uploadedProfilePic} uploadedCoverPic={this.state.uploadedCoverPic}
                            width={"17vw"} height={"20vh"} />
                    </div>


                </div>
            </div>
        );

    }

    async uploadImages(e) {
        e.preventDefault();
        let profileImage, coverImage = null;

        if (this.state.uploadedProfilePic) // Upload a new profile pic if the user has chosen one
            profileImage = await uploadProfilePicture(this.state.profilePicFile, this.props.type); // Send image to the server

        if (this.state.uploadedCoverPic) // Upload a new cover pic if the user has chosen one
            coverImage = await uploadCoverPicture(this.state.coverPicFile, this.props.type);

        if (profileImage && coverImage)
            changeProfileAndCoverImage(profileImage, coverImage)
        else if (profileImage)
            changeUserImage(profileImage);
        else if (coverImage)
            changeUserCoverImage(coverImage);
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

}