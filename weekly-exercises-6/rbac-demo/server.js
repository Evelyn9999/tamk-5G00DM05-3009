import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { users } from "./users.js";
import { authenticateToken } from "./middleware/auth.js";
import { requireAdmin } from "./middleware/admin.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "RBAC Demo API" });
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) return res.status(404).json({ error: "user not found" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "wrong password" });

    // 🔐 put role into token
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        "MY_SECRET",
        { expiresIn: "1h" }
    );

    res.json({ token });
});

// PUBLIC READABLE ROUTES
app.get("/movies", authenticateToken, (req, res) => {
    res.json(["Matrix", "Inception", "Avatar"]);
});

// ADMIN ONLY
app.post("/movies", authenticateToken, requireAdmin, (req, res) => {
    res.json({ message: "Movie added by admin" });
});

app.delete("/movies/:id", authenticateToken, requireAdmin, (req, res) => {
    res.json({ message: "Movie deleted by admin" });
});

app.listen(3000, () => console.log("Running on http://localhost:3000"));
