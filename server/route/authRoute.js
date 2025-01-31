import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { userAuth } from "../middleware/userAuth.js";

const authRoute = Router();

const authController = new AuthController()

authRoute.post('/register', authController.registerController);
authRoute.post('/login', authController.loginController);
authRoute.post('/logout', authController.logoutController);
authRoute.post('/send-verify-otp', userAuth, authController.sendVerifyOtpController);
authRoute.post('/verify-account', userAuth, authController.verifyEmailController);
authRoute.get('/is_auth', userAuth, authController.isAuthenticatedController);
authRoute.post('/send-reset-otp', authController.sendResetOtpController);
authRoute.post('/reset-password', authController.resetPasswordController);



export default authRoute