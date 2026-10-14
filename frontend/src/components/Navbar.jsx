import React, { useState } from 'react';

export default function Navbar({ 
  currentRole, 
  setRole, 
  activeTab, 
  setActiveTab, 
  onOpenPostJob,
  applicationsCount = 0,
  savedJobsCount = 0,
  unreadMessagesCount = 1
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Job Seeker 5 Primary Pages
  const seekerNavItems = [
    { id: 'explore', label: 'Explore Jobs', icon: 'search' },
    { id: 'my_applications', label: 'My Applications', icon: 'send', badge: applicationsCount },
    { id: 'messages', label: 'Messages', icon: 'chat', hasUnread: unreadMessagesCount > 0 },
    { id: 'saved_jobs', label: 'Saved Jobs', icon: 'bookmark', badge: savedJobsCount },
    { id: 'career_salary', label: 'Career & Salary', icon: 'payments' },
  ];

  // Employer Primary Pages
  const employerNavItems = [
    { id: 'employer_dashboard', label: 'Recruiter Hub', icon: 'dashboard' },
    { id: 'employer_jobs', label: 'Job Postings', icon: 'work' },
    { id: 'ats_pipeline', label: 'ATS Kanban', icon: 'view_kanban' },
    { id: 'talent_pool', label: 'Talent Pool', icon: 'groups' },
    { id: 'messages', label: 'Messages', icon: 'chat', hasUnread: unreadMessagesCount > 0 }
  ];

  const currentNavItems = currentRole === 'job_seeker' ? seekerNavItems : employerNavItems;

  const isTabActive = (itemId) => {
    if (activeTab === itemId) return true;
    if (itemId === 'my_applications' && activeTab === 'applications_tracker') return true;
    if (itemId === 'career_salary' && activeTab === 'salary_intelligence') return true;
    return false;
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_12px_rgba(20,48,34,0.04)]">
      <div className="h-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-secondary-container shadow-[0_2px_10px_rgba(0,27,14,0.18)] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">hub</span>
            </span>
            <div className="flex flex-col">
              <span className="font-headline-md text-xl font-bold tracking-tight text-primary flex items-center">
                Jobify<span className="text-secondary-container ml-0.5">2.0</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant -mt-1">
                Executive Talent
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-surface-container-low px-2 py-1.5 rounded-full border border-surface-container-high">
            {currentNavItems.map(item => {
              const active = isTabActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-full font-label-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    active 
                      ? 'bg-surface-container-lowest text-primary shadow-xs' 
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <span>{item.label}</span>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      active ? 'bg-secondary-container text-on-secondary-fixed' : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {item.hasUnread && (
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                  )}
                </button>
              );
            })}

            {/* Quick Link to Hub Overview if Candidate */}
            {currentRole === 'job_seeker' && (
              <button
                onClick={() => handleNavClick('candidate_dashboard')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'candidate_dashboard'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Hub Overview
              </button>
            )}
          </nav>
        </div>

        {/* Role & Workspace Switcher + CTAs */}
        <div className="flex items-center gap-3">
          
          {/* Quick Perspective Switcher */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-surface-container rounded-full text-xs border border-surface-container-high">
            <span className="text-[11px] text-on-surface-variant px-1 font-medium">Role:</span>
            <button
              onClick={() => {
                setRole('job_seeker');
                if (activeTab.startsWith('employer_') || activeTab === 'ats_pipeline' || activeTab === 'talent_pool') {
                  setActiveTab('explore');
                }
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                currentRole === 'job_seeker' 
                  ? 'bg-primary text-secondary-container shadow-xs' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Candidate
            </button>
            <button
              onClick={() => {
                setRole('employer');
                if (activeTab === 'explore' || activeTab === 'my_applications' || activeTab === 'saved_jobs' || activeTab === 'candidate_dashboard') {
                  setActiveTab('employer_dashboard');
                }
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                currentRole === 'employer' 
                  ? 'bg-primary text-secondary-container shadow-xs' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Employer
            </button>
          </div>

          {/* Action CTAs */}
          {currentRole === 'employer' ? (
            <button
              onClick={onOpenPostJob}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-secondary-container text-on-secondary-fixed font-label-md text-xs font-bold hover:bg-secondary-fixed-dim transition-all shadow-[0_4px_16px_rgba(204,242,26,0.3)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span className="hidden sm:inline">Post a Job</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('explore')}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-primary-container text-on-primary font-label-md text-xs font-semibold hover:bg-primary transition-all shadow-[0_4px_16px_rgba(204,242,26,0.15)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span className="hidden sm:inline">Browse Roles</span>
            </button>
          )}

          {/* User Profile / Auth Toggle */}
          <button
            onClick={() => handleNavClick('auth')}
            className="flex items-center gap-2 p-1 pl-2 bg-surface-container-low hover:bg-surface-container rounded-full border border-surface-container-high transition-colors cursor-pointer"
          >
            <span className="hidden md:inline font-label-md text-xs font-semibold text-on-surface pr-1">
              {currentRole === 'job_seeker' ? 'Annie Chen' : 'Vercel Talent'}
            </span>
            <img
              src={
                currentRole === 'job_seeker'
                  ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                  : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'
              }
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/10"
            />
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface-container-lowest border-b border-surface-container-high shadow-xl p-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-container-low">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {currentRole === 'job_seeker' ? 'Job Seeker Navigation' : 'Employer Navigation'}
            </span>
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setRole(currentRole === 'job_seeker' ? 'employer' : 'job_seeker')}
                className="text-xs font-bold text-primary underline"
              >
                Switch to {currentRole === 'job_seeker' ? 'Employer' : 'Candidate'}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {currentNavItems.map(item => {
              const active = isTabActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    active
                      ? 'bg-primary text-secondary-container'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[10px]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {currentRole === 'job_seeker' && (
              <button
                onClick={() => handleNavClick('candidate_dashboard')}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-lg">dashboard</span>
                <span>Candidate Hub Overview</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
