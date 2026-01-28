import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { like, or, eq, and, desc } from "drizzle-orm";

// GET /api/search - 搜索文章
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  if (!q || q.trim().length === 0) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  const offset = (page - 1) * limit;
  const searchTerm = `%${q}%`;

  try {
    const searchCondition = and(
      eq(posts.status, "published"),
      or(like(posts.title, searchTerm), like(posts.content, searchTerm))
    );

    const [results, totalResult] = await Promise.all([
      db.query.posts.findMany({
        where: searchCondition,
        with: { category: true },
        orderBy: [desc(posts.createdAt)],
        limit,
        offset,
      }),
      db.select({ count: posts.id }).from(posts).where(searchCondition),
    ]);

    const total = totalResult.length;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      query: q,
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    return NextResponse.json(
      { error: "Failed to search posts" },
      { status: 500 }
    );
  }
}
