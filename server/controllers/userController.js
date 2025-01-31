import { getUserDataLogic } from "../businessLogic/userLogic.js"

export class UserController {
    getUserDataController = async (req, res) => {
        try {
            return await getUserDataLogic(req, res)
        } catch (error) {
          return  res.json({success: false, message: error.message})
        }
    } 
}