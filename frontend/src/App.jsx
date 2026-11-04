import React, { useState, useEffect } from 'react';
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
import { authAPI, jobsAPI, applicationsAPI, savedJobsAPI } from './services/api';

export default function App() {
  const [currentRole, setRole] = useState('job_seeker'); // 'job_seeker' | 'employer'
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('jobify_active_tab') || 'landing');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Persist active tab
  useEffect(() => {
    localStorage.setItem('jobify_active_tab', activeTab);
  }, [activeTab]);
  useEffect(() => {
    const token = localStorage.getItem('jobify_token');
    const storedUser = localStorage.getItem('jobify_user');
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setRole(userData.role);
        fetchDashboardData(userData.role);
      } catch (e) {
        localStorage.removeItem('jobify_token');
        localStorage.removeItem('jobify_user');
      }
    }
  }, []);

  // Fetch all dashboard data from backend based on role
  const fetchDashboardData = async (role) => {
    setLoading(true);
    try {
      if (role === 'employer') {
        // Fetch employer's own job postings
        const jobsRes = await jobsAPI.myPostings();
        setJobs(jobsRes.data || []);

        // Fetch applications for employer's jobs
        const employerJobIds = (jobsRes.data || []).map(j => j.id);
        const allApps = [];
        for (const jobId of employerJobIds) {
          try {
            const appsRes = await applicationsAPI.byJob(jobId);
            allApps.push(...(appsRes.data || []));
          } catch (e) {
            console.warn(`Failed to fetch applications for job ${jobId}`, e);
          }
        }
        setApplications(allApps);
      } else {
        // Fetch all active jobs for seeker
        const jobsRes = await jobsAPI.list({ limit: 50 });
        setJobs(jobsRes.data || []);

        // Fetch seeker's own applications
        const appsRes = await applicationsAPI.list();
        setApplications(appsRes.data || []);

        // Fetch seeker's saved jobs
        const savedRes = await savedJobsAPI.list();
        setSavedJobs(savedRes.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      showToast('Failed to load dashboard data from server.');
    } finally {
      setLoading(false);
    }
  };

  const savedJobIds = savedJobs.map(s => s.job_id || s.id);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
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

  const handleApplySuccess = async (newApp) => {
    try {
      setLoading(true);
      const response = await applicationsAPI.create({
        job_id: newApp.job_id,
        resume_url: newApp.resume_url,
        cover_letter: newApp.cover_letter,
      });
      const newAppData = response.data;
      setApplications([newAppData, ...applications]);
      showToast(`Application successfully submitted to ${newApp.company_name}!`);
      if (currentRole === 'job_seeker') {
        const savedRes = await savedJobsAPI.list();
        setSavedJobs(savedRes.data || []);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Application failed.';
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (job) => {
    const isSaved = savedJobIds.includes(job.id);
    try {
      setLoading(true);
      if (isSaved) {
        await savedJobsAPI.remove(job.id);
        setSavedJobs(savedJobs.filter(s => (s.job_id || s.id) !== job.id));
        showToast('Removed from saved opportunities.');
      } else {
        const response = await savedJobsAPI.save(job.id);
        const newSaved = {
          id: response.data.id || `save-${Date.now()}`,
          user_id: response.data.user_id || user?.id,
          job_id: response.data.job_id || job.id,
          job_title: response.data.job_title || job.title,
          company_name: response.data.company_name || job.company_name,
          location: response.data.location || job.location,
          job_type: response.data.job_type || job.job_type,
          salary_range: response.data.salary_range || job.salary_range,
          created_at: response.data.created_at || new Date().toISOString()
        };
        setSavedJobs([newSaved, ...savedJobs]);
        showToast('Saved opportunity to your bookmarks!');
      }
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Save failed.';
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawApplication = async (appId) => {
    try {
      setLoading(true);
      await applicationsAPI.withdraw(appId);
      setApplications(applications.filter(a => a.id !== appId));
      showToast('Application withdrawn and archived.');
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Withdraw failed.';
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleJobCreated = async (jobData) => {
    try {
      setLoading(true);
      const requirements = jobData.requirements
        ? jobData.requirements.split('\n').filter(r => r.trim().length > 0)
        : [];

      const response = await jobsAPI.create({
        title: jobData.title,
        description: jobData.description || 'Join our executive team driving high-impact technical initiatives.',
        company_name: jobData.company_name,
        location: jobData.location,
        job_type: jobData.job_type || 'Full-Time',
        salary_range: jobData.salary_range,
        requirements,
        category: jobData.category || 'General',
      });
      const newJob = response.data;
      setJobs([newJob, ...jobs]);
      showToast(`Job "${newJob.title}" published successfully!`);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Job posting failed.';
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleJobStatus = async (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    try {
      setLoading(true);
      const newStatus = job.status === 'active' ? 'closed' : 'active';
      const response = await jobsAPI.update(jobId, { status: newStatus });
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: response.data.status } : j));
      showToast(`Job "${job.title}" ${newStatus === 'active' ? 'activated' : 'closed'}.`);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Status update failed.';
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      setLoading(true);
      const response = await applicationsAPI.updateStatus(appId, newStatus);
      setApplications(apps =>
        apps.map(a => a.id === appId ? { ...a, status: response.data.status } : a)
      );
      showToast(`Candidate status updated to ${newStatus}.`);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Status update failed.';
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setRole(userData.role);
    showToast(`Welcome ${userData.full_name}!`);
    fetchDashboardData(userData.role);
    setActiveTab(userData.role === 'employer' ? 'employer_dashboard' : 'candidate_dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('jobify_token');
    localStorage.removeItem('jobify_user');
    setUser(null);
    setIsAuthenticated(false);
    setRole('job_seeker');
    setActiveTab('landing');
    setJobs([]);
    setApplications([]);
    setSavedJobs([]);
    showToast('Logged out successfully.');
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
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

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
            user={user}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectJob={(job) => setApplyModalJob(job)}
          />
        )}

        {/* Auth / Account Page */}
        {activeTab === 'auth' && (
          <AuthPage
            onLoginSuccess={handleLoginSuccess}
            isAuthenticated={isAuthenticated}
            user={user}
          />
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
