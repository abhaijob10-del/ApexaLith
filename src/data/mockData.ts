import { 
  ProjectDetails, 
  MaterialItem, 
  ConsultationRequestPayload, 
  BrokerReferral, 
  AuditLogEntry 
} from '../types';

export const INITIAL_PROJECTS: ProjectDetails[] = [
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
    status: 'active',
    progressPercentage: 82,
    customerName: 'Lord Alexander Vance',
    customerEmail: 'a.vance@vanceholdings.com',
    customerId: 'usr_client_001',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=1200&auto=format&fit=crop'
    ],
    beforeImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    description: 'A masterpiece of cantilevered glass and local Colorado silver granite. Features an subterranean heated infinity pool, private wine vault, geothermal HVAC, and smart electrochromic floor-to-ceiling glass.',
    estimatedTier: 'tier_i',
    milestones: [
      { id: 'm1', title: 'Geothermal Substructure & Foundation', description: 'Deep bedrock anchoring and closed-loop geothermal field installation.', phase: 'Foundation', progressPercentage: 100, startDate: '2025-02-01', targetCompletion: '2025-05-15', status: 'completed' },
      { id: 'm2', title: 'Cantilever Structural Steel Framing', description: 'High-tensile Grade 60 structural steel frame erection with zero-vibration dampers.', phase: 'Structure', progressPercentage: 100, startDate: '2025-05-20', targetCompletion: '2025-09-10', status: 'completed' },
      { id: 'm3', title: 'Triple-Pane Acoustical Glazing & Envelope', description: 'Swiss-engineered Sky-Frame motorized sliding doors and curtain walls.', phase: 'MEP & Glazing', progressPercentage: 100, startDate: '2025-09-15', targetCompletion: '2025-12-20', status: 'completed' },
      { id: 'm4', title: 'Bespoke Italian Millwork & Marble', description: 'Custom Calacatta Borghini slab installation and concealed acoustic joinery.', phase: 'Interior Crafting', progressPercentage: 65, startDate: '2026-01-10', targetCompletion: '2026-08-30', status: 'in_progress' },
      { id: 'm5', title: 'Alpine Biophilic Landscape & Infinity Pool', description: 'Heated granite spa, native pine transplantation, and automated snow melt driveways.', phase: 'Landscaping & Smart Home', progressPercentage: 20, startDate: '2026-06-01', targetCompletion: '2026-10-15', status: 'in_progress' }
    ],
    documents: [
      { id: 'doc_asp_01', title: 'A101 - Architectural Site Plan & Elevation (Rev 4)', category: 'Blueprint', fileType: 'pdf', fileSize: '24.8 MB', uploadDate: '2026-06-12', version: 'v4.2', encryptedKeyHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      { id: 'doc_asp_02', title: 'S202 - Structural Cantilever Load Analysis', category: 'CAD Drawing', fileType: 'dwg', fileSize: '48.2 MB', uploadDate: '2026-05-02', version: 'v3.0', encryptedKeyHash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb' },
      { id: 'doc_asp_03', title: 'Municipal Building Permit & Environmental Clearances', category: 'Permit', fileType: 'pdf', fileSize: '8.4 MB', uploadDate: '2025-01-15', version: 'v1.0', encryptedKeyHash: '1f8257007a1c79e67c87c7b822187b5a867edb76dfb1e843ecaa9338f71295b7' },
      { id: 'doc_asp_04', title: 'Turnkey Master Construction Agreement', category: 'Contract', fileType: 'pdf', fileSize: '14.1 MB', uploadDate: '2025-01-08', version: 'v1.0', encryptedKeyHash: 'f4d8928c0b2c129e92591038234850a221f7c52701b970b9eb228511a37c3558' }
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
      },
      {
        id: 'log_asp_100',
        date: '2026-07-21',
        title: 'Subterranean Wine Vault Climate Duct Commissioning',
        notes: 'HVAC precision sensors calibrated at 55°F and 65% RH. Smoked oak racking components received from Northern Italy workshop.',
        weather: 'Partly Cloudy 68°F',
        siteManager: 'Marcus Vance, Lead Site Engineer',
        workersOnSite: 14,
        imageUrls: [
          'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=800&auto=format&fit=crop'
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
      },
      {
        projectId: 'proj_aspen_ridge_001',
        cameraName: 'Cam 02 - Subterranean Infinity Pool & Spa Deck',
        location: 'Lower Terrace West',
        status: 'healthy',
        token: 'tok_hls_9922_asp_02',
        tokenExpiresAt: Date.now() + 600000,
        lastKnownSnapshot: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
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
    status: 'active',
    progressPercentage: 94,
    customerName: 'Dr. Evelyn Sterling',
    customerEmail: 'evelyn@sterlingholdings.com',
    customerId: 'usr_client_002',
    heroImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop'
    ],
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop',
    description: 'An architectural monument overlooking the Los Angeles basin with 270-degree ocean-to-city views. Features double-cantilevered living rooms, motorized glass walls, 12-car subterranean display gallery, and heli-pad access.',
    estimatedTier: 'tier_i',
    milestones: [
      { id: 'm1', title: 'Caisson Hillside Stabilization', description: '72 deep concrete caissons anchored into mountain ridge.', phase: 'Foundation', progressPercentage: 100, startDate: '2024-06-01', targetCompletion: '2024-10-15', status: 'completed' },
      { id: 'm2', title: 'Post-Tensioned Concrete Structure', description: 'Double cantilever slab pour with carbon-fiber reinforcement.', phase: 'Structure', progressPercentage: 100, startDate: '2024-10-20', targetCompletion: '2025-04-10', status: 'completed' },
      { id: 'm3', title: 'Automated Solar Glass & HVAC', description: 'Savant-integrated motorized glazing panels and linear air diffusers.', phase: 'MEP & Glazing', progressPercentage: 100, startDate: '2025-04-15', targetCompletion: '2025-11-30', status: 'completed' },
      { id: 'm4', title: 'Bespoke Interior Crafting & Art Gallery', description: 'Travertine wall wraps, invisible acoustic plaster, and custom brass fixtures.', phase: 'Interior Crafting', progressPercentage: 98, startDate: '2025-12-01', targetCompletion: '2026-06-30', status: 'completed' },
      { id: 'm5', title: 'Landscape, Zero-Edge Pool & Commissioning', description: '80ft zero-edge pool, olive tree grove, and smart home AV stress tests.', phase: 'Landscaping & Smart Home', progressPercentage: 88, startDate: '2026-05-01', targetCompletion: '2026-08-30', status: 'in_progress' }
    ],
    documents: [
      { id: 'doc_bel_01', title: 'Architectural Working Drawings Set (Full)', category: 'Blueprint', fileType: 'pdf', fileSize: '68.5 MB', uploadDate: '2026-04-10', version: 'v5.1', encryptedKeyHash: '8b3c1a840d210a4f59c8e88e28f2c2538f9b990e292020298a00293a9e9e1102' }
    ],
    dailyLogs: [
      {
        id: 'log_bel_201',
        date: '2026-07-22',
        title: 'Helipad & Zero-Edge Pool Lighting Calibration',
        notes: 'RGBW Fiber optic pool underwater illumination testing complete. Savant scenes linked to sunset astronomical clock.',
        weather: 'Sunny 84°F',
        siteManager: 'Elena Rostova, Senior Project Manager',
        workersOnSite: 12,
        imageUrls: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&auto=format&fit=crop']
      }
    ],
    changeOrders: [],
    cameraStreams: [
      {
        projectId: 'proj_bel_air_monolith_002',
        cameraName: 'Cam 01 - Main Cantilever & Pool Deck',
        location: 'Bel Air South Crest Mast',
        status: 'healthy',
        token: 'tok_hls_8812_bel_01',
        tokenExpiresAt: Date.now() + 600000,
        lastKnownSnapshot: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&auto=format&fit=crop',
        retryCount: 0,
        devOpsAlertSent: false
      }
    ],
    financials: {
      totalBudget: 38000000,
      disbursedAmount: 35200000,
      committedExpenses: 2100000,
      contingencyRemaining: 700000,
      projectedRoiPercent: 34.2,
      asOfDate: '2026-07-22'
    }
  },
  {
    id: 'proj_tribeca_penthouse_003',
    name: 'The TriBeCa Glass Crown',
    archetype: 'Penthouse',
    style: ['Modernist', 'Industrial Chic'],
    location: 'Hubert Street, TriBeCa, New York',
    city: 'New York',
    plotSizeSqFt: 8500,
    builtUpSqFt: 8500,
    floors: 2,
    stage: 'Structural Glazing & Sky Pavilion',
    status: 'active',
    progressPercentage: 64,
    customerName: 'Marcus & Sophia Chen',
    customerEmail: 'm.chen@tribecacapital.com',
    customerId: 'usr_client_003',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'A duplex penthouse expansion atop a historic 19th-century cast-iron building. Seamlessly blends restoration brickwork with structural glass box additions and a private rooftop garden.',
    estimatedTier: 'tier_ii',
    milestones: [
      { id: 'm1', title: 'Historic Shell Structural Reinforcement', description: 'Micropile underpinning and steel beam retrofitting.', phase: 'Structure', progressPercentage: 100, startDate: '2025-08-01', targetCompletion: '2025-12-15', status: 'completed' },
      { id: 'm2', title: 'Sky Pavilion Structural Glass Enclosure', description: 'Overhead structural glass fins and motorized roof aperture.', phase: 'MEP & Glazing', progressPercentage: 70, startDate: '2026-01-10', targetCompletion: '2026-08-15', status: 'in_progress' }
    ],
    documents: [],
    dailyLogs: [],
    changeOrders: [],
    cameraStreams: [
      {
        projectId: 'proj_tribeca_penthouse_003',
        cameraName: 'Cam 01 - TriBeCa Rooftop Sky Pavilion',
        location: 'Rooftop West Frame',
        status: 'healthy',
        token: 'tok_hls_7711_tri_01',
        tokenExpiresAt: Date.now() + 600000,
        lastKnownSnapshot: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
        retryCount: 0,
        devOpsAlertSent: false
      }
    ]
  }
];

export const MOCK_MATERIALS: MaterialItem[] = [
  {
    id: 'mat_01',
    name: 'Calacatta Borghini Marble',
    category: 'Marble & Stone',
    origin: 'Carrara, Tuscany, Italy',
    rarityTier: 'Bespoke & One-of-a-Kind',
    description: 'Ultra-rare Italian marble featuring dramatic warm honey and deep gray veining over a pure translucent milk-white background. Quarried exclusively in limited annual batches.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    specifications: {
      durabilityRating: 'High Architectural Grade (Mohs 4.2)',
      sustainabilityCert: 'EPD Certified / Quarried Low-Impact',
      thermalConductivity: '2.8 W/m·K',
      leadTimeWeeks: 12
    }
  },
  {
    id: 'mat_02',
    name: 'Smoked European Bog Oak',
    category: 'Hardwood & Timber',
    origin: 'Black Forest, Germany',
    rarityTier: 'Rare',
    description: 'Reclaimed naturally dark timber aged over centuries in oxygen-depleted peat environments. Exceptionally dense, naturally rot-resistant with a rich, dark obsidian-charcoal hue.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    specifications: {
      durabilityRating: 'Janka Hardness 1,820 lbf',
      sustainabilityCert: 'FSC Certified Reclaimed',
      thermalConductivity: '0.14 W/m·K',
      leadTimeWeeks: 8
    }
  },
  {
    id: 'mat_03',
    name: 'Hand-Brushed Champagne Titanium-Zinc',
    category: 'Metals & Alloys',
    origin: 'Graubünden, Switzerland',
    rarityTier: 'Bespoke & One-of-a-Kind',
    description: 'Weather-resistant architectural alloy with a subtle warm champagne patina that develops self-healing protective layer over time under exterior exposure.',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop',
    specifications: {
      durabilityRating: '100+ Year Structural Lifespan',
      sustainabilityCert: '100% Recyclable Green Building standard',
      leadTimeWeeks: 10
    }
  },
  {
    id: 'mat_04',
    name: 'Electrochromic Dynamic Glass',
    category: 'Smart Glazing',
    origin: 'Eindhoven, Netherlands',
    rarityTier: 'Refined',
    description: 'Triple-pane insulated glass units with electrically variable tinting, reducing solar heat gain coefficient (SHGC) from 0.45 down to 0.08 on demand.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
    specifications: {
      durabilityRating: 'Impact Resistant Class 4',
      sustainabilityCert: 'LEED Platinum Envelope Contributor',
      thermalConductivity: '0.6 W/m²K',
      leadTimeWeeks: 6
    }
  }
];

export const INITIAL_LEADS: ConsultationRequestPayload[] = [
  {
    id: 'lead_9f8a2b1c',
    fullName: 'Alexander Vance',
    email: 'a.vance@vanceholdings.com',
    phone: '+1 (310) 555-0192',
    city: 'Los Angeles',
    projectType: 'Estate',
    scaleSqFt: 18500,
    timelineUrgency: 'Immediate (1-3 mos)',
    styleAffinity: ['Modernist', 'Minimalist Warmth'],
    notes: 'Looking for turnkey luxury construction on a hilltop Bel Air lot. Require 2FA client vault and live camera feed integration.',
    estimatedTier: 'tier_i',
    utmSource: 'direct_referral',
    createdAt: '2026-07-24T09:15:00Z',
    status: 'new_inquiry',
    assignedQueue: 'white_glove_concierge',
    slaMinutes: 60
  },
  {
    id: 'lead_4c2d8e9f',
    fullName: 'Lady Beatrice Sterling',
    email: 'b.sterling@sterlingcapital.co.uk',
    phone: '+44 20 7946 0912',
    city: 'London & Aspen',
    projectType: 'Compound',
    scaleSqFt: 26000,
    timelineUrgency: '3-6 months',
    styleAffinity: ['Mountain Contemporary', 'Biophilic Architecture'],
    notes: 'Compound project involving private helipad, geothermal heating, and underground art pavilion.',
    estimatedTier: 'tier_i',
    utmSource: 'private_wealth_advisors',
    createdAt: '2026-07-23T14:20:00Z',
    status: 'consultation_scheduled',
    assignedQueue: 'white_glove_concierge',
    slaMinutes: 60
  }
];

export const INITIAL_REFERRALS: BrokerReferral[] = [
  {
    id: 'ref_88102',
    brokerId: 'broker_9921',
    brokerName: 'Harrison Ford-Smythe',
    brokerCompany: 'Sotheby\'s International Realty - Beverly Hills',
    clientName: 'Julian Sterling',
    clientEmail: 'j.sterling@estatefund.com',
    clientPhone: '+1 (310) 888-2910',
    projectType: 'Villa',
    estimatedValueRange: '$25,000,000 - $35,000,000',
    notes: 'Client acquired prime hilltop acreage in Trousdale Estates. Seeking turnkey architecture and construction partner.',
    status: 'consultation_scheduled',
    submissionDate: '2026-07-18',
    commissionEstimatePct: 2.5
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    log_id: 'audit_00123456',
    actor_id: 'user_hnw_2201',
    role: 'homeowner',
    action: 'document_download',
    resource_id: 'doc_asp_01',
    ip_address: '203.0.113.42',
    timestamp: '2026-07-24T10:14:32Z',
    result: 'success'
  },
  {
    log_id: 'audit_00123457',
    actor_id: 'user_hnw_2201',
    role: 'homeowner',
    action: 'camera_feed_view',
    resource_id: 'tok_hls_9921_asp_01',
    ip_address: '203.0.113.42',
    timestamp: '2026-07-24T10:05:12Z',
    result: 'success'
  },
  {
    log_id: 'audit_00123458',
    actor_id: 'investor_9021',
    role: 'investor',
    action: 'financial_report_export',
    resource_id: 'fin_asp_q2_2026',
    ip_address: '198.51.100.89',
    timestamp: '2026-07-23T16:30:00Z',
    result: 'success'
  }
];
