 fix/story-parser-locations-1035
// backend/src/config/razorpay.ts

import Razorpay from "razorpay";
 main

import Razorpay from 'razorpay';

export const getRazorpay = (): InstanceType<typeof Razorpay> => {
 fix/story-parser-locations-1035
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured');
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}; 

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  // At this point the instance must be initialized.
  return razorpayInstance as InstanceType<typeof Razorpay>;
};

export default getRazorpay;

 main
