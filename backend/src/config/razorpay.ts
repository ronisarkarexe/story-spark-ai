import Razorpay from "razorpay";

let razorpayInstance: InstanceType<typeof Razorpay> | null = null;

const getRazorpay = (): InstanceType<typeof Razorpay> => {
import Razorpay from 'razorpay';
let razorpayInstance: InstanceType<typeof Razorpay> | null = null;
export function getRazorpay(): InstanceType<typeof Razorpay> {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  return razorpayInstance;
};

export default getRazorpay;