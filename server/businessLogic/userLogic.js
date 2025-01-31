import AuthService from "../service/userService.js";

const authService = new AuthService();

export const getUserDataLogic = async (req, res) => {
    const {userId} = req.body

    if(!userId) {
        return res.status(400).json({success: false, message: "Required Credentail"})
    }

    try {
        const user = await authService.getUserById(userId);

        if(!user) {
            return res.status(400).json({success: false, message: "No ser found"})
        }

        return res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
                email: user.email
            }
        })
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
} 