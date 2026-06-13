import Razorpay from "razorpay";

let razorpayInstance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials are missing in environment variables");
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
let razorpayInstance: InstanceType<typeof Razorpay> | null = null;

const getRazorpay = (): InstanceType<typeof Razorpay> => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  return razorpayInstance;
};

export default getRazorpay;