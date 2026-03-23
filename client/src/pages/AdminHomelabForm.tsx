import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useLocation, useRoute } from "wouter";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminHomelabForm() {
  const { user, loading, isAuthenticated } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/admin/homelab/:id");
  const projectId = params?.id;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    technologies: "",
    published: false,
  });

  const { data: project, isLoading: isLoadingProject } = trpc.homelab.getById.useQuery(
    { id: parseInt(projectId as string) },
    { enabled: !!projectId && projectId !== "new" }
  );

  const createMutation = trpc.homelab.create.useMutation({
    onSuccess: () => {
      toast.success("Homelab project created successfully");
      navigate("/admin/homelab");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create Homelab project");
    },
  });

  const updateMutation = trpc.homelab.update.useMutation({
    onSuccess: () => {
      toast.success("Homelab project updated successfully");
      navigate("/admin/homelab");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update Homelab project");
    },
  });

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role !== "admin") {
      navigate("/");
    }
  }, [loading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        slug: project.slug,
        description: project.description || "",
        content: project.content,
        technologies: project.technologies || "",
        published: project.published,
      });
    }
  }, [project]);

  if (loading || isLoadingProject) {
    return <DashboardLayout><div className="flex items-center justify-center min-h-screen">Loading...</div></DashboardLayout>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <DashboardLayout><div className="flex items-center justify-center min-h-screen">Access Denied</div></DashboardLayout>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (projectId === "new") {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({
        id: parseInt(projectId as string),
        data: formData,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">
            {projectId === "new" ? "Create New Project" : "Edit Project"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {projectId === "new" ? "Create a new Homelab project" : "Edit your Homelab project"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="url-friendly-slug"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of the project"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) =>
                    setFormData({ ...formData, technologies: e.target.value })
                  }
                  placeholder="e.g., Docker, Kubernetes, Proxmox"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content * (Markdown)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Write your project details in markdown"
                  rows={12}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked as boolean })
                  }
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Publish this project
                </Label>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {projectId === "new" ? "Create Project" : "Update Project"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/homelab")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
