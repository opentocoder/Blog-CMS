import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories, posts } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/categories/[id] - 获取单个分类
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
      with: { posts: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - 更新分类
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, slug, description } = body;

    const existing = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // 检查新 slug 是否已被其他分类使用
    if (slug && slug !== existing.slug) {
      const slugExists = await db.query.categories.findFirst({
        where: eq(categories.slug, slug),
      });
      if (slugExists) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 409 }
        );
      }
    }

    const [updatedCategory] = await db
      .update(categories)
      .set({
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
      })
      .where(eq(categories.id, categoryId))
      .returning();

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - 删除分类
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  try {
    const existing = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // 检查是否有关联文章
    const relatedPosts = await db.query.posts.findFirst({
      where: eq(posts.categoryId, categoryId),
    });

    if (relatedPosts) {
      return NextResponse.json(
        { error: "Cannot delete category with associated posts" },
        { status: 400 }
      );
    }

    await db.delete(categories).where(eq(categories.id, categoryId));

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
