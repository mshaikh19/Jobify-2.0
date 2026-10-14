import React, { useState } from 'react';

export default function MyApplicationsPage({ 
  applications, 
  onNavigate, 
  onWithdrawApplication, 
  onOpenMessage 
}) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMeetingApp, setActiveMeetingApp] = useState(null);
  const [activeOfferApp, setActiveOfferApp] = useState(null);
  const [withdrawingId, setWithdrawingId] = useState(null);

  const filtered = applications.filter(app => {
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = !searchQuery ||
      app.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.id && app.id.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const stages = [
    { key: 'applied', label: '1. Applied', icon: 'send' },
    { key: 'reviewed', label: '2. Under Review', icon: 'find_in_page' },
    { key: 'interviewing', label: '3. Interview Loop', icon: 'video_chat' },
    { key: 'accepted', label: '4. Offer / Accepted', icon: 'verified' }
  ];

  const totalCount = applications.length;
  const interviewingCount = applications.filter(a => a.status === 'interviewing').length;
  const reviewedCount = applications.filter(a => a.status === 'reviewed').length;
  const offerCount = applications.filter(a => a.status === 'accepted').length;

  return (
    <div className="w-full pt-24 pb-16 bg-background min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-container-high/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
            Real-Time ATS Synchronization
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold">
            My Applications
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-2xl">
            Live status of your executive candidacy mirrored directly from internal corporate recruitment pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('explore')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-container text-on-primary text-xs font-bold hover:bg-primary transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-base">search</span>
            <span>Explore More Roles</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setFilterStatus('all')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'all' 
              ? 'bg-surface-container-lowest border-primary shadow-sm ring-1 ring-primary/20' 
              : 'bg-surface-container-lowest border-surface-container-high hover:border-primary/40'
          }`}
        >
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Active</span>
            <span className="material-symbols-outlined text-primary text-xl">all_inbox</span>
          </div>
          <div className="text-2xl font-bold text-primary">{totalCount}</div>
          <span className="text-[11px] text-on-surface-variant mt-1 block">Live candidacies</span>
        </div>

        <div 
          onClick={() => setFilterStatus('interviewing')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'interviewing' 
              ? 'bg-surface-container-lowest border-secondary shadow-sm ring-1 ring-secondary/30' 
              : 'bg-surface-container-lowest border-surface-container-high hover:border-secondary/40'
          }`}
        >
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Interview Loops</span>
            <span className="material-symbols-outlined text-secondary text-xl">video_camera_front</span>
          </div>
          <div className="text-2xl font-bold text-secondary">{interviewingCount}</div>
          <span className="text-[11px] text-secondary font-semibold mt-1 block">Rounds scheduled</span>
        </div>

        <div 
          onClick={() => setFilterStatus('reviewed')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'reviewed' 
              ? 'bg-surface-container-lowest border-primary shadow-sm ring-1 ring-primary/20' 
              : 'bg-surface-container-lowest border-surface-container-high hover:border-primary/40'
          }`}
        >
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Under Review</span>
            <span className="material-symbols-outlined text-primary text-xl">find_in_page</span>
          </div>
          <div className="text-2xl font-bold text-primary">{reviewedCount}</div>
          <span className="text-[11px] text-on-surface-variant mt-1 block">Hiring committee screen</span>
        </div>

        <div 
          onClick={() => setFilterStatus('accepted')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'accepted' 
              ? 'bg-surface-container-lowest border-primary shadow-sm ring-1 ring-secondary-container' 
              : 'bg-surface-container-lowest border-surface-container-high hover:border-secondary-container'
          }`}
        >
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Offers Received</span>
            <span className="material-symbols-outlined text-secondary text-xl">verified</span>
          </div>
          <div className="text-2xl font-bold text-primary">{offerCount}</div>
          <span className="text-[11px] text-on-surface-variant mt-1 block">Ready for signature</span>
        </div>
      </div>

      {/* Search & Filter Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 flex-1">
          <span className="material-symbols-outlined text-primary-container text-xl">search</span>
          <input
            type="text"
            placeholder="Search applications by role title, company, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-on-surface focus:outline-none placeholder:text-outline font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 px-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'interviewing', label: `Interviews (${interviewingCount})` },
            { id: 'reviewed', label: `Review (${reviewedCount})` },
            { id: 'applied', label: 'Applied' },
            { id: 'accepted', label: `Offers (${offerCount})` },
            { id: 'rejected', label: 'Archived' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === tab.id
                  ? 'bg-primary text-secondary-container shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Feed */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-surface-container-high shadow-xs">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/60 mb-3">folder_open</span>
            <h3 className="font-headline-sm text-lg font-bold text-primary">No Applications Found</h3>
            <p className="text-xs text-on-surface-variant mt-1 mb-6 max-w-md mx-auto">
              {searchQuery || filterStatus !== 'all' 
                ? "No applications matched your active search or filter criteria. Try resetting them." 
                : "You haven't submitted any applications yet. Explore top executive circulars and fast-track your candidacy."}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setFilterStatus('all'); onNavigate('explore'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed text-xs font-bold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-base">search</span>
              <span>Browse Open Opportunities</span>
            </button>
          </div>
        ) : (
          filtered.map((app) => {
            const currentStageIndex = stages.findIndex(s => s.key === app.status);
            const isOffer = app.status === 'accepted';
            const isInterview = app.status === 'interviewing';
            const isRejected = app.status === 'rejected';

            return (
              <div
                key={app.id}
                className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 border border-surface-container-high/80 shadow-xs hover:shadow-md transition-all space-y-6"
              >
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-primary-container text-secondary-container flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                      {app.company_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-headline-sm text-lg font-bold text-primary">
                          {app.job_title}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          isOffer
                            ? 'bg-secondary-container text-on-secondary-fixed'
                            : isInterview
                            ? 'bg-secondary/15 text-secondary'
                            : isRejected
                            ? 'bg-surface-container-high text-on-surface-variant'
                            : 'bg-primary-container/10 text-primary'
                        }`}>
                          {app.status === 'accepted' ? 'Offer Extended' : app.status}
                        </span>
                      </div>
                      
                      <p className="text-xs text-on-surface-variant font-medium">
                        {app.company_name} • Application Ref: <code className="font-mono text-primary font-bold">{app.id}</code>
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-on-surface-variant mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">calendar_month</span>
                          Submitted {new Date(app.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">description</span>
                          {app.resume_url ? 'Tailored Resume Attached' : 'Standard Executive Profile'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    <button
                      onClick={() => onOpenMessage ? onOpenMessage(app.company_name) : onNavigate('messages')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-bold text-primary transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      <span>Message Recruiter</span>
                    </button>
                    
                    <button
                      onClick={() => setWithdrawingId(app.id)}
                      className="text-on-surface-variant hover:text-rose-600 p-2 rounded-full transition-colors cursor-pointer"
                      title="Withdraw Application"
                    >
                      <span className="material-symbols-outlined text-lg">delete_sweep</span>
                    </button>
                  </div>
                </div>

                {/* Visual ATS Stepper */}
                <div className="bg-surface-container-low p-5 rounded-2xl border border-surface-container-high/60">
                  <div className="grid grid-cols-4 gap-2 relative">
                    {stages.map((stage, idx) => {
                      const isPassed = !isRejected && currentStageIndex >= idx;
                      const isCurrent = app.status === stage.key;

                      return (
                        <div key={stage.key} className="flex flex-col items-center text-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all mb-2 shadow-xs ${
                              isCurrent
                                ? 'bg-secondary-container text-on-secondary-fixed ring-4 ring-secondary-container/30 scale-105'
                                : isPassed
                                ? 'bg-primary text-secondary-container'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isPassed ? 'check' : stage.icon}
                            </span>
                          </div>
                          <span className={`text-[11px] font-semibold leading-tight ${
                            isCurrent ? 'text-primary font-bold' : 'text-on-surface-variant'
                          }`}>
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional Dynamic Panels: Interview / Offer / Feedback */}
                {isInterview && (
                  <div className="p-5 rounded-2xl bg-secondary-container/15 border border-secondary-container/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-bold shrink-0">
                        <span className="material-symbols-outlined text-xl">event_available</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">
                          Next Stage: {app.interview_stage || 'Live Video Round'}
                        </span>
                        <h4 className="text-sm font-bold text-primary mt-0.5">
                          {app.interview_date ? new Date(app.interview_date).toLocaleString() : 'Friday at 3:00 PM EST'}
                        </h4>
                        {app.interviewers && (
                          <p className="text-[11px] text-on-surface-variant mt-1">
                            Executive Panel: {app.interviewers.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setActiveMeetingApp(app)}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed font-bold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">video_call</span>
                        <span>Join Video Room</span>
                      </button>
                    </div>
                  </div>
                )}

                {isOffer && (
                  <div className="p-5 rounded-2xl bg-primary-container text-on-primary flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-bold shrink-0">
                        <span className="material-symbols-outlined text-xl">verified</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-secondary-container tracking-wider block">
                          Executive Compensation Extended
                        </span>
                        <h4 className="text-sm font-bold text-on-primary mt-0.5">
                          Formal Offer Package Delivered
                        </h4>
                        <p className="text-[11px] text-on-primary-container mt-1">
                          Base + Incentive Equity grant disclosed with 14-day acceptance window.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveOfferApp(app)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
                    >
                      <span>Review Offer Terms</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                )}

                {app.recruiter_notes && (
                  <div className="text-xs text-on-surface-variant bg-surface-container-low/70 p-4 rounded-xl border border-surface-container-high/60 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">rate_review</span>
                    <div>
                      <span className="font-bold text-primary uppercase tracking-wider text-[10px] mr-1">
                        Hiring Team Notes:
                      </span>
                      <span>{app.recruiter_notes}</span>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Video Meeting Simulation Modal */}
      {activeMeetingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-3xl shadow-2xl border border-surface-container-high overflow-hidden">
            <div className="bg-primary-container p-6 text-on-primary flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-secondary-container tracking-wider block">Jobify Encrypted Video</span>
                <h3 className="font-headline-sm text-base font-bold text-on-primary mt-0.5">{activeMeetingApp.job_title}</h3>
                <p className="text-xs text-on-primary-container">{activeMeetingApp.company_name}</p>
              </div>
              <button onClick={() => setActiveMeetingApp(null)} className="text-on-primary-container hover:text-on-primary p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="aspect-video bg-primary rounded-2xl overflow-hidden relative flex items-center justify-center">
                <div className="text-center text-on-primary">
                  <div className="w-16 h-16 rounded-full bg-surface-container-lowest/15 mx-auto flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-3xl text-secondary-container">account_circle</span>
                  </div>
                  <p className="text-xs font-bold">Annie Chen (Executive Candidate)</p>
                  <p className="text-[10px] text-on-primary-container">HD Camera & Microphone Verified</p>
                </div>
                <div className="absolute bottom-3 left-3 bg-primary-container/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-secondary-container font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></span>
                  Ready to connect
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low text-xs text-on-surface-variant flex items-center justify-between">
                <span>Panelists Waiting:</span>
                <span className="font-bold text-primary">Marcus Vance, Sarah Lin</span>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low border-t border-surface-container-high flex items-center justify-end gap-3">
              <button 
                onClick={() => setActiveMeetingApp(null)} 
                className="px-4 py-2 rounded-full text-xs font-bold text-on-surface-variant hover:text-on-surface"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert("Launching secure executive video session via Google Meet / Zoom bridge...");
                  setActiveMeetingApp(null);
                }} 
                className="px-6 py-2 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed text-xs font-bold shadow-sm"
              >
                Enter Interview Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Terms Modal */}
      {activeOfferApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-3xl shadow-2xl border border-surface-container-high overflow-hidden">
            <div className="bg-primary-container p-6 text-on-primary flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-secondary-container tracking-wider block">Executive Term Sheet</span>
                <h3 className="font-headline-sm text-base font-bold text-on-primary mt-0.5">Formal Employment Offer</h3>
                <p className="text-xs text-on-primary-container">{activeOfferApp.company_name} • {activeOfferApp.job_title}</p>
              </div>
              <button onClick={() => setActiveOfferApp(null)} className="text-on-primary-container hover:text-on-primary p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-surface-container-low">
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Base Cash Compensation</span>
                  <span className="text-base font-bold text-primary">$215,000 / yr</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low">
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Equity Stock Grant</span>
                  <span className="text-base font-bold text-secondary">0.25% (4-yr Vest)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant font-medium">Upfront Sign-on Bonus:</span>
                  <span className="font-bold text-primary">$35,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant font-medium">Proposed Start Date:</span>
                  <span className="font-bold text-primary">November 16, 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant font-medium">Acceptance Deadline:</span>
                  <span className="font-bold text-amber-600">October 30, 2026</span>
                </div>
              </div>

              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Full health, dental, vision, home office stipend ($3,000), and annual executive education budget included.
              </p>
            </div>

            <div className="p-4 bg-surface-container-low border-t border-surface-container-high flex items-center justify-end gap-3">
              <button 
                onClick={() => {
                  onOpenMessage ? onOpenMessage(activeOfferApp.company_name) : onNavigate('messages');
                  setActiveOfferApp(null);
                }}
                className="px-4 py-2 rounded-full text-xs font-bold text-primary hover:bg-surface-container"
              >
                Discuss with Hiring Lead
              </button>
              <button 
                onClick={() => {
                  alert("Congratulations! Offer acceptance acknowledged. Formal DocuSign paperwork has been queued.");
                  setActiveOfferApp(null);
                }} 
                className="px-6 py-2 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed text-xs font-bold shadow-sm"
              >
                Accept Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation for Withdraw */}
      {withdrawingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-surface-container-high space-y-4">
            <h3 className="font-bold text-base text-primary">Withdraw Application?</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Are you sure you want to withdraw your candidacy? The hiring team will be notified and your application will be archived.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button 
                onClick={() => setWithdrawingId(null)}
                className="px-4 py-2 rounded-full text-xs font-bold text-on-surface-variant hover:text-on-surface"
              >
                Keep Active
              </button>
              <button 
                onClick={() => {
                  if (onWithdrawApplication) {
                    onWithdrawApplication(withdrawingId);
                  }
                  setWithdrawingId(null);
                }}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Confirm Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
