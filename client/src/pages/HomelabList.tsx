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
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {isLoading ? (
            <div className="text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => {
                const technologies = project.technologies
                  ? project.technologies.split(",").map((tech) => tech.trim())
                  : [];

                return (
                  <Card
                    key={project.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                    onClick={() => navigate(`/homelab/${project.slug}`)}
                  >
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(project.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {project.description || project.content.substring(0, 150)}...
                      </p>

                      {technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {technologies.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {technologies.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{technologies.length - 3}
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
