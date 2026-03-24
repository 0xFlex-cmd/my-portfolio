import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HomelabList() {
  const [, navigate] = useLocation();

  const { data: projects, isLoading } = trpc.homelab.list.useQuery({ published: true });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Homelab Projects</h1>
          <p className="text-muted-foreground mt-2">
            Explore my Homelab and infrastructure projects
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => {
                const technologies = project.technologies
                  ? project.technologies.split(",").map((tech) => tech.trim())
                  : [];

                return (
                  <Card
                    key={project.id}
                    className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden flex flex-col border-none bg-card/50 backdrop-blur-sm group"
                    onClick={() => navigate(`/homelab/${project.slug}`)}
                  >
                    {project.imageUrl && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                    )}
                    <CardHeader className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags?.split(",").map((tag) => (
                          <span key={tag} className="text-[10px] bg-secondary/30 text-secondary-foreground px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                      <CardTitle className="line-clamp-2 text-xl mb-1">{project.title}</CardTitle>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">
                        {new Date(project.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                        {project.description || project.content.substring(0, 150)}...
                      </p>

                      {technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {technologies.slice(0, 4).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-[10px] font-normal">
                              {tech}
                            </Badge>
                          ))}
                          {technologies.length > 4 && (
                            <Badge variant="outline" className="text-[10px] font-normal">
                              +{technologies.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No Homelab projects yet</p>
              </CardContent>
            </Card>
          )}
        </div>
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
