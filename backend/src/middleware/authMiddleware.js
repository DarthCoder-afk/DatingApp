import { decodeToken } from "../config/jwt.js";


export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) 
    return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = decodeToken(token);
    req.user = decoded; // attach decoded info to req
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
