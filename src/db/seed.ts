import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { categories, posts } from "./schema";

const sqlite = new Database("./data/blog.db");
const db = drizzle(sqlite);

async function seed() {
  console.log("Seeding database...");

  // 清空现有数据
  db.delete(posts).run();
  db.delete(categories).run();

  // 插入分类
  const categoryData = [
    { name: "技术", slug: "tech", description: "技术相关文章" },
    { name: "生活", slug: "life", description: "生活随笔" },
    { name: "教程", slug: "tutorial", description: "学习教程" },
  ];

  const insertedCategories = db
    .insert(categories)
    .values(categoryData)
    .returning()
    .all();

  console.log(`Inserted ${insertedCategories.length} categories`);

  // 插入文章
  const postData = [
    {
      title: "Next.js 15 新特性介绍",
      slug: "nextjs-15-features",
      content: `# Next.js 15 新特性

Next.js 15 带来了许多令人兴奋的新特性：

## Turbopack 稳定版

Turbopack 现在是默认的开发服务器打包工具，提供更快的热更新。

## React 19 支持

完整支持 React 19，包括新的 hooks 和并发特性。

\`\`\`typescript
// 使用新的 use hook
const data = use(fetchData());
\`\`\`

## 改进的缓存

更智能的缓存策略，提升应用性能。`,
      excerpt: "了解 Next.js 15 的最新特性和改进",
      categoryId: insertedCategories[0].id,
      status: "published" as const,
    },
    {
      title: "TypeScript 最佳实践",
      slug: "typescript-best-practices",
      content: `# TypeScript 最佳实践

## 类型推断

让 TypeScript 自动推断类型，减少冗余代码。

\`\`\`typescript
// 好的做法
const numbers = [1, 2, 3]; // TypeScript 自动推断为 number[]

// 避免
const numbers: number[] = [1, 2, 3];
\`\`\`

## 使用 unknown 替代 any

\`unknown\` 是类型安全的 \`any\` 替代品。`,
      excerpt: "提升 TypeScript 代码质量的实用技巧",
      categoryId: insertedCategories[0].id,
      status: "published" as const,
    },
    {
      title: "我的 2026 年目标",
      slug: "my-2026-goals",
      content: `# 2026 年目标

## 技术方面
- 深入学习 AI 开发
- 贡献开源项目
- 写更多技术博客

## 生活方面
- 保持健康的作息
- 每周运动三次
- 读完 20 本书`,
      excerpt: "新年新计划",
      categoryId: insertedCategories[1].id,
      status: "published" as const,
    },
    {
      title: "Drizzle ORM 入门教程",
      slug: "drizzle-orm-tutorial",
      content: `# Drizzle ORM 入门

Drizzle 是一个轻量级、类型安全的 ORM。

## 安装

\`\`\`bash
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
\`\`\`

## 定义 Schema

\`\`\`typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});
\`\`\``,
      excerpt: "学习如何使用 Drizzle ORM",
      categoryId: insertedCategories[2].id,
      status: "published" as const,
    },
    {
      title: "草稿文章示例",
      slug: "draft-example",
      content: "这是一篇草稿文章，尚未完成...",
      excerpt: "草稿",
      categoryId: insertedCategories[0].id,
      status: "draft" as const,
    },
  ];

  const insertedPosts = db.insert(posts).values(postData).returning().all();

  console.log(`Inserted ${insertedPosts.length} posts`);
  console.log("Seeding completed!");

  sqlite.close();
}

seed().catch(console.error);
