import React from 'react';

export default function EmployerDashboardPage({ jobs, applications, onOpenPostJob, onNavigate }) {
  const activeJobs = jobs.filter(j => j.status === 'active');
  const totalApplicants = applications.length;

  return (
    <div className="w-full pt-24 pb-16 bg-background min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container-high/60">
        <div>
          <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-widest">
            Recruiter & Employer Studio
          </span>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold mt-1">
            Talent Acquisition Overview
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Real-time pipeline analytics, candidate velocity, and active requisition health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('ats_pipeline')}
            className="px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-primary transition-colors border border-surface-container-high"
          >
            Open ATS Kanban Pipeline
          </button>
          <button
            onClick={onOpenPostJob}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-secondary-container text-on-secondary-fixed text-xs font-bold shadow-xs hover:bg-secondary-fixed-dim transition-all"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Post New Job</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high/80 shadow-xs">
          <span className="font-label-caps text-[11px] uppercase font-bold text-on-surface-variant block mb-1">
            Active Requisitions
          </span>
          <div className="font-headline-lg text-3xl font-bold text-primary">{activeJobs.length}</div>
          <span className="text-[11px] text-secondary font-bold mt-1 block">Live across marketplace</span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high/80 shadow-xs">
          <span className="font-label-caps text-[11px] uppercase font-bold text-on-surface-variant block mb-1">
            Candidate Inflow
          </span>
          <div className="font-headline-lg text-3xl font-bold text-primary">{totalApplicants}</div>
          <span className="text-[11px] text-on-surface-variant mt-1 block">Verified engineering applicants</span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high/80 shadow-xs">
          <span className="font-label-caps text-[11px] uppercase font-bold text-on-surface-variant block mb-1">
            Avg Time-To-Offer
          </span>
          <div className="font-headline-lg text-3xl font-bold text-primary">4.2 Days</div>
          <span className="text-[11px] text-secondary font-bold mt-1 block">68% faster than industry norm</span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high/80 shadow-xs">
          <span className="font-label-caps text-[11px] uppercase font-bold text-on-surface-variant block mb-1">
            Interview Conversion
          </span>
          <div className="font-headline-lg text-3xl font-bold text-primary">42%</div>
          <span className="text-[11px] text-on-surface-variant mt-1 block">Pass-through rate to final loop</span>
        </div>
      </div>

      {/* Recruiter Workspace: Active Requisitions + Candidate Pipeline Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Active Job Circulars (7 Cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container-low">
            <h2 className="font-headline-sm text-base font-bold text-primary">Active Team Requisitions</h2>
            <button
              onClick={() => onNavigate('employer_jobs')}
              className="text-xs font-bold text-primary hover:underline"
            >
              Manage All Jobs →
            </button>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div 
                key={job.id}
                className="p-4 rounded-xl border border-surface-container-high hover:border-primary/30 transition-all flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-sm text-primary">{job.title}</h4>
                  <p className="text-xs text-on-surface-variant">{job.category} • {job.location}</p>
                  <span className="text-[11px] font-semibold text-secondary mt-1 block">
                    {job.salary_range}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-xs font-bold text-on-surface">
                    {job.applicant_count || 12} Candidates
                  </span>
                  <button
                    onClick={() => onNavigate('ats_pipeline')}
                    className="p-1.5 rounded-full hover:bg-surface-container text-primary"
                    title="Open Pipeline"
                  >
                    <span className="material-symbols-outlined text-lg">view_kanban</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ATS Sourcing Quick Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-primary-container text-on-primary rounded-2xl p-6 relative overflow-hidden shadow-sm">
            <h3 className="font-headline-sm text-base font-bold">Candidate Pool Sourcing</h3>
            <p className="text-xs text-on-primary-container mt-1 leading-relaxed">
              Browse 450,000+ vetted senior engineers, product designers, and AI researchers actively open to direct outreach.
            </p>
            <button
              onClick={() => onNavigate('talent_pool')}
              className="mt-4 px-5 py-2.5 rounded-full bg-secondary-container text-on-secondary-fixed text-xs font-bold hover:bg-secondary-fixed-dim transition-all shadow-xs"
            >
              Explore Talent Directory
            </button>
          </div>

          {/* Hiring Pipeline Health */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/80 shadow-xs space-y-3">
            <h3 className="font-headline-sm text-sm font-bold text-primary">Candidate Funnel Stages</h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Applied / New Inflow</span>
                <span className="font-bold text-primary">14 candidates</span>
              </div>
              <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[80%] rounded-full"></div>
              </div>

              <div className="flex justify-between text-on-surface-variant pt-1">
                <span>Technical Interview Loop</span>
                <span className="font-bold text-primary">6 candidates</span>
              </div>
              <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                <div className="bg-secondary-container h-full w-[45%] rounded-full"></div>
              </div>

              <div className="flex justify-between text-on-surface-variant pt-1">
                <span>Offer Extended</span>
                <span className="font-bold text-primary">2 candidates</span>
              </div>
              <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[20%] rounded-full"></div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('ats_pipeline')}
              className="mt-2 w-full py-2 rounded-xl text-center text-xs font-bold text-primary bg-surface-container-low hover:bg-surface-container transition-colors"
            >
              Open Full ATS Board →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
