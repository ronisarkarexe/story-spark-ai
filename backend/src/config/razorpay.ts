import Razorpay from 'razorpay';

// Change "typeof Razorpay" to InstanceType<typeof Razorpay>
let razorpayInstance: InstanceType<typeof Razorpay> | null = null;

export const initRazorpay = (): InstanceType<typeof Razorpay> => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
  }
  return razorpayInstance;
};

export const getRazorpay = (): InstanceType<typeof Razorpay> => {
  if (!razorpayInstance) {
    throw new Error('Razorpay instance has not been initialized.');
  }
  return razorpayInstance;
};