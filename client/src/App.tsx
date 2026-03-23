import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlogList from "./pages/AdminBlogList";
import AdminBlogForm from "./pages/AdminBlogForm";
import AdminHomelabList from "./pages/AdminHomelabList";
import AdminHomelabForm from "./pages/AdminHomelabForm";
import BlogPost from "./pages/BlogPost";
import BlogList from "./pages/BlogList";
import HomelabProject from "./pages/HomelabProject";
import HomelabList from "./pages/HomelabList";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {/* Blog Routes */}
      <Route path={"/blog"} component={BlogList} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      {/* Homelab Routes */}
      <Route path={"/homelab"} component={HomelabList} />
      <Route path={"/homelab/:slug"} component={HomelabProject} />
      {/* Admin Routes */}
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/blog"} component={AdminBlogList} />
      <Route path={"/admin/blog/:id"} component={AdminBlogForm} />
      <Route path={"/admin/homelab"} component={AdminHomelabList} />
      <Route path={"/admin/homelab/:id"} component={AdminHomelabForm} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
