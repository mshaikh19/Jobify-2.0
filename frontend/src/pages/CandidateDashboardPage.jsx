import React from 'react';

export default function CandidateDashboardPage({ applications, savedJobs, onNavigate, onSelectJob }) {
  const interviewingApps = applications.filter(a => a.status === 'interviewing');
  const acceptedApps = applications.filter(a => a.status === 'accepted');

  return (
    <div className="w-full pt-24 pb-16 bg-background min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-primary-container text-on-primary rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[0_16px_36px_-6px_rgba(20,48,34,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-container text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
            Verified Executive Talent Profile
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold">
            Welcome back, Annie Chen
          </h1>
          <p className="text-on-primary-container text-xs sm:text-sm mt-1 max-w-xl">
            You have <strong className="text-secondary-container">{interviewingApps.length} upcoming interview loop</strong> and <strong className="text-on-primary">{acceptedApps.length} active executive offer</strong> awaiting your review.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => onNavigate('applications_tracker')}
            className="px-5 py-2.5 rounded-full bg-secondary-container text-on-secondary-fixed text-xs font-bold shadow-md hover:bg-secondary-fixed-dim transition-all"
          >
            Open Interview Tracker
          </button>
          <button
            onClick={() => onNavigate('explore')}
            className="px-5 py-2.5 rounded-full bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-on-primary text-xs font-semibold backdrop-blur-md transition-colors"
          >
            Find New Roles
          </button>
        </div>
      </div>

      {/* KPI Stat Cards matching Executive Talent Suite */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high/80 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-caps text-[11px] uppercase font-bold tracking-wider">Active Applied</span>
            <span className="material-symbols-outlined text-primary text-xl">send</span>
          </div>
          <div className="font-headline-lg text-2xl font-bold text-primary">{applications.length}</div>
          <span className="text-[11px] text-on-surface-variant mt-1 block">Transmitted directly to teams</span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high/80 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-caps text-[11px] uppercase font-bold tracking-wider">Interview Loops</span>
            <span className="material-symbols-outlined text-secondary text-xl">event</span>
          </div>
          <div className="font-headline-lg text-2xl font-bold text-primary">{interviewingApps.length}</div>
          <span className="text-[11px] text-secondary font-bold mt-1 block">Live scheduling active</span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high/80 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-caps text-[11px] uppercase font-bold tracking-wider">Saved Circulars</span>
            <span className="material-symbols-outlined text-primary text-xl">bookmark</span>
          </div>
          <div className="font-headline-lg text-2xl font-bold text-primary">{savedJobs.length}</div>
          <button 
            onClick={() => onNavigate('saved_jobs')}
            className="text-[11px] font-bold text-primary hover:underline mt-1 block text-left"
          >
            View saved bookmarks →
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high/80 shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-caps text-[11px] uppercase font-bold tracking-wider">Offers Received</span>
            <span className="material-symbols-outlined text-primary text-xl">verified</span>
          </div>
          <div className="font-headline-lg text-2xl font-bold text-primary">{acceptedApps.length}</div>
          <span className="text-[11px] text-on-surface-variant mt-1 block">Base + RSUs extended</span>
        </div>
      </div>

      {/* Main Grid: Application Feed + Fast Access Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Applications Feed (8 Cols) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/80 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-container-low">
            <div>
              <h2 className="font-headline-sm text-lg font-bold text-primary">Recent Application Pipeline</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Live tracking synchronized with recruiter ATS</p>
            </div>
            <button
              onClick={() => onNavigate('applications_tracker')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Full ATS Tracker</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="space-y-4">
            {applications.map((app) => {
              const statusColors = {
                applied: 'bg-surface-container text-on-surface-variant',
                reviewed: 'bg-primary-container/10 text-primary',
                interviewing: 'bg-secondary-container/20 text-on-secondary-container font-bold ring-1 ring-secondary-container/40',
                accepted: 'bg-emerald-100 text-emerald-800 font-bold',
                rejected: 'bg-rose-100 text-rose-800'
              };

              return (
                <div 
                  key={app.id}
                  className="p-4 rounded-xl border border-surface-container-high hover:border-primary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center font-bold text-primary text-sm shrink-0">
                      {app.company_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-sm font-bold text-primary">{app.job_title}</h4>
                      <p className="text-xs text-on-surface-variant">{app.company_name} • Applied {new Date(app.created_at).toLocaleDateString()}</p>
                      {app.recruiter_notes && (
                        <p className="text-[11px] text-on-surface-variant/80 mt-1 italic">
                          "{app.recruiter_notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className={`px-3 py-1 rounded-full text-xs capitalize ${statusColors[app.status] || 'bg-surface-container'}`}>
                      {app.status}
                    </span>
                    <button
                      onClick={() => onNavigate('applications_tracker')}
                      className="p-1.5 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container transition-colors"
                      title="Inspect Application"
                    >
                      <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Tools & Shortcuts (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Upcoming Interview Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/80 shadow-xs">
            <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-base">alarm</span> Next Scheduled Interview
            </div>
            <h3 className="font-headline-sm text-base font-bold text-primary">Technical Architecture Loop</h3>
            <p className="text-xs text-on-surface-variant mt-1">Vercel Architecture Labs • Friday, 3:00 PM EST</p>
            
            <div className="mt-4 p-3 rounded-xl bg-surface-container-low space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Round:</span>
                <span className="font-bold text-primary">Staff Distributed Systems (90m)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Lead Interviewer:</span>
                <span className="font-bold text-primary">Marcus Vance (VP Eng)</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('messages')}
              className="mt-4 w-full py-2.5 rounded-full bg-secondary-container text-on-secondary-fixed text-xs font-bold hover:bg-secondary-fixed-dim transition-colors shadow-xs"
            >
              Message Hiring Lead
            </button>
          </div>

          {/* Quick Hub Links */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/80 shadow-xs space-y-3">
            <h3 className="font-headline-sm text-sm font-bold text-primary mb-3">Talent Hub Shortcuts</h3>
            
            <button
              onClick={() => onNavigate('saved_jobs')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors text-xs font-semibold text-on-surface"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-lg">bookmark</span>
                <span>Saved Opportunities ({savedJobs.length})</span>
              </div>
              <span className="material-symbols-outlined text-sm text-on-surface-variant">arrow_forward</span>
            </button>

            <button
              onClick={() => onNavigate('salary_intelligence')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors text-xs font-semibold text-on-surface"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-lg">query_stats</span>
                <span>Salary & Career Intelligence</span>
              </div>
              <span className="material-symbols-outlined text-sm text-on-surface-variant">arrow_forward</span>
            </button>

            <button
              onClick={() => onNavigate('messages')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors text-xs font-semibold text-on-surface"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-lg">chat</span>
                <span>Direct Recruiter Messages</span>
              </div>
              <span className="material-symbols-outlined text-sm text-on-surface-variant">arrow_forward</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
