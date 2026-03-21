'use client';
import { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
  flag?: string;
  sub?: string;
}

interface ScrollableSelectProps {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  width?: string | number;
  accentColor?: string;
  placeholder?: string;
}

export default function ScrollableSelect({
  label,
  value,
  options,
  onChange,
  width = '180px',
  accentColor = '#00ffc8',
  placeholder = 'Select...',
}: ScrollableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  // Scroll selected into view when opened
  useEffect(() => {
    if (open && listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]');
      if (selected) {
        (selected as HTMLElement).scrollIntoView({ block: 'nearest' });
      }
    }
  }, [open]);

  const filtered = search
    ? options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase()) ||
        o.value.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const selected = options.find(o => o.value === value);
  const displayLabel = selected ? selected.label : placeholder;
  const showSearch = options.length > 8;

  return (
    <div ref={ref} style={{ position: 'relative', width, flexShrink: 0 }}>
      {label && (
        <div style={{
          fontSize: '9px', fontWeight: 800, color: 'rgba(0,255,200,0.5)',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          marginBottom: '4px', fontFamily: "'Orbitron','Inter',sans-serif",
        }}>
          {label}
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => { setOpen(o => !o); setSearch(''); }}
        style={{
          width: '100%',
          padding: '7px 30px 7px 12px',
          background: open ? 'rgba(0,255,200,0.06)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${open ? accentColor + '40' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: '7px',
          fontSize: '12px',
          fontFamily: "'Inter',sans-serif",
          color: value ? '#e8f4f8' : 'rgba(232,244,248,0.4)',
          cursor: 'pointer',
          textAlign: 'left',
          position: 'relative',
          transition: 'all 150ms ease',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          outline: 'none',
          boxShadow: open ? `0 0 0 2px ${accentColor}15` : 'none',
        }}
        onMouseEnter={e => {
          if (!open) {
            e.currentTarget.style.borderColor = accentColor + '30';
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          }
        }}
        onMouseLeave={e => {
          if (!open) {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          }
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {selected?.flag && <span style={{ fontSize: '14px', lineHeight: 1 }}>{selected.flag}</span>}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayLabel}</span>
        </span>
        {/* Chevron */}
        <span style={{
          position: 'absolute', right: '10px', top: '50%',
          transform: `translateY(-50%) rotate(${open ? '180deg' : '0deg'})`,
          transition: 'transform 200ms ease',
          color: open ? accentColor : 'rgba(232,244,248,0.3)',
          fontSize: '10px', lineHeight: 1, pointerEvents: 'none',
        }}>▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          width: Math.max(Number(String(width).replace('px','')) + 40, 200) + 'px',
          background: 'rgba(8,20,36,0.98)',
          border: `1px solid ${accentColor}25`,
          borderRadius: '10px',
          boxShadow: `0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px ${accentColor}10`,
          backdropFilter: 'blur(20px)',
          zIndex: 9999,
          overflow: 'hidden',
        }}>
          {/* Search */}
          {showSearch && (
            <div style={{
              padding: '8px 10px',
              borderBottom: '1px solid rgba(0,255,200,0.06)',
              background: 'rgba(0,0,0,0.2)',
            }}>
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                style={{
                  width: '100%',
                  padding: '5px 10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#e8f4f8',
                  fontFamily: "'Inter',sans-serif",
                  outline: 'none',
                }}
                onKeyDown={e => {
                  if (e.key === 'Escape') { setOpen(false); setSearch(''); }
                  if (e.key === 'Enter' && filtered.length > 0) {
                    onChange(filtered[0].value);
                    setOpen(false);
                    setSearch('');
                  }
                }}
              />
            </div>
          )}

          {/* Scrollable list */}
          <div
            ref={listRef}
            style={{
              maxHeight: '220px',
              overflowY: 'auto',
              padding: '4px',
              scrollbarWidth: 'thin',
              scrollbarColor: `${accentColor}40 transparent`,
            }}
          >
            {filtered.length === 0 ? (
              <div style={{ padding: '12px', textAlign: 'center', fontSize: '11px', color: 'rgba(232,244,248,0.3)' }}>
                No results
              </div>
            ) : (
              filtered.map(opt => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    data-selected={isSelected}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                      setSearch('');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: isSelected ? `${accentColor}10` : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 120ms ease',
                      fontFamily: "'Inter',sans-serif",
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {opt.flag && (
                      <span style={{ fontSize: '15px', flexShrink: 0, lineHeight: 1 }}>{opt.flag}</span>
                    )}
                    <span style={{ flex: 1, overflow: 'hidden' }}>
                      <span style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: isSelected ? 700 : 400,
                        color: isSelected ? accentColor : 'rgba(232,244,248,0.8)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {opt.label}
                      </span>
                      {opt.sub && (
                        <span style={{ display: 'block', fontSize: '10px', color: 'rgba(232,244,248,0.3)', marginTop: '1px' }}>
                          {opt.sub}
                        </span>
                      )}
                    </span>
                    {isSelected && (
                      <span style={{ color: accentColor, fontSize: '12px', flexShrink: 0 }}>✓</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
