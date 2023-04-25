import React, { useState, useContext, useEffect } from "react";
import { getDatabase, ref, set } from "firebase/database";
import $, { data } from "jquery";

import { auth, db, firedb } from "../../firebase";
import { onValue } from "firebase/database";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Nav from "../../Components/Nav/Nav";
import { v4 } from "uuid";
import "./Profile.css";
import { contains } from "jquery";

import {
  collection,
  addDoc,
  Timestamp,
  query,
  orderBy,
  getDocs,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  where,
  setDoc,
} from "firebase/firestore";
import Popup from "../../Components/PopUp/Popup";

function Profile() {
  console.log("jhy");

  let Phone_validate_expression =
    /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;

  const [addres_heading, set_address_heading] = useState("");

  function Account_details_show() {
    document.getElementById("Account_details").style.display = "block";
    document.getElementById("Address_details").style.display = "none";
    document.getElementById("Order_details").style.display = "none";
  }

  function Address_details_show() {
    $("#Address_details").toggle();

    document.getElementById("Account_details").style.display = "none";
    document.getElementById("Order_details").style.display = "none";
  }

  function Order_details_show() {
    $("#Order_details").toggle();

    document.getElementById("Address_details").style.display = "none";
    document.getElementById("Account_details").style.display = "none";
  }

  function Close_popup() {
    document.getElementById("Popup").style.display = "None";
  }

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  let user_data = JSON.parse(localStorage.getItem("user_info"));

  const [Profile_data, set_profile_data] = useState([
    {
      username: user_data.username,
      email: user_data.mail,
      phone: user_data.phone,
      address: user_data.address,
      location: user_data.location,
    },
  ]);

  const [Popmsg, setPopMsg] = useState("");

  const [Order_Status, set_Order_Status] = useState([]);
  const [Section_address, set_address] = useState("");
  const [Read_Address, set_Read_Address] = useState([]);
  const [Address_id, set_Address_id] = useState("");

  const [Collection_Size, set_Collection_size] = useState(0);

  const [values, setValues] = useState({
    phone: "",
    Name: "",
    City: "",
    Location: "",
  });

  function show_Profile() {
    if (document.getElementById("prof").style.display == "none") {
      document.getElementById("upd").style.display = "none";
      document.getElementById("prof").style.display = "block";
    } else {
      document.getElementById("upd").style.display = "block";
      document.getElementById("prof").style.display = "none";
    }
  }

  const handleSubmission2 = () => {
    const docRef = doc(
      firedb,
      `User-Address/${currentUser.uid}/Add_data`,
      v4()
    );

    let data = {
      Address: document.getElementById("Address_Section").value,
      Phone: document.getElementById("Phone_Section").value,
      Location: document.getElementById("location_Section").value,
      City: document.getElementById("City_Section").value,
      Customer_Name: document.getElementById("Name_section").value,
    };

    if (
      (data.Customer_Name === "") | (data.Phone === "") ||
      data.City === "" ||
      data.Location === "" ||
      data.Address === ""
    ) {
      setPopMsg("Fill All Details");

      document.getElementById("Popup").style.display = "block";

      const myTimeout = setTimeout(Close_popup, 2000);
    } else {
      let phone_v = document.getElementById("Phone_Section").value;

      if (phone_v.match(Phone_validate_expression)) {
        setDoc(docRef, data)
          .then((docRef) => {
            setPopMsg("SAVE");

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

  const New_Address = () => {
    document.getElementById("edit_Address_id").style.display = "Block";
    document.getElementById("Edit_save_btn").style.display = "None";
    document.getElementById("New_save_btn").style.display = "inline-block";
    document.getElementById("Name_section").value = "";
    document.getElementById("Address_Section").value = "";
    document.getElementById("City_Section").value = "";
    document.getElementById("location_Section").value = "";
    document.getElementById("Phone_Section").value = "";
  };

  const edit_address = (name, address, city, location, phone) => {
    document.getElementById("edit_Address_id").style.display = "Block";
    document.getElementById("Edit_save_btn").style.display = "inline-block";
    document.getElementById("New_save_btn").style.display = "None";
    document.getElementById("Name_section").value = name;
    document.getElementById("Address_Section").value = address;
    document.getElementById("City_Section").value = city;
    document.getElementById("location_Section").value = location;
    document.getElementById("Phone_Section").value = phone;
  };

  const update_address = (address_id) => {
    let phone_v = document.getElementById("Phone_Section").value;

    if (phone_v.match(Phone_validate_expression)) {
      const update_Ref = doc(
        firedb,
        `User-Address/${currentUser.uid}/Add_data/`,
        address_id
      );
      let data = {
        Address: document.getElementById("Address_Section").value,
        Phone: document.getElementById("Phone_Section").value,
        Location: document.getElementById("location_Section").value,
        City: document.getElementById("City_Section").value,
        Customer_Name: document.getElementById("Name_section").value,
      };

      updateDoc(update_Ref, data, { merge: true })
        .then((update_Ref) => {
          setPopMsg("Update");

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
  };

  const Remove_address = async () => {
    const taskDocRef = doc(
      firedb,
      `User-Address/${currentUser.uid}/Add_data`,
      Address_id
    );
    try {
      setPopMsg("DELETED");
      document.getElementById("Popup").style.display = "block";

      const myTimeout = setTimeout(Close_popup, 2000);

      await deleteDoc(taskDocRef);
    } catch (err) {
      alert(err);
    }
  };

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

  useEffect(() => {
    const q = query(
      collection(firedb, `User-Address/${currentUser.uid}/Add_data`)
    );
    onSnapshot(q, (querySnapshot) => {
      set_Collection_size(querySnapshot.size);
      set_Read_Address(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  const roleOrder = ["Pending", "Recived", "Deliver"];

  const Sort_Order = Order_Status.sort((a, b) => {
    return roleOrder.indexOf(a.Status) - roleOrder.indexOf(b.Status);
  });

  useEffect(() => {
    const or_ref = query(
      collection(firedb, "Order"),
      where("Order_ID", "==", currentUser.uid)
    );
    onSnapshot(or_ref, (querySnapshot) => {
      set_Order_Status(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
          Status: doc.data().Status,
        }))
      );
    });
  }, []);

  return (
    <div className="wrapper" id="dd">
      <div className="row n_row">
        <Nav />
      </div>

      <div className="Alert_raw" id="Popup">
        <Popup msg={Popmsg} id="Popup" />
      </div>

      <div className="row">
        <div className="col-8 profile_nav">
          <ul>
            <li
              onClick={() => {
                Account_details_show();
              }}
            >
              Account Details
            </li>
            <li
              onClick={() => {
                Address_details_show();
              }}
            >
              Addresses
            </li>
            <li
              onClick={() => {
                Order_details_show();
              }}
            >
              Orders
            </li>
          </ul>
        </div>

        {/* ================================================Account details */}

        <div className="col-8" id="Account_details">
          <div className="col-6">
            <span>
              <i class="fa-solid fa-user"></i> {user_data.username}
            </span>
            <span>
              <i class="fa-solid fa-envelope"></i> {auth.currentUser.email}
            </span>

            {/* <span><i class="fa-solid fa-location-dot"></i> {Profile_data.State}</span>

            </div>
            <div className="col-6">
              <span> <i class="fa-solid fa-city"></i> {Profile_data.City}</span>
              <span> <i class="fa-solid fa-phone"></i> {Profile_data.phone}</span> */}
          </div>

          {/* <button type="button" onClick={() => { document.getElementById("edit_details").style.display = "block"; }}>Edit</button> */}
        </div>

        {/* ==========================================================Addressres */}

        <div className="col-8" id="Address_details">
          <div className="col-12 edit_Address_section" id="edit_Address_id">
            {/* 
              <button type="button" id="Cancel_edit" onClick={() => document.getElementById("edit_Address_id").style.display = "None"}> Cancel</button>

              <button type="button" id="Cancel_edit" onClick={() => { handleSubmission2(); document.getElementById("edit_Address_id").style.display = "None" }}> Save</button> */}
            <div className="col-12">
              <h1 style={{ fontSize: "3rem", textAlign: "center" }}>
                {addres_heading}
              </h1>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name*"
              defaultValue={""}
              onChange={(e) => {
                setValues((prev) => ({ ...prev, Name: e.target.value }));
              }}
              id="Name_section"
            />
            <br />
            <input
              type="text"
              onChange={(e) => {
                set_address(e.target.value);
              }}
              placeholder="Enter House no , street*"
              id="Address_Section"
            />
            <br /> <br />
            <select
              type="text"
              name="city"
              onClick={(e) => {
                setValues((prev) => ({ ...prev, City: e.target.value }));
              }}
              id="City_Section"
            >
              <option value="">Select City</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
            <br /> <br />
            <select
              type="text"
              name="city"
              onClick={(e) => {
                setValues((prev) => ({ ...prev, Location: e.target.value }));
              }}
              id="location_Section"
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
                handleSubmission2();
              }}
              id="New_save_btn"
            >
              Save{" "}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                update_address(Address_id);
              }}
              id="Edit_save_btn"
            >
              Update
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

          <div className="col-12 add_addresses">
            
         
            <p className="row_2"
              onClick={() => {
                New_Address();
                set_address_heading("NEW ADDRESS");
              }}
            >
              + ADD NEW ADDRESS
            </p>

            {Read_Address &&
              Read_Address.map((doc) => {
                return (
                  <>
                    <div className="col-6" id="address_box">
                      <ol id="Address_list">
                        <li>
                         <p> Name : {doc.data.Customer_Name} </p>
                    
                          <p>Address : {doc.data.Address}</p>
                          <br />
                          <p>{doc.data.City} : {doc.data.Location}
                          </p>
                          <br/>
                          <p>Phone : {doc.data.Phone}</p>
                        
                          <button
                            type="button"
                            onClick={() => {
                              edit_address(
                                doc.data.Customer_Name,
                                doc.data.Address,
                                doc.data.City,
                                doc.data.Location,
                                doc.data.Phone
                              );
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onMouseEnter={() => {
                              set_Address_id(doc.id);
                            }}
                            onClick={Remove_address}
                          >
                            Remove
                          </button>
                        </li>
                        <br />
                      </ol>
                    </div>
                  </>
                );
              })}
          </div>

        </div>

        {/* ==========================================================Order Details */}

        <div className="col-8" id="Order_details">
          <div className="row">
            <div className="col-12">
              <h1
                style={{
                  fontSize: "3rem",
                  marginLeft: "2rem",
                  textAlign: "center",
                }}
              >
                MY ORDERS
              </h1>

              {Sort_Order &&
                Sort_Order.map((doc) => {
                  sessionStorage.setItem("O_State", doc.data.Status);

                  const date = doc.data.Order_Time
                    ? new Date(doc.data.Order_Time.seconds * 1000)
                    : null;
                  const dateString = date ? date.toDateString() : null;
                  const timeString = date ? date.toLocaleTimeString() : null;

                  return (
                    <>
                      <div className="row order_row">
                        <div className="col-6 order_detail">
                          <p
                            style={{
                              color: "#66B032",
                              fontWeight: "600",
                              fontSize: "2.5rem",
                            }}
                          >
                            Order : {doc.data.Status}
                          </p>
                          <br />
                          <p>{dateString}</p>
                          <p>{timeString}</p>
                          <p style={{ color: "black", fontWeight: "600" }}>
                            Delivered to :
                          </p>
                          <br />
                          <div className="dd">
                            <p>{doc.data.Person}</p>
                            <p>
                              {doc.data.Address} - {doc.data.Location}
                            </p>
                            <p>{doc.data.City}</p>
                            <br />
                            <p>{doc.data.Phone}</p>
                          </div>

                          <p id="Total_grand">TOTAL = {doc.data.Grand_Total}</p>
                        </div>

                        <div className="col-6 item_details">
                          {doc.data.Items &&
                            doc.data.Items.map((e) => {
                              return (
                                <div className="order_item_dev">
                                  <figure>
                                    <img src={e.data.Img} id="item_img" />
                                    <figcaption>{e.data.Name}</figcaption>
                                  </figure>

                                  <div className="description">
                                    <p>{e.data.Price}</p>
                                    <p>
                                      x <sup>{e.data.Quantity}</sup>
                                    </p>
                                    <p> = {e.data.Quantity * e.data.Price}</p>
                                    <p> {e.data.Type}</p>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      {/* <br />
                        <p>Order-ID : {doc.id}  [Status = {doc.data.Status}] </p> */}
                    </>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
