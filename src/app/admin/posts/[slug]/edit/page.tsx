import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  categoryId: number | null;
  status: "draft" | "published";
}

async function getPost(slug: string): Promise<Post | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/posts/${slug}`, { cache: "no-store" });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch post");
  }

  return res.json();
}

async function getCategories(): Promise<Category[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/categories`, { cache: "no-store" });
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post ? `编辑: ${post.title} | Blog CMS` : "文章未找到",
  };
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, categories] = await Promise.all([
    getPost(slug),
    getCategories(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <PostEditor
      initialData={{
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || "",
        categoryId: post.categoryId,
        status: post.status,
      }}
      categories={categories}
      isEditing
      postSlug={slug}
    />
  );
}
