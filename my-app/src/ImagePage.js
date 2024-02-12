import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import heartIcon from "./obrazky/heart.png";
import "./ImagePage.css";

function ImagePage() {
  const location = useLocation();
  const { imageData } = location.state;
  const [likes, setLikes] = useState(imageData.likes);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [liked, setLiked] = useState(imageData.liked === "true" ? true : false); // Initialize liked state based on image data
  const imageRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
        alert("Please log in to like this image.");
        return;
    }

    const token = localStorage.getItem("token");
    const imageId = imageData.id;

    try {
        const response = await fetch(`http://localhost:5000/like/${imageId}`, {
            method: liked ? "DELETE" : "POST", // If already liked, send DELETE request to unlike
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            // Update the state based on the response from the backend
            setLikes(data.likes); // Update the likes state with the new count
            setLiked(data.liked);
        } else {
            const data = await response.json();
            alert(data.message || "Failed to interact with likes");
        }
    } catch (error) {
        console.error("Error interacting with likes:", error);
        // Handle error
    }
};


  const handleDownload = () => {
    const fileExtension =
      imageData.contentType === "image/jpeg" ? "jpg" : "png";

    const link = document.createElement("a");
    link.href = `data:${imageData.contentType};base64,${imageData.image_data}`;
    link.download = `${imageData.image_name}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const backgroundStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("data:image/${imageData.contentType};base64,${imageData.image_data}") 
    center/cover no-repeat`,
  };

  const descriptionWithBreaks = imageData.description.split(/\s+/).join('\n');

  return (
    <div className="image-page" style={backgroundStyle}>
      <div className="page-name-containerI">
        <div className="page-nameI">ZochovaArt</div>
        <div className="circle-behind-tI"></div>
      </div>
      <div className="image-container">
        <img
          ref={imageRef}
          src={`data:image/${imageData.contentType};base64,${imageData.image_data}`}
          alt={imageData.image_name}
          className="image"
          style={{ maxHeight: "900px", width: "auto" }}
        />
      </div>
      <div className="info-container">
        <div className="info-section">
          <p className="label">Author:</p>
          <h2 className="info">{imageData.author}</h2>
        </div>
        <div className="info-section">
          <p className="label">Image Name:</p>
          <h2 className="info">{imageData.image_name}</h2>
        </div>
        <div className="info-section">
          <p className="label">Description:</p>
          <div className="description-container">
            <h2 className="info">{descriptionWithBreaks}</h2>
            <div className="bottom-indicator"></div>
          </div>
        </div>
        <div className="likes-section-page">
          <img
            src={heartIcon}
            alt="Like"
            className={`like-icon ${!isLoggedIn ? 'disabled' : ''} ${liked ? 'liked' : ''}`}
            onClick={handleLikeClick}
          />
          <p className="likes"> {likes}</p>
        </div>
        {!isLoggedIn && (
          <p className="login-prompt">Log in to like this image</p>
        )}
        <button onClick={handleDownload} className="download-button">
          Download Image
        </button>
        <button onClick={() => window.history.back()} className="back-button">
          Back to Main Menu
        </button>
      </div>
    </div>
  );
}

export default ImagePage;