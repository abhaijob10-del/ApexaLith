import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  ProjectDetails, 
  CustomerInquiry, 
  AuditLogEntry 
} from './types';
import { 
  INITIAL_PROJECTS, 
  MOCK_MATERIALS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ConstructionStageSequence } from './components/ConstructionStageSequence';
import { DomainsGrid } from './components/DomainsGrid';
import { PortfolioSpotlight } from './components/PortfolioSpotlight';
import { MaterialShowroom } from './components/MaterialShowroom';
import { SmartEstimatorModal } from './components/SmartEstimatorModal';
import { ConsultationModal } from './components/ConsultationModal';
import { VipClientPortal } from './components/VipClientPortal';
import { ConstructionTeamPortal } from './components/ConstructionTeamPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core Projects State
  const [projects, setProjects] = useState<ProjectDetails[]>(INITIAL_PROJECTS);

  // Modals
  const [consultationOpen, setConsultationOpen] = useState<boolean>(false);
  const [consultationPrefill, setConsultationPrefill] = useState<any | null>(null);
  const [estimatorOpen, setEstimatorOpen] = useState<boolean>(false);
  const [aiAdvisorOpen, setAiAdvisorOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Load latest projects on mount
  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(d => {
        if (d.projects && d.projects.length > 0) {
          setProjects(d.projects);
        }
      })
      .catch(err => console.warn('Using initial projects:', err));
  }, []);

  const handleToggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleOpenConsultationWithData = (data: any) => {
    setConsultationPrefill(data);
    setConsultationOpen(true);
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (!currentUser || currentUser.role !== role) {
      if (role === 'customer' || role === 'homeowner') {
        setCurrentUser({
          id: 'usr_client_001',
          name: 'Lord Alexander Vance',
          email: 'a.vance@vanceholdings.com',
          role: 'customer',
          projectId: 'proj_aspen_ridge_001'
        });
      } else if (role === 'project_manager') {
        setCurrentUser({
          id: 'team_01',
          name: 'Marcus Vance',
          email: 'm.vance@apexalith.com',
          role: 'project_manager',
          assignedProjectIds: ['proj_aspen_ridge_001']
        });
      } else if (role === 'admin') {
        setCurrentUser({
          id: 'usr_admin_001',
          name: 'Executive Administrator',
          email: 'admin@apexalith.com',
          role: 'admin'
        });
      }
    }
  };

  const handleLoginSuccess = (role: UserRole, targetTab?: string, userPayload?: any) => {
    setCurrentRole(role);
    if (userPayload) {
      setCurrentUser(userPayload);
    }
    if (targetTab) {
      setActiveTab(targetTab);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDarkMode ? 'bg-[#080B10] text-[#F5F5F0]' : 'bg-[#F9F8F5] text-slate-900'
    }`}>
      {/* Global Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenConsultation={() => {
          setConsultationPrefill(null);
          setConsultationOpen(true);
        }}
        onOpenEstimator={() => setEstimatorOpen(true)}
        onOpenAiAdvisor={() => setAiAdvisorOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onNavigateTab={setActiveTab}
        activeTab={activeTab}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <ErrorBoundary fallbackTitle="Public Showcase">
            <HeroSection
              onOpenConsultation={() => {
                setConsultationPrefill(null);
                setConsultationOpen(true);
              }}
              onOpenEstimator={() => setEstimatorOpen(true)}
              onOpenAuth={() => setAuthModalOpen(true)}
              onNavigateTab={setActiveTab}
              isDarkMode={isDarkMode}
            />

            <ConstructionStageSequence
              onOpenConsultation={() => {
                setConsultationPrefill(null);
                setConsultationOpen(true);
              }}
              isDarkMode={isDarkMode}
            />

            <PortfolioSpotlight
              projects={projects}
              onOpenConsultation={() => {
                setConsultationPrefill(null);
                setConsultationOpen(true);
              }}
              isDarkMode={isDarkMode}
              searchQuery={searchQuery}
            />

            <DomainsGrid
              onOpenConsultation={() => {
                setConsultationPrefill(null);
                setConsultationOpen(true);
              }}
              isDarkMode={isDarkMode}
            />

            <MaterialShowroom
              materials={MOCK_MATERIALS}
              isDarkMode={isDarkMode}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'portfolio' && (
          <PortfolioSpotlight
            projects={projects}
            onOpenConsultation={() => {
              setConsultationPrefill(null);
              setConsultationOpen(true);
            }}
            isDarkMode={isDarkMode}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'domains' && (
          <DomainsGrid
            onOpenConsultation={() => {
              setConsultationPrefill(null);
              setConsultationOpen(true);
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialShowroom
            materials={MOCK_MATERIALS}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'vault' && (
          <ErrorBoundary fallbackTitle="Client VIP Vault">
            <VipClientPortal
              currentRole={currentRole}
              currentUser={currentUser}
              projects={projects}
              isDarkMode={isDarkMode}
              onOpenConsultation={() => {
                setConsultationPrefill(null);
                setConsultationOpen(true);
              }}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'construction_portal' && (
          <ErrorBoundary fallbackTitle="Construction Team Workspace">
            <ConstructionTeamPortal
              currentUser={currentUser}
              isDarkMode={isDarkMode}
              onNavigateTab={setActiveTab}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'admin' && (
          <ErrorBoundary fallbackTitle="Admin Command Centre">
            <AdminDashboard
              isDarkMode={isDarkMode}
              onNavigateTab={setActiveTab}
            />
          </ErrorBoundary>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onOpenConsultation={() => {
          setConsultationPrefill(null);
          setConsultationOpen(true);
        }}
        onOpenEstimator={() => setEstimatorOpen(true)}
        onNavigateTab={setActiveTab}
        isDarkMode={isDarkMode}
      />

      {/* Multi-Step Customer Inquiry & Quotation Pipeline Modal */}
      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        prefilledData={consultationPrefill}
        isDarkMode={isDarkMode}
        onInquirySubmitted={() => {
          // Refresh data if in admin
        }}
      />

      {/* Smart Estimator Modal */}
      <SmartEstimatorModal
        isOpen={estimatorOpen}
        onClose={() => setEstimatorOpen(false)}
        projects={projects}
        onOpenConsultationWithData={handleOpenConsultationWithData}
        isDarkMode={isDarkMode}
      />

      {/* Architectural Advisor AI Modal */}
      <AiAdvisorModal
        isOpen={aiAdvisorOpen}
        onClose={() => setAiAdvisorOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Secure Role-Based Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
