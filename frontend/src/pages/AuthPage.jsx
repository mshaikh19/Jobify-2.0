import React, { useState } from 'react';

export default function AuthPage({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [role, setRole] = useState('job_seeker'); // 'job_seeker' | 'employer'
  const [email, setEmail] = useState('annie.chen@example.com');
  const [password, setPassword] = useState('••••••••••');
  const [fullName, setFullName] = useState('Annie Chen');
  const [companyName, setCompanyName] = useState('Vercel Architecture Labs');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setTimeout(() => {
      setLoading(false);
      setMessage(`Successfully authenticated as ${role === 'job_seeker' ? 'Candidate' : 'Employer'}!`);
      setTimeout(() => {
        onLoginSuccess({
          email,
          full_name: role === 'job_seeker' ? fullName : 'Talent Director',
          role: role,
          company_name: role === 'employer' ? companyName : null
        });
      }, 700);
    }, 800);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] pt-24 pb-12 flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-[0_24px_50px_-12px_rgba(20,48,34,0.14)] bg-surface-container-lowest border border-surface-container-high/60">
        
        {/* LEFT BRANDING / TRUST PANEL (5 Cols) matching Stitch */}
        <div className="lg:col-span-5 bg-primary-container text-on-primary p-8 md:p-12 relative flex flex-col justify-between overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary/40 blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-fixed shadow-[0_0_16px_rgba(204,242,26,0.35)]">
                <span className="material-symbols-outlined text-[24px]">hub</span>
              </span>
              <div className="flex flex-col">
                <span className="font-headline-md text-xl tracking-tight font-extrabold text-on-primary">
                  Jobify<span className="text-secondary-container">.</span>2.0
                </span>
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-on-primary-container font-bold">
                  Executive Workforce Network
                </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/10 backdrop-blur-md text-secondary-container mb-4">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                <span className="text-xs font-semibold tracking-wide">450k+ Verified Tech & Design Leaders</span>
              </div>
              <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold tracking-tight text-on-primary leading-tight">
                Connect with high-trajectory career pathways.
              </h1>
              <p className="font-body-md text-xs sm:text-sm text-on-primary-container mt-2 max-w-sm leading-relaxed">
                Skip traditional recruiters. Direct, transparent access to engineering leaders, design directors, and founders.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container-lowest/10 flex items-center justify-center shrink-0 text-secondary-container mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                </div>
                <div>
                  <span className="font-headline-sm text-xs font-bold text-on-primary block">Direct access to hiring teams</span>
                  <span className="font-body-sm text-xs text-on-primary-container">Chat directly with VP of Eng and Design Leads without cold inmails.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container-lowest/10 flex items-center justify-center shrink-0 text-secondary-container mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                </div>
                <div>
                  <span className="font-headline-sm text-xs font-bold text-on-primary block">100% upfront salary & equity bands</span>
                  <span className="font-body-sm text-xs text-on-primary-container">Strict base pay, bonus ranges, and real dilution models upfront.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container-lowest/10 flex items-center justify-center shrink-0 text-secondary-container mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">visibility_off</span>
                </div>
                <div>
                  <span className="font-headline-sm text-xs font-bold text-on-primary block">Anonymous stealth search mode</span>
                  <span className="font-body-sm text-xs text-on-primary-container">Hide your profile from your current employer and conglomerate automatically.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="relative z-10 pt-6 mt-6">
            <div className="p-4 rounded-2xl bg-surface-container-lowest/10 backdrop-blur-md border border-surface-container-lowest/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-secondary-container">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <span className="text-[10px] uppercase bg-secondary-container text-on-secondary-fixed px-2 py-0.5 rounded-full font-bold">
                  Placed in 4.2 days
                </span>
              </div>
              <p className="font-body-sm text-xs italic text-on-primary leading-relaxed">
                "Jobify stripped out 3 weeks of useless recruiter screens. I signed an executive Staff Design offer with complete transparency."
              </p>
              <div className="flex items-center gap-3 mt-3">
                <img 
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-secondary-container" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
                  alt="Elena Rostova" 
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-primary">Elena Rostova</span>
                  <span className="text-[11px] text-on-primary-container">Staff Product Designer • Stripe Alumni</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT INTERACTIVE AUTH CARD (7 Cols) matching Stitch */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto flex flex-col">
            
            {/* Mode Tabs (Sign In vs Create Account) */}
            <div className="flex items-center justify-between p-1 rounded-full bg-surface-container mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`w-1/2 py-2 rounded-full font-label-md text-xs transition-all duration-200 text-center font-bold ${
                  authMode === 'signin'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`w-1/2 py-2 rounded-full font-label-md text-xs transition-all duration-200 text-center font-bold ${
                  authMode === 'signup'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Role Selector matching UserRole */}
            <div className="mb-6">
              <label className="font-label-caps text-[11px] text-on-surface-variant block mb-1.5 uppercase tracking-wider font-bold">
                Select Workspace Intent
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container-low rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole('job_seeker')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all text-xs font-bold ${
                    role === 'job_seeker'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">person_search</span>
                  <span>Job Seeker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('employer')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all text-xs font-bold ${
                    role === 'employer'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">business_center</span>
                  <span>Employer / Hiring</span>
                </button>
              </div>
            </div>

            {/* Social SSO Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button 
                type="button"
                className="flex items-center justify-center gap-1.5 h-11 px-2 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface text-xs font-semibold border border-surface-container-high"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                </svg>
                <span>Google</span>
              </button>

              <button 
                type="button"
                className="flex items-center justify-center gap-1.5 h-11 px-2 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface text-xs font-semibold border border-surface-container-high"
              >
                <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                </svg>
                <span>LinkedIn</span>
              </button>

              <button 
                type="button"
                className="flex items-center justify-center gap-1.5 h-11 px-2 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface text-xs font-semibold border border-surface-container-high"
              >
                <svg className="w-4 h-4 fill-primary" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-6">
              <div className="w-full h-px bg-surface-container-high"></div>
              <span className="absolute bg-surface-container-lowest px-3 text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                or continue with email
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    {role === 'employer' ? 'Company / Organization Name' : 'Full Legal Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={role === 'employer' ? companyName : fullName}
                    onChange={(e) => role === 'employer' ? setCompanyName(e.target.value) : setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Security Password
                  </label>
                  {authMode === 'signin' && (
                    <a href="#" className="text-[11px] font-bold text-primary hover:underline">
                      Forgot?
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              {message && (
                <div className="p-3 rounded-xl bg-secondary-container/20 text-on-secondary-container text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed font-label-md text-xs font-bold transition-all shadow-[0_4px_16px_rgba(204,242,26,0.35)] cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                    <span>Authenticating Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>{authMode === 'signin' ? 'Sign In to Workspace' : 'Create Verified Account'}</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
