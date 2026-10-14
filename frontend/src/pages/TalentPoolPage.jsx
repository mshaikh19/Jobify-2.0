import React, { useState } from 'react';
import { initialCandidates } from '../data/mockData';

export default function TalentPoolPage({ onNavigate }) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [search, setSearch] = useState('');
  const [invitedIds, setInvitedIds] = useState([]);

  const filtered = candidates.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleInvite = (id) => {
    if (invitedIds.includes(id)) return;
    setInvitedIds([...invitedIds, id]);
  };

  return (
    <div className="w-full pt-24 pb-16 bg-background min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container-high/60">
        <div>
          <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-widest">
            Talent Sourcing Directory
          </span>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold mt-1">
            Verified Executive Talent Pool
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Discover senior technical individual contributors and engineering leaders actively open to direct outreach.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 p-1.5 bg-surface-container-lowest rounded-full border border-surface-container-high w-full sm:w-80 shadow-xs">
          <span className="material-symbols-outlined text-primary text-xl pl-2">search</span>
          <input
            type="text"
            placeholder="Search by skill, name, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-on-surface focus:outline-none font-medium"
          />
        </div>
      </div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(cand => {
          const isInvited = invitedIds.includes(cand.id);

          return (
            <div
              key={cand.id}
              className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/80 shadow-xs hover:border-primary/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={cand.avatar}
                      alt={cand.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/10 shrink-0"
                    />
                    <div>
                      <h3 className="font-headline-sm text-base font-bold text-primary">{cand.name}</h3>
                      <p className="text-xs text-on-surface-variant font-medium">{cand.title}</p>
                      <span className="text-[11px] text-on-surface-variant/80 mt-0.5 block">
                        {cand.location} • {cand.experience}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container text-[10px] font-bold">
                    {cand.status}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant/90 mt-2 leading-relaxed">
                  {cand.bio}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {cand.skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-md bg-surface-container-low text-[10px] font-semibold text-on-surface-variant">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 mt-4 border-t border-surface-container-low flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Target Salary:</span>
                  <span className="text-xs font-bold text-primary">{cand.salary_expectation}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('messages')}
                    className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                    title="Send Direct Inquiry"
                  >
                    <span className="material-symbols-outlined text-lg">chat</span>
                  </button>
                  <button
                    onClick={() => handleInvite(cand.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      isInvited
                        ? 'bg-primary text-secondary-container'
                        : 'bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed shadow-xs'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isInvited ? 'check_circle' : 'mail'}
                    </span>
                    <span>{isInvited ? 'Invitation Sent' : 'Fast-Track Invite'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
