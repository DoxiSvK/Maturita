import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ImageForm.css";
import LoadingScreen from "./Loading";

function ImageUploadForm() {
  const [author, setAuthor] = useState("");
  const [imageName, setImageName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [topLikedImages, setTopLikedImages] = useState([]);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add isLoggedIn state
  const navigate = useNavigate();

  const preloadImages = (imageList) => {
    imageList.forEach((image) => {
      const img = new Image();
      img.src = `data:image/${image.contentType};base64,${image.image_data}`;
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set isLoggedIn based on token presence
  }, []);

  useEffect(() => {
    // Block scroll on mount
    document.body.style.overflow = "hidden";

    // Unblock scroll on component unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  
  useEffect(() => {
    // Fetch top liked images from the server
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
        setLoading(false); // Set loading to false on error
      });
  }, []);
  
  useEffect(() => {
    preloadImages(topLikedImages);
  }, [topLikedImages]);

  useEffect(() => {
    // Set interval to transition images every 5 seconds
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => (prevTimer + 1) % 3);
    }, 5000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if the selected file is an image
      if (!selectedFile.type.startsWith("image/")) {
        alert("Please select an image file.");
        e.target.value = null; // Reset the file input
        return;
      }
      setImage(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("author", author);
    formData.append("imageName", imageName);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const result = await response.json();
      console.log(result);
      navigate("/"); // Redirect to the main page after successful upload
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed or No image is not chosen");
    }
  };

  if (!isLoggedIn) {
    navigate("/"); // Redirect to main page if not logged in
    return null; // Render nothing while redirecting
  }

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
          <div className="image-upload-form-container">
            <Carousel
              interval={10000} // Set interval to 10 seconds
              activeIndex={timer}
              onSelect={() => {}}
              fade
              className="carousel-fade"
              indicators={false} // Hide indicators (dots)
              controls={false} // Hide controls (arrows)
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
                      width: "100vw", // Adjust width as needed
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
            <form className="image-upload-form" onSubmit={handleSubmit}>
              <div>
                <label>Author:</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div>
                <label>Image Name:</label>
                <input
                  type="text"
                  value={imageName}
                  onChange={(e) => setImageName(e.target.value)}
                />
              </div>
              <div>
                <label>Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label>Image:</label>
                <div className="file-input-button">
                  <i className="fas-fa-image"></i>
                  Choose Image
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                {image && <img src={URL.createObjectURL(image)} alt="Selected" />}
              </div>
              <div>
                <button type="submit" className="upload-button">
                  Upload Image
                </button>
                <button onClick={() => navigate("/")} className="back-button">
                  Domov
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploadForm;
