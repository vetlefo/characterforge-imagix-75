
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import GraphIntegrationDemo from "./pages/GraphIntegrationDemo";
import SvelteIntegrationDemo from "./pages/SvelteIntegrationDemo";
import IntentTranslatorDemo from "./pages/IntentTranslatorDemo";

// We'll create a simple Layout component since the original can't be found
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            <a href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Creative Canvas</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
    <main className="flex-1">{children}</main>
  </div>
);

// Create a simple Home component
const Home = () => (
  <div className="container py-10">
    <h1 className="text-3xl font-bold mb-6">Creative Canvas Platform</h1>
    <p className="mb-4">Welcome to the Creative Canvas platform. This application demonstrates various creative tools and interfaces.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <a href="/intent-translator-demo" className="p-6 rounded-lg border hover:shadow-md transition-all">
        <h2 className="text-xl font-semibold mb-2">Intent Translator</h2>
        <p className="text-gray-600">Translate natural language into structured intents</p>
      </a>
      <a href="/graph-integration-demo" className="p-6 rounded-lg border hover:shadow-md transition-all">
        <h2 className="text-xl font-semibold mb-2">Graph Integration</h2>
        <p className="text-gray-600">Explore the graph database integration</p>
      </a>
      <a href="/svelte-integration-demo" className="p-6 rounded-lg border hover:shadow-md transition-all">
        <h2 className="text-xl font-semibold mb-2">Svelte Integration</h2>
        <p className="text-gray-600">See the Svelte framework integration</p>
      </a>
    </div>
  </div>
);

// Create placeholders for the missing pages
const Drawing = () => <div className="container py-10"><h1 className="text-3xl font-bold">Drawing Tool</h1><p>This is a placeholder for the Drawing tool.</p></div>;
const Styling = () => <div className="container py-10"><h1 className="text-3xl font-bold">Styling Tool</h1><p>This is a placeholder for the Styling tool.</p></div>;
const Animation = () => <div className="container py-10"><h1 className="text-3xl font-bold">Animation Tool</h1><p>This is a placeholder for the Animation tool.</p></div>;
const Website = () => <div className="container py-10"><h1 className="text-3xl font-bold">Website Tool</h1><p>This is a placeholder for the Website tool.</p></div>;
const Media = () => <div className="container py-10"><h1 className="text-3xl font-bold">Media Tool</h1><p>This is a placeholder for the Media tool.</p></div>;

function App() {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: <Layout><Home /></Layout>,
          errorElement: <NotFound />,
          children: [],
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
      ])}
    />
  );
}

export default App;
