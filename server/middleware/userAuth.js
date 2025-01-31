import jwt from 'jsonwebtoken';

export const userAuth = async (req, res, next) => {
    try {
        // Ensure cookies exist before accessing `token`
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.id) {
            // Attach user ID to request body
            req.body.userId = decoded.id;
        } else {
            return res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
        }

        next(); // Proceed to the next middleware

    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};
