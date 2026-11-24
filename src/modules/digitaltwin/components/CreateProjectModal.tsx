import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  Plus, 
  MapPin, 
  Layers, 
  DollarSign, 
  Loader2, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { firebaseService, ProjectData } from '../../firebase/firebaseService';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (newProject: ProjectData) => void;
  isDarkMode?: boolean;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
  isDarkMode = true
}) => {
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    projectType: 'Residential' as ProjectData['projectType'],
    location: '',
    plotSize: '12,500 sq ft',
    numberOfFloors: 2,
    preferredStyle: 'Modern Ultra-Luxury',
    budgetRange: '$5,000,000 - $8,000,000'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName || !formData.clientName) return;

    setLoading(true);
    try {
      const created = await firebaseService.createProject(formData);
      setSuccess(true);
      setTimeout(() => {
        onProjectCreated(created);
        setSuccess(false);
        setLoading(false);
        onClose();
      }, 600);
    } catch (err) {
      console.error('Error creating project in Firestore:', err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className={`relative max-w-xl w-full rounded-lg border p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
        isDarkMode ? 'bg-[#0D121D] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-[#B59B6D]/20 border border-[#B59B6D]/40 flex items-center justify-center text-[#B59B6D]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">
                Cloud Firestore Database
              </span>
              <h3 className="font-serif text-xl font-bold">
                Create Architectural Project
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Project & Client Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Project Name *</label>
              <input
                type="text"
                required
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                placeholder="e.g. Bel Air Crown Villa"
                className={`w-full p-2.5 rounded border focus:outline-none focus:border-[#B59B6D] ${
                  isDarkMode ? 'bg-[#111622] border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Client Name *</label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="e.g. Rothschild Capital Group"
                className={`w-full p-2.5 rounded border focus:outline-none focus:border-[#B59B6D] ${
                  isDarkMode ? 'bg-[#111622] border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Project Type & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Project Type</label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value as any })}
                className={`w-full p-2.5 rounded border focus:outline-none focus:border-[#B59B6D] ${
                  isDarkMode ? 'bg-[#111622] border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="Residential">Residential Estate</option>
                <option value="Commercial">Commercial Tower</option>
                <option value="Interior">Interior Renovation</option>
                <option value="Renovation">Historic Renovation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Beverly Hills, CA"
                className={`w-full p-2.5 rounded border focus:outline-none focus:border-[#B59B6D] ${
                  isDarkMode ? 'bg-[#111622] border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Plot Size & Floors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Plot Size</label>
              <input
                type="text"
                value={formData.plotSize}
                onChange={(e) => setFormData({ ...formData, plotSize: e.target.value })}
                placeholder="e.g. 15,000 sq ft"
                className={`w-full p-2.5 rounded border focus:outline-none focus:border-[#B59B6D] ${
                  isDarkMode ? 'bg-[#111622] border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Number of Floors</label>
              <input
                type="number"
                min={1}
                max={100}
                value={formData.numberOfFloors}
                onChange={(e) => setFormData({ ...formData, numberOfFloors: parseInt(e.target.value) || 1 })}
                className={`w-full p-2.5 rounded border focus:outline-none focus:border-[#B59B6D] ${
                  isDarkMode ? 'bg-[#111622] border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Style & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Preferred Design Style</label>
              <select
                value={formData.preferredStyle}
                onChange={(e) => setFormData({ ...formData, preferredStyle: e.target.value })}
                className={`w-full p-2.5 rounded border focus:outline-none focus:border-[#B59B6D] ${
                  isDarkMode ? 'bg-[#111622] border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="Modern Ultra-Luxury">Modern Ultra-Luxury</option>
                <option value="Contemporary Minimalist">Contemporary Minimalist</option>
                <option value="Classical European">Classical European</option>
                <option value="Scandinavian Natural">Scandinavian Natural</option>
                <option value="Organic High-Tech">Organic High-Tech</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Budget Range</label>
              <input
                type="text"
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                placeholder="e.g. $5,000,000 - $10,000,000"
                className={`w-full p-2.5 rounded border focus:outline-none focus:border-[#B59B6D] ${
                  isDarkMode ? 'bg-[#111622] border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-[0.15em] transition flex items-center space-x-2 shadow-lg shadow-[#B59B6D]/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Firestore...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Project Created!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
