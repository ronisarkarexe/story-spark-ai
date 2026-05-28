import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller";

const paymentRouter = Router();

// Route to create a new Razorpay order
paymentRouter.post("/create-order", createOrder);

// Route to verify payment signature after successful payment
paymentRouter.post("/verify", verifyPayment);

export default paymentRouter;