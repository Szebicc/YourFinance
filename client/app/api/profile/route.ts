import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { UserProfile } from "@/models/UserProfile";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    const profile =
      (await UserProfile.findOne({ userId }).lean()) ??
      (await UserProfile.create({ userId, monthlyIncome: 0 }));

    return NextResponse.json(profile, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    const body = await req.json();
    const monthlyIncome =
      typeof body.monthlyIncome === "number" ? body.monthlyIncome : 0;

    const updated = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { monthlyIncome } },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

