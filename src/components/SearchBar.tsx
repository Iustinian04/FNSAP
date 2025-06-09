
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Asset, searchAssets } from "@/lib/mock-data";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSelectAsset: (asset: Asset) => void;
}

const SearchBar = ({ onSelectAsset }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Asset[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const searchResults = searchAssets(query);
    setResults(searchResults);
    setIsSearching(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsSearching(false);
  };

  // Auto-search
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (newQuery.length >= 2) {
      const searchResults = searchAssets(newQuery);
      setResults(searchResults);
      setIsSearching(true);
    } else if (newQuery.length === 0) {
      clearSearch();
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search for a stock, index, or forex pair..."
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            className="pr-10"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} variant="default">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {isSearching && (
        <div className="relative mt-2">
          <div className={cn(
            "absolute w-full bg-background border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto",
            results.length === 0 ? "p-4" : ""
          )}>
            {results.length > 0 ? (
              <div className="p-1">
                {results.map((asset) => (
                  <div
                    key={asset.symbol}
                    className="p-2 hover:bg-accent rounded-md cursor-pointer"
                    onClick={() => {
                      onSelectAsset(asset);
                      clearSearch();
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-medium">{asset.symbol}</span>
                        <span className="text-sm text-muted-foreground">
                          {asset.name}
                        </span>
                      </div>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {asset.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                No results found for "{query}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
