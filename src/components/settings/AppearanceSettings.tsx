
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

const AppearanceSettings = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Theme</h3>
        
        <RadioGroup defaultValue="dark" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Card className="relative border-2 border-[#333370] p-2 cursor-pointer bg-[#0f0f23]">
              <div className="absolute top-2 right-2">
                <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                <div className="h-4 w-4 rounded-full border-2 border-primary shrink-0 data-[state=checked]:bg-primary"></div>
              </div>
              <Label htmlFor="theme-dark" className="cursor-pointer">
                <div className="h-24 bg-[#0f0f23] border border-[#333370] rounded flex items-center justify-center text-white">
                  Dark
                </div>
              </Label>
            </Card>
          </div>
          
          <div>
            <Card className="relative border-2 border-transparent p-2 cursor-pointer bg-[#0f0f23]">
              <div className="absolute top-2 right-2">
                <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                <div className="h-4 w-4 rounded-full border-2 border-primary shrink-0 data-[state=checked]:bg-primary"></div>
              </div>
              <Label htmlFor="theme-light" className="cursor-pointer">
                <div className="h-24 bg-white border border-gray-200 rounded flex items-center justify-center text-black">
                  Light
                </div>
              </Label>
            </Card>
          </div>
          
          <div>
            <Card className="relative border-2 border-transparent p-2 cursor-pointer bg-[#0f0f23]">
              <div className="absolute top-2 right-2">
                <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                <div className="h-4 w-4 rounded-full border-2 border-primary shrink-0 data-[state=checked]:bg-primary"></div>
              </div>
              <Label htmlFor="theme-system" className="cursor-pointer">
                <div className="h-24 bg-gradient-to-r from-[#0f0f23] to-white border border-[#333370] rounded flex items-center justify-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-black">System</span>
                </div>
              </Label>
            </Card>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Accent Color</h3>
        
        <RadioGroup defaultValue="blue" className="grid grid-cols-5 gap-4">
          <div>
            <RadioGroupItem value="blue" id="color-blue" className="sr-only" />
            <Label htmlFor="color-blue" className="cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-blue-500 border-2 border-transparent data-[state=checked]:border-white"></div>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="purple" id="color-purple" className="sr-only" />
            <Label htmlFor="color-purple" className="cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-purple-500 border-2 border-transparent data-[state=checked]:border-white"></div>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="indigo" id="color-indigo" className="sr-only" />
            <Label htmlFor="color-indigo" className="cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-indigo-500 border-2 border-transparent data-[state=checked]:border-white"></div>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="pink" id="color-pink" className="sr-only" />
            <Label htmlFor="color-pink" className="cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-pink-500 border-2 border-transparent data-[state=checked]:border-white"></div>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="green" id="color-green" className="sr-only" />
            <Label htmlFor="color-green" className="cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-green-500 border-2 border-transparent data-[state=checked]:border-white"></div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="font-size" className="text-white">Font Size</Label>
        <Select defaultValue="medium">
          <SelectTrigger id="font-size" className="bg-[#0f0f23] border-[#333370]">
            <SelectValue placeholder="Select font size" />
          </SelectTrigger>
          <SelectContent className="bg-[#0f0f23] border-[#333370]">
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button className="bg-[#333370] hover:bg-[#4d4d91]">
        Save Appearance
      </Button>
    </div>
  );
};

export default AppearanceSettings;
