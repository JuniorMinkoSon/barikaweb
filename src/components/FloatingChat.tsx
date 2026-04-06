import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Minimize2 } from 'lucide-react';
import { theme } from '../theme';

interface Message {
  id: number;
  text: string;
  from: 'user' | 'support';
  time: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: 'Bonjour 👋 Bienvenue sur LouCI ! Comment pouvons-nous vous aider ?',
    from: 'support',
    time: now(),
  },
];

function now() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [open, messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: Date.now(), text, from: 'user', time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulated reply
    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        text: 'Merci pour votre message ! Un conseiller vous répondra très rapidement 🙏',
        from: 'support',
        time: now(),
      };
      setMessages(prev => [...prev, reply]);
      if (!open) setUnread(u => u + 1);
    }, 1200);
  };

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          className="fixed z-50 flex flex-col overflow-hidden"
          style={{
            bottom: 196,
            right: 20,
            width: 340,
            height: minimized ? 64 : 480,
            borderRadius: 28,
            boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
            transition: 'height 0.35s cubic-bezier(0.4,0,0.2,1)',
            backgroundColor: '#fff',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.gray[900]} 0%, #1e293b 100%)`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <MessageCircle size={17} className="text-white" />
                </div>
                {/* Online dot */}
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: '#22c55e' }}
                />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">Support LouCI</p>
                <p className="text-green-400 text-[10px] font-medium mt-0.5">En ligne</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMinimized(m => !m)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <Minimize2 size={14} className="text-white" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ backgroundColor: '#f8fafc' }}>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div style={{ maxWidth: '78%' }}>
                      <div
                        className="px-4 py-3 text-sm font-medium leading-relaxed"
                        style={{
                          borderRadius: msg.from === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                          backgroundColor: msg.from === 'user' ? theme.colors.primary : '#fff',
                          color: msg.from === 'user' ? '#fff' : '#1e293b',
                          boxShadow: msg.from === 'user'
                            ? `0 4px 14px ${theme.colors.primary}40`
                            : '0 2px 8px rgba(0,0,0,0.08)',
                        }}
                      >
                        {msg.text}
                      </div>
                      <p
                        className={`text-[10px] text-gray-400 mt-1 font-medium ${msg.from === 'user' ? 'text-right pr-1' : 'pl-1'}`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div
                className="px-4 py-3 flex items-center gap-3 border-t"
                style={{ borderColor: '#f1f5f9', backgroundColor: '#fff' }}
              >
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Votre message..."
                  className="flex-1 px-4 py-2.5 rounded-2xl text-sm font-medium outline-none border-2 border-transparent focus:border-orange-400 transition-all"
                  style={{ backgroundColor: '#f8fafc' }}
                />
                <button
                  onClick={send}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-40"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Send size={15} className="text-white" style={{ transform: 'translateX(1px)' }} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => { setOpen(o => !o); }}
        className="fixed z-50 flex items-center justify-center transition-all active:scale-90"
        style={{
          bottom: 130,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 20,
          background: open
            ? '#1e293b'
            : `linear-gradient(135deg, ${theme.colors.primary} 0%, #f97316 100%)`,
          boxShadow: open
            ? '0 8px 24px rgba(0,0,0,0.25)'
            : `0 8px 28px ${theme.colors.primary}55`,
          transform: open ? 'rotate(0deg)' : 'rotate(0deg)',
          transition: 'background 0.25s, box-shadow 0.25s',
        }}
        aria-label="Chat support"
      >
        {open ? (
          <X size={22} className="text-white" />
        ) : (
          <>
            <MessageCircle size={24} className="text-white" />
            {unread > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-white"
                style={{ backgroundColor: '#ef4444' }}
              >
                {unread}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
}