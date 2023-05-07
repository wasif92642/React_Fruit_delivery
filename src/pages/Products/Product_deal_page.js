import React, { useEffect, useState } from "react";
import useFirestore from "../../Components/hooks/useFirestore";
import { auth } from "../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Nav from "../../Components/Nav/Nav";
import "./Product_style.css";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { firedb } from "../../firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Popup from "../../Components/PopUp/Popup";

const Products_page = () => {
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);

  const [imgurl, setImageUrls] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [type, settype] = useState("");
  const [quantity, set_quantity] = useState(1);

  const [tasks, setTasks] = useState([]);

  const [Cart, setcart] = useState([]);

  const [user_id, setid] = useState(currentUser.uid);
  const [item_id, setItem_id] = useState(0);

  function Close_popup() {
    document.getElementById("Popup").style.display = "None";
  }

  function increase() {
    set_quantity(quantity + 1);
    console.log(quantity);
  }

  function decrease() {
    if (quantity > 1) {
      set_quantity(quantity - 1);
    }
    console.log(quantity);
  }

  const add_cart = () => {
    setDoc(doc(firedb, `Cart/${user_id}/Items`, item_id + "deal"), {
      Name: name,
      Price: price,
      Type: "Deal",
      Quantity: quantity,
      Img: imgurl,
 
    });

    document.getElementById("Popup").style.display = "block";

    const myTimeout = setTimeout(Close_popup, 2000);
  };

  useEffect(() => {
    const q = query(collection(firedb, "deals"));
    onSnapshot(q, (querySnapshot) => {
      setTasks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  return (
    <div className="wrapper_product">
      <div className="row Nav_row">
        <Nav />
      </div>

      <div className="row Alert_raw" id="Popup">
        <Popup msg="ITEM ADDED" />
      </div>

      <div className="row product_row">
        <div className="col-10">
          {tasks &&
            tasks.map((doc) => {
              return (
                <div
                  className="product_card"
                  onMouseEnter={() => {
                    set_quantity(1);
                  }}
                >
                  <div className="raw img_raw">
                    <img src={doc.data.ProductImg} />
                  </div>

                  <div className="row">
                    <p id="Product_name">{doc.data.ProductName}</p>
                  </div>

                  <div className="row price_secion">
                    <p id="raw_price">{doc.data.productPrice_Deal}Rs</p>
                  </div>


                  {/* <select onClick={(e) => { set_quantity(e.target.value) }} id="Select_q">
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select> */}

                  <i
                    class="fa-solid fa-cart-plus"
                    id="bt1"
                    onMouseEnter={() => {
                      setName(doc.data.ProductName);
                      setImageUrls(doc.data.ProductImg);
                      setItem_id(doc.id);

                      setPrice(doc.data.productPrice_Deal);
                    }}
                    onClick={add_cart}
                  ></i>
                </div>
              );
            })}

          {/* <br/>
<label>{type + name + price + imgurl}</label> */}
        </div>
      </div>
    </div>
  );
};

export default Products_page;
