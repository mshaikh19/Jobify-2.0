import React, { useState } from 'react';

export default function EmployerJobsPage({ jobs, onToggleJobStatus, onOpenPostJob, onNavigate }) {
  const [filter, setFilter] = useState('all');

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  return (
    <div className="w-full pt-24 pb-16 bg-background min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container-high/60">
        <div>
          <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-widest">
            Requisition Operations
          </span>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold mt-1">
            My Job Circulars & Postings
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Manage your organization's active requisitions, applicant volume, and status toggles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPostJob}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-secondary-container text-on-secondary-fixed text-xs font-bold shadow-xs hover:bg-secondary-fixed-dim transition-all"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Create New Circular</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['all', 'active', 'closed'].map(st => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              filter === st
                ? 'bg-primary text-secondary-container shadow-xs'
                : 'bg-surface-container-lowest text-on-surface-variant border border-surface-container-high hover:text-primary'
            }`}
          >
            {st === 'all' ? 'All Postings' : `${st} Requisitions`}
          </button>
        ))}
      </div>

      {/* Jobs Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant font-bold uppercase tracking-wider text-[10px] border-b border-surface-container-high">
              <tr>
                <th className="py-3.5 px-6">Role Title & Discipline</th>
                <th className="py-3.5 px-6">Arrangement</th>
                <th className="py-3.5 px-6">Compensation</th>
                <th className="py-3.5 px-6">Applicants</th>
                <th className="py-3.5 px-6">Requisition Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredJobs.map(job => (
                <tr key={job.id} className="hover:bg-surface-container-lowest/60 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-sm text-primary block">{job.title}</span>
                    <span className="text-[11px] text-on-surface-variant">{job.category} • {job.location}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-[11px] font-semibold">
                      {job.job_type}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-primary">
                    {job.salary_range}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => onNavigate('ats_pipeline')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container font-bold hover:bg-secondary-container/30 transition-colors"
                    >
                      <span>{job.applicant_count || 18} Applicants</span>
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => onToggleJobStatus(job.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        job.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span className="capitalize">{job.status}</span>
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onNavigate('ats_pipeline')}
                        className="p-1.5 rounded-lg hover:bg-surface-container text-primary font-bold text-xs"
                        title="View ATS Kanban"
                      >
                        <span className="material-symbols-outlined text-lg">view_kanban</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
