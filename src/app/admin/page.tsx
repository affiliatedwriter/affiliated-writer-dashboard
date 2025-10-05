// File: src/app/admin/page.tsx
export default function AdminPage() {
  // ⛔ এখানে আর <Sidebar /> বা <AdminLayout> নেই—admin/layout.tsx-ই র‍্যাপ করবে
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      <p className="text-sm text-gray-600">
        Welcome to the Admin dashboard.
      </p>
    </div>
  );
}
