import jwt from "jsonwebtoken";
const SECRET = "MY_SUPER_SECRET_KEY";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Must start with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json({ error: "missing or invalid token" });

    const token = authHeader.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // attach user to req
        next();
    } catch (err) {
        return res.status(401).json({ error: "token expired or invalid" });
    }
};

export default authMiddleware;
