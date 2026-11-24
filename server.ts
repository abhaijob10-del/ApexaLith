import {installPlatform, apiErrors} from './backend/platform.mjs';
import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { 
  CustomerInquiry, 
  ProjectDetails, 
  ProjectQuotation, 
  ServiceOffering, 
  TeamMember, 
  ApprovalRequest, 
  InvoiceRecord, 
  MeetingRecord, 
  AuditLogEntry, 
  NotificationItem 
} from './src/types';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

installPlatform(app);
app.use(express.json());

// Initialize Gemini API if key is available
let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn('Gemini API key error or missing:', err);
  }
}

// -----------------------------------------------------------------------------
// IN-MEMORY / PERSISTENT DATA REPOSITORIES (Idempotent seed data)
// -----------------------------------------------------------------------------

// Seed Team Members
const teamMembers: TeamMember[] = [
  {
    id: 'team_01',
    name: 'Marcus Vance',
    email: 'm.vance@apexalith.com',
    role: 'project_manager',
    status: 'active',
    assignedProjectIds: ['proj_aspen_ridge_001'],
    phone: '+1 (310) 555-0199',
    joinedAt: '2024-03-15T00:00:00Z'
  },
  {
    id: 'team_02',
    name: 'Elena Rostova',
    email: 'e.rostova@apexalith.com',
    role: 'project_manager',
    status: 'active',
    assignedProjectIds: ['proj_bel_air_monolith_002'],
    phone: '+1 (310) 555-0188',
    joinedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'team_03',
    name: 'Julian Thorne',
    email: 'j.thorne@apexalith.com',
    role: 'architect',
    status: 'active',
    assignedProjectIds: ['proj_aspen_ridge_001', 'proj_bel_air_monolith_002'],
    phone: '+1 (310) 555-0177',
    joinedAt: '2023-11-01T00:00:00Z'
  },
  {
    id: 'team_04',
    name: 'David Sterling',
    email: 'd.sterling@apexalith.com',
    role: 'engineer',
    status: 'active',
    assignedProjectIds: ['proj_aspen_ridge_001'],
    phone: '+1 (310) 555-0166',
    joinedAt: '2024-05-20T00:00:00Z'
  }
];

// Seed Customer Inquiries
const inquiries: CustomerInquiry[] = [
  {
    id: 'INQ-2026-84210',
    fullName: 'Lord Alexander Vance',
    email: 'a.vance@vanceholdings.com',
    phone: '+1 (310) 555-0192',
    whatsapp: '+1 (310) 555-0192',
    preferredCommunication: 'phone',
    city: 'Los Angeles',
    state: 'California',
    projectType: 'residential',
    projectName: 'Bel Air Ridge Compound',
    siteAddress: '10440 Bellagio Road, Bel Air, CA',
    plotSizeSqFt: 55000,
    builtUpAreaSqFt: 18500,
    floors: 3,
    currentProjectStage: 'Raw Land / Survey Completed',
    budgetRange: '$20M - $35M',
    budgetFlexibility: 'flexible',
    preferredStartDate: '2026-11-01',
    expectedCompletionDate: '2028-06-01',
    requiredServices: ['Architecture', 'Structural Engineering', 'Construction', 'Interiors', 'Turnkey Execution'],
    projectDescription: 'Seeking turnkey luxury construction for a private estate on a hillside site. Must incorporate 12m cantilevers, subterranean wellness center, and triple-pane Sky-Frame glazing.',
    designPreference: 'luxury',
    preferredColorsMaterials: 'Warm travertine, Calacatta Borghini, bronze anodized metal, smoked oak.',
    inspirationLinks: 'https://apexalith.internal/portfolio/the-aspen-ridge-sanctuary',
    uploadedDocuments: [
      { name: 'Site_Topography_Survey.pdf', size: '14.2 MB', type: 'PDF' },
      { name: 'BelAir_Architectural_Brief.pdf', size: '4.8 MB', type: 'PDF' }
    ],
    meetingPreference: 'site_visit',
    preferredMeetingDate: '2026-10-18',
    preferredMeetingTime: '11:00 AM',
    meetingPurpose: 'On-site bedrock and view evaluation with Principal Architect.',
    status: 'Consultation Scheduled',
    assignedOwner: 'Marcus Vance',
    contactNotes: [
      {
        note: 'Spoke with representative. Client confirmed budget flexibility and requests initial structural feasibility report.',
        author: 'Marcus Vance',
        timestamp: '2026-07-24T10:30:00Z'
      }
    ],
    followUpDate: '2026-10-15',
    createdAt: '2026-07-24T09:15:00Z',
    updatedAt: '2026-07-24T10:30:00Z'
  },
  {
    id: 'INQ-2026-91042',
    fullName: 'Lady Beatrice Sterling',
    email: 'b.sterling@sterlingcapital.co.uk',
    phone: '+44 20 7946 0912',
    preferredCommunication: 'email',
    city: 'Aspen & London',
    state: 'Colorado',
    projectType: 'residential',
    projectName: 'Red Mountain Alpine Retreat',
    siteAddress: '880 Red Mountain Road, Aspen, CO',
    plotSizeSqFt: 42000,
    builtUpAreaSqFt: 14500,
    floors: 3,
    currentProjectStage: 'Architectural Concept Review',
    budgetRange: '$25M - $40M',
    budgetFlexibility: 'plus_minus_10',
    requiredServices: ['Architecture', 'Turnkey Execution', 'Smart Home Integration', 'Landscaping'],
    projectDescription: 'Bespoke mountain sanctuary with indoor-outdoor heated pool, snow-melt driveway, and geothermal heating.',
    designPreference: 'contemporary',
    preferredColorsMaterials: 'Colorado silver granite, titanium-zinc fascias, reclaimed bog oak.',
    meetingPreference: 'online',
    preferredMeetingDate: '2026-10-22',
    preferredMeetingTime: '3:00 PM GMT',
    meetingPurpose: 'Virtual review of schematic design and timeline.',
    status: 'New Inquiry',
    assignedOwner: 'Elena Rostova',
    contactNotes: [],
    createdAt: '2026-07-23T14:20:00Z',
    updatedAt: '2026-07-23T14:20:00Z'
  }
];

// Seed Projects
const projects: ProjectDetails[] = [
  {
    id: 'proj_aspen_ridge_001',
    name: 'The Aspen Ridge Sanctuary',
    archetype: 'Villa',
    style: ['Modernist', 'Mountain Contemporary'],
    location: 'Red Mountain, Aspen, Colorado',
    city: 'Aspen',
    plotSizeSqFt: 42000,
    builtUpSqFt: 14500,
    floors: 3,
    stage: 'Interior Crafting & Custom Joinery',
    progressPercentage: 82,
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop'
    ],
    beforeImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    description: 'A masterpiece of cantilevered glass and local Colorado silver granite. Features an subterranean heated infinity pool, private wine vault, geothermal HVAC, and smart electrochromic floor-to-ceiling glass.',
    estimatedTier: 'tier_i',
    customerId: 'usr_client_001',
    customerName: 'Lord Alexander Vance',
    customerEmail: 'a.vance@vanceholdings.com',
    assignedManagerId: 'team_01',
    assignedTeamMembers: ['team_01', 'team_03', 'team_04'],
    plannedStartDate: '2025-02-01',
    plannedCompletionDate: '2026-11-15',
    status: 'active',
    milestones: [
      { id: 'm1', title: 'Geothermal Substructure & Foundation', description: 'Deep bedrock anchoring and closed-loop geothermal field installation.', phase: 'Foundation', progressPercentage: 100, startDate: '2025-02-01', targetCompletion: '2025-05-15', status: 'completed', responsiblePerson: 'David Sterling' },
      { id: 'm2', title: 'Cantilever Structural Steel Framing', description: 'High-tensile Grade 60 structural steel frame erection with zero-vibration dampers.', phase: 'Structure', progressPercentage: 100, startDate: '2025-05-20', targetCompletion: '2025-09-10', status: 'completed', responsiblePerson: 'Marcus Vance' },
      { id: 'm3', title: 'Triple-Pane Acoustical Glazing & Envelope', description: 'Swiss-engineered Sky-Frame motorized sliding doors and curtain walls.', phase: 'MEP & Glazing', progressPercentage: 100, startDate: '2025-09-15', targetCompletion: '2025-12-20', status: 'completed', responsiblePerson: 'Julian Thorne' },
      { id: 'm4', title: 'Bespoke Italian Millwork & Marble', description: 'Custom Calacatta Borghini slab installation and concealed acoustic joinery.', phase: 'Interior Crafting', progressPercentage: 65, startDate: '2026-01-10', targetCompletion: '2026-08-30', status: 'in_progress', responsiblePerson: 'Marcus Vance' },
      { id: 'm5', title: 'Alpine Biophilic Landscape & Infinity Pool', description: 'Heated granite spa, native pine transplantation, and automated snow melt driveways.', phase: 'Landscaping & Smart Home', progressPercentage: 20, startDate: '2026-06-01', targetCompletion: '2026-10-15', status: 'in_progress', responsiblePerson: 'Marcus Vance' }
    ],
    documents: [
      { id: 'doc_asp_01', title: 'A101 - Architectural Site Plan & Elevation (Rev 4)', category: 'Blueprint', fileType: 'pdf', fileSize: '24.8 MB', uploadDate: '2026-06-12', version: 'v4.2', encryptedKeyHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', permittedRoles: ['admin', 'project_manager', 'customer'] },
      { id: 'doc_asp_02', title: 'S202 - Structural Cantilever Load Analysis', category: 'CAD Drawing', fileType: 'dwg', fileSize: '48.2 MB', uploadDate: '2026-05-02', version: 'v3.0', encryptedKeyHash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', permittedRoles: ['admin', 'project_manager'] },
      { id: 'doc_asp_03', title: 'Municipal Building Permit & Environmental Clearances', category: 'Permit', fileType: 'pdf', fileSize: '8.4 MB', uploadDate: '2025-01-15', version: 'v1.0', encryptedKeyHash: '1f8257007a1c79e67c87c7b822187b5a867edb76dfb1e843ecaa9338f71295b7', permittedRoles: ['admin', 'project_manager', 'customer'] },
      { id: 'doc_asp_04', title: 'Turnkey Master Construction Agreement', category: 'Contract', fileType: 'pdf', fileSize: '14.1 MB', uploadDate: '2025-01-08', version: 'v1.0', encryptedKeyHash: 'f4d8928c0b2c129e92591038234850a221f7c52701b970b9eb228511a37c3558', permittedRoles: ['admin', 'customer'] }
    ],
    dailyLogs: [
      {
        id: 'log_asp_101',
        date: '2026-07-23',
        title: 'Master Suite Calacatta Slab Placement & Millwork Framing',
        notes: 'Stone artisans installed 3 massive 12ft book-matched Calacatta slabs in primary bath. Integrated Lutron Quantum lighting sensors tested and mapped.',
        weather: 'Clear 72°F',
        siteManager: 'Marcus Vance, Lead Site Engineer',
        workersOnSite: 18,
        imageUrls: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop'
        ]
      }
    ],
    changeOrders: [
      {
        id: 'co_asp_003',
        title: 'Heated Driveway Extension & Snow-Melt Sensor Upgrade',
        requestedBy: 'Homeowner Representative',
        dateRequested: '2026-07-10',
        description: 'Expand hydronic driveway coils to encompass upper guest parking turnabout and install optical ice-detecting sensor grid.',
        costAdjustment: 85000,
        timeImpactDays: 4,
        status: 'pending_approval',
        specificationsDoc: 'CO-003-HydronicDriveway-Specs.pdf'
      }
    ],
    cameraStreams: [
      {
        projectId: 'proj_aspen_ridge_001',
        cameraName: 'Cam 01 - North Elevation & Glass Pavilion',
        location: 'North Perimeter Pole 4',
        status: 'healthy',
        token: 'tok_hls_9921_asp_01',
        tokenExpiresAt: Date.now() + 600000,
        lastKnownSnapshot: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
        retryCount: 0,
        devOpsAlertSent: false
      }
    ],
    financials: {
      totalBudget: 24500000,
      disbursedAmount: 19800000,
      committedExpenses: 3200000,
      contingencyRemaining: 1500000,
      projectedRoiPercent: 28.5,
      asOfDate: '2026-07-20'
    }
  },
  {
    id: 'proj_bel_air_monolith_002',
    name: 'The Bel Air Monolith',
    archetype: 'Estate',
    style: ['Modernist', 'Minimalist Warmth'],
    location: 'Bel Air Crest, Los Angeles, California',
    city: 'Los Angeles',
    plotSizeSqFt: 65000,
    builtUpSqFt: 22000,
    floors: 3,
    stage: 'Final Finishes & Commissioning',
    progressPercentage: 94,
    heroImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop'
    ],
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop',
    description: 'An architectural monument overlooking the Los Angeles basin with 270-degree ocean-to-city views.',
    estimatedTier: 'tier_i',
    customerId: 'usr_client_002',
    customerName: 'Marcus Kensington',
    customerEmail: 'm.kensington@capital.com',
    assignedManagerId: 'team_02',
    assignedTeamMembers: ['team_02', 'team_03'],
    plannedStartDate: '2024-06-01',
    plannedCompletionDate: '2026-09-30',
    status: 'active',
    milestones: [
      { id: 'mb1', title: 'Caisson Hillside Stabilization', description: '72 deep concrete caissons anchored into mountain ridge.', phase: 'Foundation', progressPercentage: 100, startDate: '2024-06-01', targetCompletion: '2024-10-15', status: 'completed' },
      { id: 'mb2', title: 'Post-Tensioned Concrete Structure', description: 'Double cantilever slab pour with carbon-fiber reinforcement.', phase: 'Structure', progressPercentage: 100, startDate: '2024-10-20', targetCompletion: '2025-04-10', status: 'completed' }
    ],
    documents: [],
    dailyLogs: [],
    changeOrders: [],
    cameraStreams: [],
    financials: {
      totalBudget: 38000000,
      disbursedAmount: 35200000,
      committedExpenses: 2100000,
      contingencyRemaining: 700000,
      projectedRoiPercent: 34.2,
      asOfDate: '2026-07-22'
    }
  }
];

// Seed Quotations
const quotations: ProjectQuotation[] = [
  {
    id: 'QUO-2026-001',
    projectId: 'proj_aspen_ridge_001',
    inquiryId: 'INQ-2026-84210',
    clientName: 'Lord Alexander Vance',
    clientEmail: 'a.vance@vanceholdings.com',
    projectName: 'The Aspen Ridge Sanctuary — Phase 4 Turnkey Contract',
    items: [
      { id: 'it_01', description: 'Structural Steel Moment Framing & 12m Cantilever System', category: 'Structure', quantity: 1, unit: 'Lump Sum', unitPrice: 4200000, total: 4200000 },
      { id: 'it_02', description: 'Swiss Sky-Frame Motorized Acoustical Glazing Envelope', category: 'Glazing', quantity: 24, unit: 'Units', unitPrice: 85000, total: 2040000 },
      { id: 'it_03', description: 'Direct Quarried Calacatta Borghini Marble Book-Matched Cladding', category: 'Finishes', quantity: 38, unit: 'Slabs', unitPrice: 28000, total: 1064000 },
      { id: 'it_04', description: 'Closed-Loop Geothermal Hydronic HVAC & Subterranean Plant', category: 'MEP', quantity: 1, unit: 'System', unitPrice: 950000, total: 950000 },
      { id: 'it_05', description: 'Project Governance, CPM Oversight & BIM Modeling', category: 'Management', quantity: 18, unit: 'Months', unitPrice: 45000, total: 810000 }
    ],
    subtotal: 9064000,
    taxPercentage: 5,
    taxAmount: 453200,
    total: 9517200,
    validUntil: '2026-11-30',
    status: 'Accepted',
    acceptedAt: '2026-06-15T14:30:00Z',
    acceptedBy: 'Lord Alexander Vance',
    revision: 1,
    notes: 'Firm fixed-price turnkey agreement with milestone escrow disbursements.',
    createdAt: '2026-05-20T10:00:00Z',
    updatedAt: '2026-06-15T14:30:00Z'
  },
  {
    id: 'QUO-2026-002',
    inquiryId: 'INQ-2026-91042',
    clientName: 'Lady Beatrice Sterling',
    clientEmail: 'b.sterling@sterlingcapital.co.uk',
    projectName: 'Red Mountain Alpine Retreat — Architectural & Turnkey Feasibility',
    items: [
      { id: 'it_11', description: 'Complete Architectural & Structural Engineering Package', category: 'Design', quantity: 1, unit: 'Package', unitPrice: 850000, total: 850000 },
      { id: 'it_12', description: 'Geotechnical Soil Boring & Bedrock Anchoring Investigation', category: 'Civil', quantity: 1, unit: 'Study', unitPrice: 120000, total: 120000 },
      { id: 'it_13', description: 'Environmental Clearances & Municipal Permitting Management', category: 'Permits', quantity: 1, unit: 'Service', unitPrice: 95000, total: 95000 }
    ],
    subtotal: 1065000,
    taxPercentage: 5,
    taxAmount: 53250,
    total: 1118250,
    validUntil: '2026-11-15',
    status: 'Sent',
    revision: 1,
    notes: 'Preliminary pre-construction agreement.',
    createdAt: '2026-07-24T08:00:00Z',
    updatedAt: '2026-07-24T08:00:00Z'
  }
];

// Seed Data-Driven Service Offerings
const services: ServiceOffering[] = [
  {
    id: 'svc_01',
    title: 'Luxury Residential Construction',
    category: 'Construction',
    tagline: 'Ultra-luxury estates, compounds, and villas built to generational standards.',
    description: 'Precision engineering meets architectural artistry. We construct private residences utilizing post-tensioned cantilever slabs, deep bedrock anchoring, and museum-grade finishes.',
    keyDeliverables: ['Bedrock & Caisson Structural Engineering', 'Triple-Pane Acoustical Glass Enclosures', 'Subterranean Wine Vaults & Spa Decking', 'Seismic Dampening & Geothermal HVAC'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
    published: true,
    order: 1
  },
  {
    id: 'svc_02',
    title: 'Architecture & Structural Design',
    category: 'Architecture',
    tagline: 'Visionary concept development and rigorous structural calculations.',
    description: 'Our in-house architects and structural engineers craft fluid spatial geometry, optimizing site topography, sunlight orientations, and structural physics.',
    keyDeliverables: ['Parametric 3D BIM Modeling', 'Wind Tunnel & Finite Element Stress Analysis', 'Bespoke Façade Geometry Design', 'Topographical Cantilever Integration'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    published: true,
    order: 2
  },
  {
    id: 'svc_03',
    title: 'Interior Design & Space Planning',
    category: 'Interiors',
    tagline: 'Refined interior atmospheres curated with rare global materials.',
    description: 'Tailored interior environments featuring book-matched Calacatta marble, custom Italian millwork, concealed architectural lighting, and bespoke furniture.',
    keyDeliverables: ['Book-Matched Stone Slabs & Custom Joinery', 'Architectural Lighting & Scene Programming', 'Concealed Acoustic Wall Systems', 'Curated Art & Antiquities Placement'],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
    published: true,
    order: 3
  },
  {
    id: 'svc_04',
    title: 'Turnkey Project Execution',
    category: 'Turnkey',
    tagline: 'End-to-end execution from raw land acquisition to white-glove handover.',
    description: 'Single-point accountability across land surveying, permits, architectural blueprints, procurement, site management, and white-glove staging.',
    keyDeliverables: ['Single Fixed-Contract Guarantee', 'Municipal Permit & Zoning Clearances', 'VIP Client Portal Daily Reporting', 'White-Glove Move-In Handover'],
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&auto=format&fit=crop',
    published: true,
    order: 4
  },
  {
    id: 'svc_05',
    title: 'Renovation & Remodeling',
    category: 'Renovation',
    tagline: 'Transforming legacy structures into contemporary architectural masterworks.',
    description: 'Preserving historic character while upgrading structural integrity, thermal envelopes, and modern smart home infrastructure.',
    keyDeliverables: ['Historic Cast-Iron & Masonry Restoration', 'Structural Load-Bearing Wall Removal', 'Roof Pavilion & Cantilever Additions', 'Modern Utility & MEP Retrofitting'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    published: true,
    order: 5
  },
  {
    id: 'svc_06',
    title: 'Allied Engineering & Subterranean Works',
    category: 'Engineering',
    tagline: 'Specialized civil trade execution and deep subterranean engineering.',
    description: 'Precision subterranean excavation, waterproofing, deep foundations, custom steel fabrication, and crane logistics.',
    keyDeliverables: ['Micropile Underpinning', 'Multi-Layer Membrane Waterproofing', 'Structural Titanium & Steel Fabrication', 'Heavy-Lift Crane Logistics Management'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
    published: true,
    order: 6
  }
];

// Seed Customer Approval Requests
const approvalRequests: ApprovalRequest[] = [
  {
    id: 'appr_001',
    projectId: 'proj_aspen_ridge_001',
    projectName: 'The Aspen Ridge Sanctuary',
    title: 'Wine Vault Smoked Bog Oak Finish Sample Approval',
    category: 'Material',
    description: 'Review physical sample of 300-year German smoked bog oak with matte poly-seal for subterranean wine vault joinery.',
    submittedBy: 'Marcus Vance (Project Manager)',
    submittedAt: '2026-07-22T11:00:00Z',
    status: 'approved',
    actedBy: 'Lord Alexander Vance',
    actedAt: '2026-07-23T15:45:00Z',
    notes: 'Approved without modification. Beautiful grain texture.',
    costImpact: 0,
    mediaUrls: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop']
  },
  {
    id: 'appr_002',
    projectId: 'proj_aspen_ridge_001',
    projectName: 'The Aspen Ridge Sanctuary',
    title: 'Heated Driveway Extension Specification Sign-Off',
    category: 'Scope Change',
    description: 'Expand hydronic driveway coils to encompass upper guest parking turnabout and install optical ice-detecting sensor grid.',
    submittedBy: 'Marcus Vance (Project Manager)',
    submittedAt: '2026-07-20T09:30:00Z',
    status: 'pending',
    costImpact: 85000,
    mediaUrls: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop']
  }
];

// Seed Invoices
const invoices: InvoiceRecord[] = [
  {
    id: 'inv_001',
    projectId: 'proj_aspen_ridge_001',
    projectName: 'The Aspen Ridge Sanctuary',
    invoiceNumber: 'INV-2026-041',
    description: 'Milestone 3 Completion: Acoustical Glazing & Exterior Envelope',
    amount: 2040000,
    dueDate: '2026-08-15',
    status: 'Paid',
    paidAmount: 2040000,
    paidAt: '2026-08-10T16:00:00Z',
    createdAt: '2026-07-15T00:00:00Z'
  },
  {
    id: 'inv_002',
    projectId: 'proj_aspen_ridge_001',
    projectName: 'The Aspen Ridge Sanctuary',
    invoiceNumber: 'INV-2026-042',
    description: 'Milestone 4 Progress Billing: Calacatta Slab Sourcing & Joinery',
    amount: 1064000,
    dueDate: '2026-09-30',
    status: 'Pending',
    createdAt: '2026-07-22T00:00:00Z'
  }
];

// Seed Audit Logs
const auditLogs: AuditLogEntry[] = [
  {
    log_id: 'audit_001',
    actor_id: 'usr_admin_001',
    role: 'admin',
    action: 'admin_login_success',
    resource_id: 'system_core',
    ip_address: '127.0.0.1',
    timestamp: '2026-07-24T08:00:00Z',
    result: 'success'
  },
  {
    log_id: 'audit_002',
    actor_id: 'usr_client_001',
    role: 'customer',
    action: 'approval_sign_off',
    resource_id: 'appr_001',
    ip_address: '203.0.113.42',
    timestamp: '2026-07-23T15:45:00Z',
    result: 'success'
  }
];

function recordAudit(actorId: string, role: any, action: string, resourceId: string, req: express.Request, result: 'success' | 'denied' | 'error') {
  const ip = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || '127.0.0.1';
  auditLogs.unshift({
    log_id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    actor_id: actorId,
    role,
    action,
    resource_id: resourceId,
    ip_address: ip,
    timestamp: new Date().toISOString(),
    result
  });
}

// -----------------------------------------------------------------------------
// API ROUTES
// -----------------------------------------------------------------------------

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'ApexaLith',
    version: '3.0.0-Luxury-ConTech-Platform',
    timestamp: new Date().toISOString()
  });
});

// 3. Customer Inquiry Pipeline (Multi-Step Validated Form)
app.post('/api/inquiries', (req, res) => {
  const {
    fullName,
    email,
    phone,
    whatsapp,
    preferredCommunication,
    city,
    state,
    projectType,
    projectName,
    siteAddress,
    mapLocation,
    plotSizeSqFt,
    builtUpAreaSqFt,
    floors,
    currentProjectStage,
    budgetRange,
    budgetFlexibility,
    preferredStartDate,
    expectedCompletionDate,
    requiredServices,
    projectDescription,
    designPreference,
    preferredColorsMaterials,
    inspirationLinks,
    uploadedDocuments,
    meetingPreference,
    preferredMeetingDate,
    preferredMeetingTime,
    meetingPurpose
  } = req.body;

  // Rigorous Server Validation
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return res.status(400).json({ error: 'Valid full name is required.' });
  }

  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  if (!phone || phone.trim().length < 6) {
    return res.status(400).json({ error: 'Valid contact phone number is required.' });
  }

  if (!city || !state) {
    return res.status(400).json({ error: 'City and state/region are required.' });
  }

  if (!projectDescription || projectDescription.trim().length < 10) {
    return res.status(400).json({ error: 'Please provide at least a brief project description (min 10 characters).' });
  }

  // Prevent Duplicate Submissions within 5 minutes
  const recentDuplicate = inquiries.find(
    inq => inq.email.toLowerCase() === email.toLowerCase() && 
    (Date.now() - new Date(inq.createdAt).getTime()) < 300000
  );

  if (recentDuplicate) {
    return res.status(409).json({
      error: 'An inquiry from this email address was received recently. Your inquiry reference ID is ' + recentDuplicate.id,
      existingId: recentDuplicate.id
    });
  }

  // Generate Genuine Reference ID (INQ-2026-XXXXX)
  const referenceNumber = Math.floor(10000 + Math.random() * 90000);
  const inquiryId = `INQ-2026-${referenceNumber}`;
  const now = new Date().toISOString();

  const newInquiry: CustomerInquiry = {
    id: inquiryId,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    whatsapp: whatsapp ? whatsapp.trim() : undefined,
    preferredCommunication: preferredCommunication || 'phone',
    city: city.trim(),
    state: state.trim(),
    projectType: projectType || 'residential',
    projectName: projectName ? projectName.trim() : undefined,
    siteAddress: siteAddress ? siteAddress.trim() : city,
    mapLocation,
    plotSizeSqFt: Number(plotSizeSqFt) || undefined,
    builtUpAreaSqFt: Number(builtUpAreaSqFt) || undefined,
    floors: Number(floors) || undefined,
    currentProjectStage: currentProjectStage || 'Concept Planning',
    budgetRange: budgetRange || 'To be determined during consultation',
    budgetFlexibility: budgetFlexibility || 'flexible',
    preferredStartDate,
    expectedCompletionDate,
    requiredServices: Array.isArray(requiredServices) && requiredServices.length > 0 ? requiredServices : ['Architecture & Construction'],
    projectDescription: projectDescription.trim(),
    designPreference: designPreference || 'luxury',
    preferredColorsMaterials,
    inspirationLinks,
    uploadedDocuments: Array.isArray(uploadedDocuments) ? uploadedDocuments : [],
    meetingPreference: meetingPreference || 'online',
    preferredMeetingDate,
    preferredMeetingTime,
    meetingPurpose: meetingPurpose || 'Initial Architectural & Turnkey Feasibility Consultation',
    status: 'New Inquiry',
    assignedOwner: 'Marcus Vance',
    contactNotes: [
      {
        note: 'Inquiry received via web inquiry form. Concierge SLA clock initiated (<60m).',
        author: 'System Intake',
        timestamp: now
      }
    ],
    createdAt: now,
    updatedAt: now
  };

  inquiries.unshift(newInquiry);
  recordAudit(newInquiry.email, 'guest', 'inquiry_submitted', inquiryId, req, 'success');

  console.log(`[ApexaLith] New Customer Inquiry logged: ${inquiryId} by ${newInquiry.fullName}`);

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been successfully received and registered.',
    referenceId: inquiryId,
    inquiry: newInquiry
  });
});

// Backward compatibility alias for /api/consultations
app.post('/api/consultations', (req, res) => {
  const { name, email, phone, project_type, scale_sqft, timeline_urgency, notes } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Missing required contact fields.' });
  }

  const id = `lead_${Math.random().toString(36).substring(2, 8)}`;
  res.status(200).json({
    event: 'consultation_request.created',
    lead: {
      id,
      name,
      email,
      phone,
      project_type: project_type || 'Villa',
      scale_sqft: scale_sqft || 10000,
      notes
    }
  });
});

// List Inquiries (Admin)
app.get('/api/inquiries', (req, res) => {
  const { status, search } = req.query;
  let list = [...inquiries];

  if (status && status !== 'All') {
    list = list.filter(i => i.status.toLowerCase() === (status as string).toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(i => 
      i.fullName.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      i.id.toLowerCase().includes(q) ||
      i.city.toLowerCase().includes(q)
    );
  }

  res.json({ inquiries: list, total: list.length });
});

// Update Inquiry Status / Notes / Assignment (Admin)
app.patch('/api/inquiries/:id', (req, res) => {
  const { id } = req.params;
  const { status, assignedOwner, note, author, followUpDate } = req.body;

  const inq = inquiries.find(i => i.id === id);
  if (!inq) {
    return res.status(404).json({ error: 'Inquiry not found.' });
  }

  if (status) inq.status = status;
  if (assignedOwner) inq.assignedOwner = assignedOwner;
  if (followUpDate) inq.followUpDate = followUpDate;

  if (note) {
    if (!inq.contactNotes) inq.contactNotes = [];
    inq.contactNotes.unshift({
      note,
      author: author || 'Admin',
      timestamp: new Date().toISOString()
    });
  }

  inq.updatedAt = new Date().toISOString();
  recordAudit('usr_admin_001', 'admin', 'inquiry_updated', id, req, 'success');

  res.json({ success: true, inquiry: inq });
});

// Convert Approved Inquiry to Project (Admin)
app.post('/api/inquiries/:id/convert-to-project', (req, res) => {
  const { id } = req.params;
  const { assignedManagerId, plannedStartDate, totalBudget } = req.body;

  const inq = inquiries.find(i => i.id === id);
  if (!inq) {
    return res.status(404).json({ error: 'Inquiry not found.' });
  }

  const newProjId = `proj_${Date.now().toString(36)}`;
  const newProject: ProjectDetails = {
    id: newProjId,
    name: inq.projectName || `${inq.fullName}'s Residence`,
    archetype: (inq.projectType === 'commercial' ? 'Commercial Development' : 'Estate') as any,
    style: ['Modernist', 'Minimalist Warmth'],
    location: inq.siteAddress || `${inq.city}, ${inq.state}`,
    city: inq.city,
    plotSizeSqFt: inq.plotSizeSqFt || 30000,
    builtUpSqFt: inq.builtUpAreaSqFt || 12000,
    floors: inq.floors || 2,
    stage: 'Pre-Construction Engineering & Permitting',
    progressPercentage: 5,
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'
    ],
    description: inq.projectDescription,
    customerId: `usr_client_${Date.now().toString(36)}`,
    customerName: inq.fullName,
    customerEmail: inq.email,
    assignedManagerId: assignedManagerId || 'team_01',
    assignedTeamMembers: [assignedManagerId || 'team_01', 'team_03'],
    plannedStartDate: plannedStartDate || new Date().toISOString().split('T')[0],
    status: 'active',
    milestones: [
      { id: 'm_init_1', title: 'Topographical Survey & Geotechnical Soil Boring', description: 'Bedrock evaluation and site civil testing.', phase: 'Foundation', progressPercentage: 20, startDate: new Date().toISOString().split('T')[0], targetCompletion: '2026-12-15', status: 'in_progress', responsiblePerson: 'Marcus Vance' },
      { id: 'm_init_2', title: 'Municipal Permitting & Zoning Clearances', description: 'Architectural submission to local planning department.', phase: 'Foundation', progressPercentage: 0, startDate: '2026-12-16', targetCompletion: '2027-02-28', status: 'upcoming' },
      { id: 'm_init_3', title: 'Cantilever Structural Framing', description: 'High-tensile steel framing.', phase: 'Structure', progressPercentage: 0, startDate: '2027-03-01', targetCompletion: '2027-07-30', status: 'upcoming' }
    ],
    documents: [],
    dailyLogs: [],
    changeOrders: [],
    cameraStreams: [],
    financials: {
      totalBudget: Number(totalBudget) || 15000000,
      disbursedAmount: 500000,
      committedExpenses: 750000,
      contingencyRemaining: 1500000,
      projectedRoiPercent: 25.0,
      asOfDate: new Date().toISOString().split('T')[0]
    }
  };

  projects.unshift(newProject);
  inq.status = 'Approved';
  inq.convertedProjectId = newProjId;
  inq.updatedAt = new Date().toISOString();

  recordAudit('usr_admin_001', 'admin', 'inquiry_converted_to_project', newProjId, req, 'success');

  res.status(201).json({
    success: true,
    message: 'Inquiry successfully converted to active project without duplicating customer data.',
    project: newProject
  });
});

// 4. Project Management Endpoints
app.get('/api/projects', (req, res) => {
  const { customerEmail, teamMemberId } = req.query;
  let list = [...projects];

  if (customerEmail && typeof customerEmail === 'string') {
    list = list.filter(p => p.customerEmail?.toLowerCase() === customerEmail.toLowerCase());
  }

  if (teamMemberId && typeof teamMemberId === 'string') {
    list = list.filter(p => 
      p.assignedManagerId === teamMemberId || 
      (p.assignedTeamMembers && p.assignedTeamMembers.includes(teamMemberId))
    );
  }

  res.json({ projects: list, total: list.length });
});

app.post('/api/projects', (req, res) => {
  const newProj = req.body;
  if (!newProj.name || !newProj.location) {
    return res.status(400).json({ error: 'Project name and location are required.' });
  }

  const projId = `proj_${Date.now().toString(36)}`;
  const created: ProjectDetails = {
    ...newProj,
    id: projId,
    milestones: newProj.milestones || [],
    documents: newProj.documents || [],
    dailyLogs: newProj.dailyLogs || [],
    changeOrders: newProj.changeOrders || [],
    cameraStreams: newProj.cameraStreams || [],
    progressPercentage: newProj.progressPercentage || 0,
    status: newProj.status || 'active'
  };

  projects.unshift(created);
  recordAudit('usr_admin_001', 'admin', 'project_created', projId, req, 'success');

  res.status(201).json({ success: true, project: created });
});

app.patch('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const proj = projects.find(p => p.id === id);
  if (!proj) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  Object.assign(proj, updates);
  recordAudit('usr_admin_001', 'admin', 'project_updated', id, req, 'success');

  res.json({ success: true, project: proj });
});

// Project Manager / Construction Team Site Log Submission
app.post('/api/projects/:id/site-logs', (req, res) => {
  const { id } = req.params;
  const { title, notes, weather, siteManager, workersOnSite, imageUrls, delaysReported } = req.body;

  const proj = projects.find(p => p.id === id);
  if (!proj) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  const newLog = {
    id: `log_${Date.now().toString(36)}`,
    date: new Date().toISOString().split('T')[0],
    title: title || 'Daily Site Progress Update',
    notes: notes || 'Daily construction activities conducted in accordance with CPM schedule.',
    weather: weather || 'Clear 70°F',
    siteManager: siteManager || 'Site Engineer',
    workersOnSite: Number(workersOnSite) || 12,
    imageUrls: Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'],
    delaysReported
  };

  proj.dailyLogs.unshift(newLog);
  recordAudit(siteManager || 'pm', 'project_manager', 'site_log_submitted', id, req, 'success');

  res.status(201).json({ success: true, log: newLog, project: proj });
});

// Update Milestone Progress & Evidence (Project Manager / Admin)
app.patch('/api/projects/:id/milestones/:milestoneId', (req, res) => {
  const { id, milestoneId } = req.params;
  const { progressPercentage, status, completionEvidence } = req.body;

  const proj = projects.find(p => p.id === id);
  if (!proj) return res.status(404).json({ error: 'Project not found.' });

  const m = proj.milestones.find(mile => mile.id === milestoneId);
  if (!m) return res.status(404).json({ error: 'Milestone not found.' });

  if (progressPercentage !== undefined) m.progressPercentage = Number(progressPercentage);
  if (status) m.status = status;
  if (completionEvidence) m.completionEvidence = completionEvidence;

  // Recalculate overall project progress
  const total = proj.milestones.reduce((acc, curr) => acc + (curr.progressPercentage || 0), 0);
  proj.progressPercentage = Math.round(total / (proj.milestones.length || 1));

  recordAudit('usr_pm_001', 'project_manager', 'milestone_updated', milestoneId, req, 'success');

  res.json({ success: true, milestone: m, projectProgress: proj.progressPercentage });
});

// 5. Quotation Management
app.get('/api/quotations', (req, res) => {
  const { projectId } = req.query;
  let list = [...quotations];
  if (projectId) {
    list = list.filter(q => q.projectId === projectId);
  }
  res.json({ quotations: list, total: list.length });
});

app.post('/api/quotations', (req, res) => {
  const { clientName, clientEmail, projectName, items, validUntil, notes, projectId, inquiryId, taxPercentage } = req.body;

  if (!clientName || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Client name and line items required.' });
  }

  // Derive mathematical totals from saved line items
  let subtotal = 0;
  const sanitizedItems = items.map((it: any, idx: number) => {
    const qty = Number(it.quantity) || 1;
    const price = Number(it.unitPrice) || 0;
    const tot = qty * price;
    subtotal += tot;
    return {
      id: `it_${idx + 1}`,
      description: it.description || 'Line item',
      category: it.category || 'General',
      quantity: qty,
      unit: it.unit || 'Lump Sum',
      unitPrice: price,
      total: tot
    };
  });

  const taxPct = Number(taxPercentage) || 5;
  const taxAmount = (subtotal * taxPct) / 100;
  const grandTotal = subtotal + taxAmount;

  const nextNumber = Math.floor(100 + Math.random() * 900);
  const newQuo: ProjectQuotation = {
    id: `QUO-2026-${nextNumber}`,
    projectId,
    inquiryId,
    clientName,
    clientEmail: clientEmail || '',
    projectName: projectName || 'Turnkey Project Execution',
    items: sanitizedItems,
    subtotal,
    taxPercentage: taxPct,
    taxAmount,
    total: grandTotal,
    validUntil: validUntil || '2026-12-31',
    status: 'Sent',
    revision: 1,
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  quotations.unshift(newQuo);
  recordAudit('usr_admin_001', 'admin', 'quotation_created', newQuo.id, req, 'success');

  res.status(201).json({ success: true, quotation: newQuo });
});

// Customer Accept / Reject Quotation
app.post('/api/quotations/:id/accept', (req, res) => {
  const { id } = req.params;
  const { acceptedBy } = req.body;

  const quo = quotations.find(q => q.id === id);
  if (!quo) return res.status(404).json({ error: 'Quotation not found.' });

  quo.status = 'Accepted';
  quo.acceptedAt = new Date().toISOString();
  quo.acceptedBy = acceptedBy || quo.clientName;
  quo.updatedAt = new Date().toISOString();

  recordAudit(quo.acceptedBy, 'customer', 'quotation_accepted', id, req, 'success');

  res.json({ success: true, message: 'Quotation accepted and digitally signed.', quotation: quo });
});

app.post('/api/quotations/:id/reject', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const quo = quotations.find(q => q.id === id);
  if (!quo) return res.status(404).json({ error: 'Quotation not found.' });

  quo.status = 'Rejected';
  quo.rejectionReason = reason || 'Declined by client.';
  quo.updatedAt = new Date().toISOString();

  recordAudit(quo.clientName, 'customer', 'quotation_rejected', id, req, 'success');

  res.json({ success: true, quotation: quo });
});

// 6. Data-Driven Service Management
app.get('/api/services', (req, res) => {
  res.json({ services, total: services.length });
});

app.patch('/api/services/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const svc = services.find(s => s.id === id);
  if (!svc) return res.status(404).json({ error: 'Service not found.' });

  Object.assign(svc, updates);
  recordAudit('usr_admin_001', 'admin', 'service_updated', id, req, 'success');

  res.json({ success: true, service: svc });
});

app.post('/api/services', (req, res) => {
  const newSvc = req.body;
  const created: ServiceOffering = {
    ...newSvc,
    id: `svc_${Date.now().toString(36)}`,
    published: newSvc.published ?? true,
    order: services.length + 1
  };
  services.push(created);
  recordAudit('usr_admin_001', 'admin', 'service_created', created.id, req, 'success');
  res.status(201).json({ success: true, service: created });
});

// 7. Team Management
app.get('/api/team', (req, res) => {
  res.json({ team: teamMembers, total: teamMembers.length });
});

app.post('/api/team', (req, res) => {
  const { name, email, role, phone, assignedProjectIds } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role required.' });
  }

  const newMember: TeamMember = {
    id: `team_${Date.now().toString(36)}`,
    name,
    email,
    role,
    status: 'active',
    assignedProjectIds: Array.isArray(assignedProjectIds) ? assignedProjectIds : [],
    phone,
    joinedAt: new Date().toISOString()
  };

  teamMembers.push(newMember);
  recordAudit('usr_admin_001', 'admin', 'team_member_added', newMember.id, req, 'success');

  res.status(201).json({ success: true, member: newMember });
});

app.patch('/api/team/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const member = teamMembers.find(t => t.id === id);
  if (!member) return res.status(404).json({ error: 'Member not found.' });

  Object.assign(member, updates);
  recordAudit('usr_admin_001', 'admin', 'team_member_updated', id, req, 'success');

  res.json({ success: true, member });
});

// 8. Design & Material Customer Approvals
app.get('/api/approvals', (req, res) => {
  const { projectId } = req.query;
  let list = [...approvalRequests];
  if (projectId) {
    list = list.filter(a => a.projectId === projectId);
  }
  res.json({ approvals: list, total: list.length });
});

app.post('/api/approvals', (req, res) => {
  const { projectId, title, category, description, submittedBy, costImpact, mediaUrls } = req.body;
  const proj = projects.find(p => p.id === projectId);

  const newAppr: ApprovalRequest = {
    id: `appr_${Date.now().toString(36)}`,
    projectId: projectId || 'proj_active',
    projectName: proj?.name || 'Active Project',
    title: title || 'Approval Item',
    category: category || 'Design',
    description: description || '',
    submittedBy: submittedBy || 'Project Manager',
    submittedAt: new Date().toISOString(),
    status: 'pending',
    costImpact: Number(costImpact) || 0,
    mediaUrls: Array.isArray(mediaUrls) ? mediaUrls : []
  };

  approvalRequests.unshift(newAppr);
  recordAudit(submittedBy || 'pm', 'project_manager', 'approval_submitted', newAppr.id, req, 'success');

  res.status(201).json({ success: true, approval: newAppr });
});

app.patch('/api/approvals/:id/decide', (req, res) => {
  const { id } = req.params;
  const { decision, actedBy, notes } = req.body;

  const item = approvalRequests.find(a => a.id === id);
  if (!item) return res.status(404).json({ error: 'Approval request not found.' });

  item.status = decision === 'approved' ? 'approved' : 'rejected';
  item.actedBy = actedBy || 'Customer';
  item.actedAt = new Date().toISOString();
  if (notes) item.notes = notes;

  recordAudit(item.actedBy, 'customer', `approval_${decision}`, id, req, 'success');

  res.json({ success: true, approval: item });
});

// 9. Invoices & Financials
app.get('/api/invoices', (req, res) => {
  const { projectId } = req.query;
  let list = [...invoices];
  if (projectId) {
    list = list.filter(inv => inv.projectId === projectId);
  }

  const totalBilled = list.reduce((a, b) => a + b.amount, 0);
  const totalPaid = list.reduce((a, b) => a + (b.status === 'Paid' ? b.amount : (b.paidAmount || 0)), 0);
  const totalOutstanding = totalBilled - totalPaid;

  res.json({
    invoices: list,
    summary: {
      totalBilled,
      totalPaid,
      totalOutstanding
    }
  });
});

app.post('/api/invoices', (req, res) => {
  const { projectId, description, amount, dueDate } = req.body;
  const proj = projects.find(p => p.id === projectId);

  const newInv: InvoiceRecord = {
    id: `inv_${Date.now().toString(36)}`,
    projectId: projectId || 'proj_active',
    projectName: proj?.name || 'Active Project',
    invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    description: description || 'Progress billing',
    amount: Number(amount) || 0,
    dueDate: dueDate || new Date().toISOString().split('T')[0],
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  invoices.unshift(newInv);
  recordAudit('usr_admin_001', 'admin', 'invoice_created', newInv.id, req, 'success');

  res.status(201).json({ success: true, invoice: newInv });
});

// 10. Audit Logs (Admin Restricted)
app.get('/api/audit-logs', (req, res) => {
  res.json({ auditLogs, total: auditLogs.length });
});

// 11. Tokenized Camera Stream Endpoint (PRD US-04)
app.post('/api/camera/stream-token', (req, res) => {
  const { projectId, cameraId } = req.body;
  const token = 'tok_hls_' + Math.random().toString(36).substring(2, 12);
  const expiresAt = Date.now() + 600000; // 10 min TTL

  res.json({
    projectId: projectId || 'proj_aspen_ridge_001',
    cameraId: cameraId || 'cam_01',
    streamToken: token,
    expiresAt,
    hlsSignedUrl: `https://stream.apexalith.internal/hls/${projectId || 'proj_aspen_ridge_001'}/live.m3u8?token=${token}`
  });
});

// 12. Architectural Consultation AI Advisor Endpoint
app.post('/api/gemini/advisor', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({
      text: 'ApexaLith Architectural Advisory: For ultra-luxury engineering of this magnitude, our lead structural team recommends scheduling an in-person or virtual consultation to review site typography, bedrock load capacity, and custom millwork specifications.'
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are ApexaLith's Lead Architectural & Engineering Advisor.
ApexaLith is an elite luxury construction, architecture, and interior design firm specializing in turnkey estate execution.
Provide authoritative, articulate, and concise architectural engineering advice on structural feasibility, luxury material choices (e.g. Calacatta Borghini, titanium zinc, electrochromic glass), geothermal heating, and smart home automation integration.
Never give raw dollar price quotes; emphasize bespoke consultative excellence.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to consult AI advisor.', details: error.message });
  }
});

app.use(apiErrors);

// Serve frontend in dev or prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.argv.includes('--serve-built')) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist', 'public');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, process.env.HOST || '127.0.0.1', () => {
    console.log(`[ApexaLith Server Running] http://localhost:${PORT}`);
  });
}

startServer();
