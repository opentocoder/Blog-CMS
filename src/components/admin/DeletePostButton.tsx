"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeletePostButtonProps {
  slug: string;
  title: string;
}

export default function DeletePostButton({ slug, title }: DeletePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`确定要删除文章「${title}」吗？此操作不可撤销。`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete post");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("删除失败，请重试");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
      title="删除"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
