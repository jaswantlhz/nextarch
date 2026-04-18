import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";


// Plan definitions
const PLANS = {
  monthly: { amount: 50000, label: "1-Month Plan" },    // ₹500 in paise
  quarterly: { amount: 100000, label: "3-Month Plan" }, // ₹1000 in paise
} as const;

type PlanKey = keyof typeof PLANS;

export async function POST(request: NextRequest) {
  const email = request.cookies.get("nextarch_user")?.value;
  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const plan = body.plan as PlanKey;

  if (!PLANS[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const { amount, label } = PLANS[plan];

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    notes: { plan, email, label },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    label,
  });
}
