"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createOrder = void 0;
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = __importDefault(require("../config/razorpay"));
const token_1 = require("../app/middleware/token");
const order_model_1 = require("../app/modules/payment/order.model");
const user_model_1 = require("../app/modules/user/user.model");
const payment_constant_1 = require("../app/modules/payment/payment.constant");
// Creates a Razorpay order for a chosen plan. The price is resolved server
// side from PLAN_PRICING so the client cannot dictate the amount, and the
// order is persisted so verifyPayment can map it back to the user and tier.
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (0, token_1.getToken)(req);
        const plan = (0, payment_constant_1.normalizePlan)((_a = req.body) === null || _a === void 0 ? void 0 : _a.plan);
        if (!plan) {
            return res.status(400).json({ success: false, message: "Invalid or missing plan" });
        }
        const pricing = payment_constant_1.PLAN_PRICING[plan];
        const order = yield (0, razorpay_1.default)().orders.create({
            amount: pricing.amount,
            currency: pricing.currency,
            receipt: `receipt_${token._id}_${Date.now()}`,
        });
        yield order_model_1.Order.create({
            userId: token._id,
            razorpayOrderId: order.id,
            plan,
            amount: pricing.amount,
            currency: pricing.currency,
            status: "created",
        });
        res.status(200).json({ success: true, order });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
});
exports.createOrder = createOrder;
// Verifies the Razorpay signature, then atomically claims the persisted order
// and upgrades the user's subscription. The atomic status transition makes a
// replayed verify request a no-op so a tier cannot be granted twice.
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
        if (!RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ success: false, message: "Payment not configured" });
        }
        const token = (0, token_1.getToken)(req);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing payment details" });
        }
        const expectedSignature = crypto_1.default
            .createHmac("sha256", RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");
        const expectedBuffer = Buffer.from(expectedSignature, "hex");
        const receivedBuffer = Buffer.from(razorpay_signature, "hex");
        const signaturesMatch = expectedBuffer.length === receivedBuffer.length &&
            crypto_1.default.timingSafeEqual(expectedBuffer, receivedBuffer);
        if (!signaturesMatch) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
        const order = yield order_model_1.Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id, userId: token._id, status: "created" }, { status: "paid", razorpayPaymentId: razorpay_payment_id }, { new: true });
        if (!order) {
            const existing = yield order_model_1.Order.findOne({ razorpayOrderId: razorpay_order_id });
            if (existing && existing.status === "paid" && existing.userId.toString() === token._id) {
                return res.status(200).json({ success: true, message: "Payment already verified" });
            }
            return res.status(400).json({ success: false, message: "Order not found" });
        }
        const pricing = payment_constant_1.PLAN_PRICING[order.plan];
        if (pricing) {
            yield user_model_1.User.findByIdAndUpdate(order.userId, {
                subscriptionType: pricing.subscriptionType,
            });
        }
        res.status(200).json({ success: true, message: "Payment verified and subscription upgraded" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Payment verification failed" });
    }
});
exports.verifyPayment = verifyPayment;
