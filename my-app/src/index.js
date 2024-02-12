import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Mainpage from "./Mainpage.js";
import ImageForm from "./ImageForm.js";
import ImagePage from "./ImagePage.js";
import Register from "./Register.js";
import Login from "./Login.js";
import Videos from "./Videos.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   <React.StrictMode>
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/ImageForm" element={<ImageForm />}></Route>
            <Route path="/image/:index" element={<ImagePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Videos" element={<Videos />} />
         </Routes>
      </BrowserRouter>
   </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
