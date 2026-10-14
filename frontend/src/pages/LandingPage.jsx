import React, { useState } from 'react';
import { mockCategories } from '../data/mockData';

export default function LandingPage({ jobs, onSelectJob, onApplyJob, onNavigate }) {
  const [searchRole, setSearchRole] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredJobs = jobs.filter(job => {
    const matchesRole = !searchRole || job.title.toLowerCase().includes(searchRole.toLowerCase()) || job.company_name.toLowerCase().includes(searchRole.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesRole && matchesCategory;
  });

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* Immersive Hero Section bleeding under navbar */}
      <section className="relative w-full overflow-hidden bg-primary pt-32 pb-24 md:pb-32">
        {/* Ambient Visuals & Glows matching Stitch */}
        <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-secondary-container/15 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] rounded-full bg-surface-tint/20 blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ccf21a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        
        {/* Contour SVG decoration from Stitch */}
        <svg className="absolute right-0 top-12 w-96 h-96 text-secondary-container/20 pointer-events-none stroke-current" fill="none" viewBox="0 0 400 400">
          <path d="M50 120 C 150 40, 280 80, 360 220 S 200 380, 80 320" strokeDasharray="6 8" strokeLinecap="round" strokeWidth="2.5"></path>
          <circle cx="280" cy="110" fill="#ccf21a" fillOpacity="0.25" r="14"></circle>
          <circle cx="120" cy="270" fill="#caead5" fillOpacity="0.3" r="8"></circle>
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Eyebrow Tag */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-lowest/10 backdrop-blur-md shadow-sm border border-surface-container-lowest/15">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse"></span>
              <span className="font-label-caps text-xs uppercase text-secondary-container tracking-wider font-bold">
                Live Executive Talent Marketplace
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display-hero text-3xl sm:text-5xl lg:text-6xl text-on-primary font-extrabold tracking-tight mb-4 leading-tight">
              <span className="text-secondary-container inline-block">2,568+</span> jobs available.<br />
              You can choose your dream job.
            </h1>
            <p className="font-body-lg text-base sm:text-lg text-primary-fixed-dim/90 max-w-2xl mx-auto mb-10 leading-relaxed">
              Direct access to engineering leaders, design directors, and high-growth venture-backed teams with curated upfront compensation.
            </p>
          </div>

          {/* Hero Multi-Input Consolidated Search Bar */}
          <div className="max-w-4xl mx-auto bg-surface-container-lowest rounded-2xl md:rounded-full p-2.5 shadow-[0_20px_50px_-10px_rgba(0,27,14,0.35)]">
            <form 
              onSubmit={(e) => { e.preventDefault(); onNavigate('explore'); }}
              className="flex flex-col md:flex-row items-stretch md:items-center gap-2"
            >
              {/* Role input */}
              <div className="flex-1 flex items-center gap-3 px-4 py-2.5 md:py-2 bg-surface-container-low md:bg-transparent rounded-full">
                <span className="material-symbols-outlined text-primary-container text-xl select-none">search</span>
                <div className="flex flex-col flex-1 min-w-0 text-left">
                  <label className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold" htmlFor="search-role">
                    Role or Keyword
                  </label>
                  <input
                    id="search-role"
                    type="text"
                    value={searchRole}
                    onChange={(e) => setSearchRole(e.target.value)}
                    placeholder="e.g. Staff Distributed, AI Researcher"
                    className="w-full bg-transparent text-sm text-on-surface focus:outline-none placeholder:text-outline font-medium"
                  />
                </div>
              </div>

              <div className="hidden md:block w-px h-9 bg-surface-container-highest"></div>

              {/* Location Selector */}
              <div className="flex-1 flex items-center gap-3 px-4 py-2.5 md:py-2 bg-surface-container-low md:bg-transparent rounded-full">
                <span className="material-symbols-outlined text-primary-container text-xl select-none">distance</span>
                <div className="flex flex-col flex-1 min-w-0 text-left">
                  <label className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold" htmlFor="search-location">
                    Location
                  </label>
                  <select
                    id="search-location"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full bg-transparent text-sm text-on-surface focus:outline-none cursor-pointer appearance-none font-medium"
                  >
                    <option value="all">Any Location (Global / Remote)</option>
                    <option value="sf">San Francisco, CA</option>
                    <option value="ny">New York, NY</option>
                    <option value="sea">Seattle, WA</option>
                    <option value="lon">London, UK</option>
                  </select>
                </div>
                <span className="material-symbols-outlined text-outline text-base">expand_more</span>
              </div>

              <div className="hidden md:block w-px h-9 bg-surface-container-highest"></div>

              {/* Category Selector */}
              <div className="flex-1 flex items-center gap-3 px-4 py-2.5 md:py-2 bg-surface-container-low md:bg-transparent rounded-full">
                <span className="material-symbols-outlined text-primary-container text-xl select-none">category</span>
                <div className="flex flex-col flex-1 min-w-0 text-left">
                  <label className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold" htmlFor="search-category">
                    Category
                  </label>
                  <select
                    id="search-category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent text-sm text-on-surface focus:outline-none cursor-pointer appearance-none font-medium"
                  >
                    <option value="all">All Disciplines</option>
                    <option value="Engineering & Tech">Engineering & Tech</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Data Science & AI">Data Science & AI</option>
                  </select>
                </div>
                <span className="material-symbols-outlined text-outline text-base">expand_more</span>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed font-label-md text-sm font-bold transition-transform active:scale-95 shadow-[0_4px_16px_rgba(204,242,26,0.35)] shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">search</span>
                <span>Search Jobs</span>
              </button>
            </form>
          </div>

          {/* Trust Badges Under Search */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-8 text-on-primary">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/10 backdrop-blur-sm">
              <span className="material-symbols-outlined text-secondary-container text-lg">verified</span>
              <span className="text-xs font-semibold text-surface-container-lowest">98% Verified Employers</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/10 backdrop-blur-sm">
              <span className="material-symbols-outlined text-secondary-container text-lg">bolt</span>
              <span className="text-xs font-semibold text-surface-container-lowest">Direct Fast-Track Loops</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/10 backdrop-blur-sm">
              <span className="material-symbols-outlined text-secondary-container text-lg">star</span>
              <span className="text-xs font-semibold text-surface-container-lowest">4.9/5 Candidate Satisfaction</span>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Verticals Pill Section */}
      <section className="w-full py-16 bg-surface-container-low border-b border-surface-container-high/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-widest">
              Explore Verticals
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-primary mt-1 mb-2 font-bold">
              Popular Categories
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant">
              Browse vetted roles across high-impact functional areas updated in real time
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-5xl mx-auto">
            {mockCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name === 'All Disciplines' ? 'all' : cat.name);
                }}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xs transition-all ${
                  (selectedCategory === 'all' && cat.name === 'All Disciplines') || selectedCategory === cat.name
                    ? 'bg-primary-container text-on-primary ring-2 ring-secondary-container/40'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-secondary-container text-lg">{cat.icon}</span>
                <span className="font-label-md text-xs font-semibold">{cat.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-bold">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Curated High-Trajectory Editorial Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="relative w-full rounded-2xl overflow-hidden bg-primary-container p-8 md:p-12 shadow-[0_12px_32px_-4px_rgba(20,48,34,0.12)]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-container font-label-caps text-xs uppercase mb-3 font-bold">
                <span className="material-symbols-outlined text-sm">stars</span>
                Curated High-Trajectory Roles
              </div>
              <h3 className="font-headline-lg text-2xl sm:text-3xl text-on-primary font-bold">
                Fast-track direct hiring with transparent offers.
              </h3>
              <p className="font-body-md text-sm sm:text-base text-primary-fixed-dim mt-2 leading-relaxed">
                Every listing features fully verified compensation, upfront equity tranches, and direct access to founders or hiring VPs without intermediate recruiter spam.
              </p>
            </div>

            {/* Metrics Counters */}
            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
              <div className="bg-surface-container-lowest/10 backdrop-blur-md rounded-2xl p-5 border border-surface-container-lowest/15">
                <div className="font-headline-lg text-3xl text-secondary-container font-bold">4.2 Days</div>
                <div className="font-body-sm text-xs text-surface-container-lowest/80 mt-1">Average Time-to-Offer</div>
              </div>
              <div className="bg-surface-container-lowest/10 backdrop-blur-md rounded-2xl p-5 border border-surface-container-lowest/15">
                <div className="font-headline-lg text-3xl text-on-primary font-bold">100%</div>
                <div className="font-body-sm text-xs text-surface-container-lowest/80 mt-1">Salary Disclosed Upfront</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Openings Grid */}
      <section className="w-full py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-widest">
                Active Circulars
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold mt-1">
                Recent Job Openings
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant mt-1">
                Showing {filteredJobs.length} verified executive positions open for application
              </p>
            </div>
            
            <button
              onClick={() => onNavigate('explore')}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary-container transition-colors"
            >
              <span>View All 2,568+ Opportunities</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/80 hover:border-primary/30 transition-all hover:shadow-[0_12px_32px_-4px_rgba(20,48,34,0.08)] flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <img
                      src={job.logo}
                      alt={job.company_name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-surface-container-high"
                    />
                    <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold uppercase tracking-wide">
                      {job.job_type}
                    </span>
                  </div>

                  <h3 
                    onClick={() => onSelectJob(job)}
                    className="font-headline-sm text-lg font-bold text-primary group-hover:text-primary-container cursor-pointer transition-colors line-clamp-1"
                  >
                    {job.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">
                    {job.company_name} • {job.location}
                  </p>
                  <p className="text-xs text-on-surface-variant/80 mt-3 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">
                      Compensation
                    </span>
                    <span className="text-xs font-extrabold text-primary">{job.salary_range}</span>
                  </div>

                  <button
                    onClick={() => onApplyJob(job)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-container text-on-primary hover:bg-primary text-xs font-bold transition-all shadow-xs"
                  >
                    <span>Apply</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer matching Stitch */}
      <footer className="w-full bg-primary text-on-primary py-12 border-t border-surface-container-highest/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </span>
            <span className="font-headline-md text-lg font-bold text-on-primary">
              Jobify<span className="text-secondary-container">.</span>2.0
            </span>
            <span className="text-xs text-primary-fixed-dim/70 ml-2">
              © 2026 Executive Workforce Platform. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-primary-fixed-dim">
            <button onClick={() => onNavigate('explore')} className="hover:text-secondary-container transition-colors">Find Jobs</button>
            <button onClick={() => onNavigate('salary_intelligence')} className="hover:text-secondary-container transition-colors">Salary Intelligence</button>
            <button onClick={() => onNavigate('auth')} className="hover:text-secondary-container transition-colors">Sign In / Register</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
