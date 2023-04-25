import React, {useState, useContext, useEffect, useCallback} from "react";
import $ from "jquery";
import {auth, db} from "../../firebase";
import {signOut} from "firebase/auth";
import {AuthContext} from "../../Context/AuthContext";
import "./Home.css";
import {useNavigate, Link} from "react-router-dom";
import {ref, onValue} from "firebase/database";
import Nav from "../../Components/Nav/Nav";

import d1 from "./images/dish-1.png";
import d2 from "./images/dish-3.png";
import d3 from "./images/dish-6.png";
import d4 from "./images/dish-2.png";
import d5 from "./images/dish-4.png";
import background from "../../Images/xyz.png";

const Home = () => {
    const {currentUser} = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const starCountRef = ref(db, "users/" + currentUser.uid);

    localStorage.setItem("Product_type", "Fruits");


    const [Profile_data, set_profile_data] = useState({

        username: "",
        mail: "",
     
    
    
      });
    
      let abc = Profile_data;
    
      localStorage.setItem("user_info" , JSON.stringify(abc));

    function p_select(props) {
        navigate("/Products");
    }

    useEffect(() => {
        onValue(starCountRef, (snapshot) => {
            if (snapshot.exists()) {
                var data = snapshot.val();

                set_profile_data({username: data.Name, mail: data.email});
            }
        });
    }, []);
    // const clickLogin = () => {
    // if (currentUser) {
    //     signOut(auth);
    //     navigate("/login");
    // }

    // };

    return (
        <div className="wrapper-home" id="mm">
            <div className="row Home_Nav_row" id="scroll_nav">
                <Nav/>
            </div>

            {/*      
      {currentUser && <p onClick={()=>window.alert(username)}>show order</p>}
 */}

            {/* <div className="buttons">
        <button onClick={clickLogin}>
          {currentUser ? "Log Out" : "Login"}
        </button>
        {!currentUser && <button onClick={clickSignup}>Sign Up</button>}
      </div> */}

            <div className="row h1">
                <div className="col-9 main_section" id="main_section">

                    <h2>OUR SPECIALITY</h2>
                    <h1>A place for </h1>
                    <h1 style={{marginTop:'-3rem'}}>Fruits & Veggies</h1>
                  
                    <br/>
                    <br/>
                    <Link to="/Products"
                        onClick={
                            () => {
                                localStorage.setItem("Product_type", "Fruits");
                            }
                    }>
                        <button type="button">
                            {" "}

                            SHOP NOW

                        </button>
                    </Link>
                  
                </div>



              

                 </div>

          </div>
    );
};

export default Home;
