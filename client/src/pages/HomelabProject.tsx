import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";
import { ArrowLeft, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HomelabProject() {
  const [match, params] = useRoute("/homelab/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug;

  const { data: project, isLoading, error } = trpc.homelab.getBySlug.useQuery(
    { slug: slug as string },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const technologies = project.technologies
    ? project.technologies.split(",").map((tech) => tech.trim())
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <article className="container mx-auto px-4 py-12 max-w-3xl">
          {/* Project Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>

            <div className="flex items-center gap-4 text-muted-foreground mb-6">
              <time dateTime={project.createdAt.toString()}>
                {new Date(project.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {project.updatedAt !== project.createdAt && (
                <span>
                  Updated{" "}
                  {new Date(project.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            {project.description && (
              <p className="text-lg text-muted-foreground mb-6">
                {project.description}
              </p>
            )}

            {/* Technologies */}
            {technologies.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4" />
                  <span className="font-semibold">Technologies</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* Project Content */}
          <div className="prose dark:prose-invert max-w-none">
            <Streamdown>{project.content}</Streamdown>
          </div>
        </article>
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
