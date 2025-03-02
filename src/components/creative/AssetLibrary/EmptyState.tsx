
import { Button } from "@/components/ui/button";
import { Sparkles, Image, FileText } from "lucide-react";

interface EmptyStateProps {
  onCreateNew: () => void;
  filtered?: boolean;
}

const EmptyState = ({ onCreateNew, filtered = false }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
        {filtered ? (
          <FilterIcon size={36} className="text-blue-400/70" />
        ) : (
          <Image size={36} className="text-blue-400/70" />
        )}
      </div>
      
      <h3 className="text-xl font-medium text-white mb-2">
        {filtered 
          ? "No matching assets found" 
          : "Your asset library is empty"}
      </h3>
      
      <p className="text-white/60 max-w-md mb-6">
        {filtered
          ? "Try adjusting your filters or search terms to find what you're looking for."
          : "Create your first creative asset to start building your library. You can create images, text snippets, or add website references."}
      </p>
      
      {!filtered && (
        <div className="flex gap-3">
          <Button 
            onClick={onCreateNew} 
            className="gap-2 bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600"
          >
            <Sparkles size={16} />
            Create New Asset
          </Button>
        </div>
      )}
    </div>
  );
};

// Import this where needed
import { FilterIcon } from "lucide-react";

export default EmptyState;
