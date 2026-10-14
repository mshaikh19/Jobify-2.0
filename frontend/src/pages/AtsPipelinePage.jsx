import React, { useState } from 'react';

export default function AtsPipelinePage({ applications, onUpdateStatus, onNavigate }) {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');

  const columns = [
    { key: 'applied', label: 'Applied', color: 'bg-surface-container', count: applications.filter(a => a.status === 'applied').length },
    { key: 'reviewed', label: 'Under Review', color: 'bg-primary-container/10', count: applications.filter(a => a.status === 'reviewed').length },
    { key: 'interviewing', label: 'Interview Loops', color: 'bg-secondary-container/20', count: applications.filter(a => a.status === 'interviewing').length },
    { key: 'accepted', label: 'Offer Extended', color: 'bg-emerald-100', count: applications.filter(a => a.status === 'accepted').length },
    { key: 'rejected', label: 'Archived', color: 'bg-rose-50', count: applications.filter(a => a.status === 'rejected').length }
  ];

  const filteredApps = applications.filter(a => {
    if (selectedRoleFilter === 'all') return true;
    return a.job_title === selectedRoleFilter;
  });

  const uniqueRoles = Array.from(new Set(applications.map(a => a.job_title)));

  return (
    <div className="w-full pt-24 pb-16 bg-background min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container-high/60">
        <div>
          <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-widest">
            Enterprise ATS Pipeline
          </span>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold mt-1">
            Recruiter Kanban Stage Board
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Advance candidates across interview loops and update requisition status in real time.
          </p>
        </div>

        {/* Filter by Role */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-on-surface-variant">Requisition:</label>
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-surface-container-high text-xs bg-surface-container-lowest font-medium focus:outline-none"
          >
            <option value="all">All Active Roles ({applications.length})</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board 5 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {columns.map(col => {
          const colApps = filteredApps.filter(a => a.status === col.key);

          return (
            <div
              key={col.key}
              className="bg-surface-container-low/70 rounded-2xl p-3 border border-surface-container-high/70 min-h-[500px] flex flex-col"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between p-2 mb-3 bg-surface-container-lowest rounded-xl border border-surface-container-high/50 shadow-xs">
                <span className="font-headline-sm text-xs font-bold text-primary">{col.label}</span>
                <span className="w-5 h-5 rounded-full bg-surface-container text-on-surface font-bold text-[10px] flex items-center justify-center">
                  {colApps.length}
                </span>
              </div>

              {/* Candidate Cards Stream */}
              <div className="space-y-3 flex-1">
                {colApps.map(app => (
                  <div
                    key={app.id}
                    className="bg-surface-container-lowest rounded-xl p-3.5 border border-surface-container-high shadow-xs hover:border-primary/40 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-container text-secondary-container font-bold text-xs flex items-center justify-center shrink-0">
                          {app.seeker_name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-primary leading-tight">{app.seeker_name}</h4>
                          <span className="text-[10px] text-on-surface-variant block">{app.job_title}</span>
                        </div>
                      </div>
                    </div>

                    {app.recruiter_notes && (
                      <p className="text-[10px] text-on-surface-variant/90 bg-surface-container-low p-2 rounded-lg italic">
                        "{app.recruiter_notes}"
                      </p>
                    )}

                    {/* Stage Transition Selector matching ApplicationStatusUpdate */}
                    <div className="pt-2 border-t border-surface-container-low flex items-center justify-between text-[10px]">
                      <span className="text-on-surface-variant font-medium">Stage:</span>
                      <select
                        value={app.status}
                        onChange={(e) => onUpdateStatus(app.id, e.target.value)}
                        className="bg-surface-container-low px-2 py-1 rounded-md font-bold text-primary focus:outline-none cursor-pointer"
                      >
                        <option value="applied">Applied</option>
                        <option value="reviewed">Under Review</option>
                        <option value="interviewing">Interview Loop</option>
                        <option value="accepted">Offer Extended</option>
                        <option value="rejected">Archived</option>
                      </select>
                    </div>
                  </div>
                ))}

                {colApps.length === 0 && (
                  <div className="h-32 flex items-center justify-center text-[11px] text-on-surface-variant/60 border border-dashed border-surface-container-high rounded-xl">
                    No candidates
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
