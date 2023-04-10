import "./Nav_style.css";
import $ from "jquery";

import React, {useState, useContext, useEffect} from "react";
import {auth, db} from "../../firebase";
import {signOut} from "firebase/auth";
import {AuthContext} from "../../Context/AuthContext";
import {useNavigate, Link} from "react-router-dom";
import {firedb} from "../../firebase";

import {
    collection,
    doc,
    onSnapshot,
    query,
    deleteDoc,
    increment,
    updateDoc,
    getDoc
} from "firebase/firestore";
import logo from "../../Images/logo2.png";
import { async } from "@firebase/util";

function Nav() {
    const {currentUser, logOut} = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);

    const [user_id, setid] = useState(currentUser.uid);

    const [item_id, set_Item_id] = useState("");

    const navigate = useNavigate();

    function Navshow() {
        $("#md_nav  ").toggle();
    }

    function Cart_show() {
        $(".cart_row").toggle();
    }

    function Profile_show() {
        $(".Profile_row").toggle();
    }

    const Log_out = () => {
        if (currentUser) {
            logOut();

            navigate("/login");
        }
    };



    const Item_increas = async (e)=>{


        const userRef = doc(firedb, "Cart", currentUser.uid);
        const todosRef = collection(userRef, "Items");
    
        const current_item = doc(todosRef, e);

          try {
            const doc_snap = await getDoc(current_item);
            const count = doc_snap.data().Quantity;
            const price = doc_snap.data().Price;
            

                await updateDoc(doc(todosRef, e), {
                    Quantity : increment(1),
                   
                });
            
            console.log("Increament  updated successfully");
          } catch (error) {
            console.error("Error updating : ", error);
          }


    }


    const Item_decreas = async (e)=>{

        const userRef = doc(firedb, "Cart", currentUser.uid);
        const todosRef = collection(userRef, "Items");
        const current_item = doc(todosRef, e);



          try {

            const doc_snap = await getDoc(current_item);
            const count = doc_snap.data().Quantity;
            const price = doc_snap.data().Price;
            

            if (count > 1) {
                await updateDoc(doc(todosRef, e), {
                    Quantity : increment(-1),
                    Total:count*price,
                });
            
                console.log("Count decremented successfully");
              } else {
                console.log("Count is already zero");
              }


           
          
            console.log("Decreast item updated successfully");
          } catch (error) {
            console.error("Error updating : ", error);
          }


    }



    const Check_out = () => {
        return navigate("/Cart");
    };

    useEffect(() => {
        if (currentUser) {
            const q = query(collection(firedb, `Cart/${user_id}/Items`));
            onSnapshot(q, (querySnapshot) => {
                setTasks(querySnapshot.docs.map((doc) => ({id: doc.id, data: doc.data()})));
            });
        } else {
            navigate("/");
        }
    }, [setTasks]);

    const Delet_Item = async () => {
        const taskDocRef = doc(firedb, `Cart/${user_id}/Items`, item_id);
        try {
            deleteDoc(taskDocRef);
        } catch (err) {
            alert(err);
        }
    };

    if (currentUser) {
        return (
            <>
                <div className="row Nav_container">
                    <div className="row Profile_row">
                        <ul>
                            <Link to="/Profile"
                                style={
                                    {textDecoration: "none"}
                            }>
                                <li>Profile</li>
                            </Link>
                            <li onClick={Log_out}
                                class="fa-solid fa-right-from-bracket">
                                {/* {currentUser ? "Log Out" : "Login"} */} </li>
                        </ul>
                    </div>

                    <div className="row cart_row" id="cart__row">
                        <div className="row cart_header">
                            <h1>CART</h1>
                            <i class="fa-solid fa-xmark" id="cart_close"
                                onClick={
                                    () => {
                                        Cart_show();
                                    }
                                }/>
                        </div>

                    <div className="row cart_item">
                        {
                        tasks && tasks.map((doc) => (
                            <div className="nav_cart_card">
                                 <p id="i_name">
                                    {
                                    doc.data.Name
                                }
                                    {
                                    doc.data.Type
                                }
                                    {" "} </p>
                                       <i class="fa-solid fa-trash-can" id="cancel_item"
                                    onMouseEnter={
                                        (e) => {
                                            set_Item_id(doc.id);
                                        }
                                    }
                                    onClick={Delet_Item}/>
                                <div className="cart_img">
                                    
                                    <img src={
                                        doc.data.Img
                                    }/>
                                </div>

                                <div className="text_sec">
                                    <p>{
                                        doc.data.Price
                                    }Rs</p>

                                    <p>
                                        X<sup>{
                                            doc.data.Quantity
                                        }</sup>
                                    </p>

                                    <p>
                                        = {
                                        doc.data.Quantity*doc.data.Price
                                    }</p>
                                </div>

                               
                             
                                    <button type="button" onClick={()=>{Item_increas(doc.id)}} id="qut_bt">+</button>

                                    <button type="button" onClick={()=>{Item_decreas(doc.id)}} id="qut_bt">-</button>
                       
                            </div>
                        ))
                    } </div>

                    <div className="row Confirm_order">
                        <button type="button"
                            onClick={Check_out}>
                            CHECK OUT
                        </button>
                    </div>
                </div>
                <div className="border_fill"/>
                <div className="col-4 logo_col">
                    <h1 id="Logo_name">VitaBite</h1>

                    <p id="icon"
                        onClick={Navshow}>
                        <i class="fa-solid fa-bars"/>
                    </p>
                    <p id="icon_cart"
                        onClick={
                            () => {
                                Cart_show();
                            }
                    }>
                        <i class="fa-solid fa-cart-shopping"/>
                    </p>
                    <p id="icon_profile"
                        onClick={Profile_show}>
                        {" "}
                        <i class="fa-regular fa-user"></i>
                    </p>
                </div>

                <div className="col-7" id="md_nav">
                    <ul className="ul" id="hh">
                        <Link to="/"
                            style={
                                {textDecoration: "None"}
                        }>
                            {" "}
                            <li>Home</li>
                        </Link>
                        <Link to="/About"
                            style={
                                {textDecoration: "None"}
                        }>
                            {" "}
                            <li>About</li>
                        </Link>
                        <Link to="/Products"
                            style={
                                {textDecoration: "None"}
                        }>
                            {" "}
                            <li>
                                Products
                                <ul id="inner_ul">
                                    <Link to="/Products" id="lin"
                                        onClick={
                                            () => {
                                                localStorage.setItem("Product_type", "Fruits");
                                            }
                                    }>
                                        {" "}
                                        <li>Fruits</li>
                                    </Link>
                                    <Link to="/Products"
                                        onClick={
                                            () => {
                                                localStorage.setItem("Product_type", "Vegitable");
                                            }
                                        }
                                        id="lin">
                                        <li>Vegetables</li>
                                    </Link>
                                    <Link to="/Products_deal"
                                        onClick={
                                            () => {
                                                localStorage.setItem("Product_type", "deals");
                                            }
                                        }
                                        id="lin">
                                        <li>Deals</li>
                                    </Link>
                                </ul>
                            </li>
                        </Link>
                        <Link to=""
                            style={
                                {textDecoration: "None"}
                        }>
                            <li class="fa-solid fa-cart-shopping" id="inner_cart_icon"
                                onClick={
                                    () => {
                                        Cart_show();
                                    }
                            }></li>
                    </Link>

                    <Link to=""
                        style={
                            {textDecoration: "None"}
                    }>
                        {" "}
                        <li class="fa-regular fa-user" id="inner_profile_icon"
                            onClick={Profile_show}></li>
                    </Link>
                </ul>
            </div>
        </div>
    </>
        );
    } else {
        navigate("/");
    }
}

export default Nav;
