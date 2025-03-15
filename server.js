const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", optionsSuccessStatus: 200 })); // Allow cross-origin requests
app.use(express.static("public")); // Serve static files from 'public' folder

// PostgreSQL Connection Pool
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "dataformdb",
    password: "postgres",
    port: 5432
});

// Handle Form Submission
app.post("/submit", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const result = await pool.query(
            "INSERT INTO form_data (name, email, message) VALUES ($1, $2, $3) RETURNING *",
            [name, email, message]
        );
        console.log("Inserted Row:", result.rows[0]);
        res.json({ message: "Data saved successfully!" });
    } catch (error) {
        console.error("Database Error:", error.code, error.message);
        res.status(500).json({ message: "Error saving data", error: error.message });
    }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));