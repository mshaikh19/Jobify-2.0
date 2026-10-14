import React, { useState } from 'react';

export default function ExploreJobsPage({ jobs, savedJobIds = [], onToggleSave, onApplyJob, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [minSalary, setMinSalary] = useState('0');
  const [selectedJob, setSelectedJob] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const filtered = jobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.tags && job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesType = selectedType === 'all' || job.job_type === selectedType;
    
    const matchesLocation = selectedLocation === 'all' || 
      (selectedLocation === 'remote' && (job.job_type === 'Remote' || job.location.toLowerCase().includes('remote'))) ||
      job.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const extractNum = (str) => {
      const match = (str || '').match(/\$(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };
    const salaryNum = extractNum(job.salary_range);
    const matchesSalary = minSalary === '0' || salaryNum >= parseInt(minSalary, 10);

    return matchesSearch && matchesCategory && matchesType && matchesLocation && matchesSalary;
  });

  const handleCopyLink = (job) => {
    setCopiedId(job.id);
    navigator.clipboard?.writeText(window.location.origin + '?job=' + job.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="w-full pt-24 pb-16 bg-background min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Top Header & Search Bar */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-sm">hub</span> Live Executive Marketplace
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold">
              Explore Executive Roles
            </h1>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Curated positions across top tier-1 enterprises, frontier AI labs, and high-growth engineering teams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('saved_jobs')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-xs font-bold text-primary transition-colors border border-surface-container-high"
              >
                <span className="material-symbols-outlined text-sm text-secondary">bookmark</span>
                <span>Saved Jobs ({savedJobIds.length})</span>
              </button>
            )}

            <span className="px-3 py-1.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold">
              {filtered.length} Active Positions
            </span>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="flex items-center gap-3 p-2 bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-high">
          <span className="material-symbols-outlined text-primary-container text-2xl pl-2">search</span>
          <input
            type="text"
            placeholder="Search by role title, technology stack (e.g. Go, Rust, React, AI), or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-on-surface focus:outline-none placeholder:text-outline font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-full"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Quick Location & Salary Bar */}
        <div className="flex items-center justify-between gap-3 mt-3 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider pr-1 shrink-0">Metro:</span>
            {[
              { id: 'all', label: 'All Regions' },
              { id: 'remote', label: 'Remote Only' },
              { id: 'san francisco', label: 'San Francisco' },
              { id: 'new york', label: 'New York' },
              { id: 'seattle', label: 'Seattle' }
            ].map(loc => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedLocation === loc.id
                    ? 'bg-primary text-secondary-container shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Min Comp:</span>
            <select
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="px-3 py-1 rounded-full bg-surface-container-low text-xs font-bold text-primary border border-surface-container-high focus:outline-none cursor-pointer"
            >
              <option value="0">All Ranges</option>
              <option value="180">$180k+ / yr</option>
              <option value="200">$200k+ / yr</option>
              <option value="250">$250k+ / yr</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Job Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Filters Sidebar (4 Cols) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-surface-container-low">
            <span className="font-headline-sm text-sm font-bold text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg">tune</span> Filters
            </span>
            {(selectedCategory !== 'all' || selectedType !== 'all' || selectedLocation !== 'all' || minSalary !== '0' || searchQuery) && (
              <button
                onClick={() => { 
                  setSelectedCategory('all'); 
                  setSelectedType('all'); 
                  setSelectedLocation('all');
                  setMinSalary('0');
                  setSearchQuery(''); 
                }}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Discipline Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2.5">
              Functional Discipline
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'all', label: 'All Disciplines' },
                { id: 'Engineering & Tech', label: 'Engineering & Tech' },
                { id: 'UI/UX Design', label: 'UI/UX Design' },
                { id: 'Product Management', label: 'Product Management' },
                { id: 'Data Science & AI', label: 'Data Science & AI' },
                { id: 'Cybersecurity & Infra', label: 'Cybersecurity & Infra' },
                { id: 'Marketing & Growth', label: 'Marketing & Growth' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-primary-container text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <span>{cat.label}</span>
                  {selectedCategory === cat.id && (
                    <span className="material-symbols-outlined text-sm text-secondary-container">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2.5">
              Employment Arrangement
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['all', 'Full-Time', 'Remote', 'Contract', 'Part-Time'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedType === type
                      ? 'bg-secondary-container text-on-secondary-fixed shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Guarantee Box */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/60 space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <span className="material-symbols-outlined text-base text-secondary">verified_user</span>
              Compensation Transparency
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              100% of jobs posted on Jobify 2.0 require disclosed salary brackets and equity ranges to protect candidate velocity.
            </p>
          </div>
        </div>

        {/* Job Cards Stream (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-surface-container-high shadow-xs">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">search_off</span>
              <h3 className="font-headline-sm text-lg font-bold text-primary">No Matching Positions Found</h3>
              <p className="text-xs text-on-surface-variant mt-1">Try resetting your search query or discipline filter.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedType('all'); setSelectedLocation('all'); setSearchQuery(''); }}
                className="mt-4 px-5 py-2 rounded-full bg-primary-container text-on-primary text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filtered.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/80 hover:border-primary/40 transition-all hover:shadow-md group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    
                    {/* Role Title & Details */}
                    <div className="flex items-start gap-4">
                      <img
                        src={job.logo}
                        alt={job.company_name}
                        className="w-13 h-13 rounded-xl object-cover ring-1 ring-surface-container-high shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 
                            onClick={() => setSelectedJob(job)}
                            className="font-headline-sm text-base sm:text-lg font-bold text-primary group-hover:text-primary-container cursor-pointer transition-colors"
                          >
                            {job.title}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-[11px] font-bold">
                            {job.job_type}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant font-medium">
                          {job.company_name} • {job.location} • <span className="text-primary font-semibold">{job.category}</span>
                        </p>
                      </div>
                    </div>

                    {/* Bookmark action */}
                    <div className="flex items-center gap-1 self-start sm:self-auto">
                      <button
                        onClick={() => handleCopyLink(job)}
                        title="Copy Job Link"
                        className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {copiedId === job.id ? 'check' : 'share'}
                        </span>
                      </button>

                      <button
                        onClick={() => onToggleSave(job)}
                        title={isSaved ? 'Remove from Saved' : 'Save Opportunity'}
                        className={`p-2 rounded-full transition-colors cursor-pointer ${
                          isSaved 
                            ? 'bg-secondary-container text-on-secondary-fixed' 
                            : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                          bookmark
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-xs text-on-surface-variant/90 mt-3 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    {job.tags?.map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-surface-container-low text-[11px] font-medium text-on-surface-variant">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer: Salary + Actions */}
                  <div className="pt-4 mt-4 border-t border-surface-container-low flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-base">payments</span>
                      <span className="text-xs font-bold text-primary">{job.salary_range}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="px-4 py-2 rounded-full text-xs font-bold text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                      >
                        Role Brief
                      </button>
                      <button
                        onClick={() => onApplyJob(job)}
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed font-label-md text-xs font-bold transition-all shadow-[0_4px_16px_rgba(204,242,26,0.3)] cursor-pointer"
                      >
                        <span>Fast-Track Apply</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Role Details Modal Drawer */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-3xl shadow-2xl border border-surface-container-high overflow-hidden max-h-[85vh] flex flex-col">
            <div className="bg-primary-container p-6 text-on-primary flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img src={selectedJob.logo} alt={selectedJob.company_name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-secondary-container" />
                <div>
                  <h2 className="font-headline-md text-lg font-bold text-on-primary">{selectedJob.title}</h2>
                  <p className="text-xs text-on-primary-container">{selectedJob.company_name} • {selectedJob.location}</p>
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-on-primary-container hover:text-on-primary p-1.5 rounded-full hover:bg-surface-container-lowest/10 cursor-pointer">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-on-surface">
              <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Disclosed Compensation</span>
                  <span className="text-base font-bold text-primary">{selectedJob.salary_range}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container font-bold">
                  {selectedJob.job_type}
                </span>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-on-surface-variant mb-1">About the Role</h4>
                <p className="leading-relaxed text-on-surface-variant">{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-on-surface-variant mb-2">Core Requirements & Competencies</h4>
                <ul className="space-y-2">
                  {selectedJob.requirements?.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">check_circle</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low border-t border-surface-container-high flex items-center justify-end gap-3 shrink-0">
              <button onClick={() => setSelectedJob(null)} className="px-4 py-2 rounded-full font-bold text-xs text-on-surface-variant hover:text-on-surface cursor-pointer">
                Close
              </button>
              <button 
                onClick={() => { const j = selectedJob; setSelectedJob(null); onApplyJob(j); }}
                className="px-6 py-2 rounded-full bg-secondary-container text-on-secondary-fixed font-bold text-xs shadow-sm hover:bg-secondary-fixed-dim cursor-pointer"
              >
                Apply to this Role
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
