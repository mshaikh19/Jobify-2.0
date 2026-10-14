import React, { useState } from 'react';

export default function PostJobModal({ isOpen, onClose, onJobCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    company_name: 'Vercel Architecture Labs',
    location: 'Remote (US/EU)',
    job_type: 'Full-Time',
    category: 'Engineering & Tech',
    salary_range: '$180,000 - $240,000 + Equity',
    description: '',
    requirements: 'Production experience with Go, Rust, or TypeScript\nDeep understanding of distributed consensus & caching\nTrack record of shipping mission-critical systems'
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const newJob = {
        id: `job-${Date.now()}`,
        title: formData.title,
        company_name: formData.company_name,
        location: formData.location,
        job_type: formData.job_type,
        category: formData.category,
        salary_range: formData.salary_range,
        description: formData.description || 'Join our executive team driving high-impact technical initiatives.',
        requirements: formData.requirements.split('\n').filter(r => r.trim().length > 0),
        employer_id: 'emp-current',
        status: 'active',
        applicant_count: 0,
        created_at: new Date().toISOString(),
        tags: [formData.category, formData.job_type],
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80'
      };

      onJobCreated(newJob);
      setLoading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-[0_24px_50px_-12px_rgba(20,48,34,0.3)] border border-surface-container-high overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-primary-container p-6 text-on-primary flex items-center justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-container text-xs font-bold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-sm">business_center</span> Recruiter Job Publishing
            </div>
            <h2 className="font-headline-md text-xl font-bold text-on-primary">Publish New Circular</h2>
            <p className="text-on-primary-container text-xs mt-0.5">Aligned with FastAPI <code>JobCreate</code> schema</p>
          </div>
          <button 
            onClick={onClose}
            className="text-on-primary-container hover:text-on-primary p-1.5 rounded-full hover:bg-surface-container-lowest/10 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lead Core Infrastructure Architect"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-surface-container-high text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-surface-container-high text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                Discipline / Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-surface-container-high text-sm bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:outline-none"
              >
                <option value="Engineering & Tech">Engineering & Tech</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Product Management">Product Management</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Cybersecurity & Infra">Cybersecurity & Infra</option>
                <option value="Marketing & Growth">Marketing & Growth</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                Job Type
              </label>
              <select
                value={formData.job_type}
                onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-surface-container-high text-sm bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:outline-none"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-surface-container-high text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              Transparent Salary Range (Upfront Transparency Guarantee)
            </label>
            <input
              type="text"
              placeholder="e.g. $190,000 - $240,000 + 0.2% Equity"
              value={formData.salary_range}
              onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-surface-container-high text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              Role Overview & Mission
            </label>
            <textarea
              rows={3}
              placeholder="Describe the high-impact challenges, team structure, and strategic deliverables..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-surface-container-high text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              Core Requirements (One per line)
            </label>
            <textarea
              rows={3}
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-surface-container-high text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none font-mono text-xs"
            />
          </div>

          {/* Footer CTAs */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-high">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full font-label-md text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed font-label-md text-xs font-bold transition-all shadow-[0_4px_16px_rgba(204,242,26,0.35)]"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  <span>Posting Circular...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Publish Job Circular</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
