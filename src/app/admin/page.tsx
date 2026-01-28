import Link from "next/link";
import { FileText, FolderOpen, Eye, Edit } from "lucide-react";

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
}

interface RecentPost {
  id: number;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
}

async function getStats(): Promise<Stats> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const [postsRes, categoriesRes] = await Promise.all([
    fetch(`${baseUrl}/api/posts?limit=100`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/categories`, { cache: "no-store" }),
  ]);

  const postsData = await postsRes.json();
  const categoriesData = await categoriesRes.json();

  const posts = postsData.data || [];

  return {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p: { status: string }) => p.status === "published").length,
    draftPosts: posts.filter((p: { status: string }) => p.status === "draft").length,
    totalCategories: categoriesData.length,
  };
}

async function getRecentPosts(): Promise<RecentPost[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/posts?limit=5`, { cache: "no-store" });
  const data = await res.json();
  return data.data || [];
}

export default async function AdminDashboard() {
  const [stats, recentPosts] = await Promise.all([getStats(), getRecentPosts()]);

  const statCards = [
    {
      label: "总文章数",
      value: stats.totalPosts,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      label: "已发布",
      value: stats.publishedPosts,
      icon: Eye,
      color: "bg-green-500",
    },
    {
      label: "草稿",
      value: stats.draftPosts,
      icon: Edit,
      color: "bg-yellow-500",
    },
    {
      label: "分类数",
      value: stats.totalCategories,
      icon: FolderOpen,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">仪表盘</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow p-6 flex items-center gap-4"
          >
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">最近文章</h2>
          <Link
            href="/admin/posts"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            查看全部
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentPosts.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              暂无文章
            </div>
          ) : (
            recentPosts.map((post) => (
              <div
                key={post.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      post.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {post.status === "published" ? "已发布" : "草稿"}
                  </span>
                  <Link
                    href={`/admin/posts/${post.slug}/edit`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    编辑
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
