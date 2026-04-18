import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  const email = request.cookies.get("nextarch_user")?.value;
  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
  } = body;

  // ── Verify HMAC-SHA256 signature ─────────────────────────────
  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(payload)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json(
      { error: "Payment verification failed. Signature mismatch." },
      { status: 400 }
    );
  }

  // ── Calculate plan expiry ────────────────────────────────────
  const daysToAdd = plan === "monthly" ? 30 : 90;
  const planExpiresAt = new Date();
  planExpiresAt.setDate(planExpiresAt.getDate() + daysToAdd);

  // ── Tag user in MongoDB ──────────────────────────────────────
  const client = await clientPromise;
  await client
    .db("nextarch")
    .collection("users")
    .updateOne(
      { email },
      {
        $set: {
          plan,
          planExpiresAt,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          subscribedAt: new Date(),
        },
      }
    );

  return NextResponse.json({ success: true, plan, planExpiresAt });
}
