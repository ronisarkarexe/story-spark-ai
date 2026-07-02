 fix/audio-word-count-1214
 fix/audio-word-count-1214
 fix/audio-word-count-1214
// backend/src/config/razorpay.ts

import Razorpay from "razorpay";
main

 fix/story-parser-locations-1035
// backend/src/config/razorpay.ts

import Razorpay from "razorpay";
 main
 main

import Razorpay from 'razorpay';

let razorpayInstance: InstanceType<typeof Razorpay> | null = null;

export const getRazorpay = (): InstanceType<typeof Razorpay> => {
 fix/audio-word-count-1214
fix/audio-word-count-1214

 fix/story-parser-locations-1035
 main

import Razorpay from 'razorpay';

export const getRazorpay = (): InstanceType<typeof Razorpay> => {
 main
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured');
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayInstance;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

export default getRazorpay;