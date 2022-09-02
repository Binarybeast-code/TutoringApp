import React, { Component } from "react";
import "./PersonalSummary.css";
import { SocialIcon } from "react-social-icons";
import EditModal from "./edit-profile/EditModal";
import Rating from '@material-ui/lab/Rating';
import { isViewedTutorSet } from "../../util/authenticationFunctions";
import ProfileImagesArea from "./ProfileImagesArea";

export default class PersonalSummary extends Component {

  render() {

    const width = this.props.isUser ? "summaryBigWidth" : "summarySmallWidth";
    const height = this.props.isUser ? "summaryBigHeight" : "summarySmallHeight";
    return (
      <div className="summarySection">

        <ProfileImagesArea profilePic={this.props.person.profilePic}
          coverPic={this.props.person.coverPic}
          width={"25vw"} height={"30vh"} />

        <div className={`textContainer ${width}`}>
          <dv className="nameContainer">
            <h3>{this.props.person.user.name}</h3>
            {!this.props.isUser && isViewedTutorSet() && <Rating value={this.props.person.rating} readOnly />}
          </dv>
          <h6>{this.props.person.user.email}</h6>
          <p>{this.props.person.bio}</p>
          <p>
            {this.props.person.courses !== undefined // Change condition later
              ? "Course(s): " +
              this.props.person.courses.map((course) => ` ${course} `)
              : null}
            <br />
            Language(s):
            {typeof this.props.person.languages !== "undefined"
              ? this.props.person.languages.map((language) => ` ${language} `)
              : null}
            <br />
            Location: {this.props.person.location}
          </p>
        </div>
        <div className={`socialArea ${width}`}>{this.createSocialArea()}</div>

        {this.props.isUser && <div className="editContainer">
          <EditModal className="editIcon" />
        </div>}

      </div>
    );
  }

  createSocialArea() {
    if (this.props.person.social === null || this.props.person.social === undefined)
      return;
    let socialAccounts = Object.values(this.props.person.social); // Change color later
    socialAccounts = socialAccounts.filter((socialAccount) => socialAccount !== null);
    // Had to add 'https://' to the start of the links given in the backend examples. Will probably remove later
    return socialAccounts.map((socialAccount) => (
      <SocialIcon
        bgColor="#a385e0"
        url={`https://${socialAccount}`}
        target="_blank"
      />
    ));
  }
}
