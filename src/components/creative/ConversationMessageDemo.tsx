
import React, { useState } from "react";
import { 
  ConversationMessage, 
  MessageGroupContainer,
  InteractiveMessageElement
} from "./ConversationMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const ConversationMessageDemo: React.FC = () => {
  const [color, setColor] = useState("#ff5500");
  const [size, setSize] = useState(100);
  
  // Example message group
  const messageGroup = {
    id: "group-1",
    title: "Drawing Instructions",
    messages: [
      {
        id: "msg-1",
        sender: "user",
        content: { type: "text", content: "Create a red circle in the center of the canvas" },
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: "msg-2",
        sender: "assistant",
        content: [
          { type: "text", content: "I'll create a red circle for you. What size would you like it to be?" },
          { 
            type: "slider", 
            min: 10, 
            max: 300, 
            defaultValue: [100], 
            onValueChange: (value) => setSize(value[0]),
            label: "Circle Size"
          }
        ],
        timestamp: new Date(Date.now() - 240000)
      },
      {
        id: "msg-3",
        sender: "user",
        content: { type: "text", content: "Make it 150px wide" },
        timestamp: new Date(Date.now() - 180000)
      }
    ]
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Enhanced Conversation Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="individual">
          <TabsList className="mb-4">
            <TabsTrigger value="individual">Individual Messages</TabsTrigger>
            <TabsTrigger value="group">Message Groups</TabsTrigger>
            <TabsTrigger value="interactive">Interactive Elements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual">
            <div className="space-y-4">
              <ConversationMessage
                id="msg-a"
                sender="user"
                content={{ type: "text", content: "I want to create a new website with a dark theme" }}
              />
              
              <ConversationMessage
                id="msg-b"
                sender="assistant"
                content={{ type: "text", content: "Great choice! Here's a preview of a dark-themed website I created based on your request:" }}
              />
              
              <ConversationMessage
                id="msg-c"
                sender="assistant"
                content={[
                  { type: "text", content: "I've also prepared some code for you:" },
                  { 
                    type: "code", 
                    content: `// Dark theme styles
const darkTheme = {
  background: '#121212',
  text: '#ffffff',
  primary: '#bb86fc',
  secondary: '#03dac6',
  error: '#cf6679'
};` 
                  }
                ]}
                visualIndicator="info"
              />
              
              <ConversationMessage
                id="msg-d"
                sender="user"
                content={{ type: "text", content: "Can you change the primary color to something more blue?" }}
                referencesMessageId="msg-c"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="group">
            <MessageGroupContainer group={messageGroup} />
          </TabsContent>
          
          <TabsContent value="interactive">
            <ConversationMessage
              id="interactive-1"
              sender="assistant"
              content={[
                { type: "text", content: "Here are some interactive controls you can use to customize your design:" }
              ]}
            />
            
            <Card className="mt-4 bg-[#1A1A2E] border border-[#2A2A4A]/50 text-white">
              <CardContent className="p-4">
                <InteractiveMessageElement 
                  label="Color Selection" 
                  tooltip="Choose a color for your design element"
                >
                  <div className="flex gap-2 items-center">
                    <Input 
                      type="color" 
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-10 p-1 bg-transparent"
                    />
                    <Input 
                      type="text" 
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-32"
                    />
                    <div 
                      className="w-8 h-8 rounded-full ml-2" 
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </InteractiveMessageElement>
                
                <InteractiveMessageElement 
                  label="Size Adjustment" 
                  tooltip="Adjust the size of your element"
                >
                  <div className="flex gap-4 items-center">
                    <Slider
                      min={10}
                      max={300}
                      step={1}
                      defaultValue={[size]}
                      onValueChange={(value) => setSize(value[0])}
                      className="w-full"
                    />
                    <span className="text-sm w-12 text-right">{size}px</span>
                  </div>
                </InteractiveMessageElement>
                
                <InteractiveMessageElement label="Preview">
                  <div className="flex justify-center items-center p-4 bg-[#0A0A1B] rounded-lg">
                    <div 
                      style={{ 
                        width: `${size}px`, 
                        height: `${size}px`, 
                        backgroundColor: color,
                        borderRadius: '50%'
                      }} 
                    />
                  </div>
                </InteractiveMessageElement>
                
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline">Reset</Button>
                  <Button>Apply Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ConversationMessageDemo;
