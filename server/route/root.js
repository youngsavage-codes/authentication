import { Router } from "express";
import authRoute from './authRoute.js';
import userRoute from './userRoute.js';

const rootRoute = Router();

rootRoute.use('/auth', authRoute);
rootRoute.use('/user', userRoute);

export default rootRoute;

