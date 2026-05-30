import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller";
import auth from "../app/middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../enums/user";

const paymentRouter = Router();

// Route to create a new Razorpay order — requires a valid user session
paymentRouter.post("/create-order", auth(ENUM_USER_ROLE.USER), createOrder);

// Route to verify payment signature after successful payment — requires a valid user session
paymentRouter.post("/verify", auth(ENUM_USER_ROLE.USER), verifyPayment);

export default paymentRouter;