
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface AssetSearchProps {
  onSearch: (searchTerm: string) => void;
}

const AssetSearch = ({ onSearch }: AssetSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <Search 
          size={16} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" 
        />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search assets..."
          className="pl-9 pr-9 bg-[#1A1A2E]/50 border-[#2A2A4A]/30 placeholder:text-white/40"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 text-white/60 hover:text-white"
            onClick={clearSearch}
          >
            <X size={14} />
          </Button>
        )}
      </div>
    </form>
  );
};

export default AssetSearch;
