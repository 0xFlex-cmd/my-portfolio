import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Trash2, Edit, Plus } from "lucide-react";
import { toast } from "sonner";

export default function AdminHomelabList() {
  const { user, loading, isAuthenticated } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const [, navigate] = useLocation();

  const { data: projects, isLoading, refetch } = trpc.homelab.list.useQuery({});
  const deleteMutation = trpc.homelab.delete.useMutation({
    onSuccess: () => {
      toast.success("Homelab project deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete Homelab project");
    },
  });

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role !== "admin") {
      navigate("/");
    }
  }, [loading, isAuthenticated, user, navigate]);

  if (loading || isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center min-h-screen">Loading...</div></DashboardLayout>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <DashboardLayout><div className="flex items-center justify-center min-h-screen">Access Denied</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Homelab Projects</h1>
            <p className="text-muted-foreground mt-2">
              Manage your Homelab projects
            </p>
          </div>
          <Button onClick={() => navigate("/admin/homelab/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="space-y-4">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {project.published ? "Published" : "Draft"} • {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/homelab/${project.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this project?")) {
                            deleteMutation.mutate({ id: project.id });
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description || project.content.substring(0, 100)}...
                  </p>
                  {project.technologies && (
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Tech:</strong> {project.technologies}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">No Homelab projects yet</p>
                <Button onClick={() => navigate("/admin/homelab/new")}>
                  Create your first project
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
