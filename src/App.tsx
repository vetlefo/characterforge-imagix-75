
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DrawingEditor from "./pages/DrawingEditor";
import WebsitePreviewDemo from "./pages/WebsitePreviewDemo";
import AssetLibraryPage from "./pages/AssetLibraryPage";
import StyleSystemPage from "./pages/StyleSystemPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/drawing" element={<DrawingEditor />} />
          <Route path="/website-preview" element={<WebsitePreviewDemo />} />
          <Route path="/asset-library" element={<AssetLibraryPage />} />
          <Route path="/style-system" element={<StyleSystemPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
