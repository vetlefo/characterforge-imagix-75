
import { useState } from "react";
import WebsitePreview from "@/components/preview/WebsitePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play } from "lucide-react";

const WebsitePreviewDemo = () => {
  const [html, setHtml] = useState<string>(`
<div class="container">
  <h1>Hello, WebsitePreview!</h1>
  <p>This is a responsive preview component.</p>
  <button id="demoButton">Click Me</button>
  <div class="color-box"></div>
</div>
  `);
  
  const [css, setCss] = useState<string>(`
body {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 2rem;
  line-height: 1.5;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  color: #4F46E5;
}

p {
  color: #666;
  margin-bottom: 2rem;
}

button {
  background: #4F46E5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

button:hover {
  background: #4338CA;
}

.color-box {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #4F46E5, #EC4899);
  margin: 2rem auto;
  border-radius: 8px;
  transition: transform 0.3s;
}

.color-box:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  body {
    padding: 1rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
}
  `);
  
  const [js, setJs] = useState<string>(`
document.getElementById('demoButton').addEventListener('click', function() {
  alert('Button clicked!');
  const colorBox = document.querySelector('.color-box');
  if (colorBox) {
    colorBox.style.transform = 'rotate(45deg)';
    setTimeout(() => {
      colorBox.style.transform = 'none';
    }, 1000);
  }
});
  `);

  const [previewHtml, setPreviewHtml] = useState(html);
  const [previewCss, setPreviewCss] = useState(css);
  const [previewJs, setPreviewJs] = useState(js);

  const handleUpdatePreview = () => {
    setPreviewHtml(html);
    setPreviewCss(css);
    setPreviewJs(js);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F23]">
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Website Preview Demo</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#0A0A1B]/70 backdrop-blur-md rounded-2xl p-4 border border-[#2A2A4A]/30">
                <Tabs defaultValue="html">
                  <TabsList className="mb-4 bg-[#1A1A2E]/50">
                    <TabsTrigger value="html">HTML</TabsTrigger>
                    <TabsTrigger value="css">CSS</TabsTrigger>
                    <TabsTrigger value="js">JavaScript</TabsTrigger>
                  </TabsList>
                  <TabsContent value="html" className="mt-0">
                    <Textarea
                      value={html}
                      onChange={(e) => setHtml(e.target.value)}
                      className="min-h-[300px] font-mono text-sm bg-[#1A1A2E]/50 border-[#2A2A4A]"
                    />
                  </TabsContent>
                  <TabsContent value="css" className="mt-0">
                    <Textarea
                      value={css}
                      onChange={(e) => setCss(e.target.value)}
                      className="min-h-[300px] font-mono text-sm bg-[#1A1A2E]/50 border-[#2A2A4A]"
                    />
                  </TabsContent>
                  <TabsContent value="js" className="mt-0">
                    <Textarea
                      value={js}
                      onChange={(e) => setJs(e.target.value)}
                      className="min-h-[300px] font-mono text-sm bg-[#1A1A2E]/50 border-[#2A2A4A]"
                    />
                  </TabsContent>
                </Tabs>
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={handleUpdatePreview}
                    className="gap-2 bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Play size={16} />
                    Update Preview
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <WebsitePreview 
                html={previewHtml} 
                css={previewCss} 
                js={previewJs} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsitePreviewDemo;
