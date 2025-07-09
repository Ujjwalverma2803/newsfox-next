import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, url, imageUrl, source } = await request.json();

    // Basic validation
    if (!title?.trim() || !url?.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid title or url" },
        { status: 400 }
      );
    }

    // Find user by email
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // If user doesn't exist (unlikely), create user
    if (!user) {
      user = await prisma.user.create({
        data: { email: session.user.email },
      });
    }

    // Check if favorite already exists for this user and url to prevent duplicates
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_url: {
          userId: user.id,
          url: url.trim(),
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { message: "Already in favorites", favorite: existingFavorite },
        { status: 200 }
      );
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        title: title.trim(),
        url: url.trim(),
        imageUrl: imageUrl ? imageUrl.trim() : null,
        source: source ? source.trim() : "Unknown",
        userId: user.id,
      },
    });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user by email to get user id
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all favorites for this user, ordered by addedAt descending
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { addedAt: "desc" },
    });

    return NextResponse.json({ favorites }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
