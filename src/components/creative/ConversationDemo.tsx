
import React, { useState } from "react";
import ConversationMessage from "./ConversationMessage";
import { Button } from "@/components/ui/button";

const ConversationDemo = () => {
  const [brightness, setBrightness] = useState([50]);
  const [showAdditionalMessage, setShowAdditionalMessage] = useState(false);

  return (
    <div className="space-y-4 mb-8">
      <ConversationMessage
        sender="assistant"
        content={[
          { 
            type: "text", 
            content: "# Welcome to the Creative Space\n\nI notice you're exploring **fluid landscapes**. Would you like to continue this exploration?" 
          }
        ]}
      />
      
      <ConversationMessage
        sender="user"
        content={[
          { 
            type: "text", 
            content: "Yes, I'd like to create something with organic flowing forms and vibrant colors." 
          }
        ]}
      />
      
      <ConversationMessage
        sender="assistant"
        content={[
          { 
            type: "text", 
            content: "I can help with that! Here's an example of a fluid landscape that might inspire you:" 
          },
          { 
            type: "image", 
            src: "/lovable-uploads/e9db2be9-f0a3-4506-b387-ce20bea67ba9.png", 
            alt: "Fluid landscape",
            caption: "A vibrant fluid landscape with organic flowing forms" 
          },
          { 
            type: "text", 
            content: "You can adjust the brightness of your canvas using this slider:" 
          },
          {
            type: "slider",
            min: 0,
            max: 100,
            defaultValue: brightness,
            onValueChange: setBrightness,
            label: `Brightness: ${brightness}%`
          },
          {
            type: "button",
            label: "See another example",
            onClick: () => setShowAdditionalMessage(true),
            variant: "outline"
          }
        ]}
      />

      {showAdditionalMessage && (
        <ConversationMessage
          sender="assistant"
          content={[
            { 
              type: "text", 
              content: "Here's another example you might find inspiring:" 
            },
            { 
              type: "image", 
              src: "/lovable-uploads/fa140a1b-cb9d-457c-a7ca-e630a9052d31.png", 
              alt: "Another fluid landscape",
              caption: "Another approach to fluid landscapes with different color palette" 
            },
            {
              type: "code",
              content: "// Example code for creating a fluid effect\nconst canvas = document.getElementById('canvas');\nconst ctx = canvas.getContext('2d');\n\nfunction drawFluidShape() {\n  // Create flowing organic shapes\n  ctx.beginPath();\n  ctx.moveTo(20, 20);\n  ctx.bezierCurveTo(90, 30, 120, 60, 100, 100);\n  ctx.bezierCurveTo(80, 140, 30, 110, 20, 20);\n  ctx.fillStyle = 'rgba(75, 0, 130, 0.7)';\n  ctx.fill();\n}"
            },
            {
              type: "button",
              label: "Start Drawing",
              onClick: () => console.log("Start drawing clicked"),
              variant: "default"
            }
          ]}
        />
      )}
    </div>
  );
};

export default ConversationDemo;
