import PostEditor from "@/components/admin/PostEditor";

interface Category {
  id: number;
  name: string;
  slug: string;
}

async function getCategories(): Promise<Category[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/categories`, { cache: "no-store" });
  return res.json();
}

export const metadata = {
  title: "新建文章 | Blog CMS",
};

export default async function NewPostPage() {
  const categories = await getCategories();

  return <PostEditor categories={categories} />;
}
