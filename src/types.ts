/**
 * ApexaLith ConTech & Luxury Construction Platform
 * Global TypeScript Interfaces & Types
 */

export type UserRole = 
  | 'admin'
  | 'project_manager'
  | 'customer'
  | 'architect'
  | 'engineer'
  | 'interior_designer'
  | 'procurement'
  | 'finance'
  | 'guest'
  | 'homeowner'
  | 'investor'
  | 'broker'
  | 'concierge';

export type ProjectArchetype = 
  | 'Villa'
  | 'Estate'
  | 'Penthouse'
  | 'Compound'
  | 'Historic Restoration'
  | 'Commercial Development';

export type ArchitecturalStyle = 
  | 'Modernist'
  | 'Mountain Contemporary'
  | 'Neoclassical Luxury'
  | 'Minimalist Warmth'
  | 'Biophilic Architecture'
  | 'Industrial Chic';

export type InternalTier = 'tier_i' | 'tier_ii' | 'tier_iii' | 'tier_iv';

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  city: string;
  state: string;
  country: string;
  category: 'HNW Homeowner' | 'Real Estate Developer' | 'Institutional Investor' | 'Architect Partner' | 'Premium Broker';
  assignedManager?: string;
  registrationDate: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  phase: 'Foundation' | 'Structure' | 'MEP & Glazing' | 'Interior Crafting' | 'Landscaping & Smart Home' | 'Final Handover';
  progressPercentage: number;
  startDate: string;
  targetCompletion: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  mediaUrl?: string;
  costBudgeted?: number;
  costActual?: number;
  dependencies?: string[];
  responsiblePerson?: string;
  completionEvidence?: string;
}

export interface ProjectDocument {
  id: string;
  title: string;
  category: 'Blueprint' | 'CAD Drawing' | 'Structural Analysis' | 'Permit' | 'Contract' | 'Invoice' | 'Change Order' | 'Specification';
  fileType: 'pdf' | 'dwg' | 'png' | 'docx';
  fileSize: string;
  uploadDate: string;
  version: string;
  encryptedKeyHash: string;
  downloadSignedUrl?: string;
  expiresInSeconds?: number;
  projectId?: string;
  permittedRoles?: UserRole[];
}

export interface DailyLogEntry {
  id: string;
  date: string;
  title: string;
  notes: string;
  weather: string;
  siteManager: string;
  imageUrls: string[];
  workersOnSite: number;
  delaysReported?: string;
  materialDeliveries?: string;
}

export interface ChangeOrder {
  id: string;
  title: string;
  requestedBy: string;
  dateRequested: string;
  description: string;
  costAdjustment: number;
  timeImpactDays: number;
  status: 'pending_approval' | 'approved' | 'rejected' | 'in_review';
  specificationsDoc?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface CameraStreamState {
  projectId: string;
  cameraName: string;
  location: string;
  status: 'healthy' | 'reconnecting' | 'failed' | 'unavailable';
  token: string;
  tokenExpiresAt: number;
  lastKnownSnapshot: string;
  retryCount: number;
  devOpsAlertSent: boolean;
}

export interface ProjectDetails {
  id: string;
  name: string;
  archetype: ProjectArchetype;
  style: ArchitecturalStyle[];
  location: string;
  city: string;
  plotSizeSqFt: number;
  builtUpSqFt: number;
  floors: number;
  stage: string;
  progressPercentage: number;
  heroImage: string;
  gallery: string[];
  beforeImage?: string;
  afterImage?: string;
  description: string;
  estimatedTier?: InternalTier;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  assignedManagerId?: string;
  assignedTeamMembers?: string[]; // Team member IDs
  plannedStartDate?: string;
  plannedCompletionDate?: string;
  status: 'active' | 'completed' | 'delayed' | 'on_hold' | 'archived';
  milestones: ProjectMilestone[];
  documents: ProjectDocument[];
  dailyLogs: DailyLogEntry[];
  changeOrders: ChangeOrder[];
  cameraStreams: CameraStreamState[];
  financials?: {
    totalBudget: number;
    disbursedAmount: number;
    committedExpenses: number;
    contingencyRemaining: number;
    projectedRoiPercent: number;
    asOfDate: string;
  };
}

export interface MaterialItem {
  id: string;
  name: string;
  category: 'Marble & Stone' | 'Hardwood & Timber' | 'Metals & Alloys' | 'Smart Glazing' | 'Acoustics & Surfaces';
  origin: string;
  rarityTier: 'Refined' | 'Rare' | 'Bespoke & One-of-a-Kind';
  description: string;
  image: string;
  specifications: {
    durabilityRating: string;
    sustainabilityCert: string;
    thermalConductivity?: string;
    leadTimeWeeks: number;
  };
}

export interface SmartEstimatorInput {
  archetype: ProjectArchetype;
  sqFtScale: number;
  siteComplexity: 'Flat Lot' | 'Hillside / Slope' | 'Waterfront / Marine' | 'Historic Landmark Constraints';
  materialAspiration: 'Refined' | 'Rare' | 'Bespoke & One-of-a-Kind';
  timelineUrgency: 'Immediate (1-3 mos)' | '3-6 months' | '6-12 months' | 'Exploratory Phase';
  styleAffinity: ArchitecturalStyle[];
  region: string;
}

export type InquiryStatus = 
  | 'New Inquiry'
  | 'Contacted'
  | 'Consultation Scheduled'
  | 'Site Visit Scheduled'
  | 'Quotation Preparation'
  | 'Quotation Sent'
  | 'Negotiation'
  | 'Approved'
  | 'Rejected'
  | 'On Hold';

export interface CustomerInquiry {
  id: string; // e.g. INQ-2026-84210
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  preferredCommunication: 'phone' | 'email' | 'whatsapp';
  city: string;
  state: string;

  // Project Information
  projectType: 'residential' | 'commercial' | 'interior_design' | 'renovation' | 'turnkey';
  projectName?: string;
  siteAddress: string;
  mapLocation?: string;
  plotSizeSqFt?: number;
  builtUpAreaSqFt?: number;
  floors?: number;
  currentProjectStage?: string;

  // Planning
  budgetRange: string;
  budgetFlexibility: 'fixed' | 'plus_minus_10' | 'flexible';
  preferredStartDate?: string;
  expectedCompletionDate?: string;
  requiredServices: string[];
  projectDescription: string;

  // Design Preferences
  designPreference: 'modern' | 'luxury' | 'minimalist' | 'contemporary' | 'traditional';
  preferredColorsMaterials?: string;
  inspirationLinks?: string;

  // Documents
  uploadedDocuments?: {
    name: string;
    size: string;
    type: string;
    url?: string;
  }[];

  // Meeting Preferences
  meetingPreference: 'online' | 'site_visit' | 'office';
  preferredMeetingDate?: string;
  preferredMeetingTime?: string;
  meetingPurpose?: string;

  // Internal Management
  status: InquiryStatus;
  assignedOwner?: string;
  contactNotes?: {
    note: string;
    author: string;
    timestamp: string;
  }[];
  followUpDate?: string;
  convertedProjectId?: string;
  createdAt: string;
  updatedAt: string;
}

// Backward compatibility alias for ConsultationRequestPayload
export interface ConsultationRequestPayload {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  city: string;
  projectType: ProjectArchetype;
  scaleSqFt: number;
  timelineUrgency: string;
  styleAffinity: string[];
  notes?: string;
  estimatedTier?: InternalTier;
  utmSource?: string;
  createdAt: string;
  status: any;
  assignedQueue: string;
  slaMinutes: number;
}

export interface QuotationLineItem {
  id: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';

export interface ProjectQuotation {
  id: string; // e.g. QUO-2026-001
  projectId?: string;
  inquiryId?: string;
  clientName: string;
  clientEmail: string;
  projectName: string;
  items: QuotationLineItem[];
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  total: number;
  validUntil: string;
  status: QuotationStatus;
  acceptedAt?: string;
  acceptedBy?: string;
  rejectionReason?: string;
  revision: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceOffering {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  keyDeliverables: string[];
  image: string;
  published: boolean;
  order: number;
}

export interface ApprovalRequest {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  category: 'Design' | 'Material' | 'Scope Change' | 'Milestone Sign-off';
  description: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  actedBy?: string;
  actedAt?: string;
  notes?: string;
  costImpact?: number;
  mediaUrls?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'project_manager' | 'architect' | 'engineer' | 'interior_designer' | 'procurement' | 'finance';
  status: 'active' | 'inactive';
  assignedProjectIds: string[];
  phone?: string;
  joinedAt: string;
}

export interface InvoiceRecord {
  id: string;
  projectId: string;
  projectName: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Partially Paid';
  paidAmount?: number;
  paidAt?: string;
  createdAt: string;
}

export interface MeetingRecord {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  type: 'online' | 'site_visit' | 'office';
  date: string;
  time: string;
  purpose: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface NotificationItem {
  id: string;
  recipientRole: UserRole;
  recipientId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'inquiry' | 'approval' | 'milestone' | 'document' | 'payment';
}

export interface BrokerReferral {
  id: string;
  brokerId: string;
  brokerName: string;
  brokerCompany: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectType: ProjectArchetype;
  estimatedValueRange: string;
  notes: string;
  status: 'submitted' | 'under_review' | 'qualified' | 'consultation_scheduled' | 'converted' | 'closed_lost';
  submissionDate: string;
  commissionEstimatePct: number;
}

export interface AuditLogEntry {
  log_id: string;
  actor_id: string;
  role: UserRole;
  action: string;
  resource_id: string;
  ip_address: string;
  timestamp: string;
  result: 'success' | 'denied' | 'error';
}
