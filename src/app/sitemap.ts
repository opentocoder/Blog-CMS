import { MetadataRoute } from "next";

interface Post {
  slug: string;
  updatedAt: string;
}

interface Category {
  slug: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // 获取所有文章
  let posts: Post[] = [];
  let categories: Category[] = [];

  try {
    const postsRes = await fetch(`${baseUrl}/api/posts?status=published&limit=100`);
    const postsData = await postsRes.json();
    posts = postsData.data || [];

    const categoriesRes = await fetch(`${baseUrl}/api/categories`);
    categories = await categoriesRes.json();
  } catch (error) {
    console.error("Error fetching data for sitemap:", error);
  }

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // 文章页面
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // 分类页面
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...postPages, ...categoryPages];
}
