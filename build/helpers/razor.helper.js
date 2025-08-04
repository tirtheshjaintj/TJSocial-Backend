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
const razorpay_1 = __importDefault(require("razorpay"));
const razorpay_utils_1 = require("razorpay/dist/utils/razorpay-utils");
const key_secret = process.env.RAZORPAY_API_SECRET || "";
const key_id = process.env.RAZORPAY_API_KEY || "";
const initializeRazorpay = () => {
    if (!key_secret || !key_id) {
        throw new Error('Sorry Payment is not working');
    }
    return new razorpay_1.default({
        key_id,
        key_secret
    });
};
const createOrder = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    const instance = initializeRazorpay();
    const options = {
        amount: Math.round(amount * 100),
        currency: "INR"
    };
    return yield instance.orders.create(options);
});
const verifyPayment = (order_id, payment_id, signature) => {
    return (0, razorpay_utils_1.validatePaymentVerification)({ order_id, payment_id }, signature, key_secret);
};
