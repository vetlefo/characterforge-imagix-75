
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMediaTransform } from './MediaTransformContext';
import { Loader2, Upload, Code } from 'lucide-react';

interface AnimationGeneratorProps {
  imageUrl?: string;
}

export const AnimationGenerator: React.FC<AnimationGeneratorProps> = ({ imageUrl }) => {
  const [selectedTab, setSelectedTab] = useState('upload');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(imageUrl || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateAnimationFromImage, isProcessing, generatedAnimations } = useMediaTransform();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImageUrl(url);
    }
  };

  const handleGenerate = async () => {
    if (uploadedImageUrl) {
      setIsGenerating(true);
      try {
        await generateAnimationFromImage(uploadedImageUrl);
      } catch (error) {
        console.error('Error generating animation:', error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="results">Generated Animations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-2">
                {uploadedImageUrl ? (
                  <div className="relative w-full">
                    <img 
                      src={uploadedImageUrl} 
                      alt="Uploaded image" 
                      className="max-h-64 mx-auto object-contain rounded-md"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setUploadedImageUrl(null)}
                      className="absolute top-2 right-2 bg-white bg-opacity-75"
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-500">Upload an image to generate animations</p>
                    <label className="cursor-pointer">
                      <span className="relative inline-block">
                        <Button variant="default">Upload Image</Button>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </span>
                    </label>
                  </>
                )}
              </div>
            </CardContent>
            {uploadedImageUrl && (
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleGenerate}
                  disabled={isGenerating || isProcessing}
                >
                  {(isGenerating || isProcessing) ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Animation</>
                  ) : (
                    'Generate Animation'
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          {generatedAnimations.length > 0 ? (
            <div className="space-y-4">
              {generatedAnimations.map(animation => (
                <Card key={animation.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Animation {animation.id.slice(-6)}</h3>
                        <Button variant="outline" size="sm">
                          <Code className="h-4 w-4 mr-2" />
                          Copy CSS
                        </Button>
                      </div>
                      
                      <div className="border rounded-md p-4 bg-black/5 overflow-auto">
                        <pre className="text-xs">
                          <code>{animation.css}</code>
                        </pre>
                      </div>
                      
                      <div className="border rounded-md p-6 flex justify-center items-center">
                        <div className="w-32 h-32 bg-blue-500 animated-element"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center p-6">
                <p className="text-gray-500">No animations generated yet</p>
                <Button 
                  variant="link" 
                  onClick={() => setSelectedTab('upload')}
                  className="mt-2"
                >
                  Upload an image to get started
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnimationGenerator;
