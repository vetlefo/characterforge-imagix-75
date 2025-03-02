
import React from "react";
import { Button } from "@/components/ui/button";

interface InspirationItemProps {
  src: string;
}

const InspirationItem = ({ src }: InspirationItemProps) => (
  <div className="rounded-lg overflow-hidden aspect-square relative group">
    <img src={src} alt="Inspiration" className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
      <span className="text-white text-sm font-medium">AI Generated</span>
      <Button variant="outline" size="sm" className="bg-black/50 border-white/30 text-white">
        Use
      </Button>
    </div>
  </div>
);

const InspirationalEchoes = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <InspirationItem src="/lovable-uploads/22f4141e-f83e-4b85-8c93-672e181d999b.png" />
      <InspirationItem src="/lovable-uploads/e565a3ea-dc96-4344-a533-62026d4245e1.png" />
      <InspirationItem src="/lovable-uploads/e9db2be9-f0a3-4506-b387-ce20bea67ba9.png" />
      <InspirationItem src="/lovable-uploads/fa140a1b-cb9d-457c-a7ca-e630a9052d31.png" />
    </div>
  );
};

export default InspirationalEchoes;
