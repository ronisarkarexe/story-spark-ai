import mongoose from "mongoose";
import crypto from "crypto";
import { Request, Response } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller";
import { Order } from "../app/modules/payment/order.model";
import { User } from "../app/modules/user/user.model";

const mockOrdersCreate = jest.fn();
const mockOrdersFetch = jest.fn();

jest.mock("razorpay", () =>
  jest.fn().mockImplementation(() => ({
    orders: {
      create: (...args: unknown[]) => mockOrdersCreate(...args),
      fetch: (...args: unknown[]) => mockOrdersFetch(...args),
    },
  }))
);

const makeRes = (): Partial<Response> => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe("payment.controller", () => {
  const userId = new mongoose.Types.ObjectId();
  const otherUserId = new mongoose.Types.ObjectId();
  const razorpayOrderId = "order_test123";
  const razorpayPaymentId = "pay_test456";

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RAZORPAY_KEY_ID = "test_key";
    process.env.RAZORPAY_KEY_SECRET = "test_secret";
  });

  describe("createOrder", () => {
    it("persists a local order bound to the authenticated user", async () => {
      mockOrdersCreate.mockResolvedValue({
        id: razorpayOrderId,
        amount: 49900,
        currency: "INR",
      });
      jest.spyOn(Order, "create").mockResolvedValue({} as any);

      const req = {
        user: { _id: userId },
        body: { plan: "monthly" },
      } as unknown as Request;
      const res = makeRes() as Response;
      const next = jest.fn();

      await createOrder(req, res, next);

      expect(Order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          razorpayOrderId,
          plan: "monthly",
          amount: 49900,
          status: "created",
        })
      );
      expect(mockOrdersCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          notes: expect.objectContaining({ userId: userId.toString() }),
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("verifyPayment", () => {
    const buildSignature = (orderId: string, paymentId: string) =>
      crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

    it("rejects verification when the order belongs to another user", async () => {
      jest.spyOn(Order, "findOne").mockResolvedValue({
        userId: otherUserId,
        razorpayOrderId,
        plan: "monthly",
        status: "created",
      } as any);

      const req = {
        user: { _id: userId },
        body: {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: buildSignature(razorpayOrderId, razorpayPaymentId),
        },
      } as unknown as Request;
      const res = makeRes() as Response;
      const next = jest.fn();

      await verifyPayment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, error: "Order does not belong to this user." })
      );
    });

    it("rejects replay when the payment id was already redeemed by another user", async () => {
      jest
        .spyOn(Order, "findOne")
        .mockResolvedValueOnce({
          userId,
          razorpayOrderId,
          plan: "monthly",
          status: "created",
        } as any)
        .mockResolvedValueOnce({
          userId: otherUserId,
          razorpayOrderId: "order_other",
          razorpayPaymentId,
          status: "paid",
        } as any);

      const req = {
        user: { _id: userId },
        body: {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: buildSignature(razorpayOrderId, razorpayPaymentId),
        },
      } as unknown as Request;
      const res = makeRes() as Response;
      const next = jest.fn();

      await verifyPayment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, error: "Payment already redeemed." })
      );
    });

    it("rejects verification when the stored order amount does not match the selected plan", async () => {
      jest
        .spyOn(Order, "findOne")
        .mockResolvedValueOnce({
          userId,
          razorpayOrderId,
          plan: "monthly",
          amount: 100,
          status: "created",
        } as any)
        .mockResolvedValueOnce(null);

      mockOrdersFetch.mockResolvedValue({
        amount: 49900,
        notes: { plan: "monthly" },
      });

      const req = {
        user: { _id: userId },
        body: {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: buildSignature(razorpayOrderId, razorpayPaymentId),
        },
      } as unknown as Request;
      const res = makeRes() as Response;
      const next = jest.fn();

      await verifyPayment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Stored order amount does not match the selected plan.",
        })
      );
    });

    it("upgrades the paying user when ownership and amount checks pass", async () => {
      jest
        .spyOn(Order, "findOne")
        .mockResolvedValueOnce({
          userId,
          razorpayOrderId,
          plan: "monthly",
          amount: 49900,
          status: "created",
        } as any)
        .mockResolvedValueOnce(null);

      jest.spyOn(Order, "findOneAndUpdate").mockResolvedValue({
        userId,
        razorpayOrderId,
        plan: "monthly",
        status: "paid",
      } as any);

      mockOrdersFetch.mockResolvedValue({
        amount: 49900,
        notes: { plan: "monthly" },
      });

      jest.spyOn(User, "findByIdAndUpdate").mockResolvedValue({
        subscriptionType: "premium",
        subscriptionExpiry: new Date("2026-07-22"),
      } as any);

      const req = {
        user: { _id: userId },
        body: {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: buildSignature(razorpayOrderId, razorpayPaymentId),
        },
      } as unknown as Request;
      const res = makeRes() as Response;
      const next = jest.fn();

      await verifyPayment(req, res, next);

      expect(Order.findOneAndUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          razorpayOrderId: razorpayOrderId,
          userId,
          status: "created",
        }),
        expect.objectContaining({
          status: "paid",
          razorpayPaymentId,
        }),
        { new: true }
      );
      expect(User.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
