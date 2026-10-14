import React, { useState } from 'react';

export default function SavedJobsPage({ savedJobs, onRemoveSaved, onApplyJob, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'salary' | 'company'
  const [selectedJobForBrief, setSelectedJobForBrief] = useState(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const filtered = savedJobs.filter(job => {
    const matchesSearch = !searchQuery ||
      job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'all' || job.job_type === selectedType;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'company') {
      return a.company_name.localeCompare(b.company_name);
    }
    if (sortBy === 'salary') {
      // rough salary extraction
      const extractNum = (str) => {
        const match = (str || '').match(/\$(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      };
      return extractNum(b.salary_range) - extractNum(a.salary_range);
    }
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  const totalSaved = savedJobs.length;
  const remoteSaved = savedJobs.filter(j => (j.job_type || '').toLowerCase().includes('remote') || (j.location || '').toLowerCase().includes('remote')).length;

  return (
    <div className="w-full pt-24 pb-16 bg-background min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-container-high/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">bookmark</span>
            Bookmarked Circulars
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold">
            Saved Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-2xl">
            Keep track of executive roles, compare disclosed compensation, and submit fast-track applications when ready.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {totalSaved > 1 && (
            <button
              onClick={() => setIsCompareOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-bold text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-secondary">compare_arrows</span>
              <span>Compare Roles ({totalSaved})</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('explore')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary-container text-on-secondary-fixed text-xs font-bold shadow-xs hover:bg-secondary-fixed-dim transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">search</span>
            <span>Browse More Circulars</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Saved Positions</span>
            <span className="material-symbols-outlined text-primary text-xl">bookmarks</span>
          </div>
          <div className="text-2xl font-bold text-primary">{totalSaved}</div>
          <span className="text-[11px] text-on-surface-variant mt-0.5 block">Stored in candidate vault</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Remote Enabled</span>
            <span className="material-symbols-outlined text-secondary text-xl">public</span>
          </div>
          <div className="text-2xl font-bold text-secondary">{remoteSaved}</div>
          <span className="text-[11px] text-on-surface-variant mt-0.5 block">Global or US Remote</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Base Bracket</span>
            <span className="material-symbols-outlined text-primary text-xl">payments</span>
          </div>
          <div className="text-2xl font-bold text-primary">$210,000+</div>
          <span className="text-[11px] text-on-surface-variant mt-0.5 block">Tier-1 Verified Packages</span>
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 flex-1">
          <span className="material-symbols-outlined text-primary-container text-xl">search</span>
          <input
            type="text"
            placeholder="Search saved jobs by title, company, or city..."
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

        {/* Filters & Sorting */}
        <div className="flex items-center gap-2 px-2 flex-wrap">
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-full text-xs">
            {['all', 'Remote', 'Full-Time'].map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedType === t
                    ? 'bg-primary text-secondary-container shadow-xs'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {t === 'all' ? 'All Types' : t}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-surface-container-low text-xs font-bold text-on-surface-variant border border-surface-container-high focus:outline-none cursor-pointer"
          >
            <option value="recent">Sort: Recently Saved</option>
            <option value="salary">Sort: Compensation</option>
            <option value="company">Sort: Company Name</option>
          </select>
        </div>
      </div>

      {/* Grid of Saved Opportunities */}
      {filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-surface-container-high shadow-xs">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/50 mb-3">bookmark_border</span>
          <h3 className="font-headline-sm text-lg font-bold text-primary">No Saved Opportunities</h3>
          <p className="text-xs text-on-surface-variant mt-1 mb-6 max-w-md mx-auto">
            {searchQuery || selectedType !== 'all' 
              ? "No saved jobs matched your search criteria. Try clearing the filter." 
              : "Bookmark high-conviction roles from the Explore page to easily compare salary brackets and apply at your convenience."}
          </p>
          <button
            onClick={() => onNavigate('explore')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">explore</span>
            <span>Browse Active Openings</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((job) => {
            const jobId = job.job_id || job.id;
            return (
              <div
                key={job.id}
                className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/80 hover:border-primary/40 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-[11px] font-bold">
                        {job.job_type || 'Full-Time'}
                      </span>
                      <span className="text-[11px] text-on-surface-variant/80">
                        Saved {new Date(job.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveSaved(jobId)}
                      title="Remove Bookmark"
                      className="text-on-surface-variant hover:text-rose-600 p-1.5 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>

                  {/* Role Title & Organization */}
                  <h3 
                    onClick={() => setSelectedJobForBrief(job)}
                    className="font-headline-sm text-lg font-bold text-primary group-hover:text-primary-container cursor-pointer transition-colors"
                  >
                    {job.job_title}
                  </h3>
                  
                  <p className="text-xs text-on-surface-variant font-medium mt-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">apartment</span>
                    <span>{job.company_name}</span>
                    <span>•</span>
                    <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
                    <span>{job.location}</span>
                  </p>

                  {/* Disclosed Comp Highlight */}
                  <div className="mt-4 p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary text-sm">payments</span>
                      <span className="font-semibold">Disclosed Band:</span>
                    </div>
                    <span className="text-xs font-extrabold text-primary">{job.salary_range}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-5 border-t border-surface-container-low flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedJobForBrief(job)}
                    className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    View Brief
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onApplyJob({
                        id: jobId,
                        title: job.job_title,
                        company_name: job.company_name,
                        location: job.location,
                        salary_range: job.salary_range,
                        job_type: job.job_type
                      })}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <span>Fast-Track Apply</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Role Brief Modal Drawer */}
      {selectedJobForBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-3xl shadow-2xl border border-surface-container-high overflow-hidden">
            <div className="bg-primary-container p-6 text-on-primary flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-secondary-container tracking-wider block">Bookmarked Opportunity</span>
                <h3 className="font-headline-sm text-base font-bold text-on-primary mt-0.5">{selectedJobForBrief.job_title}</h3>
                <p className="text-xs text-on-primary-container">{selectedJobForBrief.company_name} • {selectedJobForBrief.location}</p>
              </div>
              <button onClick={() => setSelectedJobForBrief(null)} className="text-on-primary-container hover:text-on-primary p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Disclosed Compensation</span>
                  <span className="text-sm font-bold text-primary">{selectedJobForBrief.salary_range}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container font-bold">
                  {selectedJobForBrief.job_type || 'Full-Time'}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-primary mb-1">Executive Fast-Track Note</h4>
                <p className="text-on-surface-variant leading-relaxed">
                  Candidates applying from their saved bookmarks bypass initial screening queues and are routed directly to hiring partners.
                </p>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low border-t border-surface-container-high flex items-center justify-end gap-3">
              <button 
                onClick={() => setSelectedJobForBrief(null)} 
                className="px-4 py-2 rounded-full text-xs font-bold text-on-surface-variant hover:text-on-surface"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const j = selectedJobForBrief;
                  setSelectedJobForBrief(null);
                  onApplyJob({
                    id: j.job_id || j.id,
                    title: j.job_title,
                    company_name: j.company_name,
                    location: j.location,
                    salary_range: j.salary_range,
                    job_type: j.job_type
                  });
                }}
                className="px-6 py-2 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed text-xs font-bold shadow-xs cursor-pointer"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-side Role Comparison Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest w-full max-w-4xl rounded-3xl shadow-2xl border border-surface-container-high overflow-hidden max-h-[85vh] flex flex-col">
            <div className="bg-primary-container p-6 text-on-primary flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-secondary-container tracking-wider block">Executive Market Matrix</span>
                <h3 className="font-headline-sm text-lg font-bold text-on-primary mt-0.5">Compare Saved Roles</h3>
              </div>
              <button onClick={() => setIsCompareOpen(false)} className="text-on-primary-container hover:text-on-primary p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 overflow-x-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-surface-container-high">
                    <th className="py-3 px-4 font-bold text-on-surface-variant">Role Title</th>
                    <th className="py-3 px-4 font-bold text-on-surface-variant">Company</th>
                    <th className="py-3 px-4 font-bold text-on-surface-variant">Location</th>
                    <th className="py-3 px-4 font-bold text-on-surface-variant">Type</th>
                    <th className="py-3 px-4 font-bold text-primary">Disclosed Salary Band</th>
                    <th className="py-3 px-4 font-bold text-right text-on-surface-variant">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {savedJobs.map((j) => (
                    <tr key={j.id} className="hover:bg-surface-container-low/50">
                      <td className="py-4 px-4 font-bold text-primary">{j.job_title}</td>
                      <td className="py-4 px-4 text-on-surface-variant font-medium">{j.company_name}</td>
                      <td className="py-4 px-4 text-on-surface-variant">{j.location}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-[10px] font-bold">
                          {j.job_type}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-extrabold text-primary">{j.salary_range}</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => {
                            setIsCompareOpen(false);
                            onApplyJob({
                              id: j.job_id || j.id,
                              title: j.job_title,
                              company_name: j.company_name,
                              location: j.location,
                              salary_range: j.salary_range
                            });
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[11px] font-bold hover:bg-secondary-fixed-dim"
                        >
                          Apply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-surface-container-low border-t border-surface-container-high flex justify-end shrink-0">
              <button 
                onClick={() => setIsCompareOpen(false)}
                className="px-5 py-2 rounded-full bg-surface-container text-xs font-bold text-primary hover:bg-surface-container-high"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
