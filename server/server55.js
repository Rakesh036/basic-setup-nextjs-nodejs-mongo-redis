const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = 8080;
const SECRET = "your_jwt_secret"; // Keep this safe

// Fake in-memory DB
const users = [];

app.use(cors({
    origin: "http://localhost:3000", // your Next.js app
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// SIGNUP
app.post("/api/auth/signup", async (req, res) => {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    users.push({ email, password: hashed });
    res.status(201).json({ message: "User registered" });
});

// SIGNIN
app.post("/api/auth/signin", async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false // set to true in production with HTTPS
    }).json({ message: "Signed in" });
});

// SIGNOUT
app.post("/api/auth/signout", (req, res) => {
    res.clearCookie("token").json({ message: "Signed out" });
});

// PROTECTED ROUTE EXAMPLE
app.get("/api/profile", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const data = jwt.verify(token, SECRET);
        res.json({ email: data.email });
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
