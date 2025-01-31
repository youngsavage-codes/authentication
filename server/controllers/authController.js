import { 
    loginLogic, 
    registerLogic, 
    logOutLogic, 
    sendVerifyOtpLogic, 
    verifyEmailLogic, 
    isAuthenticatedLogic,
    sendResetOtpLogic,
    resetPasswordLogic } from "../businessLogic/authLogic.js";

export class AuthController {
    registerController = async (req, res) => {
        try {
            return registerLogic(req, res);
        } catch(error) {
            res.json({success: false, message: error.message})
        }
    }
    
    loginController = async (req, res) => {
        try {
            return loginLogic(req, res);
        } catch(error) {
            res.json({success: false, message: error.message})
        }
    }

    logoutController = async (req, res) => {
        try {
            return logOutLogic(req, res);
        } catch(error) {
            res.json({success: false, message: error.message})
        }
    }

    sendVerifyOtpController = async (req, res) => {
        try {
            return sendVerifyOtpLogic(req, res);
        } catch(error) {
            res.json({success: false, message: error.message})
        }
    }

    verifyEmailController = async (req, res) => {
        try {
            return verifyEmailLogic(req, res);
        } catch(error) {
            res.json({success: false, message: error.message})
        }
    }

    isAuthenticatedController = async (req, res) => {
        try {
            return isAuthenticatedLogic(req, res);
        } catch(error) {
            res.json({success: false, message: error.message})
        }
    }

    sendResetOtpController = async (req, res) => {
        try {
            return sendResetOtpLogic(req, res);
        } catch(error) {
            res.json({success: false, message: error.message})
        }
    }

    resetPasswordController = async (req, res) => {
        try {
            return resetPasswordLogic(req, res);
        } catch(error) {
            res.json({success: false, message: error.message})
        }
    }
}