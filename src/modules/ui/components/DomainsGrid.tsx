import React, { useState } from 'react';
import { 
  Home, 
  Building, 
  Compass, 
  Palette, 
  Key, 
  BarChart3, 
  Wrench, 
  Cpu, 
  Trees, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Hammer, 
  Briefcase,
  ArrowRight,
  CheckCircle2,
  X
} from 'lucide-react';

interface DomainItem {
  id: string;
  title: string;
  icon: React.ElementType;
  tagline: string;
  description: string;
  keyDeliverables: string[];
  image: string;
}

interface DomainsGridProps {
  onOpenConsultation: () => void;
  isDarkMode: boolean;
}

export const DOMAINS: DomainItem[] = [
  {
    id: 'res_const',
    title: 'Luxury Residential Construction',
    icon: Home,
    tagline: 'Ultra-luxury estates, compounds, and villas built to generational standards.',
    description: 'Precision engineering meets architectural artistry. We construct private residences utilizing post-tensioned cantilever slabs, deep bedrock anchoring, and museum-grade finishes.',
    keyDeliverables: ['Bedrock & Caisson Structural Engineering', 'Triple-Pane Acoustical Glass Enclosures', 'Subterranean Wine Vaults & Spa Decking', 'Seismic Dampening & Geothermal HVAC'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'comm_const',
    title: 'Commercial Construction',
    icon: Building,
    tagline: 'Iconic commercial towers, luxury retail flagships, and boutique corporate headquarters.',
    description: 'Delivering institutional-grade commercial spaces with strict timeline compliance, structural steel innovation, and LEED Platinum sustainability credentials.',
    keyDeliverables: ['High-Tensile Structural Steel Frameworks', 'Smart Glass Curtain Wall Façades', 'BMS Energy Automation & Microgrids', 'Acoustical Open-Plan Sound Masking'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'arch_design',
    title: 'Architecture & Structural Design',
    icon: Compass,
    tagline: 'Visionary concept development and structural calculations.',
    description: 'Our in-house architects and structural engineers craft fluid spatial geometry, optimizing site topography, sunlight orientations, and structural physics.',
    keyDeliverables: ['Parametric 3D BIM Modeling', 'Wind Tunnel & Structural Finite Element Analysis', 'Bespoke Façade Geometry Design', 'Topographical Cantilever Integration'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'interior_design',
    title: 'Interior Design & Space Planning',
    icon: Palette,
    tagline: 'Refined interior atmospheres curated with rare global materials.',
    description: 'Tailored interior environments featuring book-matched Calacatta marble, custom Italian millwork, concealed architectural lighting, and bespoke furniture.',
    keyDeliverables: ['Book-Matched Stone Slabs & Custom Joinery', 'Architectural Lighting & Scene Programming', 'Concealed Acoustic Wall Systems', 'Curated Art & Antiquities Placement'],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'turnkey_sol',
    title: 'Turnkey Construction Solutions',
    icon: Key,
    tagline: 'End-to-end execution from raw land acquisition to key delivery.',
    description: 'Single-point accountability across land surveying, permits, architectural blueprints, procurement, site management, and white-glove staging.',
    keyDeliverables: ['Single Fixed Contract Guarantee', 'Municipal Permit & Zoning Clearances', 'VIP Client Vault Daily Reporting', 'White-Glove Move-In Handover'],
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'proj_mgmt',
    title: 'Project Planning & Management',
    icon: BarChart3,
    tagline: 'Institutional project lifecycle governance and cost control.',
    description: 'Data-driven site oversight utilizing Critical Path Method (CPM) scheduling, real-time drone monitoring, and transparent financial disbursements.',
    keyDeliverables: ['CPM Milestone Schedule Audits', 'Earned Value Analysis (EVA) Reports', 'Subcontractor Quality Enforcement', 'Daily Digital Site Log Syncing'],
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'renovation',
    title: 'Renovation & Remodeling',
    icon: Hammer,
    tagline: 'Transforming legacy structures into contemporary architectural masterworks.',
    description: 'Preserving historic character while upgrading structural integrity, thermal envelopes, and modern smart home infrastructure.',
    keyDeliverables: ['Historic Cast-Iron & Masonry Restoration', 'Structural Load Bearing Wall Removal', 'Roof Pavilion & Cantilever Additions', 'Modern Utility & MEP Retrofitting'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'eng_consultancy',
    title: 'Engineering Consultancy',
    icon: Wrench,
    tagline: 'Specialized MEP, structural, and environmental consultancy.',
    description: 'Expert engineering reviews for complex foundation challenges, acoustic engineering, cleanroom HVAC systems, and renewable energy grids.',
    keyDeliverables: ['Soil Load & Geotechnical Reports', 'Acoustical Vibration Isolation Engineering', 'Hydronic Snow-Melt Grid Calculations', 'Off-Grid Solar & Battery Microgrids'],
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'allied_svcs',
    title: 'Allied Construction Services',
    icon: Layers,
    tagline: 'Specialized trade execution and subterranean engineering.',
    description: 'Precision subterranean excavation, waterproofing, deep foundations, custom steel fabrication, and crane logistics.',
    keyDeliverables: ['Micropile Underpinning', 'Multi-Layer Membrane Waterproofing', 'Structural Titanium & Steel Fabrication', 'Heavylift Crane Logistics Management'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'material_proc',
    title: 'Material Selection & Procurement',
    icon: Sparkles,
    tagline: 'Direct quarry and artisanal material sourcing worldwide.',
    description: 'Direct relationships with Italian quarries, Swiss metallurgists, and German glassmakers ensure exclusive access to rare finishes.',
    keyDeliverables: ['Direct Italian Quarry Block Selection', 'Custom Swiss Titanium-Zinc Sheet Sourcing', 'German Triple-Pane Glazing Orders', 'Quality Control Inspections at Factory'],
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'site_supervision',
    title: 'Site Supervision & Quality Assurance',
    icon: ShieldCheck,
    tagline: 'Uncompromising zero-defect quality control on active sites.',
    description: 'Dedicated site engineers conduct daily millimeter-tolerance laser scans, concrete core compression tests, and MEP thermal scans.',
    keyDeliverables: ['3D LiDAR Scan Audits', 'Concrete Core Strength Verification', 'Thermal Moisture Barrier Inspections', 'VIP Live Camera Telemetry'],
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'smart_home',
    title: 'Smart Home Integration',
    icon: Cpu,
    tagline: 'Subtle, intuitive home automation and biosecurity systems.',
    description: 'Seamless integration of Savant, Lutron, motorized architectural shading, biosecurity access controls, and audiophile-grade concealed acoustic systems.',
    keyDeliverables: ['Biometric & Passkey Access Security', 'Astronomical Clock Scene Lighting', 'Zero-Latency Motorized Glass Shades', 'Multi-Zone Subterranean AV Networks'],
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'landscape_design',
    title: 'Landscape & Outdoor Design',
    icon: Trees,
    tagline: 'Resort-quality outdoor living, infinity pools, and native ecosystems.',
    description: 'Harmonizing outdoor terraces with natural topographies, featuring mature specimen trees, zero-edge heated pools, and architectural fire features.',
    keyDeliverables: ['Specimen Olive & Pine Transplantation', 'Zero-Edge Hydronic Heated Pools', 'Architectural Flame & Water Walls', 'Biophilic Rainwater Harvesting Grids'],
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'investor_rel',
    title: 'Investor Relations & Development Projects',
    icon: Briefcase,
    tagline: 'B2B institutional real estate development & financial reporting.',
    description: 'Partnering with developers and ultra-high-net-worth investors to execute capital-efficient, high-yield luxury real estate developments.',
    keyDeliverables: ['Verified Financial ROI Dashboards', 'Pro-Forma Cost Variance Tracking', 'Equity Joint-Venture Structuring', 'Gated Institutional Capital Reporting'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop'
  }
];

export const DomainsGrid: React.FC<DomainsGridProps> = ({
  onOpenConsultation,
  isDarkMode
}) => {
  const [selectedDomain, setSelectedDomain] = useState<DomainItem | null>(null);

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 border-b transition-colors ${
      isDarkMode ? 'bg-[#0A0A0A] border-white/10' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B59B6D]">
            Comprehensive ConTech Infrastructure
          </span>
          <h2 className={`font-serif text-3xl sm:text-5xl font-bold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            14 Business Verticals, One Unified Standard
          </h2>
          <p className={`text-sm sm:text-base font-light leading-relaxed ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            ApexaLith replaces fragmented contractor networks with an integrated end-to-end architectural and engineering ecosystem.
          </p>
        </div>

        {/* 14 Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOMAINS.map((domain) => {
            const IconComponent = domain.icon as any;
            return (
              <div
                key={domain.id}
                onClick={() => setSelectedDomain(domain)}
                className={`group cursor-pointer rounded-sm border p-6 transition-all duration-300 flex flex-col justify-between hover:border-[#B59B6D] ${
                  isDarkMode 
                    ? 'bg-[#0D0D0D] border-white/10 hover:bg-[#121212]' 
                    : 'bg-white border-slate-200 hover:border-[#B59B6D] hover:bg-white shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-sm bg-[#B59B6D]/10 border border-[#B59B6D]/30 flex items-center justify-center text-[#B59B6D] group-hover:bg-[#B59B6D] group-hover:text-black transition duration-300">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-serif text-xl font-bold tracking-wide group-hover:text-[#B59B6D] transition ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {domain.title}
                    </h3>
                    <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {domain.tagline}
                    </p>
                  </div>
                </div>

                <div className={`pt-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D] border-t ${
                  isDarkMode ? 'border-white/10' : 'border-slate-200'
                } mt-4`}>
                  <span>Explore Capability</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Domain Detail Modal */}
      {selectedDomain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className={`relative max-w-2xl w-full rounded-sm border p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-[#0D0D0D] border-white/10 text-[#F5F5F0]' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setSelectedDomain(null)}
              className="absolute top-4 right-4 p-2 rounded-sm text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-sm bg-[#B59B6D]/20 border border-[#B59B6D]/40 flex items-center justify-center text-[#B59B6D]">
                {React.createElement(selectedDomain.icon as any, { className: "w-5 h-5" })}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#B59B6D] font-bold">
                  ApexaLith Domain Vertical
                </span>
                <h3 className="font-serif text-2xl font-bold">
                  {selectedDomain.title}
                </h3>
              </div>
            </div>

            <div className="aspect-video rounded-sm overflow-hidden border border-white/10">
              <img
                src={selectedDomain.image}
                alt={selectedDomain.title}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
              {selectedDomain.description}
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">
                Key Technical Deliverables
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedDomain.keyDeliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-white/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B59B6D] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3 border-t border-white/10">
              <button
                onClick={() => setSelectedDomain(null)}
                className="px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedDomain(null);
                  onOpenConsultation();
                }}
                className="px-5 py-2.5 rounded-sm bg-[#B59B6D] text-black font-bold text-xs uppercase tracking-[0.15em] hover:bg-[#c4ab7d] transition-all"
              >
                Request Domain Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
