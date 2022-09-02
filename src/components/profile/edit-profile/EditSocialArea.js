import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';

const SOCIAL_ICONS = [LinkedInIcon, TwitterIcon, FacebookIcon, InstagramIcon, YouTubeIcon];
const SOCIAL_MEDIA_NAMES = ["linkedin", "twitter", "facebook", "instagram", "youtube"];

export default class EditSocialArea extends Component {

    render() {
        return (
            <>
                <Form.Label>Social Media</Form.Label>
                {this.createSocialMediaInputs()}
            </>
        );
    }

    createSocialMediaInputs() {
        let socialInputs = [];
        for (let i = 0; i < SOCIAL_ICONS.length; i++) {
            let SocialIcon = SOCIAL_ICONS[i];
            socialInputs[i] =
                (<div className="myAddInputRow">
                    <SocialIcon className="editFormSocialIcon" fontSize="large" />
                    <Form.Control type="text" value={this.props.social[SOCIAL_MEDIA_NAMES[i]]}
                        onChange={(e) => this.props.updateSocialAccount(e, SOCIAL_MEDIA_NAMES[i])} />
                </div>)
        }
        return socialInputs;
    }

}