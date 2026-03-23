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

export default function AdminBlogForm() {
  const { user, loading, isAuthenticated } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/admin/blog/:id");
  const postId = params?.id;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    published: false,
  });

  const { data: post, isLoading: isLoadingPost } = trpc.blog.getById.useQuery(
    { id: parseInt(postId as string) },
    { enabled: !!postId && postId !== "new" }
  );

  const createMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully");
      navigate("/admin/blog");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create blog post");
    },
  });

  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Blog post updated successfully");
      navigate("/admin/blog");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update blog post");
    },
  });

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role !== "admin") {
      navigate("/");
    }
  }, [loading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content,
        published: post.published,
      });
    }
  }, [post]);

  if (loading || isLoadingPost) {
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

    if (postId === "new") {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({
        id: parseInt(postId as string),
        data: formData,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">
            {postId === "new" ? "Create New Post" : "Edit Post"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {postId === "new" ? "Create a new blog post" : "Edit your blog post"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
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
                  placeholder="Enter post title"
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
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Brief summary of the post"
                  rows={3}
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
                  placeholder="Write your post content in markdown"
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
                  Publish this post
                </Label>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {postId === "new" ? "Create Post" : "Update Post"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/blog")}
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
