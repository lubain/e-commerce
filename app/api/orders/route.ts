import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateOrderNumber } from "@/utils";

const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().positive(),
      price: z.number().positive(),
    }),
  ),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  subtotal: z.number(),
  discount: z.number().default(0),
  shipping: z.number(),
  total: z.number(),
  promoCode: z.string().optional(),
  paymentIntentId: z.string().optional(),
});

// GET /api/orders — list user orders
export async function GET(_request: NextRequest) {
  // In production: verify auth session and query DB
  // const session = await auth()
  // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // const orders = await db.order.findMany({ where: { userId: session.user.id }, include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } })

  // Demo response
  return NextResponse.json({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
}

// POST /api/orders — create order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = orderSchema.parse(body);

    const orderNumber = generateOrderNumber();

    // In production:
    /*
    const session = await auth()
    const order = await db.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id ?? 'guest',
        status: 'PENDING',
        subtotal: data.subtotal,
        discount: data.discount,
        shipping: data.shipping,
        total: data.total,
        promoCode: data.promoCode,
        paymentIntentId: data.paymentIntentId,
        shippingAddress: data.shippingAddress,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    })
    return NextResponse.json({ data: order }, { status: 201 })
    */

    // Demo response
    return NextResponse.json(
      {
        data: {
          id: `order_${Date.now()}`,
          orderNumber,
          status: "PENDING",
          ...data,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
