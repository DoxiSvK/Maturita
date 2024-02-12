// Register.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Register.css"; // Link to the new CSS file
import LoadingScreen from "./Loading";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [topLikedImages, setTopLikedImages] = useState([]);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  const preloadImages = (imageList) => {
   imageList.forEach((image) => {
     const img = new Image();
     img.src = `data:image/${image.contentType};base64,${image.image_data}`;
   });
 };

 useEffect(() => {
   document.body.style.overflow = "hidden";
   return () => {
     document.body.style.overflow = "auto";
   };
 }, []);

 useEffect(() => {
   fetch("http://localhost:5000/images")
     .then((response) => response.json())
     .then((data) => {
        const sortedImages = data.sort((a, b) => b.likes - a.likes);
        const top3Liked = sortedImages.slice(0, 3);
        setTopLikedImages(top3Liked);
        setLoading(true); // Set loading to true again to display loading screen
        setTimeout(() => setLoading(false), 3000); // Set loading to false after 2 seconds
     })
     .catch((error) => {
       console.error("Error fetching images:", error);
       setLoading(false);
     });
 }, []);

 useEffect(() => {
   preloadImages(topLikedImages);
 }, [topLikedImages]);

 useEffect(() => {
   const intervalId = setInterval(() => {
     setTimer((prevTimer) => (prevTimer + 1) % 3);
   }, 5000);

   return () => clearInterval(intervalId);
 }, []);


 const handleRegister = async (e) => {
  e.preventDefault();

  // Check if the password meets the minimum length requirement
  if (password.length < 5) {
    alert("Password must be at least 5 characters long");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Server error");
    }

    const result = await response.json();
    console.log(result);
    navigate("/login");
    // navigate to another route after registration
  } catch (error) {
    console.error("Registration failed:", error);
    alert(error.message || "Registration failed");
  }
};

  return (
   <div>
      {loading ? (
        <LoadingScreen />
      ) : (
    <div>
      <div className="page-name-containerF">
            <div className="page-nameF">ZochovaArt</div>
            <div className="circle-behind-tF"></div>
          </div>
      <div className="register-container">
        <div className="background-carousel-r">
          <Carousel
            interval={10000}
            activeIndex={timer}
            onSelect={() => {}}
            className="carousel-fade"
            indicators={false}
            controls={false}
          >
           {topLikedImages.map((likedImage, index) => (
                <Carousel.Item key={index}>
                  <div
                    className="carousel-image"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
                                          url("data:image/${likedImage.contentType};base64,${likedImage.image_data}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      height: "100vh",
                      width: "100vw",
                    }}
                  />
                </Carousel.Item>
              ))}
          </Carousel>
        </div>
        <div className="register-form">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button className="buttonR" type="submit">
                Register
              </button>
              <button onClick={() => navigate("/")} className="button-backR">
                Home
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
      )}
   </div>
  );
}

export default Register;
