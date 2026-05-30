import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("eur"),
  orderId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency } = bodySchema.parse(body);

    // Demo: simulate a payment intent
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({
      clientSecret: `pi_demo_${Date.now()}_secret_demo`,
      paymentIntentId: `pi_demo_${Date.now()}`,
      amount,
      currency,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Payment intent error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 },
    );
  }
}
