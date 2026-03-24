import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role !== "admin") {
      navigate("/");
    }
  }, [loading, isAuthenticated, user, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.name}! Manage your write-ups and Homelab projects here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-2">Write-ups</h2>
            <p className="text-muted-foreground mb-4">
              Create, edit, and manage your write-ups.
            </p>
            <a
              href="/admin/blog"
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Manage Write-ups
            </a>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-2">Homelab Projects</h2>
            <p className="text-muted-foreground mb-4">
              Create, edit, and manage your Homelab projects.
            </p>
            <a
              href="/admin/homelab"
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Manage Homelab
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
