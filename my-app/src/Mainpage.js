import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import heartIcon from "./obrazky/heart.png";
import "./Mainpage.css";
import LoadingScreen from "./Loading";

function Mainpage() {
    const [images, setImages] = useState([]);
    const [carouselImages, setCarouselImages] = useState([]);
    const [sortingOption, setSortingOption] = useState("newest");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [fetchLiked, setFetchLiked] = useState(false); // New state variable to control fetching liked images
    const [likedImages, setLikedImages] = useState([]); // New state to hold the liked images
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 2000));

                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:5000/images", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                setImages(data);
                setCarouselImages([...data].sort((a, b) => b.likes - a.likes).slice(0, 3));

                if (token) {
                    setIsLoggedIn(true);
                    const usernameResponse = await fetch("http://localhost:5000/getUsername", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const usernameData = await usernameResponse.json();
                    setUsername(usernameData.username);
                }

                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Fetch images based on the sorting option and fetchLiked flag
        if (fetchLiked) {
            fetchLikedImages();
        } else {
            // Fetch images based on other sorting options
            // ...
        }
    }, [fetchLiked]);

    const fetchLikedImages = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:5000/likedImages", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                let data = await response.json();
                // Sort liked images by ID in descending order
                data = data.sort((a, b) => b.id - a.id);
                setLikedImages(data); // Set liked images state
            } else {
                // Handle error response
            }
        } catch (error) {
            console.error("Error fetching liked images: ", error);
        }
    };;

    const handleAddImage = () => {
        if (!isLoggedIn) {
            alert("Please log in to add images.");
        } else {
            navigate("/ImageForm");
        }
    };

    const updateLikeCount = (id, liked, newLikeCount) => {
        // Update like count in images state
        setImages(prevImages =>
            prevImages.map(image =>
                image.id === id ? { ...image, likes: newLikeCount, liked: !liked } : image
            )
        );
    
        // Update like count in carouselImages state
        setCarouselImages(prevImages =>
            prevImages.map(image =>
                image.id === id ? { ...image, likes: newLikeCount, liked: !liked } : image
            )
        );
    
        // Update like count in likedImages state
        setLikedImages(prevImages =>
            prevImages.map(image =>
                image.id === id ? { ...image, likes: newLikeCount, liked: !liked } : image
            )
        );
    };
    
    const incrementLike = async (id, liked) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in to like images.");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:5000/like/${id}`, {
                method: liked ? "DELETE" : "POST", // If already liked, send DELETE request to unlike
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                // Update like count across all arrays
                updateLikeCount(id, liked, data.likes);
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to interact with likes');
            }
        } catch (error) {
            console.error('Error interacting with likes:', error);
            // Handle error
        }
    };

    const handleSorting = (option) => {
        if (option === 'liked') {
            setFetchLiked(true);
        } else {
            setFetchLiked(false);
        }
        setSortingOption(option);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredImages = () => {
        return images.filter(
            (image) =>
                image.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                image.image_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const sortedImages = () => {
        if (fetchLiked) {
            return likedImages;
        } else {
            switch (sortingOption) {
                case "newest":
                    return [...filteredImages()].sort((a, b) => b.id - a.id);
                case "oldest":
                    return [...filteredImages()].sort((a, b) => a.id - b.id);
                case "mostLiked":
                    return [...filteredImages()].sort((a, b) => b.likes - a.likes);
                default:
                    return [...filteredImages()].sort((a, b) => b.likes - a.likes);
            }
        }
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    return (
        <div>
            {loading ? (
                <LoadingScreen />
            ) : (
                <div>
                    <div className="page-name-container">
                        <div className="page-name">ZochovaArt</div>
                        <div className="circle-behind-t"></div>
                    </div>
                    <div className="header">
                        <div className="search-bar-container">
                            <input
                                type="text"
                                className="search-bar"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <div className="search-icon">
                                <FaSearch style={{ fontSize: '24px', transform: 'scaleX(-1)' }} />
                            </div>
                        </div>
                        <div>
                            <button className="add-image-button" onClick={handleAddImage}>
                                Add Image
                            </button>
                            {isLoggedIn ? (
                                <>
                                    <span className="welcome" style={{ marginRight: '10px' }}>
                                        Welcome {username}!
                                    </span>
                                    <Link className="logout" onClick={() => {
                                    localStorage.removeItem("token");
                                    setIsLoggedIn(false);
                                    window.location.reload(); // Add this line to refresh the page
                                }}>
                                    Logout
                                </Link>
                                </>
                            ) : (
                                <div className="register-login-options" style={{ marginRight: '40px' }}>
                                    <Link to="/register" className="register-login-option">
                                        Register
                                    </Link>
                                    <p style={{ opacity: 0.3 }}>︱</p>
                                    <Link to="/login" className="register-login-option">
                                        Login
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <Carousel 
                        id="carouselExample" 
                        style={{ width: '100%', marginBottom: '20px' }}
                        >
                        {carouselImages.map((image) => (
                            <Carousel.Item key={image.id}>
                                <Link to={`/image/${image.id}`} state={{ imageData: image }}>
                                    <img
                                        src={`data:image/${image.contentType};base64,${image.image_data}`}
                                        alt={image.image_name}
                                        className="d-block w-100"
                                        style={{ width: '100%', height: '900px', objectFit: 'cover' }}
                                    />
                                </Link>
                                <Carousel.Caption>
                                    <div style={{ position: 'absolute', top: '-550%', left: '-10%', transform: 'translateY(-50%)' }}>
                                        <p style={{ fontSize: '60px', fontWeight: 'bold', display: 'inline', textShadow: '3px 3px 3px black' }}>{image.author}</p>
                                        <p style={{ fontSize: '35px', display: 'inline', marginLeft: '5px', textShadow: '2px 2px 2px black' }}>{image.image_name}</p>
                                    </div>
                                    <div className="likes-section-Carousel">
                                        <img
                                            src={heartIcon}
                                            alt="Like"
                                            className="like-iconC"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                incrementLike(image.id);
                                            }}
                                        />
                                        <p className="likes"> {image.likes}</p>
                                    </div>
                                </Carousel.Caption>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    <h2 className="sorting-optionsS" style={{ marginLeft: '40px', textAlign: 'left', marginTop: '42px', opacity: 0.6, fontSize: '18px' }}>Sort by:</h2>
                    <div className="sorting-options" style={{ marginBottom: '0px', marginRight: '40px' }}>
                        <span className={`sorting-option ${sortingOption === 'newest' ? 'active' : ''}`} onClick={() => handleSorting("newest")}>Newest</span>
                        <p style={{ opacity: 0.3 }}>︱</p>
                        <span className={`sorting-option ${sortingOption === 'oldest' ? 'active' : ''}`} onClick={() => handleSorting("oldest")}>Oldest</span>
                        <p style={{ opacity: 0.3 }}>︱</p>
                        <span className={`sorting-option ${sortingOption === 'mostLiked' ? 'active' : ''}`} onClick={() => handleSorting("mostLiked")}>Most Liked</span>
                        <p style={{ opacity: 0.3 }}>︱</p>
                        <span className={`sorting-option ${sortingOption === 'liked' ? 'active' : ''}`} onClick={() => handleSorting("liked")}>Liked</span>
                    </div>
                    <div className="grid-container">
                        {sortingOption === "liked" && !isLoggedIn && (
                            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", fontSize: "18px", color: "red" }}>
                            You must be logged in to see liked images.
                        </div>
                        )}
                        {sortedImages().map((image) => (
                            <Link
                                to={`/image/${image.id}`}
                                key={image.id}
                                state={{ imageData: image }}
                            >
                                <div className="grid-item">
                                    <img
                                        src={`data:image/${image.contentType};base64,${image.image_data}`}
                                        alt={image.image_name}
                                    />
                                    <div className="overlay">
                                        <div className="author-section">
                                            <p>by {image.author}</p>
                                        </div>
                                        <div className="Name-selection">
                                            <p>{image.image_name}</p>
                                        </div>
                                    </div>
                                    <div className="likes-section">
                                        <img
                                            src={heartIcon}
                                            alt="Like"
                                            className="like-icon"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                incrementLike(image.id);
                                            }}
                                        />
                                        <p className="likes"> {image.likes}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="last-element"></div>
                    <button className="add-video-button" onClick={() => navigate("/Videos")}>
                        Tutorials
                    </button>
                    <footer className="footer">
                        <Link to="#" onClick={scrollToBottom} className="scroll-to-bottom-link">
                            <span></span>
                        </Link>
                    </footer>
                </div>
            )}
        </div>
    );
}

export default Mainpage;
