import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
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

interface SearchResponse {
  query: string;
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function searchPosts(query: string): Promise<SearchResponse | null> {
  if (!query) return null;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to search posts");
  }

  return res.json();
}

export const metadata = {
  title: "搜索 | Blog CMS",
  description: "搜索文章",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const results = await searchPosts(query);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回首页
      </Link>

      {/* Search Header */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-8 h-8 text-gray-400" />
          <h1 className="text-3xl font-bold text-gray-900">搜索结果</h1>
        </div>

        {query ? (
          <p className="text-gray-600">
            关键词「<span className="font-medium text-gray-900">{query}</span>
            」的搜索结果
            {results && (
              <span className="text-gray-500">
                ，共找到 {results.pagination.total} 篇文章
              </span>
            )}
          </p>
        ) : (
          <p className="text-gray-600">请输入搜索关键词</p>
        )}
      </section>

      {/* Search Results */}
      {!query ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">在顶部搜索框输入关键词开始搜索</p>
        </div>
      ) : results && results.data.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">
            未找到包含「{query}」的文章
          </p>
          <p className="text-sm text-gray-400">
            尝试使用其他关键词搜索
          </p>
        </div>
      ) : results ? (
        <div className="grid gap-6">
          {results.data.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
