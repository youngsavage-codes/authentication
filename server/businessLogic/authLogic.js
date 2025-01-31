import AuthService from '../service/userService.js';
import { comparePassword, hashPassword } from '../utils/hashes.js';
import { sendWelcomeMail, sendOtpVerifyMail, sendResetOtpMail } from '../utils/mail.js';
import { generateOtp } from '../utils/otp.js';
import { generateAccessToken } from '../utils/token.js';

const authService = new AuthService();

// Register a new user
export const registerLogic = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing details" });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Register the user
        const user = await authService.register({ name, email, password: hashedPassword });

        if (!user || !user._id) {
            return res.status(400).json({ success: false, message: "Registration failed" });
        }

        // Generate token
        const token = generateAccessToken(user._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send welcome email
        await sendWelcomeMail(email);

        return res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error("Error in registerLogic:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// Login user
export const loginLogic = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing email or password" });
        }

        const userFound = await authService.getUser(email);

        if (!userFound) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const passwordMatch = await comparePassword(password, userFound.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate token
        const token = generateAccessToken(userFound._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: "Login successful" });
    } catch (error) {
        console.error("Error in loginLogic:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// Logout user
export const logOutLogic = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Error in logOutLogic:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// Send OTP for email verification
export const sendVerifyOtpLogic = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await authService.getUserById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }

        const otp = generateOtp();

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // OTP expires in 24 hours

        await user.save();

        await sendOtpVerifyMail(user.email, otp);

        return res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error in sendVerifyOtp:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// Verify Email
export const verifyEmailLogic = async (req, res) => {
    const {userId, otp} = req.body

    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: "User ID And OTP is required" });
    }
    try {
        const user = await authService.getUserById(userId);

        if(!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        } 

        if(user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: "Incorrect Otp" });
        }

        if(user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "Otp Expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtpExpireAt = 0;
        user.verifyOtp = '';

        user.save();

        return res.json({ success: true, message: "Email Verified successfully" });
    } catch(error) {
        console.error("Error in sendVerifyOtp:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
}

// Is User Authenticated
export const isAuthenticatedLogic = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch(error) {
        return res.json({success: false, message: error.message || "Internal server error"});
    }
}

// Send reset Otp
export const sendResetOtpLogic = async (req, res) => {
    const {email} = req.body;

    if(!email) {
        return res.status(400).json({success: false, message: "Email Is Required"});
    }

    try {
        const user = await authService.getUser(email);

        if(!user) {
            return res.status(404).json({success: false, message: "User Not Found"});
        }

        const otp = generateOtp();

        user.resetOtp = otp;
        user.resetOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // OTP expires in 24 hours

        await user.save();

        await sendResetOtpMail(user.email, otp);

        return res.json({ success: true, message: "Reset Otp Sent" });
    } catch(error) {
        return res.json({success: false, message: error.message});
    }
}

// Reset User Password
export const resetPasswordLogic = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: "Missing details" });
    }

    try {
        const user = await authService.getUser(email);

        if(!user) {
            return res.status(404).json({success: false, message: "User Not Found"});
        }

        if(user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(400).json({success: false, message: "Incorrect OTP Entered"});
        }

        if(user.resetOtpExpiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: "Otp Expired" });
        }

         // Hash the password
         const hashedPassword = await hashPassword(newPassword);

        user.resetOtp = '';
        user.resetOtpExpiresAt = 0; // OTP expires in 24 hours
        user.password = hashedPassword;

        user.save();

        return res.json({ success: true, message: "Password Reset Successfully" });
    } catch (error) {
        return res.json({success: false, message: error.message || "Internal server error"});
    }
}