import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (address: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [value, setValue] = useState('');

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex items-center flex-1 max-w-md bg-secondary rounded-md border border-border">
        <Search className="w-4 h-4 text-muted-foreground ml-3" />
        <input
          type="text"
          placeholder="Klistra in tokenadress för att söka..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>
      <button
        onClick={() => onSearch(value)}
        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Sök
      </button>
    </div>
  );
};

export default SearchBar;
