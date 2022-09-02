import React, { Component } from "react";
import Carousel from 'react-bootstrap/Carousel'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import "./HomePage.css";

export default class HomePage extends Component {
    render() {
        return (
            <div className="homeDiv">
                <Carousel nextIcon={<NavigateNextIcon style={{ fontSize: 60 }} className="carouselPrevIcon" />}
                    prevIcon={<NavigateBeforeIcon style={{ fontSize: 60 }} className="carouselPrevIcon" />} >
                    <Carousel.Item >
                        <img className="homeImage" src={require("../../images/screenshots/scheduling.JPG")} alt="First slide" />
                        <Carousel.Caption>
                            <div className="carouselCaption">
                                <h3>Book appointments and customize your availability</h3>
                                <p>Effortlessly update your weekly schedule to create the most convenient schedule for you.</p>
                            </div>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img className="homeImage" src={require("../../images/screenshots/search.JPG")} alt="Third slide" />
                        <Carousel.Caption>
                            <div className="carouselCaption">
                                <h3>Highly customizable tutor search</h3>
                                <p>Get the exact tutor that meets your requirements with our easy to use search page.</p>
                            </div>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img className="homeImage" src={require("../../images/screenshots/metrics.JPG")} alt="Third slide" />
                        <Carousel.Caption>
                            <div className="carouselCaption">
                                <h3>Get useful tutor statistics</h3>
                                <p>As a tutor you can review the numbers that describe your time with Tutormi.</p>
                            </div>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        );
    }
}


