'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, X, Send, Zap, RotateCcw } from 'lucide-react';

interface Message { role: 'user' | 'assistant'; content: string; }

const SUGGESTIONS = [
  'Which country has the highest GOSA score?',
  'Compare Malaysia vs Vietnam for EV battery investment',
  'What is the GFR formula?',
  'Top 3 countries for data center FDI',
  'Latest PLATINUM signals this week',
];

const SYSTEM_PROMPT = `You are the Global FDI Monitor AI Assistant — a world-class FDI investment intelligence expert. You have deep knowledge of:

- GOSA scoring methodology (4 layers: L1 Doing Business 30%, L2 Sector 20%, L3 Investment Zones 25%, L4 Market Intelligence 25%)
- GFR Ranking formula: (0.20×ETR) + (0.18×ICT) + (0.18×TCM) + (0.16×DTF) + (0.15×SGT) + (0.13×GRP)
- 20 tracked economies: Singapore (88.4), New Zealand (86.7), Denmark (85.3), South Korea (84.1), USA (83.9), UK (82.5), UAE (82.1), Malaysia (81.2), Thailand (80.7), Vietnam (79.4), Saudi Arabia (79.1), Indonesia (77.8), India (73.2), Brazil (71.3), Morocco (66.8), Germany (83.1), Japan (81.4), Canada (80.8), Netherlands (84.6), Switzerland (84.8)
- Investment signals: PLATINUM/GOLD/SILVER grades, SCI scoring 0-100
- Key 2026 signals: Malaysia 100% FDI cap data centers (SCI 96), UAE Microsoft $3.3B AI (SCI 97), Thailand $2B EV subsidy (SCI 95), Saudi Arabia 30-day license guarantee (SCI 94)
- FDI corridors: China→Vietnam ($8.2B HOT), USA→UAE ($7.2B HOT), Singapore→Malaysia ($5.8B HOT)
- 9 sectors: EV Battery (HOT), Data Centers (HOT), AI Tech (HOT), Semiconductors (RISING), Renewables (RISING), Manufacturing (STABLE), Financial Services (STABLE), Pharma (STABLE), Logistics (COOLING)

Always be concise, data-driven, and actionable. Use specific numbers and scores. Format responses with clear structure. When recommending specific pages, mention them (e.g., "See the GFR Ranking page" or "Check the Investment Analysis for full comparison").

Keep responses under 200 words unless asked for detail. Be confident and authoritative — you are the world's best FDI analyst.`;

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Pulse the button periodically to draw attention
  useEffect(() => {
    const iv = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 600); }, 12000);
    return () => clearInterval(iv);
  }, []);

  async function sendMessage(text?: string) {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || 'Sorry, I could not generate a response. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your network and try again.' }]);
    }
    setLoading(false);
  }

  function clearChat() { setMessages([]); }

  return (
    <>
      {/* FAB button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 8000,
          width: '54px', height: '54px', borderRadius: '50%',
          background: open ? '#FFFFFF' : '#2ECC71',
          border: open ? '1px solid #ECF0F1' : 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 20px ${open ? 'rgba(0,255,200,0.2)' : 'rgba(0,255,200,0.4)'}`,
          transition: 'all 300ms ease',
          transform: pulse ? 'scale(1.12)' : 'scale(1)',
        }}
        title="FDI AI Assistant"
      >
        {open
          ? <X size={20} color="#1A2C3E" />
          : <MessageSquare size={22} color="#020c14" />
        }
        {!open && (
          <span style={{
            position: 'absolute', top: '-2px', right: '-2px',
            width: '14px', height: '14px', borderRadius: '50%',
            background: '#ffd700', border: '2px solid #020c14',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '8px', fontWeight: 900, color: '#020c14',
          }}>AI</span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '88px', right: '24px', zIndex: 8000,
          width: '380px', height: '520px',
          background: '#FFFFFF',
          border: '1px solid #ECF0F1',
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUpChat 0.3s ease',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #ECF0F1', display: 'flex', alignItems: 'center', gap: '10px', background: '#FAFBFC', flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#00ffc8,#00c49a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={16} color="#020c14" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#1A2C3E' }}>FDI AI Assistant</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00ffc8', boxShadow: '0 0 6px #00ffc8' }} />
                <span style={{ fontSize: '10px', color: '#27ae60', fontFamily: "'JetBrains Mono',monospace" }}>claude-powered · FDI specialist</span>
              </div>
            </div>
            {messages.length > 0 && (
              <button onClick={clearChat} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(232,244,248,0.3)', padding: '4px', lineHeight: 1, transition: 'color 150ms' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ff4466'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(232,244,248,0.3)'; }}>
                <RotateCcw size={13} />
              </button>
            )}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>🌍</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A2C3E', marginBottom: '6px' }}>FDI Intelligence Assistant</div>
                <div style={{ fontSize: '12px', color: 'rgba(232,244,248,0.45)', lineHeight: 1.65, marginBottom: '16px' }}>
                  Ask me anything about investment opportunities, GOSA scores, GFR rankings, or FDI signals.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => sendMessage(s)}
                      style={{ padding: '8px 12px', background: 'rgba(46,204,113,0.06)', border: '1px solid rgba(46,204,113,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', color: '#27ae60', fontFamily: "'Inter',sans-serif", textAlign: 'left', transition: 'all 150ms ease' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,200,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,255,200,0.05)'; }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg,#00ffc8,#00c49a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: '8px', marginTop: '2px' }}>
                    <Zap size={12} color="#020c14" />
                  </div>
                )}
                <div style={{
                  maxWidth: '82%',
                  padding: '10px 13px',
                  borderRadius: msg.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg,#00ffc8,#00c49a)' : 'rgba(255,255,255,0.05)',
                  border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  fontSize: '12px',
                  color: msg.role === 'user' ? '#020c14' : 'rgba(232,244,248,0.85)',
                  lineHeight: 1.65,
                  fontWeight: msg.role === 'user' ? 600 : 400,
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg,#00ffc8,#00c49a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={12} color="#020c14" />
                </div>
                <div style={{ padding: '10px 14px', background: '#F8F9FA', borderRadius: '12px 12px 12px 3px', border: '1px solid #ECF0F1', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ffc8', animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #ECF0F1', flexShrink: 0, background: '#FAFBFC' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask about FDI opportunities..."
                rows={1}
                style={{
                  flex: 1, background: '#F8F9FA', border: '1.5px solid #ECF0F1', borderRadius: '9px',
                  padding: '9px 12px', fontSize: '12px', color: '#1A2C3E', fontFamily: "'Inter',sans-serif",
                  outline: 'none', resize: 'none', lineHeight: 1.5, maxHeight: '80px', overflowY: 'auto',
                  transition: 'border-color 150ms',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(0,255,200,0.3)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                style={{ width: '36px', height: '36px', borderRadius: '9px', background: input.trim() ? 'linear-gradient(135deg,#00ffc8,#00c49a)' : 'rgba(255,255,255,0.06)', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 150ms', boxShadow: input.trim() ? '0 4px 12px rgba(0,255,200,0.25)' : 'none' }}>
                <Send size={15} color={input.trim() ? '#020c14' : 'rgba(232,244,248,0.3)'} />
              </button>
            </div>
            <div style={{ fontSize: '9px', color: '#C8D0D6', marginTop: '5px', textAlign: 'center' }}>
              Powered by Claude · FDI specialist · Press Enter to send
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUpChat { from { opacity:0; transform:translateY(16px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes dotPulse { 0%,80%,100% { opacity:0.3; transform:scale(0.8); } 40% { opacity:1; transform:scale(1); } }
      `}</style>
    </>
  );
}
