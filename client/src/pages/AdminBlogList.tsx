import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Trash2, Edit, Plus } from "lucide-react";
import { toast } from "sonner";

export default function AdminBlogList() {
  const { user, loading, isAuthenticated } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const [, navigate] = useLocation();

  const { data: posts, isLoading, refetch } = trpc.blog.list.useQuery({});
  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Write-up deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete write-up");
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
            <h1 className="text-3xl font-bold">Write-ups</h1>
            <p className="text-muted-foreground mt-2">
              Manage your write-ups
            </p>
          </div>
          <Button onClick={() => navigate("/admin/blog/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        <div className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {post.published ? "Published" : "Draft"} • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/blog/${post.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this post?")) {
                            deleteMutation.mutate({ id: post.id });
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
                    {post.excerpt || post.content.substring(0, 100)}...
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">No write-ups yet</p>
                <Button onClick={() => navigate("/admin/blog/new")}>
                  Create your first post
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
