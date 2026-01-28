import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "管理后台 | Blog CMS",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-100">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
