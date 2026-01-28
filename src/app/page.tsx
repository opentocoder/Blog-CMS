import Link from "next/link";
import PostCard from "@/components/PostCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

interface PostsResponse {
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function getPosts(page: number = 1): Promise<PostsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/posts?page=${page}&limit=10&status=published`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const { data: posts, pagination } = await getPosts(page);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">最新文章</h1>
        <p className="text-gray-600">探索技术、生活和更多精彩内容</p>
      </section>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无文章</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <nav className="flex justify-center items-center gap-4 mt-8">
              {page > 1 ? (
                <Link
                  href={`/?page=${page - 1}`}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  上一页
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                  上一页
                </span>
              )}

              <span className="text-sm text-gray-600">
                第 {page} / {pagination.totalPages} 页
              </span>

              {page < pagination.totalPages ? (
                <Link
                  href={`/?page=${page + 1}`}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  下一页
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
                  下一页
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
