import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Drawing from "./pages/Drawing";
import Styling from "./pages/Styling";
import Animation from "./pages/Animation";
import Website from "./pages/Website";
import Media from "./pages/Media";
import GraphIntegrationDemo from "./pages/GraphIntegrationDemo";
import SvelteIntegrationDemo from "./pages/SvelteIntegrationDemo";
import IntentTranslatorDemo from "./pages/IntentTranslatorDemo";

function App() {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: <Layout />,
          errorElement: <NotFound />,
          children: [
            {
              index: true,
              element: <Home />,
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
              path: "/graph-integration-demo",
              element: <GraphIntegrationDemo />,
            },
            {
              path: "/svelte-integration-demo",
              element: <SvelteIntegrationDemo />,
            },
            { 
              path: "/intent-translator-demo", 
              element: <IntentTranslatorDemo /> 
            },
          ],
        },
      ])}
    />
  );
}

export default App;
