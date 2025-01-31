import jwt from 'jsonwebtoken'
import "dotenv/config";

// Generate Access Token
export const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
    );
};