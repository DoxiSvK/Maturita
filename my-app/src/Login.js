// Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import LoadingScreen from "./Loading";

function Login() {
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
                setTimeout(() => setLoading(false), 1500); // Set loading to false after 2 seconds
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

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                navigate("/");
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Error logging in: ", error);
            alert("Wrong username or password");
        }
    };
//Spominka na TÚ noc
    const incrementLike = (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in to like images.");
            return;
        }

        fetch(`http://localhost:5000/like/${id}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (response.ok) {
                // Update the like count in the frontend state
                setTopLikedImages(prevImages => {
                    return prevImages.map(image => {
                        if (image.id === id) {
                            return { ...image, likes: image.likes + 1 };
                        } else {
                            return image;
                        }
                    });
                });
                // Handle success
                // Update the UI to reflect the incremented like count
            } else {
                // Handle error responses
                throw new Error('Failed to increment like');
            }
        })
        .catch(error => {
            console.error('Error incrementing like:', error);
            // Handle error
        });
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
                    <div className="login-container">
                        <div className="background-carousell">
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
                        <div className="login-form">
                            <h2>Login</h2>
                            <form onSubmit={handleLogin}>
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
                                    <button className="buttonL" type="submit">Login</button>
                                    <button onClick={() => navigate("/")} className="button-backL">
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

export default Login;
