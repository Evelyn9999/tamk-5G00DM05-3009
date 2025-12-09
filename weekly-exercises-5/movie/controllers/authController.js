import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { users, getNextUserId } from "../data/users.js";

const SECRET = "MY_SUPER_SECRET_KEY";

// ---------- SIGNUP ----------
export const signup = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ error: "username and password required" });

    // check uniqueness
    const existing = users.find(u => u.username === username);
    if (existing)
        return res.status(409).json({ error: "username is already taken" });

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
        id: getNextUserId(),
        username,
        passwordHash
    };

    users.push(newUser);

    res.status(201).json({ message: "user created", username });
};

// ---------- LOGIN ----------
export const login = async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user)
        return res.status(401).json({ error: "invalid credentials" });

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrect)
        return res.status(401).json({ error: "invalid credentials" });

    // create token
    const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token });
};
