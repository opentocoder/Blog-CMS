import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Folder, ArrowLeft } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

async function getPost(slug: string): Promise<Post | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch post");
  }

  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "文章未找到" };
  }

  const description = post.excerpt || post.content.replace(/[#*`\n]/g, " ").slice(0, 160);

  return {
    title: post.title,
    description,
    keywords: post.category ? [post.category.name, "博客", "文章"] : ["博客", "文章"],
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: ["Blog CMS"],
      section: post.category?.name,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回首页
      </Link>

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.createdAt}>{formattedDate}</time>
          </div>

          {post.category && (
            <Link
              href={`/categories/${post.category.slug}`}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <Folder className="w-4 h-4" />
              {post.category.name}
            </Link>
          )}
        </div>
      </header>

      {/* Article Content */}
      <div className="border-t pt-8">
        <MarkdownRenderer content={post.content} />
      </div>

      {/* Article Footer */}
      <footer className="mt-12 pt-6 border-t">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            &larr; 返回文章列表
          </Link>

          {post.category && (
            <Link
              href={`/categories/${post.category.slug}`}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              更多「{post.category.name}」文章 &rarr;
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
}
