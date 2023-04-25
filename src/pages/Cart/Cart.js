import React, { useState, useContext, useEffect } from "react";
import useFirestore from "../../Components/hooks/useFirestore";
import { auth, firedb, db } from "../../firebase";
import $ from "jquery";
import { ref, onValue, set } from "firebase/database";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import Nav from "../../Components/Nav/Nav";

import {
  collection,
  doc,
  onSnapshot,
  query,
  deleteDoc,
  getDocs,
  setDoc,
  where,
  serverTimestamp,
  documentId,
} from "firebase/firestore";
import "./Cart.css";
import Popup from "../../Components/PopUp/Popup";

let cart_Checker = "false";




function Cart() {
  const navigate = useNavigate();

  let Phone_validate_expression =
    /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
  let Grand_total = 0;
  let user_data = JSON.parse(localStorage.getItem("user_info"));
  let Order_state = sessionStorage.getItem("O_State");

  const { currentUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [User_Address, set_User_Address] = useState([]);
  const [Order_task, set_Order_task] = useState([]);
  const [user_id, setid] = useState(auth.currentUser.uid);
  const [item_id, set_Item_id] = useState("");

  const [Collection_Size, set_Collection_size] = useState(0);
  const [Item_Collection_Size, set_Item_Collection_size] = useState(0);
  const [Delivery_Charg, set_Delivery_Charg] = useState(0);
  const [Section_address, set_address] = useState("");
  const [Popmsg, setPopMsg] = useState("");

  const [values, setValues] = useState({
    phone: "",
    address: "",
    Name: "",
    City: "",
    Location: "",
  });

  const [location, setLocation] = useState({});

  const take_cordinates = () => {
    console.log(location.longitude, location.latitude);
  };

  function Close_popup() {
    document.getElementById("Popup").style.display = "None";
  }

  function Add_show() {
    $("#Add_li  ").toggle();
  }

  const handleSubmission = () => {
    const docRef = doc(
      firedb,
      `User-Address/${currentUser.uid}/Add_data`,
      v4()
    );

    let data = {
      Address: Section_address,
      Location: values.Location,
      City: values.City,
      Phone: values.phone,
      Customer_Name: values.Name,
    };

    if (
      (values.Name === "") | (values.phone === "") ||
      values.City === "" ||
      values.Location === "" ||
      Section_address === ""
    ) {
      setPopMsg("Fill All Details");

      document.getElementById("Popup").style.display = "block";

      const myTimeout = setTimeout(Close_popup, 2000);
    } else {
      let phone_v = document.getElementById("Phone_Section").value;

      if (phone_v.match(Phone_validate_expression)) {
        setDoc(docRef, data)
          .then((docRef) => {
            setPopMsg("Save");

            document.getElementById("Popup").style.display = "block";

            const myTimeout = setTimeout(Close_popup, 2000);
          })
          .catch((error) => {
            alert(error);
          });
        document.getElementById("edit_Address_id").style.display = "none";
      } else {
        alert("Phone-Number is not valid");
      }
    }
  };


  function generateUid(length = 6) {
    let uid = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      uid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  
    return uid;
  }
  
  
  const Clear_cart = async () => {
    const Cart_ref = collection(firedb, `Cart/${currentUser.uid}/Items`);

    await getDocs(Cart_ref)
      .then((querySnapshot) => {
        // Loop through all the documents and delete them
        querySnapshot.docs.forEach((doc) => {
          deleteDoc(doc.ref);
        });

        console.log("Done Clear Cart");
      })
      .catch((error) => {
        console.log("Error deleting documents: ", error);
      });
  };

  for (let i = 0; i < Order_task.length; i++) {
    if (Order_task.length > 0) {
      if (Order_task[i].Status == "Pending") {
        document.getElementById("Place_Order_bt").style.display = "None";
      }
    }
  }

  const place_order = async () => {
    const Cart_ref = collection(firedb, `Cart/${currentUser.uid}/Items`);

    if (Grand_total == 0) {

      setPopMsg("Cart is Empty");

      document.getElementById("Popup").style.display = "block";

      const myTimeout = setTimeout(Close_popup, 2000);
    } else if (!values.address) {
      setPopMsg("Select Address");

      document.getElementById("Popup").style.display = "block";

      const myTimeout = setTimeout(Close_popup, 2000);
    } else {
      Clear_cart();
      document.getElementById("Place_Order_bt").style.display = "None";
      setPopMsg("Order Place");

      document.getElementById("Popup").style.display = "block";

      const myTimeout = setTimeout(Close_popup, 2000);

      let order_uid = generateUid();

      await setDoc(doc(firedb, `Order/`, order_uid), {
        Person: values.Name,
        Phone: values.phone,
        Address: values.address,
        City: values.City,
        Location: values.Location,
        Items: tasks,
        Grand_Total: Grand_total + Delivery_Charg,
        Order_ID: user_id,
        OB_ID:order_uid,
        Status: "Pending",
        Payment_Status: "Pending",
        Cordinates:location,
        Order_Time: serverTimestamp(),
      })
      
        .then(() => {
          console.log("Order Place");
        })
        .catch((err) => {
          window.alert(err);
        });
    }
  };

  // const [user_data , set_user_data] = useState({

  //   Name:user_info_cart.mail,
  //   Email:"",
  //   Phone:0,
  //   Address : "" ,
  //   Location: ""

  // });

  useEffect(() => {
    const q = query(collection(firedb, `Cart/${user_id}/Items`));
    onSnapshot(q, (querySnapshot) => {
      set_Item_Collection_size(querySnapshot.size);
      setTasks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  useEffect(() => {
    const Address_refrence = query(
      collection(firedb, `User-Address/${user_id}/Add_data`)
    );
    onSnapshot(Address_refrence, (querySnapshot) => {
      set_Collection_size(querySnapshot.size);
      set_User_Address(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  // const starCountRef = ref(db, "users/" + currentUser.uid);

  // useEffect(()=>{

  //   onValue(starCountRef, (snapshot) => {
  //     if (snapshot.exists()) {

  //       var data = snapshot.val();

  //       set_user_data({Name:data.Name , Email:data.email , Phone:data.Phone , Address:data.Address , Location:data.Location});

  //     }
  //   });

  // })

  useEffect(() => {
    if (Grand_total < 1500) {
      if (values.Location == "Unit#10") {
        set_Delivery_Charg(50);
      } else if (values.Location == "Unit#6") {
        set_Delivery_Charg(60);
      } else if (values.Location == "Unit#7") {
        set_Delivery_Charg(60);
      } else if (values.Location == "Unit#9") {
        set_Delivery_Charg(40);
      } else if (values.Location == "Qasimabad") {
        set_Delivery_Charg(90);
      } else if (values.Location == "City") {
        set_Delivery_Charg(80);
      } else if (values.Location == "Saddar") {
        set_Delivery_Charg(75);
      }
    } else {
      set_Delivery_Charg(0);
    }
  }, [values.Location]);

  useEffect(() => {
    const or_ref = query(
      collection(firedb, "Order"),
      where("Order_ID", "==", currentUser.uid)
    );
    onSnapshot(or_ref, (querySnapshot) => {
      set_Order_task(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
          Status: doc.data().Status,
        }))
      );
    });

    navigator.geolocation.getCurrentPosition(function (position) {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, [Order_state]);

  return (
    <div class="wrapper_cart">
      <div class="row">
        <Nav />
      </div>

      <div className="row Alert_raw" id="Popup">
        <Popup msg={Popmsg} />
      </div>

      <div className="row second_row">
        <div className="col-12">
          <div className="col-12 edit_Address_section" id="edit_Address_id">
            <h1 style={{ fontSize: "3rem", textAlign: "center" }}>
              New Address
            </h1>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name*"
              defaultValue={""}
              onChange={(e) => {
                setValues((prev) => ({ ...prev, Name: e.target.value }));
              }}
            />
            <br />
            <input
              type="text"
              onChange={(e) => {
                set_address(e.target.value);
              }}
              placeholder="Enter House no , street*"
            />
            <br /> <br />
            <select
              type="text"
              name="city"
              onClick={(e) => {
                setValues((prev) => ({ ...prev, City: e.target.value }));
              }}
            >
              <option>Select City</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
            <br /> <br />
            <select
              type="text"
              name="city"
              onClick={(e) => {
                setValues((prev) => ({ ...prev, Location: e.target.value }));
              }}
            >
              <option value="">Select Location</option>
              <option value="Unit#7">Unit#7</option>
              <option value="Unit#6">Unit#6</option>
              <option value="Unit#9">Unit#9</option>
              <option value="Unit#10">Unit#10</option>
              <option value="Qasimabad">Qasimabad</option>
              <option value="City">City</option>
              <option value="Saddar">Saddar</option>
            </select>
            <br />
            <input
              type="text"
              className="form-control"
              placeholder="Enter Mobile *"
              defaultValue={""}
              onChange={(e) => {
                setValues((prev) => ({ ...prev, phone: e.target.value }));
              }}
              id="Phone_Section"
            />
            <br />
            <button
              className="btn"
              type="button"
              onClick={() => {
                handleSubmission();
              }}
            >
              Save Profile
            </button>
            <button
              className="btn"
              type="button"
              onClick={() =>
                (document.getElementById("edit_Address_id").style.display =
                  "None")
              }
            >
              {" "}
              Cancel
            </button>
          </div>

          <div className="col-4">
            <h1
              onClick={() => {
                Add_show();
              }}
              style={{ cursor: "pointer" }}
            >
              SELECT SAVE ADDRESS{" "}
            </h1>

            <div className="row" id="Add_li">
              {User_Address &&
                User_Address.map((doc) => {
                  return (
                    <>
                      <div
                        className="col-12"
                        id="Add_map"
                        onClick={() => {
                          take_cordinates();

                          setValues((prev) => ({
                            ...prev,
                            Name: doc.data.Customer_Name,
                          }));
                          setValues((prev) => ({
                            ...prev,
                            address: doc.data.Address,
                          }));
                          setValues((prev) => ({
                            ...prev,
                            City: doc.data.City,
                          }));
                          setValues((prev) => ({
                            ...prev,
                            Location: doc.data.Location,
                          }));
                          setValues((prev) => ({
                            ...prev,
                            phone: doc.data.Phone,
                          }));
                          Add_show();
                        }}
                      >
                        <p>
                          {doc.data.Customer_Name}
                          <br />
                          {doc.data.Address}
                          <br />
                          {doc.data.Location}:{doc.data.City}
                          <br />
                          {doc.data.Phone}
                        </p>
                      </div>
                    </>
                  );
                })}
            </div>

            <div className="row">
              <p
                onClick={() => {
                  document.getElementById("edit_Address_id").style.display =
                    "Block";
                }}
                style={{ textAlign: "center" }}
              >
                + ADD NEW ADDRESS
              </p>
            </div>
          </div>

          <div className="col-6">
            <h1 id="h_h">ITEMS PURCHASED</h1>
            <p id="p_p">ITEM PRICE</p>

            {tasks &&
              tasks.map((doc) => {
                Grand_total += doc.data.Quantity * doc.data.Price;

                return (
                  <>
                    <div
                      className="row"
                      style={{ borderBottom: "1px solid black" }}
                    >
                      <div className="Detail_section">
                        <p>{doc.data.Name}</p>
                        <p>
                          {doc.data.Quantity} X {doc.data.Price}/Rs
                        </p>
                      </div>

                      <div className="Item_Price_Section">
                        <p>{doc.data.Quantity * doc.data.Price}</p>
                      </div>
                    </div>
                  </>
                );
              })}

            <h1 id="h_h">PRICE DETAILS : ({Item_Collection_Size} Items)</h1>
            <br />
            <p id="Delivery_Charg1">Delivery Charges</p>
            <p id="Delivery_Charg">{Delivery_Charg}</p>

            <br />
            <sub>Free Delivery On Order Above 1500Rs</sub>
            <hr />

            <br />
            <br />
            <h1 id="h_h">
              Total Amount <i class="fa-solid fa-arrow-right" id="h_h"></i>{" "}
              {Grand_total + Delivery_Charg}
            </h1>

            <hr />
            <br />
            <p style={{ fontSize: "2rem", fontWeight: "600" }}>DELIVER TO,</p>
            <br />

            <div className="row" id="lower_add">
              <div className="col-6">
                <p>
                  Name : {values.Name} <br />
                  Address: {values.address}-{values.Location}
                  <br />
                </p>
              </div>

              <div className="col-6">
                <p>
                  City:{values.City}
                  <br />
                  Phone:{values.phone}
                </p>
              </div>
            </div>

            <br />
            <input
              type="button"
              id="Place_Order_bt"
              value="PLACE ORDER"
              onClick={() => {
                place_order();
              }}
            />
          </div>
        </div>

        {/* <div className="col-8 user_details">

          <h1 style={{ fontSize: "3rem" }}>Billing details</h1>

          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="full-name" defaultValue={user_data.username} required />
          </div>


          <div class="form-group">
            <label>Phon#</label>
            <input type="text" id="phone" defaultValue={user_data.phone} required />
          </div>
          <div class="form-group">
            <label >Location</label>
            <input type="text" id="Location" defaultValue={user_data.location} required />
          </div>
          <div class="form-group">
            <label >Save Address</label>
            <select id="Address_selection">              {
              User_Address && User_Address.map((doc) => {

                return (
                  <>

                    <option>{doc.data.Address}</option>

                  </>

                )
              })


            }


            </select>

          </div>

          <div class="form-group">
            <label >New Address</label>
            <input type="text" id="address" defaultValue={user_data.Address} required />
          </div>



          <input type="button" value="Place Order" onClick={place_order} />




        </div>

        <div className="col-3 payment_details">


          <h1 id="h_h">YOUR ORDER</h1>
          <br />
          <p id="p_p">Product Total</p>
          <br />
          <hr />
          {tasks &&
            tasks.map((doc) => {

              Grand_total += doc.data.Total;

              return (
                <>
                  <br />
                  <li id="p_p">{doc.data.Name} {doc.data.Total}</li>
                </>

              )
            }
            )
          }
          <br /><br />
          <hr />

          <br /><br />
          <h1 id="h_h" style={{ wordSpacing: "9rem" }}>Total {Grand_total}</h1>

        </div>
 */}
      </div>
    </div>
  );
}

export default Cart;
