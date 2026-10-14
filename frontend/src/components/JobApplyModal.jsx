import React, { useState } from 'react';

export default function JobApplyModal({ job, isOpen, onClose, onApplySuccess }) {
  const [resumeName, setResumeName] = useState('annie_chen_executive_cv.pdf');
  const [coverNote, setCoverNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !job) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onApplySuccess({
        job_id: job.id,
        job_title: job.title,
        company_name: job.company_name,
        cover_letter: coverNote,
        resume_url: `/resumes/${resumeName}`,
        seeker_id: 'usr-annie',
        seeker_name: 'Annie Chen',
        seeker_email: 'annie.chen@example.com',
        status: 'applied'
      });
      setSubmitted(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-2xl shadow-[0_24px_50px_-12px_rgba(20,48,34,0.3)] border border-surface-container-high overflow-hidden">
        
        {/* Header */}
        <div className="bg-primary-container p-6 text-on-primary relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-on-primary-container hover:text-on-primary p-1 rounded-full hover:bg-surface-container-lowest/10 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-container text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">bolt</span> Direct Fast-Track Application
          </div>
          <h2 className="font-headline-md text-xl font-bold text-on-primary">{job.title}</h2>
          <p className="text-on-primary-container text-sm mt-0.5">{job.company_name} • {job.location}</p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Applicant Info (Pre-filled from Profile) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                Applicant Name
              </label>
              <input 
                type="text" 
                disabled 
                value="Annie Chen" 
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container-high cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                Verified Email
              </label>
              <input 
                type="email" 
                disabled 
                value="annie.chen@example.com" 
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container-high cursor-not-allowed"
              />
            </div>
          </div>

          {/* Resume Upload Section */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Executive Resume / CV
            </label>
            <div className="flex items-center justify-between p-3.5 rounded-xl border-2 border-dashed border-surface-container-highest hover:border-primary/40 bg-surface-container-lowest transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">description</span>
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary">{resumeName}</p>
                  <p className="text-xs text-on-surface-variant">PDF • 2.4 MB • Verified Profile</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setResumeName(resumeName.includes('v2') ? 'annie_chen_executive_cv.pdf' : 'annie_chen_updated_v2.pdf')}
                className="text-xs font-bold text-primary px-3 py-1.5 rounded-full hover:bg-surface-container transition-colors"
              >
                Change
              </button>
            </div>
          </div>

          {/* Direct Note to Hiring Lead */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Pitch / Brief Note to Hiring Manager <span className="text-on-surface-variant/70 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Highlight relevant architectural wins, systems scaled, or why this mission resonates..."
              className="w-full px-4 py-2.5 rounded-xl border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-outline bg-surface-container-lowest"
            />
          </div>

          {/* Salary Expectation alignment */}
          <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-lg">verified</span>
              <span className="text-xs font-semibold text-on-surface">Upfront Target Compensation</span>
            </div>
            <span className="text-xs font-bold text-primary">{job.salary_range}</span>
          </div>

          {/* CTA Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full font-label-md text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitted}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed font-label-md text-xs font-bold transition-all shadow-[0_4px_16px_rgba(204,242,26,0.35)]"
            >
              {submitted ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  <span>Transmitting Application...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Confirm & Send Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
