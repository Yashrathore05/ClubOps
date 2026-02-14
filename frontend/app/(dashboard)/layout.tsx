import Sidebar from "../../components/layout/sidebar";
import AuthGuard from "../../components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 flex text-slate-900">
        <Sidebar />
        <main className="flex-1 px-6 sm:px-8 py-8 overflow-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
