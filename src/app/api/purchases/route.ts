import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/purchases — fetch all purchases
export async function GET() {
  try {
    const purchases = await prisma.purchase.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(purchases);
  } catch (error) {
    console.error("[GET /api/purchases] DB error:", error);
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}

// POST /api/purchases — add a new purchase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemName, cost, date, time, category, description, source } = body;

    if (!itemName || cost === undefined || !date || !time || !category || !source) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const purchase = await prisma.purchase.create({
      data: {
        itemName,
        cost: parseFloat(cost),
        date,
        time,
        category,
        description: description ?? "",
        source,
      },
    });

    console.log("[POST /api/purchases] Created:", purchase.id);
    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("[POST /api/purchases] DB error:", error);
    return NextResponse.json({ error: "Failed to save purchase" }, { status: 500 });
  }
}
