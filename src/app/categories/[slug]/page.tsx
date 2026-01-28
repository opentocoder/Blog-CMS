import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PostCard from "@/components/PostCard";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: string;
  category: {
    name: string;
    slug: string;
  } | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  posts: Post[];
}

async function getCategory(slug: string): Promise<Category | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Get all categories to find the one we need
  const categoriesRes = await fetch(`${baseUrl}/api/categories`, {
    cache: "no-store",
  });

  if (!categoriesRes.ok) {
    throw new Error("Failed to fetch categories");
  }

  const categories = await categoriesRes.json();
  const category = categories.find(
    (c: { slug: string }) => c.slug === slug
  );

  if (!category) return null;

  // Get posts for this category
  const postsRes = await fetch(
    `${baseUrl}/api/posts?categoryId=${category.id}&status=published`,
    { cache: "no-store" }
  );

  if (!postsRes.ok) {
    throw new Error("Failed to fetch posts");
  }

  const postsData = await postsRes.json();

  return {
    ...category,
    posts: postsData.data,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return { title: "分类未找到" };
  }

  return {
    title: `${category.name} | Blog CMS`,
    description: category.description || `${category.name}分类下的所有文章`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Link */}
      <Link
        href="/categories"
        className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回分类列表
      </Link>

      {/* Category Header */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-gray-600">{category.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          共 {category.posts.length} 篇文章
        </p>
      </section>

      {/* Posts List */}
      {category.posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">该分类下暂无文章</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {category.posts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                category: { name: category.name, slug: category.slug },
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
