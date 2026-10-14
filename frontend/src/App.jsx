import React, { useState } from 'react';
import Navbar from './components/Navbar';
import JobApplyModal from './components/JobApplyModal';
import PostJobModal from './components/PostJobModal';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ExploreJobsPage from './pages/ExploreJobsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import MessagesPage from './pages/MessagesPage';
import SavedJobsPage from './pages/SavedJobsPage';
import CareerSalaryPage from './pages/CareerSalaryPage';
import CandidateDashboardPage from './pages/CandidateDashboardPage';
import EmployerDashboardPage from './pages/EmployerDashboardPage';
import EmployerJobsPage from './pages/EmployerJobsPage';
import AtsPipelinePage from './pages/AtsPipelinePage';
import TalentPoolPage from './pages/TalentPoolPage';
import { initialJobs, initialApplications, initialSavedJobs } from './data/mockData';

export default function App() {
  const [currentRole, setRole] = useState('job_seeker'); // 'job_seeker' | 'employer'
  const [activeTab, setActiveTab] = useState('landing');
  const [jobs, setJobs] = useState(initialJobs);
  const [applications, setApplications] = useState(initialApplications);
  const [savedJobs, setSavedJobs] = useState(initialSavedJobs);
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeThreadId, setActiveThreadId] = useState(null);

  const savedJobIds = savedJobs.map(s => s.job_id || s.id);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleApplySuccess = (newApp) => {
    const appWithId = {
      ...newApp,
      id: `app-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setApplications([appWithId, ...applications]);
    showToast(`Application successfully submitted to ${newApp.company_name}!`);
  };

  const handleToggleSave = (job) => {
    const isSaved = savedJobIds.includes(job.id);
    if (isSaved) {
      setSavedJobs(savedJobs.filter(s => (s.job_id || s.id) !== job.id));
      showToast('Removed from saved opportunities.');
    } else {
      const newSaved = {
        id: `save-${Date.now()}`,
        user_id: 'usr-annie',
        job_id: job.id,
        job_title: job.title,
        company_name: job.company_name,
        location: job.location,
        job_type: job.job_type,
        salary_range: job.salary_range,
        created_at: new Date().toISOString()
      };
      setSavedJobs([newSaved, ...savedJobs]);
      showToast('Saved opportunity to your bookmarks!');
    }
  };

  const handleWithdrawApplication = (appId) => {
    setApplications(applications.filter(a => a.id !== appId));
    showToast('Application withdrawn and archived.');
  };

  const handleOpenMessage = (companyName) => {
    if (companyName && companyName.toLowerCase().includes('vercel')) {
      setActiveThreadId('thread-1');
    } else if (companyName && companyName.toLowerCase().includes('linear')) {
      setActiveThreadId('thread-2');
    } else if (companyName && companyName.toLowerCase().includes('cognition')) {
      setActiveThreadId('thread-3');
    } else if (companyName && companyName.toLowerCase().includes('stripe')) {
      setActiveThreadId('thread-4');
    }
    setActiveTab('messages');
  };

  const handleJobCreated = (newJob) => {
    setJobs([newJob, ...jobs]);
    showToast(`Job circular "${newJob.title}" posted successfully!`);
    setActiveTab('employer_jobs');
  };

  const handleToggleJobStatus = (jobId) => {
    setJobs(jobs.map(j => {
      if (j.id === jobId) {
        const nextStatus = j.status === 'active' ? 'closed' : 'active';
        showToast(`Requisition "${j.title}" is now ${nextStatus}.`);
        return { ...j, status: nextStatus };
      }
      return j;
    }));
  };

  const handleUpdateStatus = (appId, newStatus) => {
    setApplications(applications.map(a => {
      if (a.id === appId) {
        showToast(`Candidate stage updated to "${newStatus}".`);
        return { ...a, status: newStatus };
      }
      return a;
    }));
  };

  const handleLoginSuccess = (user) => {
    setRole(user.role);
    showToast(`Welcome ${user.full_name}!`);
    setActiveTab(user.role === 'employer' ? 'employer_dashboard' : 'candidate_dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md selection:bg-secondary-container selection:text-on-secondary-fixed">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-primary text-secondary-container shadow-2xl border border-secondary-container/20 text-xs font-bold animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation Bar */}
      <Navbar
        currentRole={currentRole}
        setRole={(role) => {
          setRole(role);
          if (role === 'employer' && (activeTab === 'candidate_dashboard' || activeTab === 'my_applications' || activeTab === 'saved_jobs')) {
            setActiveTab('employer_dashboard');
          } else if (role === 'job_seeker' && activeTab === 'employer_dashboard') {
            setActiveTab('explore');
          }
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPostJob={() => setIsPostJobOpen(true)}
        applicationsCount={applications.length}
        savedJobsCount={savedJobs.length}
        unreadMessagesCount={1}
      />

      {/* Quick Navigation Drawer for Fast Testing of All Screens */}
      <div className="fixed bottom-4 left-4 z-40 hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-surface-container-lowest/95 backdrop-blur-md border border-surface-container-high shadow-lg text-[11px] font-semibold text-on-surface-variant">
        <span className="px-2 text-primary font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">hub</span> Seeker Pages:
        </span>
        <button
          onClick={() => setActiveTab('explore')}
          className={`px-2.5 py-1 rounded-full transition-colors ${activeTab === 'explore' ? 'bg-primary text-secondary-container font-bold' : 'hover:text-primary'}`}
        >
          1. Explore Jobs
        </button>
        <button
          onClick={() => setActiveTab('my_applications')}
          className={`px-2.5 py-1 rounded-full transition-colors ${activeTab === 'my_applications' || activeTab === 'applications_tracker' ? 'bg-primary text-secondary-container font-bold' : 'hover:text-primary'}`}
        >
          2. My Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-2.5 py-1 rounded-full transition-colors ${activeTab === 'messages' ? 'bg-primary text-secondary-container font-bold' : 'hover:text-primary'}`}
        >
          3. Messages
        </button>
        <button
          onClick={() => setActiveTab('saved_jobs')}
          className={`px-2.5 py-1 rounded-full transition-colors ${activeTab === 'saved_jobs' ? 'bg-primary text-secondary-container font-bold' : 'hover:text-primary'}`}
        >
          4. Saved Jobs ({savedJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('career_salary')}
          className={`px-2.5 py-1 rounded-full transition-colors ${activeTab === 'career_salary' || activeTab === 'salary_intelligence' ? 'bg-primary text-secondary-container font-bold' : 'hover:text-primary'}`}
        >
          5. Career & Salary
        </button>
        
        <span className="w-px h-3 bg-surface-container-high mx-1"></span>

        <button
          onClick={() => setActiveTab('candidate_dashboard')}
          className={`px-2 py-1 rounded-full text-xs font-semibold ${activeTab === 'candidate_dashboard' ? 'bg-primary text-secondary-container font-bold' : 'hover:text-primary'}`}
        >
          Hub
        </button>
      </div>

      {/* Pages Container */}
      <main className="w-full">
        {activeTab === 'landing' && (
          <LandingPage
            jobs={jobs}
            onSelectJob={(job) => setApplyModalJob(job)}
            onApplyJob={(job) => setApplyModalJob(job)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* 1. Explore Jobs */}
        {activeTab === 'explore' && (
          <ExploreJobsPage
            jobs={jobs}
            savedJobIds={savedJobIds}
            onToggleSave={handleToggleSave}
            onApplyJob={(job) => setApplyModalJob(job)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* 2. My Applications */}
        {(activeTab === 'my_applications' || activeTab === 'applications_tracker') && (
          <MyApplicationsPage
            applications={applications}
            onNavigate={(tab) => setActiveTab(tab)}
            onWithdrawApplication={handleWithdrawApplication}
            onOpenMessage={handleOpenMessage}
          />
        )}

        {/* 3. Messages */}
        {activeTab === 'messages' && (
          <MessagesPage
            currentRole={currentRole}
            initialThreadId={activeThreadId}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* 4. Saved Jobs */}
        {activeTab === 'saved_jobs' && (
          <SavedJobsPage
            savedJobs={savedJobs}
            onRemoveSaved={(jobId) => setSavedJobs(savedJobs.filter(s => (s.job_id || s.id) !== jobId))}
            onApplyJob={(job) => setApplyModalJob(job)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* 5. Career & Salary */}
        {(activeTab === 'career_salary' || activeTab === 'salary_intelligence') && (
          <CareerSalaryPage
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Candidate Dashboard Overview */}
        {activeTab === 'candidate_dashboard' && (
          <CandidateDashboardPage
            applications={applications}
            savedJobs={savedJobs}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectJob={(job) => setApplyModalJob(job)}
          />
        )}

        {/* Auth / Account Page */}
        {activeTab === 'auth' && (
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        )}

        {/* Employer Side Pages */}
        {activeTab === 'employer_dashboard' && (
          <EmployerDashboardPage
            jobs={jobs}
            applications={applications}
            onOpenPostJob={() => setIsPostJobOpen(true)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'employer_jobs' && (
          <EmployerJobsPage
            jobs={jobs}
            onToggleJobStatus={handleToggleJobStatus}
            onOpenPostJob={() => setIsPostJobOpen(true)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'ats_pipeline' && (
          <AtsPipelinePage
            applications={applications}
            onUpdateStatus={handleUpdateStatus}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'talent_pool' && (
          <TalentPoolPage
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Reusable Modals */}
      <JobApplyModal
        job={applyModalJob}
        isOpen={Boolean(applyModalJob)}
        onClose={() => setApplyModalJob(null)}
        onApplySuccess={handleApplySuccess}
      />

      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onJobCreated={handleJobCreated}
      />

    </div>
  );
}
