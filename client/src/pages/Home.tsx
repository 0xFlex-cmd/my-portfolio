import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  
  let user, loading, isAuthenticated;
  try {
    const auth = useAuth();
    user = auth.user;
    loading = auth.loading;
    isAuthenticated = auth.isAuthenticated;
  } catch (e) {
    user = null;
    loading = false;
    isAuthenticated = false;
  }

  const { data: blogPosts } = trpc.blog.list.useQuery({ published: true });
  const { data: homelabProjects } = trpc.homelab.list.useQuery({ published: true });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Transparent Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white">
              A
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Alaa Atef
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#about" className="text-sm font-medium hover:text-cyan-400 transition-colors">
              About
            </a>
            <a href="#experience" className="text-sm font-medium hover:text-cyan-400 transition-colors">
              Experience
            </a>
            <a href="#skills" className="text-sm font-medium hover:text-cyan-400 transition-colors">
              Skills
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-cyan-400 transition-colors">
              Contact
            </a>
            <div className="flex gap-2">
              {isAuthenticated && user?.role === "admin" && (
                <Button size="sm" onClick={() => navigate("/admin")} className="bg-cyan-500 hover:bg-cyan-600">
                  Admin
                </Button>
              )}
              {!isAuthenticated && !loading && (
                <Button size="sm" onClick={() => {
                  try {
                    window.location.href = getLoginUrl();
                  } catch (e) {
                    console.error('OAuth not configured');
                  }
                }} className="bg-cyan-500 hover:bg-cyan-600">
                  Sign In
                </Button>
              )}
              {isAuthenticated && (
                <Button size="sm" variant="outline" onClick={() => navigate("/")}>
                  {user?.name}
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-background/50 backdrop-blur-md">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#about" className="text-sm font-medium hover:text-cyan-400 transition-colors">
                About
              </a>
              <a href="#experience" className="text-sm font-medium hover:text-cyan-400 transition-colors">
                Experience
              </a>
              <a href="#skills" className="text-sm font-medium hover:text-cyan-400 transition-colors">
                Skills
              </a>
              <a href="#contact" className="text-sm font-medium hover:text-cyan-400 transition-colors">
                Contact
              </a>
              <div className="flex gap-2 pt-2">
                {isAuthenticated && user?.role === "admin" && (
                  <Button size="sm" onClick={() => navigate("/admin")} className="bg-cyan-500 hover:bg-cyan-600 flex-1">
                    Admin
                  </Button>
                )}
                {!isAuthenticated && !loading && (
                  <Button size="sm" onClick={() => {
                    try {
                      window.location.href = getLoginUrl();
                    } catch (e) {
                      console.error('OAuth not configured');
                    }
                  }} className="bg-cyan-500 hover:bg-cyan-600 flex-1">
                    Sign In
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        {/* Hero Section - Full Screen */}
        <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                      Alaa Atef Elsayed Ahmed
                    </span>
                  </h2>
                  <p className="text-2xl font-semibold text-cyan-400">
                    Cybersecurity SOC Analyst
                  </p>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                  Hands-on cybersecurity professional specializing in threat intelligence, incident response, and digital forensics. Currently working at THE WHITEGUARD with expertise in SIEM operations, detection engineering, and proactive defense strategies.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    size="lg"
                    onClick={() => navigate("/blog")}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
                  >
                    Get In Touch
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/blog")}
                    className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    View CV <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Social Links */}
                <div className="flex gap-4 pt-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-cyan-500/30 flex items-center justify-center transition-colors">
                    <span className="text-sm">in</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-cyan-500/30 flex items-center justify-center transition-colors">
                    <span className="text-sm">gh</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-cyan-500/30 flex items-center justify-center transition-colors">
                    <span className="text-sm">tw</span>
                  </a>
                </div>
              </div>

              {/* Right Content - Profile Image */}
              <div className="hidden md:flex justify-center items-center">
                <div className="relative w-80 h-80">
                  {/* Animated Border Circle */}
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-500/50 animate-spin" style={{ animationDuration: '20s' }}></div>
                  <div className="absolute inset-4 rounded-full border border-blue-500/30"></div>

                  {/* Profile Image Container */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-600/10 flex items-center justify-center">
                      <div className="text-6xl font-bold text-cyan-400/30">A</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-sm text-gray-400">Scroll to explore</span>
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

        {/* Professional Summary Section */}
        <section id="about" className="py-20 border-t border-white/10">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Professional Summary
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Core Strengths</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-300">
                    Threat Intelligence & Analysis, SIEM Operations, Incident Response, Digital Forensics, Security Monitoring
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Technologies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-300">
                    Elastic Stack (ELK), Palo Alto Cortex, Splunk, Wireshark, Metasploit, Linux, Windows Security
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Latest Write-ups Section */}
        <section id="experience" className="py-20 border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Latest Write-ups
                </span>
              </h3>
              <Button variant="outline" onClick={() => navigate("/blog")} className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {blogPosts && blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.slice(0, 3).map((post) => (
                  <Card
                    key={post.id}
                    className="cursor-pointer bg-white/5 border-white/10 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all group overflow-hidden"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    {post.imageUrl && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-xl">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags?.split(",").map((tag) => (
                          <span key={tag} className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                      <CardTitle className="line-clamp-2 text-white group-hover:text-cyan-400 transition-colors">
                        {post.title}
                      </CardTitle>
                      <p className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 line-clamp-3">
                        {post.excerpt || post.content.substring(0, 100)}...
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-400">No write-ups yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Homelab Projects Section */}
        <section id="skills" className="py-20 border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Homelab Projects
                </span>
              </h3>
              <Button variant="outline" onClick={() => navigate("/homelab")} className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {homelabProjects && homelabProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {homelabProjects.slice(0, 2).map((project) => (
                  <Card
                    key={project.id}
                    className="cursor-pointer bg-white/5 border-white/10 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all group overflow-hidden"
                    onClick={() => navigate(`/homelab/${project.slug}`)}
                  >
                    {project.imageUrl && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-xl">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.tags?.split(",").map((tag) => (
                          <span key={tag} className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                      <CardTitle className="line-clamp-2 text-white group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </CardTitle>
                      <p className="text-xs text-gray-400">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {project.description || project.content.substring(0, 100)}...
                      </p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.split(",").map(tech => (
                            <span key={tech} className="text-[10px] border border-cyan-500/30 px-1.5 py-0.5 rounded text-cyan-300">
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
              <Card className="bg-white/5 border-white/10">
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-400">No Homelab projects yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 border-t border-white/10">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Let's Connect
              </span>
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Interested in discussing cybersecurity, threat intelligence, or collaboration opportunities? Feel free to reach out.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold">
              Send Me an Email
            </Button>
          </div>
        </section>
      </main>

      {/* Floating Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md bg-background/30 border-t border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center text-sm text-gray-400">
          <p>&copy; 2024 Alaa Atef. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>

      {/* Add custom animations */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
