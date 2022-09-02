import React from "react";
import TutorProfile from "../../components/search-components/TutorProfile";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

const SearchContent = ({ tutorList = [] }) => {
  let key = 10;
  return (
    <Grid container spacing={4}>
      {tutorList.tutors.map((tutor) => (
        <Grid key={++key} item xs={12} md={4}>
          <TutorProfile
            key={tutor.id}
            id={tutor._id}
            title={tutor.user.name}
            avatarSrc={require(`../../images/uploads/${tutor.profilePic}`)}
            imgSrc={require(`../../images/uploads/${tutor.coverPic}`)}
            description={tutor.bio}
            rating={tutor.rating}
            courses={tutor.courses}
          />
        </Grid>
      ))}
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  tutorList: state.tutorSearchList,
});
export default connect(mapStateToProps)(SearchContent);
