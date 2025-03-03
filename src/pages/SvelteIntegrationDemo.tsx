import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SvelteConversationIntegration from '@/components/creative/SvelteIntegration';

/**
 * This demo page showcases the integration of Svelte components in our React application
 * using the Svelte Anywhere approach. It demonstrates how we can build complex UI components
 * in Svelte while maintaining full compatibility with our React-based application.
 */
const SvelteIntegrationDemo = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Svelte Integration Demo</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="p-6 h-[600px]">
            <Tabs defaultValue="conversation">
              <TabsList className="mb-4">
                <TabsTrigger value="conversation">Conversation Interface</TabsTrigger>
                <TabsTrigger value="about">About This Demo</TabsTrigger>
              </TabsList>
              
              <TabsContent value="conversation" className="h-[520px]">
                <SvelteConversationIntegration />
              </TabsContent>
              
              <TabsContent value="about">
                <div className="prose dark:prose-invert">
                  <h3>Why Svelte + React?</h3>
                  <p>
                    This demo showcases how we can leverage Svelte's excellent component model
                    for specific UI components while maintaining our React application architecture.
                  </p>
                  
                  <h3>Benefits of This Approach</h3>
                  <ul>
                    <li>
                      <strong>Performance</strong>: Svelte compiles to highly optimized vanilla JS with minimal runtime overhead
                    </li>
                    <li>
                      <strong>Animation</strong>: Built-in transition and animation capabilities
                    </li>
                    <li>
                      <strong>Reduced Complexity</strong>: Simpler reactivity model with less boilerplate
                    </li>
                    <li>
                      <strong>Portability</strong>: Components can be used in any frontend framework, not just React
                    </li>
                  </ul>
                  
                  <h3>How It Works</h3>
                  <p>
                    We're using the <code>Svelte Anywhere</code> approach, which compiles Svelte components
                    to Web Components (Custom Elements). These components can then be used directly in our
                    React JSX, just like any HTML element.
                  </p>
                  
                  <h3>Architecture</h3>
                  <p>
                    The components maintain proper bidirectional communication with our React application:
                  </p>
                  <ul>
                    <li>React context and state management remains as the source of truth</li>
                    <li>Svelte components dispatch events that React listens for</li>
                    <li>React can call methods exposed by the Svelte components</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        <div className="lg:col-span-4">
          <Card className="p-6 h-[600px] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Implementation Notes</h2>
            
            <div className="prose dark:prose-invert text-sm">
              <h3>Required Setup</h3>
              <p>
                To make this work in a production environment, you would need:
              </p>
              <ol>
                <li>Vite + Svelte setup with the Svelte Anywhere plugin</li>
                <li>Build process that generates the custom elements</li>
                <li>Proper loading of the compiled JS</li>
              </ol>
              
              <h3>Advantages for Our Project</h3>
              <p>
                This approach is particularly useful for our conversation interface because:
              </p>
              <ul>
                <li>It provides smooth animations and transitions</li>
                <li>The typing indicator and message bubbles benefit from Svelte's simple animation system</li>
                <li>Complex interactive elements are easier to build with Svelte's reactivity</li>
                <li>The interface could be embedded in other applications</li>
              </ul>
              
              <h3>Integration with CreativeContext</h3>
              <p>
                The demo shows how we maintain integration with our CreativeContext:
              </p>
              <ul>
                <li>User messages are processed through our intent translation system</li>
                <li>The creative intent is processed by our creative context</li>
                <li>Results are displayed back in the Svelte component</li>
                <li>The conversation history is maintained in both systems</li>
              </ul>
              
              <h3>Next Steps</h3>
              <p>
                To fully implement this approach, we would need to:
              </p>
              <ol>
                <li>Create a dedicated build process for Svelte components</li>
                <li>Develop a complete set of conversation components</li>
                <li>Ensure proper theming and styling integration</li>
                <li>Add support for rich content like images, code, and interactive elements</li>
              </ol>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SvelteIntegrationDemo;