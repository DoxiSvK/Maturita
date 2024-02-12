const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const upload = multer({ dest: "uploads/" });
const db = new sqlite3.Database("database.sqlite");

const secretKey = "yourSecretKey"; // Replace 'yourSecretKey' with your actual secret key

app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Database setup
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author TEXT,
            image_name TEXT,
            image_data BLOB,
            description TEXT,
            likes INTEGER DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS user_likes (
            user_id INTEGER,
            image_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(image_id) REFERENCES images(id),
            PRIMARY KEY(user_id, image_id)
        )
    `);
});

// Route to get username
app.get("/getUsername", authenticateToken, (req, res) => {
    res.status(200).json({ username: req.user.username });
});

// Endpoint to fetch liked images for the logged-in user
app.get("/likedImages", authenticateToken, (req, res) => {
    const userId = req.user.id;

    // Fetch liked images from the database based on the user's ID
    db.all("SELECT images.*, user_likes.user_id FROM images INNER JOIN user_likes ON images.id = user_likes.image_id WHERE user_likes.user_id = ?", [userId], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        
        // Convert image data to Base64
        const imagesWithBase64 = rows.map((row) => {
            let imageBase64 = "";
            if (row.image_data) {
                imageBase64 = Buffer.from(row.image_data).toString("base64");
            }
            return {
                ...row,
                image_data: imageBase64,
            };
        });

        res.status(200).json(imagesWithBase64);
    });
});


// Endpoint to handle image uploads
app.post("/upload", upload.single("image"), (req, res) => {
    let { author, imageName, description } = req.body;

    // Set default values if author or imageName is not provided
    if (!author) {
        author = "anonymous";
    }

    if (!imageName) {
        imageName = "No Name";
    }

    if (!description) {
        description = "No Description";
    }

    // Check if an image is included in the request
    if (!req.file) {
        return res.status(400).send("No image is chosen");
    }

    const image = {
        data: fs.readFileSync(
            path.join(__dirname + "/uploads/" + req.file.filename)
        ),
        contentType: req.file.mimetype,
    };

    // Save the image to the database or perform other actions as needed
    db.run(
        "INSERT INTO images (author, image_name, image_data, description) VALUES (?, ?, ?, ?)",
        [author, imageName, image.data, description],
        function (err) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.status(200).send({
                    message: "Image uploaded successfully",
                    id: this.lastID,
                });
            }
        }
    );
});
// Endpoint to handle image liking/unliking
app.post("/like/:id", authenticateToken, (req, res) => {
    const id = req.params.id;
    const userId = req.user.id; // Assuming user id is included in the token payload

    // Check if the user has already liked the image
    db.get("SELECT * FROM user_likes WHERE user_id = ? AND image_id = ?", [userId, id], (err, row) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        if (row) {
            // If the user has already liked the image, remove the like
            db.run(
                "DELETE FROM user_likes WHERE user_id = ? AND image_id = ?",
                [userId, id],
                function (err) {
                    if (err) {
                        res.status(500).send(err.message);
                        return;
                    }
                    // Decrement the like count for the image
                    db.run(
                        "UPDATE images SET likes = likes - 1 WHERE id = ?",
                        [id],
                        function (err) {
                            if (err) {
                                res.status(500).send(err.message);
                                return;
                            }
                            // Fetch the updated like count
                            db.get("SELECT likes FROM images WHERE id = ?", [id], (err, row) => {
                                if (err) {
                                    res.status(500).send(err.message);
                                    return;
                                }
                                res.status(200).json({ likes: row.likes, liked: false }); // Send the updated like count
                            });
                        }
                    );
                }
            );
        } else {
            // If the user hasn't liked the image yet, increment the like count and record the like
            db.run(
                "UPDATE images SET likes = likes + 1 WHERE id = ?",
                [id],
                function (err) {
                    if (err) {
                        res.status(500).send(err.message);
                        return;
                    }
                    // Record the like in the user_likes table
                    db.run("INSERT INTO user_likes (user_id, image_id) VALUES (?, ?)", [userId, id], function (err) {
                        if (err) {
                            res.status(500).send(err.message);
                            return;
                        }
                        // Fetch the updated like count
                        db.get("SELECT likes FROM images WHERE id = ?", [id], (err, row) => {
                            if (err) {
                                res.status(500).send(err.message);
                                return;
                            }
                            res.status(200).json({ likes: row.likes, liked: true }); // Send the updated like count
                        });
                    });
                }
            );
        }
    });
});


// NEW: Endpoint to handle unliking an image
app.delete("/like/:id", authenticateToken, (req, res) => {
    const id = req.params.id;
    const userId = req.user.id; 

    // Delete the like record from the user_likes table
    db.run(
        "DELETE FROM user_likes WHERE user_id = ? AND image_id = ?",
        [userId, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message }); // Send JSON error response
                return;
            }

            // Decrement the like count for the image
            db.run(
                "UPDATE images SET likes = likes - 1 WHERE id = ?",
                [id],
                function (err) {
                    if (err) {
                        res.status(500).json({ error: err.message }); // Send JSON error response
                        return;
                    }

                    // Fetch the updated like count
                    db.get("SELECT likes FROM images WHERE id = ?", [id], (err, row) => {
                        if (err) {
                            res.status(500).json({ error: err.message }); // Send JSON error response
                            return;
                        }
                        res.status(200).json({ likes: row.likes, liked: false });
                    });
                }
            );
        }
    );
});



// Registration endpoint
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if username already exists in the database
        db.get(
            "SELECT * FROM users WHERE username = ?",
            [username],
            async (err, row) => {
                if (err) {
                    res.status(500).send(err.message);
                    return;
                }
                if (row) {
                    // Username already exists, send an error response
                    res.status(400).send({ error: "Username already exists" });
                    return;
                }
                // Username does not exist, proceed with registration
                const hashedPassword = await bcrypt.hash(password, 10);
                db.run(
                    "INSERT INTO users (username, password) VALUES (?, ?)",
                    [username, hashedPassword],
                    function (err) {
                        if (err) {
                            res.status(500).send(err.message);
                        } else {
                            res.status(200).send({
                                message: "User registered successfully",
                            });
                        }
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).send("Error registering user: " + error.message);
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, row) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            if (!row) {
                res.status(401).send("Invalid username");
                return;
            }
            try {
                const passwordMatch = await bcrypt.compare(
                    password,
                    row.password
                );
                if (passwordMatch) {
                    // Generate JWT token
                    const token = jwt.sign({ id: row.id, username: username }, secretKey);
                    res.status(200).send({ token: token, message: "Login successful" });
                } else {
                    res.status(401).send("Invalid password");
                }
            } catch (error) {
                res
                    .status(500)
                    .send("Error checking password: " + error.message);
            }
        }
    );
});

// Fetch all images endpoint
app.get("/images", (req, res) => {
    db.all("SELECT * FROM images", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        // Convert image data to Base64
        const imagesWithBase64 = rows.map((row) => {
            let imageBase64 = "";
            if (row.image_data) {
                imageBase64 = Buffer.from(row.image_data).toString("base64");
            }
            return {
                ...row,
                image_data: imageBase64,
            };
        });

        // Send the response with correct headers
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(imagesWithBase64);
    });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});