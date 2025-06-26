import Razorpay from "razorpay";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
const key_secret = process.env.RAZORPAY_API_SECRET || "";
const key_id = process.env.RAZORPAY_API_KEY || "";

const initializeRazorpay = () => {
    if (!key_secret || !key_id) {
        throw new Error('Sorry Payment is not working');
    }
    return new Razorpay({
        key_id,
        key_secret
    });
}

const createOrder = async (amount: number) => {
    const instance = initializeRazorpay();
    const options = {
        amount: Math.round(amount * 100),
        currency: "INR"
    }
    return await instance.orders.create(options);
}

const verifyPayment = (order_id: string, payment_id: string, signature: string) => {
    return validatePaymentVerification({ order_id, payment_id }, signature, key_secret);
}