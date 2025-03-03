
import React, { useState } from 'react';
import { useMediaTransform } from './MediaTransformContext';
import { useCreative } from '../CreativeContext';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Code, Copy, Check, FileCode, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { WebsitePreview } from '../../preview/WebsitePreview';

interface CodeGeneratorProps {
  assetId?: string;
  onCodeGenerated?: (codeId: string) => void;
}

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({
  assetId,
  onCodeGenerated
}) => {
  const { generateCodeFromVisual, generatedCode, isProcessing } = useMediaTransform();
  const { assets, selectedAssetId, addAsset, createRelationship } = useCreative();
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('preview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Get the asset from the selected asset or use the provided assetId
  const effectiveAssetId = assetId || selectedAssetId;
  const selectedAsset = effectiveAssetId 
    ? assets.find(asset => asset.id === effectiveAssetId)
    : null;

  const handleGenerateCode = async () => {
    if (!selectedAsset) {
      toast.error('No asset selected for code generation');
      return;
    }
    
    // Simulate progress updates
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      const generatedCodeResult = await generateCodeFromVisual(selectedAsset);
      setProgress(100);
      
      toast.success('Code generated successfully');
      
      // Create a new text asset with the generated code
      const newAsset = addAsset(
        'text',
        JSON.stringify({
          html: generatedCodeResult.html,
          css: generatedCodeResult.css,
          js: generatedCodeResult.js || ''
        }),
        ['generated', 'code', 'html', 'css'],
        { generatedFrom: selectedAsset.id, generatedAt: new Date() }
      );
      
      // Create a relationship between the source asset and the generated code
      createRelationship(
        selectedAsset.id,
        newAsset.id,
        'iteration',
        8,
        { transformationType: 'code-generation' }
      );
      
      if (onCodeGenerated) {
        onCodeGenerated(generatedCodeResult.id);
      }
      
      // Reset progress after a delay
      setTimeout(() => setProgress(0), 1000);
    } catch (error) {
      toast.error('Failed to generate code');
      setProgress(0);
    } finally {
      clearInterval(interval);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    toast.success(`Copied ${type} to clipboard`);
    
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {selectedAsset && selectedAsset.type === 'image' ? (
          <div className="rounded-lg overflow-hidden border border-border w-24 h-24 flex-shrink-0">
            <img 
              src={selectedAsset.content} 
              alt="Source asset" 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-muted w-24 h-24 flex items-center justify-center flex-shrink-0">
            <FileCode className="text-muted-foreground" size={24} />
          </div>
        )}
        
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-medium">Code Generator</h3>
          <p className="text-sm text-muted-foreground">
            Generate HTML, CSS, and JavaScript from visual elements
          </p>
          
          {progress > 0 && (
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
        
        <Button
          onClick={handleGenerateCode}
          disabled={isProcessing || !selectedAsset}
          className="gap-2"
        >
          <Code size={16} />
          Generate Code
        </Button>
      </div>
      
      {generatedCode.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="preview">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="html">
              <span className="font-mono text-xs mr-2">HTML</span>
              HTML
            </TabsTrigger>
            <TabsTrigger value="css">
              <span className="font-mono text-xs mr-2">CSS</span>
              CSS
            </TabsTrigger>
          </TabsList>
          
          {generatedCode.map(code => (
            <React.Fragment key={code.id}>
              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Generated Component Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <WebsitePreview
                        html={code.html}
                        css={code.css}
                        js={code.js}
                        defaultViewport="desktop"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="html" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-base">HTML Code</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(code.html, 'html')}
                      className="gap-2 h-8"
                    >
                      {copiedCode === 'html' ? (
                        <>
                          <Check size={14} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm font-mono">
                        <code>{code.html}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="css" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-base">CSS Code</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(code.css, 'css')}
                      className="gap-2 h-8"
                    >
                      {copiedCode === 'css' ? (
                        <>
                          <Check size={14} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm font-mono">
                        <code>{code.css}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </React.Fragment>
          ))}
        </Tabs>
      )}
    </div>
  );
};
