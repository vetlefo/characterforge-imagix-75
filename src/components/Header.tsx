
import { YoutubeIcon, DiscordIcon, HelpCircleIcon, Plus } from "lucide-react";

const Header = () => {
  return (
    <div className="h-16 flex items-center justify-end px-6 border-b border-gray-800">
      <div className="flex items-center gap-4">
        <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
          <YoutubeIcon size={20} />
        </a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
          <DiscordIcon size={20} />
        </a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
          <HelpCircleIcon size={20} />
        </a>
        <button className="px-4 py-1.5 text-gray-300 text-sm border border-gray-700 rounded-md hover:bg-gray-800 transition-colors">
          Upgrade
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white flex items-center gap-1 rounded-md px-4 py-1.5 text-sm font-medium">
          <Plus size={16} />
          Create
        </button>
        <button className="px-4 py-1.5 text-gray-300 text-sm border border-gray-700 rounded-md hover:bg-gray-800 transition-colors">
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Header;
