
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import GraphIntegrationDemo from "./pages/GraphIntegrationDemo";
import SvelteIntegrationDemo from "./pages/SvelteIntegrationDemo";
import IntentTranslatorDemo from "./pages/IntentTranslatorDemo";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Drawing from "./pages/Drawing";
import Styling from "./pages/Styling";
import Animation from "./pages/Animation";
import Website from "./pages/Website";
import Media from "./pages/Media";
import WebsitePreviewDemo from "./pages/WebsitePreviewDemo";

// Routes configuration with Layout wrapper
const routes = [
  {
    path: "/",
    element: <Layout><Index /></Layout>,
    errorElement: <NotFound />,
  },
  {
    path: "/drawing",
    element: <Layout><Drawing /></Layout>,
  },
  {
    path: "/styling",
    element: <Layout><Styling /></Layout>,
  },
  {
    path: "/animation",
    element: <Layout><Animation /></Layout>,
  },
  {
    path: "/website",
    element: <Layout><Website /></Layout>,
  },
  {
    path: "/media",
    element: <Layout><Media /></Layout>,
  },
  {
    path: "/website-preview-demo",
    element: <Layout><WebsitePreviewDemo /></Layout>,
  },
  {
    path: "/graph-integration-demo",
    element: <Layout><GraphIntegrationDemo /></Layout>,
  },
  {
    path: "/svelte-integration-demo",
    element: <Layout><SvelteIntegrationDemo /></Layout>,
  },
  { 
    path: "/intent-translator-demo", 
    element: <Layout><IntentTranslatorDemo /></Layout>,
  },
];

function App() {
  return <RouterProvider router={createBrowserRouter(routes)} />;
}

export default App;
