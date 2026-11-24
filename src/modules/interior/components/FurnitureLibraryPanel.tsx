import React, { useState } from 'react';
import { FurnitureCategory, FurnitureItem } from '../types/interiorTypes';
import { FurnitureLibraryService, CatalogFurnitureTemplate } from '../services/FurnitureLibraryService';
import { Search, Plus, Sparkles, Box, Lock, Unlock } from 'lucide-react';

interface FurnitureLibraryPanelProps {
  onAddFurniture: (template: CatalogFurnitureTemplate) => void;
  isDarkMode?: boolean;
}

export const FurnitureLibraryPanel: React.FC<FurnitureLibraryPanelProps> = ({
  onAddFurniture,
  isDarkMode = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FurnitureCategory | 'All'>('All');

  const categories: (FurnitureCategory | 'All')[] = [
    'All',
    'Sofas & Seating',
    'Beds & Sleep',
    'Tables & Dining',
    'Storage & Cabinets',
    'Lighting Fixtures',
    'Decor & Artwork',
    'Office & Desks',
    'Bathroom Fixtures',
    'Outdoor & Plants'
  ];

  const catalog = FurnitureLibraryService.getCatalog();
  const filteredCatalog = catalog.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className={`p-3.5 space-y-4 text-xs font-sans rounded-sm border ${
      isDarkMode ? 'bg-[#0D111A] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Box className="w-4 h-4 text-[#B59B6D]" />
          <h3 className="font-bold text-sm uppercase tracking-wider">Furniture Catalog</h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">{filteredCatalog.length} Items</span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search sofa, bed, marble table..."
          className={`w-full pl-8 pr-3 py-1.5 rounded-sm border text-xs focus:outline-none focus:border-[#B59B6D] ${
            isDarkMode ? 'bg-[#070A11] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
          }`}
        />
      </div>

      {/* Category Pills */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-[#B59B6D] text-black'
                : isDarkMode ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Catalog Item Cards */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {filteredCatalog.map((item) => (
          <div
            key={item.catalogId}
            className={`p-2.5 rounded-sm border transition flex items-start justify-between gap-2 ${
              isDarkMode ? 'bg-white/5 border-white/10 hover:border-[#B59B6D]' : 'bg-slate-50 border-slate-200 hover:border-[#B59B6D]'
            }`}
          >
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs truncate text-white">{item.name}</span>
                <span className="px-1.5 py-0.5 rounded-sm bg-[#B59B6D]/20 text-[#B59B6D] text-[9px] font-mono">
                  {item.style}
                </span>
              </div>

              <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                {item.description}
              </p>

              <div className="text-[9px] font-mono text-slate-400">
                Dim: {item.dimensions.length}m × {item.dimensions.width}m × {item.dimensions.height}m
              </div>
            </div>

            <button
              onClick={() => onAddFurniture(item)}
              className="p-2 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold transition shrink-0 shadow"
              title="Add to selected room"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
