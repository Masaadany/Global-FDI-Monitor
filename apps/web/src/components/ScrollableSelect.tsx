'use client';
import { useState, useRef, useEffect } from 'react';

interface Option { value: string; label: string; flag?: string; sub?: string; }
interface Props { label?: string; value: string; options: Option[]; onChange: (v: string) => void; width?: string; accentColor?: string; }

export default function ScrollableSelect({ label, value, options, onChange, width = '160px', accentColor = '#2ECC71' }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch(''); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  const filtered = search ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase())) : options;
  const selected = options.find(o => o.value === value);
  const showSearch = options.length > 8;

  return (
    <div ref={ref} style={{ position: 'relative', width, flexShrink: 0 }}>
      {label && <div style={{ fontSize: '10px', fontWeight: 700, color: '#5A6874', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>}
      <button onClick={() => { setOpen(o => !o); setSearch(''); }}
        style={{ width: '100%', padding: '8px 32px 8px 12px', background: '#FFFFFF', border: `1.5px solid ${open ? accentColor : '#ECF0F1'}`, borderRadius: '10px', fontSize: '13px', color: '#1A2C3E', cursor: 'pointer', textAlign: 'left', position: 'relative', fontFamily: 'Inter,sans-serif', transition: 'all 0.15s', outline: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', boxShadow: open ? `0 0 0 3px ${accentColor}15` : 'none' }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.borderColor = accentColor; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = '#ECF0F1'; }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {selected?.flag && <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${selected.flag}.svg`} width="16" height="11" style={{ borderRadius: '2px', flexShrink: 0 }} onError={e => { (e.target as any).style.display = 'none'; }}/>}
          {selected?.label || 'Select...'}
        </span>
        <span style={{ position: 'absolute', right: '10px', top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: 'transform 0.2s', color: '#5A6874', fontSize: '10px' }}>▾</span>
      </button>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: Math.max(parseInt(width)+40, 200) + 'px', background: '#FFFFFF', border: '1px solid #ECF0F1', borderRadius: '14px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', zIndex: 9999, overflow: 'hidden' }}>
          {showSearch && (
            <div style={{ padding: '8px', borderBottom: '1px solid #F8F9FA' }}>
              <input ref={inputRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); setSearch(''); } if (e.key === 'Enter' && filtered[0]) { onChange(filtered[0].value); setOpen(false); setSearch(''); } }}
                style={{ width: '100%', padding: '7px 10px', border: '1.5px solid #ECF0F1', borderRadius: '8px', fontSize: '12px', outline: 'none', fontFamily: 'Inter,sans-serif', color: '#1A2C3E' }}
                onFocus={e => { e.target.style.borderColor = accentColor; }} onBlur={e => { e.target.style.borderColor = '#ECF0F1'; }}/>
            </div>
          )}
          <div style={{ maxHeight: '240px', overflowY: 'auto', padding: '4px' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#5A6874' }}>No results</div>
            ) : filtered.map(opt => {
              const isSel = opt.value === value;
              return (
                <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); setSearch(''); }}
                  style={{ width: '100%', padding: '9px 12px', background: isSel ? `${accentColor}10` : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.1s', fontFamily: 'Inter,sans-serif' }}
                  onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = '#F8F9FA'; }}
                  onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}>
                  {opt.flag && <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${opt.flag}.svg`} width="18" height="12" style={{ borderRadius: '2px', flexShrink: 0 }} onError={e => { (e.target as any).style.display = 'none'; }}/>}
                  <span style={{ flex: 1 }}>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: isSel ? 700 : 400, color: isSel ? accentColor : '#1A2C3E' }}>{opt.label}</span>
                    {opt.sub && <span style={{ display: 'block', fontSize: '10px', color: '#5A6874', marginTop: '1px' }}>{opt.sub}</span>}
                  </span>
                  {isSel && <span style={{ color: accentColor, fontSize: '12px' }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
