import React, { useState, useEffect, useRef } from 'react';
import { initialMessages } from '../data/mockData';

export default function MessagesPage({ currentRole = 'job_seeker', initialThreadId = null, onNavigate }) {
  // Enhanced threads with more recruiter dialogues for Jobify 2.0
  const [threads, setThreads] = useState(() => {
    // Add 2 more threads if not present
    const extraThreads = [
      {
        id: 'thread-3',
        participant_name: 'David K. Zhang',
        participant_title: 'Head of Talent @ Cognition Dynamics',
        participant_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        role_context: 'Head of AI Research & Agents',
        company: 'Cognition Dynamics',
        unread: false,
        last_message: 'Our research partners were very impressed with your NeurIPS publication notes.',
        time: 'Oct 13',
        messages: [
          {
            id: 'm301',
            sender: 'David K. Zhang',
            text: 'Hello Annie, thanks for applying to Head of AI Research. Our research committee was very impressed with your publication notes on autonomous reasoning chains.',
            time: 'Oct 13 2:10 PM',
            isMe: false
          },
          {
            id: 'm302',
            sender: 'Annie Chen',
            text: 'Thank you David! I am particularly excited about your work on speculative decoding runtime benchmarks.',
            time: 'Oct 13 3:00 PM',
            isMe: true
          },
          {
            id: 'm303',
            sender: 'David K. Zhang',
            text: 'Our research partners were very impressed with your NeurIPS publication notes. We are consolidating feedback for the next technical round.',
            time: 'Oct 13 4:45 PM',
            isMe: false
          }
        ]
      },
      {
        id: 'thread-4',
        participant_name: 'Sarah Jenkins',
        participant_title: 'Principal Technical Recruiter @ Stripe Infrastructure',
        participant_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        role_context: 'Senior Product Manager - Developer Platform',
        company: 'Stripe Infrastructure',
        unread: false,
        last_message: 'The signed executive offer letter has been deposited in your portal.',
        time: 'Oct 12',
        messages: [
          {
            id: 'm401',
            sender: 'Sarah Jenkins',
            text: 'Hi Annie, we are thrilled to extend the formal executive offer for Senior Product Manager - Developer Platform! Base $215k + equity package is ready.',
            time: 'Oct 12 11:00 AM',
            isMe: false
          },
          {
            id: 'm402',
            sender: 'Annie Chen',
            text: 'Thank you so much Sarah! I am reviewing the term sheet now.',
            time: 'Oct 12 1:30 PM',
            isMe: true
          },
          {
            id: 'm403',
            sender: 'Sarah Jenkins',
            text: 'The signed executive offer letter has been deposited in your portal. Let me know if you need any adjustments on start dates!',
            time: 'Oct 12 6:15 PM',
            isMe: false
          }
        ]
      }
    ];

    const baseWithContext = initialMessages.map(t => ({
      ...t,
      role_context: t.id === 'thread-1' ? 'Staff Distributed Systems Engineer' : 'Principal Product Designer',
      company: t.id === 'thread-1' ? 'Vercel Architecture Labs' : 'Linear Craft Technologies'
    }));

    return [...baseWithContext, ...extraThreads];
  });

  const [activeThreadId, setActiveThreadId] = useState(() => initialThreadId || threads[0].id);
  const [searchFilter, setSearchFilter] = useState('');
  const [inputText, setInputText] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread' | 'offers'
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Update activeThreadId if initialThreadId changes
  useEffect(() => {
    if (initialThreadId && threads.some(t => t.id === initialThreadId)) {
      setActiveThreadId(initialThreadId);
    }
  }, [initialThreadId, threads]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  const handleSendMessage = (textToSend = null) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: currentRole === 'job_seeker' ? 'Annie Chen' : 'Recruiting Lead',
      text: text,
      time: 'Just now',
      isMe: true
    };

    const updated = threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          last_message: text,
          time: 'Just now',
          unread: false,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    });

    setThreads(updated);
    setInputText('');
  };

  const handleQuickSuggestion = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const filteredThreads = threads.filter(t => {
    const matchesSearch = !searchFilter ||
      t.participant_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.participant_title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.last_message.toLowerCase().includes(searchFilter.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'unread') return t.unread;
    if (filterType === 'offers') return t.role_context.toLowerCase().includes('offer') || t.last_message.toLowerCase().includes('offer');
    return true;
  });

  return (
    <div className="w-full pt-24 pb-12 bg-background min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container-high/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Direct Hiring Communication
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold">
            Recruiter Messages
          </h1>
          <p className="text-xs text-on-surface-variant">
            Encrypted end-to-end messaging with hiring managers and enterprise talent partners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-on-surface-variant font-medium">Logged in as:</span>
          <span className="px-3 py-1 rounded-full bg-surface-container text-xs font-bold text-primary border border-surface-container-high">
            {currentRole === 'job_seeker' ? 'Annie Chen (Staff Candidate)' : 'Recruiter Workspace'}
          </span>
        </div>
      </div>

      {/* Main Messaging Interface Container */}
      <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/80 shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[660px]">
        
        {/* Left Threads Column (4 Cols) */}
        <div className="md:col-span-4 border-r border-surface-container-low flex flex-col bg-surface-container-lowest">
          
          {/* Search Contacts */}
          <div className="p-4 border-b border-surface-container-low space-y-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-high/60">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
              <input
                type="text"
                placeholder="Search recruiters or conversations..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-transparent text-xs text-on-surface focus:outline-none placeholder:text-outline font-medium"
              />
              {searchFilter && (
                <button onClick={() => setSearchFilter('')} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            {/* Quick Filter Chips */}
            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: 'All Inquiries' },
                { id: 'unread', label: 'Unread' },
                { id: 'offers', label: 'Offers' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                    filterType === f.id
                      ? 'bg-primary text-secondary-container'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations List */}
          <div className="divide-y divide-surface-container-low flex-1 overflow-y-auto">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant text-xs">
                No conversations found.
              </div>
            ) : (
              filteredThreads.map(thread => {
                const isSelected = activeThreadId === thread.id;
                return (
                  <button
                    key={thread.id}
                    onClick={() => {
                      setActiveThreadId(thread.id);
                      setThreads(threads.map(t => t.id === thread.id ? { ...t, unread: false } : t));
                    }}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors relative cursor-pointer ${
                      isSelected
                        ? 'bg-surface-container-low/90'
                        : 'hover:bg-surface-container-low/40'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container"></div>
                    )}
                    
                    {/* Avatar with Presence Indicator */}
                    <div className="relative shrink-0">
                      <img
                        src={thread.participant_avatar}
                        alt={thread.participant_name}
                        className="w-11 h-11 rounded-full object-cover ring-1 ring-surface-container-high"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-xs text-primary truncate">{thread.participant_name}</h4>
                        <span className="text-[10px] text-on-surface-variant">{thread.time}</span>
                      </div>
                      
                      <p className="text-[11px] text-on-surface-variant font-medium truncate">
                        {thread.participant_title}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-secondary-container/20 text-on-secondary-container text-[10px] font-bold truncate max-w-[170px]">
                          {thread.role_context}
                        </span>
                        {thread.unread && (
                          <span className="w-2 h-2 rounded-full bg-secondary-container shrink-0"></span>
                        )}
                      </div>

                      <p className={`text-xs truncate mt-1.5 ${
                        thread.unread ? 'font-bold text-primary' : 'text-on-surface-variant/80 font-normal'
                      }`}>
                        {thread.last_message}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Conversation (8 Cols) */}
        <div className="md:col-span-8 flex flex-col justify-between bg-surface-container-lowest">
          
          {/* Chat Header */}
          <div className="p-4 sm:p-5 border-b border-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest/90 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeThread.participant_avatar}
                  alt={activeThread.participant_name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/10 shrink-0"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-primary">{activeThread.participant_name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-bold">
                    Online
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">{activeThread.participant_title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsScheduleOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-xs font-bold text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-secondary">calendar_today</span>
                <span>Schedule Sync</span>
              </button>
              <button
                onClick={() => onNavigate('explore')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-xs font-bold text-on-surface-variant transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                <span>Job Spec</span>
              </button>
            </div>
          </div>

          {/* Context Banner */}
          <div className="px-6 py-2.5 bg-surface-container-low/70 border-b border-surface-container-high/40 flex items-center justify-between text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">work</span>
              <span>Re: <strong className="text-primary">{activeThread.role_context}</strong> ({activeThread.company})</span>
            </div>
            <span className="text-[11px] font-bold text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">lock</span> Verified Channel
            </span>
          </div>

          {/* Messages Feed */}
          <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[460px]">
            {activeThread.messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-on-surface-variant">{msg.sender}</span>
                  <span className="text-[10px] text-on-surface-variant/70">{msg.time}</span>
                </div>

                <div
                  className={`max-w-md sm:max-w-lg p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    msg.isMe
                      ? 'bg-primary text-on-primary rounded-br-none'
                      : 'bg-surface-container text-on-surface rounded-bl-none border border-surface-container-high/60'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.isMe && (
                  <span className="text-[10px] text-on-surface-variant flex items-center gap-0.5 px-1">
                    <span className="material-symbols-outlined text-xs text-secondary">done_all</span>
                    Delivered
                  </span>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-6 py-2 border-t border-surface-container-low/80 bg-surface-container-lowest overflow-x-auto flex items-center gap-2">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider shrink-0">
              Quick Reply:
            </span>
            {[
              "Yes, Friday at 3:00 PM EST works great!",
              "Could you share the equity grant details?",
              "Thank you for the update! Looking forward to meeting the team.",
              "I've attached my updated portfolio case study."
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickSuggestion(chip)}
                className="px-3 py-1 rounded-full bg-surface-container-low hover:bg-secondary-container/20 text-on-surface-variant hover:text-primary text-[11px] font-medium whitespace-nowrap transition-colors border border-surface-container-high/50 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Text Input Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-4 border-t border-surface-container-low flex items-center gap-3 bg-surface-container-lowest"
          >
            <button
              type="button"
              onClick={() => alert("Simulated file attach: 'Executive_Architect_Portfolio_AnnieChen.pdf' attached.")}
              title="Attach Document or Portfolio"
              className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">attach_file</span>
            </button>

            <input
              type="text"
              placeholder={`Write confidential message to ${activeThread.participant_name.split(' ')[0]}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-full border border-surface-container-high text-xs bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim disabled:opacity-40 text-on-secondary-fixed flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </form>

        </div>

      </div>

      {/* Schedule Sync Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 shadow-2xl border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-low">
              <h3 className="font-bold text-base text-primary">Schedule Recruiter Sync</h3>
              <button onClick={() => setIsScheduleOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Select an available executive slot with <strong>{activeThread.participant_name}</strong>:
            </p>

            <div className="space-y-2">
              {[
                { day: 'Thursday, Oct 16', time: '10:00 AM - 10:30 AM EST' },
                { day: 'Friday, Oct 17', time: '2:00 PM - 2:30 PM EST' },
                { day: 'Monday, Oct 20', time: '11:00 AM - 11:30 AM EST' }
              ].map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSendMessage(`Confirmed for synchronous recruiter briefing on ${slot.day} at ${slot.time}.`);
                    setIsScheduleOpen(false);
                  }}
                  className="w-full p-3 rounded-xl bg-surface-container-low hover:bg-secondary-container/20 border border-surface-container-high text-left flex items-center justify-between text-xs transition-colors"
                >
                  <span className="font-bold text-primary">{slot.day}</span>
                  <span className="text-secondary font-semibold">{slot.time}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsScheduleOpen(false)}
                className="px-4 py-2 rounded-full text-xs font-bold text-on-surface-variant hover:text-on-surface"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
