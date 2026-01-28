import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/posts/[slug] - 获取单篇文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const post = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
      with: { category: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[slug] - 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = await request.json();
    const { title, slug: newSlug, content, excerpt, categoryId, status } = body;

    const existing = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 如果更改了 slug，检查新 slug 是否已被使用
    if (newSlug && newSlug !== slug) {
      const slugExists = await db.query.posts.findFirst({
        where: eq(posts.slug, newSlug),
      });
      if (slugExists) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 409 }
        );
      }
    }

    const [updatedPost] = await db
      .update(posts)
      .set({
        ...(title && { title }),
        ...(newSlug && { slug: newSlug }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(categoryId !== undefined && { categoryId }),
        ...(status && { status }),
        updatedAt: new Date(),
      })
      .where(eq(posts.slug, slug))
      .returning();

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[slug] - 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const existing = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await db.delete(posts).where(eq(posts.slug, slug));

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
