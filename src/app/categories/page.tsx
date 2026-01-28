import Link from "next/link";
import { Folder, FileText } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
}

async function getCategories(): Promise<Category[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/categories`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

export const metadata = {
  title: "分类 | Blog CMS",
  description: "浏览所有文章分类",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">文章分类</h1>
        <p className="text-gray-600">按分类浏览文章</p>
      </section>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无分类</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Folder className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <FileText className="w-4 h-4" />
                    <span>{category.postCount} 篇文章</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
