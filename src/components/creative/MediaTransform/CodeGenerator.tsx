
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Copy, Check, Send } from 'lucide-react';
import { useMediaTransform } from './MediaTransformContext';
import WebsitePreview from '../../preview/WebsitePreview';

const CodeGenerator = () => {
  const { imageUrl, setGeneratedCode } = useMediaTransform();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [code, setCode] = useState<{ html: string; css: string; js: string } | null>(null);
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});
  const [componentType, setComponentType] = useState<string>('card');

  const handleGenerateCode = async () => {
    if (!imageUrl) return;
    
    setGenerating(true);
    
    // Simulate code generation with a delay
    setTimeout(() => {
      // Mock generated code based on component type
      let generatedCode;
      
      if (componentType === 'card') {
        generatedCode = {
          html: `<div class="card">
  <div class="card-image">
    <img src="${imageUrl}" alt="Card image">
  </div>
  <div class="card-content">
    <h3 class="card-title">Card Title</h3>
    <p class="card-description">This is a description of the card content.</p>
    <button class="card-button">Learn More</button>
  </div>
</div>`,
          css: `.card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 360px;
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 16px;
}

.card-title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
}

.card-description {
  margin: 0 0 16px;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.card-button {
  display: inline-block;
  padding: 8px 16px;
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.card-button:hover {
  background-color: #3A80D2;
}`,
          js: `document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.card-button');
  
  if (button) {
    button.addEventListener('click', () => {
      alert('Button clicked!');
    });
  }
});`
        };
      } else if (componentType === 'header') {
        generatedCode = {
          html: `<header class="site-header">
  <div class="logo">
    <img src="${imageUrl}" alt="Logo" class="logo-img">
  </div>
  <nav class="main-nav">
    <ul class="nav-list">
      <li class="nav-item"><a href="#" class="nav-link">Home</a></li>
      <li class="nav-item"><a href="#" class="nav-link">About</a></li>
      <li class="nav-item"><a href="#" class="nav-link">Services</a></li>
      <li class="nav-item"><a href="#" class="nav-link">Contact</a></li>
    </ul>
  </nav>
  <button class="mobile-menu-btn">Menu</button>
</header>`,
          css: `.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 40px;
  width: auto;
}

.main-nav {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-left: 24px;
}

.nav-link {
  color: #333333;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #4A90E2;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .main-nav {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
}`,
          js: `document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.style.display = mainNav.style.display === 'flex' ? 'none' : 'flex';
    });
  }
});`
        };
      } else {
        // Default component
        generatedCode = {
          html: `<div class="component">
  <h2>Generated Component</h2>
  <img src="${imageUrl}" alt="Component image">
  <p>This is a generated component based on the image.</p>
</div>`,
          css: `.component {
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.component h2 {
  margin-top: 0;
  color: #333333;
}

.component img {
  max-width: 100%;
  border-radius: 4px;
  margin: 16px 0;
}

.component p {
  color: #666666;
  line-height: 1.5;
}`,
          js: `// No JavaScript for this component`
        };
      }
      
      setCode(generatedCode);
      setGeneratedCode(generatedCode);
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [key]: true });
    setTimeout(() => {
      setCopied({ ...copied, [key]: false });
    }, 2000);
  };

  const handleComponentTypeChange = (type: string) => {
    setComponentType(type);
    setGenerated(false);
    setCode(null);
  };

  if (!imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-[#1A1A2E] rounded-full flex items-center justify-center mb-4">
          <Code size={24} className="text-blue-400" />
        </div>
        <h3 className="text-xl font-medium mb-2">No Image Selected</h3>
        <p className="text-gray-400 mb-4">Select or upload an image to generate code from</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium">Code Generation</h3>
        <div className="flex gap-3">
          <select 
            className="bg-[#1A1A2E] border border-[#2A2A4A] rounded p-2 text-sm"
            value={componentType}
            onChange={(e) => handleComponentTypeChange(e.target.value)}
          >
            <option value="card">Card</option>
            <option value="header">Header</option>
            <option value="gallery">Gallery</option>
            <option value="form">Form</option>
          </select>
          <Button 
            onClick={handleGenerateCode} 
            disabled={generating || !imageUrl}
            className="gap-2"
          >
            <Code size={16} />
            {generating ? "Generating..." : generated ? "Re-Generate" : "Generate Code"}
          </Button>
        </div>
      </div>
      
      {generating && (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-300">Analyzing image and generating code...</p>
        </div>
      )}
      
      {code && !generating && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="w-full mb-4 bg-[#1A1A2E]">
                <TabsTrigger value="html" className="flex-1">HTML</TabsTrigger>
                <TabsTrigger value="css" className="flex-1">CSS</TabsTrigger>
                <TabsTrigger value="js" className="flex-1">JavaScript</TabsTrigger>
              </TabsList>
              
              <TabsContent value="html" className="space-y-4">
                <Card className="p-4 bg-[#1A1A2E] relative">
                  <div className="absolute top-4 right-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleCopy(code.html, 'html')} 
                      className="h-8 w-8"
                    >
                      {copied.html ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                  <pre className="overflow-auto p-4 bg-[#0F0F23] rounded-md text-sm">
                    <code>{code.html}</code>
                  </pre>
                </Card>
              </TabsContent>
              
              <TabsContent value="css" className="space-y-4">
                <Card className="p-4 bg-[#1A1A2E] relative">
                  <div className="absolute top-4 right-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleCopy(code.css, 'css')} 
                      className="h-8 w-8"
                    >
                      {copied.css ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                  <pre className="overflow-auto p-4 bg-[#0F0F23] rounded-md text-sm">
                    <code>{code.css}</code>
                  </pre>
                </Card>
              </TabsContent>
              
              <TabsContent value="js" className="space-y-4">
                <Card className="p-4 bg-[#1A1A2E] relative">
                  <div className="absolute top-4 right-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleCopy(code.js, 'js')} 
                      className="h-8 w-8"
                    >
                      {copied.js ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                  <pre className="overflow-auto p-4 bg-[#0F0F23] rounded-md text-sm">
                    <code>{code.js}</code>
                  </pre>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => handleCopy(`${code.html}\n\n<style>\n${code.css}\n</style>\n\n<script>\n${code.js}\n</script>`, 'all')}
            >
              {copied.all ? <Check size={16} /> : <Copy size={16} />}
              {copied.all ? "Copied All Code" : "Copy All Code"}
            </Button>
          </div>
          
          <div className="space-y-4">
            <Card className="p-4 bg-[#1A1A2E]">
              <h4 className="font-medium mb-4">Preview</h4>
              <div className="bg-white rounded-md overflow-hidden" style={{ height: "400px" }}>
                <WebsitePreview
                  html={code.html}
                  css={code.css}
                  js={code.js}
                  width="100%"
                  height="100%"
                />
              </div>
            </Card>
            
            <Button className="w-full gap-2">
              <Send size={16} />
              Apply to Current Project
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeGenerator;
