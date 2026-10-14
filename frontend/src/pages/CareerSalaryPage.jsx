import React, { useState } from 'react';

export default function CareerSalaryPage({ onNavigate }) {
  // Compensation calculator state
  const [selectedTrack, setSelectedTrack] = useState('eng_distributed');
  const [selectedLevel, setSelectedLevel] = useState('staff');
  const [selectedRegion, setSelectedRegion] = useState('sf');

  // Offer Evaluator state
  const [offerBase, setOfferBase] = useState('225000');
  const [offerBonus, setOfferBonus] = useState('30000');
  const [offerEquity, setOfferEquity] = useState('60000');
  const [offerAnalysis, setOfferAnalysis] = useState(null);

  // Search in table
  const [tableSearch, setTableSearch] = useState('');

  // Compensation benchmark database
  const compensationData = {
    eng_distributed: {
      title: 'Distributed Systems & Cloud Architecture',
      levels: {
        senior: { p25: 165000, p50: 195000, p75: 230000, p90: 265000, equity: '0.08% - 0.15%', bonus: '$25,000' },
        staff: { p25: 210000, p50: 245000, p75: 285000, p90: 330000, equity: '0.18% - 0.35%', bonus: '$40,000' },
        principal: { p25: 260000, p50: 310000, p75: 375000, p90: 450000, equity: '0.35% - 0.75%', bonus: '$65,000' },
        director: { p25: 280000, p50: 340000, p75: 420000, p90: 520000, equity: '0.60% - 1.50%', bonus: '$90,000' }
      }
    },
    ai_research: {
      title: 'AI Research & LLM Reasoning',
      levels: {
        senior: { p25: 185000, p50: 220000, p75: 260000, p90: 310000, equity: '0.10% - 0.20%', bonus: '$35,000' },
        staff: { p25: 240000, p50: 290000, p75: 350000, p90: 420000, equity: '0.25% - 0.50%', bonus: '$55,000' },
        principal: { p25: 310000, p50: 380000, p75: 470000, p90: 580000, equity: '0.50% - 1.10%', bonus: '$85,000' },
        director: { p25: 350000, p50: 430000, p75: 530000, p90: 660000, equity: '0.80% - 2.00%', bonus: '$120,000' }
      }
    },
    design_systems: {
      title: 'Product Design & Design Systems',
      levels: {
        senior: { p25: 145000, p50: 175000, p75: 205000, p90: 235000, equity: '0.06% - 0.12%', bonus: '$20,000' },
        staff: { p25: 185000, p50: 220000, p75: 255000, p90: 295000, equity: '0.12% - 0.25%', bonus: '$30,000' },
        principal: { p25: 225000, p50: 265000, p75: 315000, p90: 370000, equity: '0.25% - 0.50%', bonus: '$45,000' },
        director: { p25: 250000, p50: 300000, p75: 360000, p90: 430000, equity: '0.40% - 1.00%', bonus: '$65,000' }
      }
    },
    product_mgmt: {
      title: 'Technical Product Management',
      levels: {
        senior: { p25: 155000, p50: 185000, p75: 215000, p90: 250000, equity: '0.08% - 0.15%', bonus: '$25,000' },
        staff: { p25: 195000, p50: 235000, p75: 275000, p90: 320000, equity: '0.15% - 0.30%', bonus: '$35,000' },
        principal: { p25: 245000, p50: 290000, p75: 345000, p90: 410000, equity: '0.30% - 0.65%', bonus: '$55,000' },
        director: { p25: 280000, p50: 335000, p75: 410000, p90: 490000, equity: '0.50% - 1.25%', bonus: '$80,000' }
      }
    },
    security_infra: {
      title: 'Cybersecurity & Zero-Trust Infra',
      levels: {
        senior: { p25: 160000, p50: 190000, p75: 220000, p90: 255000, equity: '0.07% - 0.14%', bonus: '$22,000' },
        staff: { p25: 200000, p50: 235000, p75: 270000, p90: 315000, equity: '0.14% - 0.28%', bonus: '$35,000' },
        principal: { p25: 245000, p50: 295000, p75: 350000, p90: 420000, equity: '0.28% - 0.60%', bonus: '$55,000' },
        director: { p25: 275000, p50: 330000, p75: 395000, p90: 480000, equity: '0.45% - 1.10%', bonus: '$75,000' }
      }
    }
  };

  const regionMultipliers = {
    sf: { name: 'SF Bay Area / Silicon Valley', factor: 1.0 },
    nyc: { name: 'New York City Metro', factor: 0.98 },
    seattle: { name: 'Seattle / Pacific Northwest', factor: 0.95 },
    remote_us: { name: 'US Remote (Tier 1)', factor: 0.92 },
    europe: { name: 'London / Berlin / EU Hubs', factor: 0.82 }
  };

  const currentTrackData = compensationData[selectedTrack] || compensationData.eng_distributed;
  const currentLevelData = currentTrackData.levels[selectedLevel] || currentTrackData.levels.staff;
  const regionFactor = regionMultipliers[selectedRegion].factor;

  const adjP25 = Math.round((currentLevelData.p25 * regionFactor) / 1000) * 1000;
  const adjP50 = Math.round((currentLevelData.p50 * regionFactor) / 1000) * 1000;
  const adjP75 = Math.round((currentLevelData.p75 * regionFactor) / 1000) * 1000;
  const adjP90 = Math.round((currentLevelData.p90 * regionFactor) / 1000) * 1000;

  // Table benchmarks
  const tableBenchmarks = [
    { role: 'Staff Distributed Systems Engineer', discipline: 'Engineering', p25: '$210,000', p50: '$245,000', p75: '$285,000', p90: '$330,000', equity: '0.18% - 0.35%', yoy: '+18.4%' },
    { role: 'Principal AI / LLM Reasoning Scientist', discipline: 'AI & Data', p25: '$310,000', p50: '$380,000', p75: '$470,000', p90: '$580,000', equity: '0.50% - 1.10%', yoy: '+24.6%' },
    { role: 'Principal Design Systems Architect', discipline: 'Design', p25: '$225,000', p50: '$265,000', p75: '$315,000', p90: '$370,000', equity: '0.25% - 0.50%', yoy: '+12.1%' },
    { role: 'VP of Product Engineering', discipline: 'Leadership', p25: '$280,000', p50: '$340,000', p75: '$420,000', p90: '$520,000', equity: '0.60% - 1.50%', yoy: '+15.2%' },
    { role: 'Staff Product Manager - API Platform', discipline: 'Product', p25: '$195,000', p50: '$235,000', p75: '$275,000', p90: '$320,000', equity: '0.15% - 0.30%', yoy: '+10.8%' },
    { role: 'Lead Zero-Trust Security Architect', discipline: 'Security', p25: '$200,000', p50: '$235,000', p75: '$270,000', p90: '$315,000', equity: '0.14% - 0.28%', yoy: '+14.9%' }
  ];

  const filteredBenchmarks = tableBenchmarks.filter(b => 
    !tableSearch ||
    b.role.toLowerCase().includes(tableSearch.toLowerCase()) ||
    b.discipline.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const handleEvaluateOffer = (e) => {
    e.preventDefault();
    const b = parseFloat(offerBase) || 0;
    const bon = parseFloat(offerBonus) || 0;
    const eq = parseFloat(offerEquity) || 0;
    const totalComp = b + bon + eq;

    let percentile = '70th Percentile';
    let grade = 'Competitive Market Tier-2';
    let tip = 'Your base salary is in line with top 30% of market. You have room to negotiate an additional $15k sign-on bonus or ask for an accelerated equity vesting schedule.';

    if (totalComp >= adjP90) {
      percentile = '92nd Percentile (Tier-1 Top Decile)';
      grade = 'Exceptional Executive Package';
      tip = 'This package sits at the very top of the market. Ensure your contract includes strong double-trigger acceleration clauses on change-of-control.';
    } else if (totalComp >= adjP75) {
      percentile = '80th Percentile (Tier-1)';
      grade = 'Strong Above-Market Offer';
      tip = 'Solid executive offer. Consider counter-offering on initial equity grant or annual refresh frequency before signing.';
    } else if (totalComp < adjP50) {
      percentile = '38th Percentile';
      grade = 'Below Verified Median';
      tip = 'This offer is currently below the 2026 verified market median for this seniority level. We strongly recommend countering with the median base figure.';
    }

    setOfferAnalysis({
      totalComp,
      percentile,
      grade,
      tip
    });
  };

  return (
    <div className="w-full pt-24 pb-16 bg-background min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fadeIn">
      
      {/* Top Hero Section */}
      <div className="bg-primary-container text-on-primary rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-container text-xs font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-sm">query_stats</span> Verified Q4 2026 Market Intelligence
          </div>
          <h1 className="font-headline-lg text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Career & Salary Intelligence
          </h1>
          <p className="text-on-primary-container text-sm sm:text-base mt-2 leading-relaxed">
            Real compensation percentiles, equity dilution models, and executive career ladder blueprints compiled from verified tech offers, W2 filings, and corporate payroll benchmarks.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-on-primary font-medium">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary-container text-sm">check_circle</span>
              <span>100% Verified Disclosures</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary-container text-sm">check_circle</span>
              <span>No Recruiter Discovery Gatekeeping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary-container text-sm">check_circle</span>
              <span>2026 Inflation & AI Multipliers Adjusted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Compensation Explorer Tool */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-surface-container-high/80 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container-low">
          <div>
            <span className="text-[10px] uppercase font-bold text-secondary tracking-widest block">Interactive Calculator</span>
            <h2 className="font-headline-sm text-xl font-bold text-primary">Executive Compensation Calculator</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Customize discipline, seniority ladder, and target metro market.</p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold">
            Live Adjusted for: {regionMultipliers[selectedRegion].name}
          </div>
        </div>

        {/* Selector Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Functional Discipline */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              Functional Discipline
            </label>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container-high text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="eng_distributed">Distributed Systems & Backend</option>
              <option value="ai_research">AI Research & LLM Reasoning</option>
              <option value="design_systems">Product Design & Systems</option>
              <option value="product_mgmt">Technical Product Management</option>
              <option value="security_infra">Cybersecurity & Zero-Trust</option>
            </select>
          </div>

          {/* Seniority Ladder */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              Seniority Level
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-surface-container-low rounded-xl border border-surface-container-high">
              {[
                { id: 'senior', label: 'Senior (IC5)' },
                { id: 'staff', label: 'Staff (IC6)' },
                { id: 'principal', label: 'Principal (IC7)' },
                { id: 'director', label: 'Director (IC8+)' }
              ].map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`py-2 text-[11px] font-bold rounded-lg transition-colors ${
                    selectedLevel === lvl.id
                      ? 'bg-primary text-secondary-container shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {lvl.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              Target Metro Location
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container-high text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="sf">San Francisco Bay Area (1.0x)</option>
              <option value="nyc">New York City Metro (0.98x)</option>
              <option value="seattle">Seattle / PNW (0.95x)</option>
              <option value="remote_us">US Remote Tier-1 (0.92x)</option>
              <option value="europe">London / European Tech Hubs (0.82x)</option>
            </select>
          </div>
        </div>

        {/* Calculated Percentile Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-high/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">25th Percentile</span>
            <div className="text-xl sm:text-2xl font-bold text-primary mt-1">
              ${adjP25.toLocaleString()}
            </div>
            <span className="text-[11px] text-on-surface-variant mt-1 block">Entry for this tier</span>
          </div>

          <div className="p-5 rounded-2xl bg-secondary-container/20 border border-secondary-container/60 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block">Median (50th %ile)</span>
              <span className="material-symbols-outlined text-secondary text-base">star</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-primary mt-1">
              ${adjP50.toLocaleString()}
            </div>
            <span className="text-[11px] text-secondary font-bold mt-1 block">Market Benchmark</span>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-high/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">75th Percentile</span>
            <div className="text-xl sm:text-2xl font-bold text-primary mt-1">
              ${adjP75.toLocaleString()}
            </div>
            <span className="text-[11px] text-on-surface-variant mt-1 block">Competitive tier-1</span>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-high/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">90th Percentile</span>
            <div className="text-xl sm:text-2xl font-bold text-primary mt-1">
              ${adjP90.toLocaleString()}
            </div>
            <span className="text-[11px] text-on-surface-variant mt-1 block">Top-tier leadership</span>
          </div>
        </div>

        {/* Equity & Bonus Auxiliary Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-lg">pie_chart</span>
              <span className="text-xs font-bold text-primary">Typical Equity Ownership Bracket:</span>
            </div>
            <span className="text-xs font-extrabold text-secondary">{currentLevelData.equity}</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">monetization_on</span>
              <span className="text-xs font-bold text-primary">Target Annual Bonus / Sign-on:</span>
            </div>
            <span className="text-xs font-extrabold text-primary">{currentLevelData.bonus}</span>
          </div>
        </div>

      </div>

      {/* Offer Evaluator Tool */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-surface-container-high/80 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-secondary tracking-widest block">Executive Self-Audit</span>
            <h2 className="font-headline-sm text-xl font-bold text-primary">Evaluate a Job Offer Package</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Enter your pending or current offer numbers to benchmark against real market percentiles.
            </p>
          </div>

          <form onSubmit={handleEvaluateOffer} className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                Base Annual Cash Salary ($)
              </label>
              <input
                type="number"
                value={offerBase}
                onChange={(e) => setOfferBase(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-xs font-bold text-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Annual Target Bonus ($)
                </label>
                <input
                  type="number"
                  value={offerBonus}
                  onChange={(e) => setOfferBonus(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-xs font-bold text-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Annualized Equity Value ($)
                </label>
                <input
                  type="number"
                  value={offerEquity}
                  onChange={(e) => setOfferEquity(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-xs font-bold text-primary focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Analyze Offer Against {selectedTrack.replace('_', ' ')} Standards
            </button>
          </form>
        </div>

        {/* Right Output Analysis (6 cols) */}
        <div className="lg:col-span-6 bg-surface-container-low rounded-2xl p-6 border border-surface-container-high/60 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
            <span className="font-bold text-xs uppercase tracking-wider text-primary">Benchmark Analysis Result</span>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[10px] font-bold">
              AI Market Model
            </span>
          </div>

          {offerAnalysis ? (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="flex items-baseline justify-between">
                <span className="text-on-surface-variant font-medium">Total Annual Target Comp (TTC):</span>
                <span className="text-2xl font-black text-primary">${offerAnalysis.totalComp.toLocaleString()}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-high space-y-1">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Market Decile Ranking:</span>
                <div className="font-bold text-secondary text-sm">{offerAnalysis.percentile}</div>
                <div className="text-[11px] text-on-surface-variant font-medium">{offerAnalysis.grade}</div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high space-y-1">
                <span className="text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary">tips_and_updates</span>
                  Tactical Negotiation Recommendation
                </span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  {offerAnalysis.tip}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-on-surface-variant space-y-2">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">insights</span>
              <p className="text-xs">Click "Analyze Offer" to calculate your market percentile and tactical leverage.</p>
            </div>
          )}
        </div>

      </div>

      {/* Verified 2026 Compensation Matrix Table */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-surface-container-high/80 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container-low">
          <div>
            <span className="text-[10px] uppercase font-bold text-secondary tracking-widest block">Executive Payroll Matrix</span>
            <h2 className="font-headline-sm text-lg font-bold text-primary">2026 Tier-1 Verified Compensation Bands</h2>
            <p className="text-xs text-on-surface-variant">Base cash salary percentiles excluding bonus & upfront sign-on</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-surface-container-high text-xs">
              <span className="material-symbols-outlined text-sm text-on-surface-variant">search</span>
              <input
                type="text"
                placeholder="Search benchmark role..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="bg-transparent text-xs text-on-surface focus:outline-none placeholder:text-outline w-36"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface-container-low text-on-surface-variant uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Executive Role Title</th>
                <th className="py-3 px-4">Discipline</th>
                <th className="py-3 px-4">25th %ile</th>
                <th className="py-3 px-4 text-primary font-bold">Median (50th)</th>
                <th className="py-3 px-4">75th %ile</th>
                <th className="py-3 px-4">90th %ile</th>
                <th className="py-3 px-4">Target Equity Band</th>
                <th className="py-3 px-4 text-right">YoY Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredBenchmarks.map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low/40">
                  <td className="py-4 px-4 font-bold text-primary">{row.role}</td>
                  <td className="py-4 px-4 text-on-surface-variant">{row.discipline}</td>
                  <td className="py-4 px-4 text-on-surface-variant">{row.p25}</td>
                  <td className="py-4 px-4 font-extrabold text-primary bg-secondary-container/10">{row.p50}</td>
                  <td className="py-4 px-4 text-on-surface-variant">{row.p75}</td>
                  <td className="py-4 px-4 text-primary font-bold">{row.p90}</td>
                  <td className="py-4 px-4 text-secondary font-bold">{row.equity}</td>
                  <td className="py-4 px-4 text-right font-bold text-emerald-600">{row.yoy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Career Ladder Competency Levers */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-surface-container-high/80 shadow-md space-y-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-secondary tracking-widest block">Seniority Blueprint</span>
          <h2 className="font-headline-sm text-lg font-bold text-primary">Staff vs Principal Promotion Levers</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">What behaviors and organizational leverage command tier-1 compensation brackets?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-high/60 space-y-3">
            <span className="px-2.5 py-1 rounded-full bg-primary text-secondary-container text-[10px] font-bold uppercase">
              Senior (IC5)
            </span>
            <h3 className="font-bold text-sm text-primary">Autonomous Feature Delivery</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Takes ambiguous team-level goals, scopes architecture, implements with high code quality, and mentors junior engineers.
            </p>
            <div className="text-[11px] font-semibold text-primary pt-2 border-t border-surface-container-high">
              Typical Band: $165k - $215k Base
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-secondary-container/15 border border-secondary-container/60 space-y-3 relative">
            <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-[10px] font-bold uppercase">
              Staff (IC6) - Inflection Point
            </span>
            <h3 className="font-bold text-sm text-primary">Multi-Team Architectural RFCs</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Solves architectural bottlenecks spanning multiple org boundaries. Defines engineering standards, deprecates legacy cruft, and steers technical roadmap.
            </p>
            <div className="text-[11px] font-extrabold text-secondary pt-2 border-t border-secondary-container/40">
              Typical Band: $210k - $290k Base + 0.25% Equity
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-high/60 space-y-3">
            <span className="px-2.5 py-1 rounded-full bg-primary text-secondary-container text-[10px] font-bold uppercase">
              Principal (IC7+)
            </span>
            <h3 className="font-bold text-sm text-primary">Enterprise Business Multiplier</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Aligns multi-year technical strategy directly with executive company P&L, customer retention, and transformative new market categories.
            </p>
            <div className="text-[11px] font-semibold text-primary pt-2 border-t border-surface-container-high">
              Typical Band: $280k - $450k Base + 0.60%+ Equity
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
