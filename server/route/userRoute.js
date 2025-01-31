import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { userAuth } from "../middleware/userAuth.js";

const userRoute = Router();

const userController = new UserController();

userRoute.get('/data', userAuth, userController.getUserDataController)

export default userRoute