import userModel from "../models/userModel.js";

class AuthService {
    // Register a new user
    async register(credential) {
        try {
            // Check if email already exists
            const isEmailExist = await userModel.findOne({ email: credential.email });

            if (isEmailExist) {
                throw new Error('Email already exists');
            }

            // Create a new user
            const data = new userModel(credential);
            await data.save();

            return data; // Return saved user
        } catch (e) {
            console.error("Error in register:", e);
            throw new Error('Registration failed');
        }
    }

    // Get user by email
    async getUser(email) {
        try {
            return await userModel.findOne({ email });
        } catch (e) {
            console.error("Error in getUser:", e);
            throw new Error('Failed to fetch user');
        }
    }

    // Get user by ID
    async getUserById(userId) {
        try {
            return await userModel.findById(userId);
        } catch (e) {
            console.error("Error in getUserById:", e);
            throw new Error('Failed to fetch user by ID');
        }
    }
}

export default AuthService;
