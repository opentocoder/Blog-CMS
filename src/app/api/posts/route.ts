import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, categories } from "@/db/schema";
import { eq, desc, and, like, or } from "drizzle-orm";

// GET /api/posts - 获取文章列表
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status");
  const categoryId = searchParams.get("categoryId");

  const offset = (page - 1) * limit;

  try {
    const conditions = [];

    if (status) {
      conditions.push(eq(posts.status, status as "draft" | "published"));
    }

    if (categoryId) {
      conditions.push(eq(posts.categoryId, parseInt(categoryId)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [postList, totalResult] = await Promise.all([
      db.query.posts.findMany({
        where: whereClause,
        with: { category: true },
        orderBy: [desc(posts.createdAt)],
        limit,
        offset,
      }),
      db.select({ count: posts.id }).from(posts).where(whereClause),
    ]);

    const total = totalResult.length;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: postList,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - 创建文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, categoryId, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // 检查 slug 是否已存在
    const existing = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }

    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        slug,
        content,
        excerpt,
        categoryId,
        status: status || "draft",
      })
      .returning();

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
