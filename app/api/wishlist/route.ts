import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const wishlistSchema = z.object({
  productId: z.string(),
});

export async function GET() {
  return NextResponse.json({ data: [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId } = wishlistSchema.parse(body);
    return NextResponse.json(
      { data: { productId, added: true } },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const productId = new URL(request.url).searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }
  return NextResponse.json({ data: { productId, removed: true } });
}
