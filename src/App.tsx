
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import GraphIntegrationDemo from "./pages/GraphIntegrationDemo";
import SvelteIntegrationDemo from "./pages/SvelteIntegrationDemo";
import IntentTranslatorDemo from "./pages/IntentTranslatorDemo";
import Index from "./pages/Index";
import Drawing from "./pages/Drawing";
import Styling from "./pages/Styling";
import Animation from "./pages/Animation";
import Website from "./pages/Website";
import Media from "./pages/Media";
import WebsitePreviewDemo from "./pages/WebsitePreviewDemo";
import AssetLibraryPage from "./pages/AssetLibraryPage";
import StyleSystemPage from "./pages/StyleSystemPage";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Integrations from "./pages/Integrations";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DependencyVisualizerPage from "./pages/DependencyVisualizerPage";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

// Routes configuration
const routes = [
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/drawing",
    element: <Drawing />,
  },
  {
    path: "/styling",
    element: <Styling />,
  },
  {
    path: "/animation",
    element: <Animation />,
  },
  {
    path: "/website",
    element: <Website />,
  },
  {
    path: "/media",
    element: <Media />,
  },
  {
    path: "/dependency-visualizer",
    element: <DependencyVisualizerPage />,
  },
  {
    path: "/website-preview-demo",
    element: <WebsitePreviewDemo />,
  },
  {
    path: "/graph-integration-demo",
    element: <GraphIntegrationDemo />,
  },
  {
    path: "/svelte-integration-demo",
    element: <SvelteIntegrationDemo />,
  },
  {
    path: "/intent-translator-demo",
    element: <IntentTranslatorDemo />,
  },
  {
    path: "/asset-library",
    element: <AssetLibraryPage />,
  },
  {
    path: "/style-system",
    element: <StyleSystemPage />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/integrations",
    element: <Integrations />,
  },
  {
    path: "/auth",
    element: <Auth />,
  }
];

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={createBrowserRouter(routes)} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
