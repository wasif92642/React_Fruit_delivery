import React from "react";
import "./About.css";
import Nav from "../../Components/Nav/Nav";
import maleeha from "./img/ml.jpg";
import wasif from "./img/wasif.jpeg";
import kumail from "./img/kumail.jpeg";

import pic1 from "./img/293952.jpg";
import pic2 from "./img/715338.jpg";
import pic3 from "./img/766732.jpg";
import pic4 from "./img/876005.jpg";

import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
function About() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="about">
      <div className="row about_nav">
        <Nav />
      </div>

      <div className="row about">
        <div className="col-5 Left_panel">
          <div class="gallery">
            <img src={pic4} alt="a hot air balloon" />
            <img src={pic2} alt="a sky photo of an old city" />
            <img src={pic3} alt="a small boat" />
            <img src={pic1} alt="a forest" />
          </div>
        </div>
        <div className="col-7 About_page">
          <h1>WHO WE ARE</h1>
          <p>
            We believe that people will lead healthier, better-informed, and
            more creative lives in the future. Here, we'll make you eat
            high-quality fruits and vegetables that can be delivered chopped or
            Unchopped. We're adaptable, quick, and dedicated to helping you
            succeed.
          </p>
        </div>
      </div>

      <div className="col-12 Team_Section">
        <div className="row TS_row1">
        <h1>Team</h1>

  
        </div>
        <div className="TS_row2">
            <div className="col-4 Member_Card">
                <img src={maleeha}/>
                <div className="overlay">
                    <h1>Maleeha Khan</h1>
                    <p>web-Designer</p>
                </div>
            </div>


            <div className="col-4 Member_Card">
            <img src={wasif}/>
            <div className="overlay">
                    <h1>Wasif Kazmi</h1>
                    <p>Fullstack Developer</p>
                </div>
            </div>

            <div className="col-4 Member_Card">
            <img src={kumail}/>
            <div className="overlay">
                    <h1>Kumail Kumar</h1>
                    <p>Web & Graphic Designer</p>
                </div>
            </div>

        </div>
     
      </div>
    </div>
  );
}

export default About;
