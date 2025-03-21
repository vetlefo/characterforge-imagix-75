
import { Button } from "@/components/ui/button";
import { Sparkles, Image, FileText, FilterX } from "lucide-react";

interface EmptyStateProps {
  onCreateNew: () => void;
  filtered?: boolean;
}

const EmptyState = ({
  onCreateNew,
  filtered = false
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 my-8">
      <div className="w-20 h-20 mb-5 rounded-full bg-blue-500/10 flex items-center justify-center">
        {filtered ? <FilterX size={32} className="text-blue-400/70" /> : <Image size={32} className="text-blue-400/70" />}
      </div>
      
      <h3 className="text-xl font-medium text-white mb-2">
        {filtered ? "No matching assets found" : "Your asset library is empty"}
      </h3>
      
      <p className="text-white/60 max-w-md mb-6">
        {filtered ? "Try adjusting your filters or search terms to find what you're looking for." : "Create your first creative asset to start building your library. You can create images, text snippets, or add website references."}
      </p>
      
      {!filtered && (
        <div className="flex gap-3">
          <Button 
            id="create-asset-btn"
            onClick={onCreateNew} 
            className="gap-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-sm font-medium"
          >
            <Sparkles size={16} />
            Create New Asset
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
