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
  let product = localStorage.getItem("Product_type");

  const [Popmsg, setPopMsg] = useState("");

  function Close_popup() {
    document.getElementById("Popup").style.display = "None";
  }

  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);

  const [imgurl, setImageUrls] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [type, settype] = useState("");
  const [get_i, set_i] = useState(3);

  const [tasks, setTasks] = useState([]);

  const [Cart, setcart] = useState([]);

  const [user_id, setid] = useState(currentUser.uid);
  const [item_id, setItem_id] = useState(0);
  const [quantity, set_quantity] = useState(1);

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
    if (type == "") {
      setPopMsg("SELECT TYPE");
      document.getElementById("Popup").style.display = "block";
      const myTimeout = setTimeout(Close_popup, 2000);
    }

    // else{
    // setDoc(doc(firedb, `Cart/${user_id}/Items`, item_id), {
    //   Name: name,
    //   Price: price,
    //   Type : type,
    //   Quantity : quantity,
    //   Img:imgurl,
    //   Total:price*quantity
    // });
    else {
      if (type == "Raw") {
        setDoc(doc(firedb, `Cart/${user_id}/Items`, item_id + "Raw"), {
          Name: name,
          Price: price,
          Type: type,
          Quantity: quantity,
          Img: imgurl,
        });
        setPopMsg("ITEM ADDED");

        document.getElementById("Popup").style.display = "block";
        const myTimeout = setTimeout(Close_popup, 2000);
      } else if (type == "chop") {
        setDoc(doc(firedb, `Cart/${user_id}/Items`, item_id + "Chop"), {
          Name: name,
          Price: price,
          Type: type,
          Quantity: quantity,
          Img: imgurl,
        });

        setPopMsg("ITEM ADDED");

        document.getElementById("Popup").style.display = "block";

        const myTimeout = setTimeout(Close_popup, 2000);
      }
    }
  };

  useEffect(() => {
    const q = query(collection(firedb, product));
    onSnapshot(q, (querySnapshot) => {
      setTasks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    if (type == "chop") {
      Object.keys(tasks).forEach((key) => {
        if (tasks[key].data.Product_Type == "Raw") {
          document.getElementById(tasks[key].id).style.display = "None";
        }
      });
    } else {
      Object.keys(tasks).forEach((key) => {
        if (tasks[key].data.Product_Type == "Raw") {
          document.getElementById(tasks[key].id).style.display = "inline-block";
        }
      });
    }
  }, [product, type]);

  return (
    <div className="wrapper_product">
      <div className="row Nav_row">
        <Nav />
      </div>

      <div className="row Alert_raw" id="Popup">
        <Popup msg={Popmsg} id="pp" />
      </div>

      <div className="row select_row">
        <select for="price">
          <option selected="selected" disabled="disabled">
            SELECT TYPE
          </option>
          <option
            id="unch"
            name="ds"
            value="Raw"
            onClick={() => {
              settype("Raw");
              set_i(1);
            }}
          >
            UNCHOP
          </option>
          <option
            id="ch"
            name="ds"
            value="chop"
            onClick={() => {
              settype("chop");
              set_i(0);
            }}
          >
            CHOP
          </option>
        </select>
      </div>

      <div className="row product_row">
        <div className="col-10">
          {tasks &&
            tasks.map((doc) => {
              let a = [doc.data.ProductPrice_Chop, doc.data.ProductPrice_Raw];

              let x = 0;

              return (
                <div
                  className="product_card"
                  onMouseEnter={() => {
                    set_quantity(1);
                  }}
                  id={doc.id}
                >
                  <div className="raw img_raw">
                    <img src={doc.data.ProductImg} />
                  </div>

                  <p id="Product_name">{doc.data.ProductName}</p>

                  <div className="raw radio_Class" id={doc.id}>
                    <p>{a[get_i]}Rs / 250g</p>
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
                      if (type == "chop") {
                        setPrice(doc.data.ProductPrice_Chop);
                      } else if (type == "Raw") {
                        setPrice(doc.data.ProductPrice_Raw);
                      }
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
