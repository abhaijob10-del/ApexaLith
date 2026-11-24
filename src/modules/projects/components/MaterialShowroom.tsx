import React, { useState } from 'react';
import { MaterialItem } from '../../../types';
import { Sparkles, Shield, Clock, Leaf, Download, CheckCircle, Info } from 'lucide-react';

interface MaterialShowroomProps {
  materials: MaterialItem[];
  isDarkMode: boolean;
}

export const MaterialShowroom: React.FC<MaterialShowroomProps> = ({
  materials,
  isDarkMode
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeMaterial, setActiveMaterial] = useState<MaterialItem | null>(materials[0]);
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const categories = ['All', 'Marble & Stone', 'Hardwood & Timber', 'Metals & Alloys', 'Smart Glazing'];

  const filteredMaterials = selectedCategory === 'All' 
    ? materials 
    : materials.filter(m => m.category === selectedCategory);

  const handleDownloadSpec = (matName: string) => {
    setDownloadMsg(`Generating Technical Specification Sheet for "${matName}"...`);
    setTimeout(() => {
      setDownloadMsg(`Specification Sheet generated successfully for ${matName}.`);
      setTimeout(() => setDownloadMsg(null), 3000);
    }, 1000);
  };

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 border-b transition-colors ${
      isDarkMode ? 'bg-[#0A0A0A] border-white/10' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B59B6D]">
            Rare Global Finishes & Structural Materials
          </span>
          <h2 className={`font-serif text-3xl sm:text-5xl font-bold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Interactive Material Showroom
          </h2>
          <p className={`text-sm font-light leading-relaxed ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Directly sourced from European quarries and specialized metallurgy labs for uncompromised longevity.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-sm text-[10px] uppercase tracking-wider font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-[#B59B6D] text-black shadow-md'
                    : isDarkMode 
                      ? 'bg-[#121212] border border-white/10 text-white/70 hover:border-[#B59B6D]' 
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-[#B59B6D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {downloadMsg && (
          <div className="max-w-xl mx-auto p-3 rounded-sm bg-[#B59B6D]/20 border border-[#B59B6D] text-[#B59B6D] text-xs font-mono text-center animate-pulse">
            {downloadMsg}
          </div>
        )}

        {/* Main Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Material Cards List */}
          <div className="lg:col-span-5 space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                onClick={() => setActiveMaterial(mat)}
                className={`p-4 rounded-sm border cursor-pointer transition-all duration-200 flex items-center space-x-4 ${
                  activeMaterial?.id === mat.id
                    ? 'border-[#B59B6D] bg-[#B59B6D]/10'
                    : isDarkMode
                      ? 'bg-[#0D0D0D] border-white/10 hover:border-white/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-16 h-16 rounded-sm overflow-hidden shrink-0 border border-white/10">
                  <img src={mat.image} alt={mat.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">
                      {mat.rarityTier}
                    </span>
                    <span className={`text-[10px] font-mono ${
                      isDarkMode ? 'text-white/40' : 'text-slate-500'
                    }`}>
                      {mat.origin}
                    </span>
                  </div>
                  <h4 className={`font-serif text-lg font-bold truncate mt-0.5 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {mat.name}
                  </h4>
                  <p className={`text-xs truncate mt-0.5 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {mat.category}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Active Material Detail Inspector */}
          {activeMaterial && (
            <div className={`lg:col-span-7 rounded-sm border p-6 sm:p-8 space-y-6 ${
              isDarkMode ? 'bg-[#0D0D0D] border-white/10 text-[#F5F5F0]' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="aspect-video rounded-sm overflow-hidden border border-white/10 relative">
                <img
                  src={activeMaterial.image}
                  alt={activeMaterial.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] bg-[#0A0A0A]/90 text-[#B59B6D] border border-[#B59B6D]/40 backdrop-blur-md">
                  {activeMaterial.rarityTier}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                  {activeMaterial.origin}
                </span>
                <h3 className="font-serif text-3xl font-bold tracking-tight mt-1">
                  {activeMaterial.name}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed mt-3">
                  {activeMaterial.description}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D] flex items-center space-x-2">
                  <Info className="w-3.5 h-3.5 text-[#B59B6D]" />
                  <span>Technical & Environmental Specifications</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-sm bg-[#121212] border border-white/10 space-y-1">
                    <div className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Durability Rating</div>
                    <div className="text-xs font-semibold text-white/90 flex items-center space-x-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#B59B6D]" />
                      <span>{activeMaterial.specifications.durabilityRating}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-sm bg-[#121212] border border-white/10 space-y-1">
                    <div className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Sustainability Certification</div>
                    <div className="text-xs font-semibold text-white/90 flex items-center space-x-1.5">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{activeMaterial.specifications.sustainabilityCert}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-sm bg-[#121212] border border-white/10 space-y-1">
                    <div className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Production & Lead Time</div>
                    <div className="text-xs font-semibold text-white/90 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#B59B6D]" />
                      <span>{activeMaterial.specifications.leadTimeWeeks} Weeks Fulfillment</span>
                    </div>
                  </div>

                  {activeMaterial.specifications.thermalConductivity && (
                    <div className="p-3.5 rounded-sm bg-[#121212] border border-white/10 space-y-1">
                      <div className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Thermal Conductivity</div>
                      <div className="text-xs font-semibold text-white/90 font-mono">
                        {activeMaterial.specifications.thermalConductivity}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => handleDownloadSpec(activeMaterial.name)}
                  className="px-5 py-2.5 rounded-sm bg-[#B59B6D] text-black font-bold text-xs uppercase tracking-[0.15em] flex items-center space-x-2 hover:bg-[#c4ab7d] transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Spec Sheet PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
