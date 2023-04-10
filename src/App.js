import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase";

import Home from "./pages/Home/Home.js";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import ForgetPassword from "./Components/Forgetpassword/Forget";
import Splash from "./pages/Splash/Splash";
import Products_page from "./pages/Products/Products_page";
import Products__deal_page from "./pages/Products/Product_deal_page";
import PrivateRoute from "./Components/PrivateRoute";
import Nav from "./Components/Nav/Nav";
import Profile from "./pages/Profile/Profile.js";
import Cart from "./pages/Cart/Cart.js";
import AddProduct from "./Components/Addproduct/Addproduct";
import About from "./pages/About/About.js";
import AuthProvider, { useAuth } from "./Context/AuthContext";
import Popup from "./Components/PopUp/Popup";

import "./App.css";

function App() {
  function CheckLogin({ children }) {
    const { currentUser } = useAuth();

    if (currentUser) {
      return <Navigate to="/" />;
    }

    return children;
  }

  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />{" "}
                </PrivateRoute>
              }
            />
            <Route
              path="/login"
              element={
                <CheckLogin>
                  <Login />
                </CheckLogin>
              }
            />
            <Route path="/Nav" element={<Nav />} />
            <Route path="/Register" element={<Signup />} />
            <Route path="/Products" element={<Products_page />} />
            <Route path="/Products_deal" element={<Products__deal_page />} />
            <Route path="/adp" element={<AddProduct />} />
            <Route path="/About" element={<About />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/Splash" element={<Splash />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />

            <Route path="/Pop" element={<Popup />} />

            {/* <Route path="/Nav" element={<Nav/>} /> */}
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
