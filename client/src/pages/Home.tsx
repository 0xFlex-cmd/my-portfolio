import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data: blogPosts } = trpc.blog.list.useQuery({ published: true });
  const { data: homelabProjects } = trpc.homelab.list.useQuery({ published: true });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Portfolio</h1>
          <div className="flex gap-2">
            {isAuthenticated && user?.role === "admin" && (
              <Button onClick={() => navigate("/admin")}>Admin Dashboard</Button>
            )}
            {!isAuthenticated && !loading && (
              <Button onClick={() => (window.location.href = getLoginUrl())}>
                Sign In
              </Button>
            )}
            {isAuthenticated && (
              <Button variant="outline" onClick={() => navigate("/")}>
                {user?.name}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-4">Welcome</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore my write-ups and Homelab projects. I share insights about technology,
              infrastructure, and personal projects.
            </p>
          </div>
        </section>

        {/* Write-ups Section */}
        <section className="border-b py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold">Latest Write-ups</h3>
              <Button variant="outline" onClick={() => navigate("/blog")}>
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {blogPosts && blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.slice(0, 3).map((post) => (
                  <Card
                    key={post.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    {post.imageUrl && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-xl">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags?.split(",").map((tag) => (
                          <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {post.excerpt || post.content.substring(0, 100)}...
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No write-ups yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Homelab Projects Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold">Homelab Projects</h3>
              <Button variant="outline" onClick={() => navigate("/homelab")}>
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {homelabProjects && homelabProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {homelabProjects.slice(0, 2).map((project) => (
                  <Card
                    key={project.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/homelab/${project.slug}`)}
                  >
                    {project.imageUrl && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-xl">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.tags?.split(",").map((tag) => (
                          <span key={tag} className="text-[10px] bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                      <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description || project.content.substring(0, 100)}...
                      </p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.split(",").map(tech => (
                            <span key={tech} className="text-[10px] border px-1.5 py-0.5 rounded text-muted-foreground">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No Homelab projects yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 My Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
