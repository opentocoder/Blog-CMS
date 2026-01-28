import Link from "next/link";
import { Calendar, Folder } from "lucide-react";

interface PostCardProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    createdAt: string;
    category: {
      name: string;
      slug: string;
    } | null;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <Link href={`/posts/${post.slug}`}>
        <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
          {post.title}
        </h2>
      </Link>

      {post.excerpt && (
        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>

        {post.category && (
          <Link
            href={`/categories/${post.category.slug}`}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <Folder className="w-4 h-4" />
            <span>{post.category.name}</span>
          </Link>
        )}
      </div>
    </article>
  );
}
