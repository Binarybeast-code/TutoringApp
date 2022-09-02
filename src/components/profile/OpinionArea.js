import React, { Component } from "react";
import Rating from '@material-ui/lab/Rating';
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import customTheme from "../../styles/materialUiTheme";
import FavoriteIcon from '@material-ui/icons/Favorite';
import { connect } from "react-redux";
import {
    addTutorToFavorites, removeTutorFromFavorites,
    addRatingToTutor, removeRating, addToBlockList, removeFromBlockList
} from "../../store/user/userActions";
import { updateTutorRating } from "../../store/viewed-tutor/viewedTutorActions";
import { updateTuteeFavorites, addRating, deleteRating, blockUser, unBlockUser } from "../../util/apiCallFunctions";
import { isTutee } from "../../util/authenticationFunctions";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import BlockIcon from '@material-ui/icons/Block';
import "./OpinionArea.css";

class OpinionArea extends Component {

    constructor(props) {
        super(props);
        this.state = { isSaving: false }
        this.handleBlock = this.handleBlock.bind(this);
        this.handleDeleteRating = this.handleDeleteRating.bind(this);
    }

    render() {
        return (
            <div className="personalRatingContainer summarySmallWidth">
                <ThemeProvider theme={customTheme}>
                    {isTutee() &&
                        <div className="ratingContainer">
                            <label >Your Rating:</label>

                            {this.state.isSaving
                                ? <Rating value={this.getTuteeRating().rate} disabled />
                                : <Rating value={this.getTuteeRating().rate} onChange={(event, newValue) => this.handleRate(newValue)} />}
                            <IconButton aria-label="delete" color="primary" onClick={this.handleDeleteRating}>
                                <HighlightOffIcon />
                            </IconButton>
                        </div>
                    }

                    <div className="opinionButtonsContainer">

                        {isTutee() &&
                            <Button color="primary" variant="contained" startIcon={<FavoriteIcon />}
                                onClick={() => {
                                    if (this.props.user.favorites.some((tutor) => tutor._id === this.props.viewedTutor._id)) {
                                        updateTuteeFavorites(this.props.viewedTutor._id, false);
                                        removeTutorFromFavorites(this.props.viewedTutor._id);
                                    } else {
                                        updateTuteeFavorites(this.props.viewedTutor._id, true);
                                        addTutorToFavorites(this.props.viewedTutor);
                                    }
                                }}>
                                {!this.props.user.favorites.some((tutor) => tutor._id === this.props.viewedTutor._id)
                                    ? "Add to favorites" : "Remove from favorites"}
                            </Button>
                        }

                        <Button color="secondary" variant="contained" startIcon={<BlockIcon />}
                            onClick={() => this.isPersonBlocked() ? this.handleUnBlock() : this.handleBlock()}>
                            {this.isPersonBlocked() ? "Unblock" : "Block"}
                        </Button>
                    </div>
                </ThemeProvider>
            </div>
        );
    }

    isPersonBlocked() {
        if (isTutee()) {
            return this.props.user.blockedTutors.some((tutor) => tutor === this.props.viewedTutor._id);
        } else {
            return this.props.user.blockedTutees.some((tutee) => tutee === this.props.viewedTutee._id);
        }
    }

    handleBlock() {
        let blockedPersonId = this.props.viewedTutee === null ? this.props.viewedTutor._id : this.props.viewedTutee._id;
        blockUser(blockedPersonId)
            .then(response => addToBlockList(blockedPersonId));
    }

    handleUnBlock() {
        let blockedPersonId = this.props.viewedTutee === null ? this.props.viewedTutor._id : this.props.viewedTutee._id;
        unBlockUser(blockedPersonId)
            .then(response => removeFromBlockList(blockedPersonId));
    }

    handleDeleteRating() {
        this.setState({ isSaving: true });
        deleteRating(this.getTuteeRating()._id)
            .then((response) => {
                removeRating(response.rating)
                updateTutorRating(response.average);
                this.setState({ isSaving: false })
            });
    }

    getTuteeRating() {
        let givenRating = this.props.user.ratings.filter((rating) => this.props.viewedTutor._id === rating.tutor.id)[0];
        return givenRating === undefined ? { rate: 0 } : givenRating;
    }

    handleRate(newValue) {
        this.setState({ isSaving: true });
        addRating(this.props.viewedTutor._id, newValue, this.getTuteeRating()._id)
            .then((response) => {
                response.rating.rate = newValue;
                addRatingToTutor(response.rating);
                updateTutorRating(response.average);
                this.setState({ isSaving: false });
            });
    }

}

function mapStateToProps(state) {
    return {
        user: state.user.user,
        viewedTutor: state.viewedTutor.viewedTutor,
        viewedTutee: state.viewedTutee.viewedTutee
    };
}

export default connect(mapStateToProps)(OpinionArea);

