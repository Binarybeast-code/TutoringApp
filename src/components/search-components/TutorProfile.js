import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import { getAndSetViewedTutor } from "../../util/apiCallFunctions";
import Typography from "@material-ui/core/Typography";
import { Avatar, IconButton, CardMedia } from "@material-ui/core";
import { Rating } from "@material-ui/lab";

const useStyles = makeStyles(() => ({
  root: {
    minHeight: 350,
  },

  paper: {
    padding: "2px 4px",
    marginTop: 5,
    display: "flex",
    alignItems: "center",
    textAlign: "center",
  },
  color: {
    background: "#2962FF",
    fontWeight: "bold",
    width: 1000,
  },
  typography: {
    flexGrow: 1,
    alignItems: "center",
  },
}));

const trimBio = (description) => {
  const bio =
    description !== null && description !== undefined && description.length > 65
      ? description.substring(0, 65) + "..."
      : description;
  return bio;
};

const TutorProfile = ({
  id,
  avatarSrc,
  title,
  description,
  imgSrc,
  rating,
}) => {
  const classes = useStyles();
  description = trimBio(description);

  return (
    <Card className={classes.root} raised>
      <CardHeader
        avatar={<Avatar src={avatarSrc} />}
        action={
          <IconButton aria-label="settings">
            <Rating name="read-only" value={rating} readOnly />
          </IconButton>
        }
        title={title}
      />
      <CardMedia style={{ height: "150px" }} image={imgSrc} />
      <CardContent>
        <Typography variant="body2" component="p">
          {trimBio(description)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          className={classes.color}
          variant="contained"
          color="primary"
          size="medium"
          style={{
            marginTop:
              description !== null &&
              description !== undefined &&
              description.length <= 45
                ? 20
                : 0,
          }}
          onClick={() => {
            getAndSetViewedTutor(id).then(
              () => (window.location.href = "/viewTutor")
            );
          }}
        >
          Profile
        </Button>
      </CardActions>
    </Card>
  );
};

export default TutorProfile;
