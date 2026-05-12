import { useState, useRef, useMemo } from 'react'
import { ARTISTS } from '../../data/onboardingData'

interface Props {
  selected: string[]
  onChange: (artists: string[]) => void
}

export default function StepArtists({ selected, onChange }: Props) {
  const [inputs, setInputs] = useState<string[]>(() => {
    const base = ['', '', '', '', '']
    selected.forEach((a, i) => { if (i < 5) base[i] = a })
    return base
  })
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const suggestions = useMemo(() => {
    if (focusedIndex === null) return []
    const q = inputs[focusedIndex]?.toLowerCase().trim()
    if (!q) return ARTISTS.slice(0, 8)
    return ARTISTS.filter(a => a.toLowerCase().includes(q)).slice(0, 8)
  }, [inputs, focusedIndex])

  function handleChange(index: number, value: string) {
    const next = [...inputs]
    next[index] = value
    setInputs(next)
    setDropdownOpen(index)
    onChange(next.filter(v => v.trim()))
  }

  function handleSelect(index: number, artist: string) {
    const next = [...inputs]
    next[index] = artist
    setInputs(next)
    onChange(next.filter(v => v.trim()))
    // Move focus to next empty slot — let handleFocus manage the dropdown state
    const nextEmpty = next.findIndex((v, i) => i > index && !v.trim())
    if (nextEmpty !== -1) {
      setTimeout(() => inputRefs.current[nextEmpty]?.focus(), 0)
    } else {
      setDropdownOpen(null)
      setFocusedIndex(null)
    }
  }

  function handleClear(index: number) {
    const next = [...inputs]
    next[index] = ''
    setInputs(next)
    onChange(next.filter(v => v.trim()))
    inputRefs.current[index]?.focus()
  }

  function handleFocus(index: number) {
    setFocusedIndex(index)
    setDropdownOpen(index)
  }

  function handleBlur() {
    // Use a small delay so the new focus target has time to receive focus.
    // Then check if focus is still inside one of our inputs — if so, don't close.
    setTimeout(() => {
      const activeEl = document.activeElement
      const isOwnInput = inputRefs.current.some(ref => ref === activeEl)
      if (!isOwnInput) {
        setFocusedIndex(null)
        setDropdownOpen(null)
      }
    }, 50)
  }

  const filledCount = inputs.filter(v => v.trim()).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {inputs.map((val, i) => {
        const isOpen = dropdownOpen === i && suggestions.length > 0
        const isFocused = focusedIndex === i
        return (
          <div key={i} style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: `1px solid ${
                  isFocused
                    ? 'rgba(201,169,110,0.60)'
                    : val
                    ? 'rgba(201,169,110,0.40)'
                    : 'rgba(201,169,110,0.14)'
                }`,
                transition: 'border-color 0.25s',
                paddingTop: 14,
                paddingBottom: 12,
                gap: 14,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.10em',
                  color: val
                    ? 'rgba(201,169,110,0.80)'
                    : 'rgba(201,169,110,0.30)',
                  minWidth: 16,
                  transition: 'color 0.25s',
                  userSelect: 'none',
                }}
              >
                {i + 1}
              </span>

              <input
                ref={el => { inputRefs.current[i] = el }}
                type="text"
                value={val}
                onChange={e => handleChange(i, e.target.value)}
                onFocus={() => handleFocus(i)}
                onBlur={handleBlur}
                placeholder={i === 0 ? 'Type an artist name...' : `Artist ${i + 1}`}
                aria-label={`Artist ${i + 1}`}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-display)',
                  fontSize: 21,
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: val ? 'rgba(240,235,224,0.92)' : 'rgba(240,235,224,0.35)',
                  letterSpacing: '0.01em',
                  minHeight: 44,
                }}
              />

              {val && (
                <button
                  onClick={() => handleClear(i)}
                  aria-label={`Clear ${val}`}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(201,169,110,0.50)',
                    padding: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 44,
                    minHeight: 44,
                    borderRadius: 4,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,169,110,0.90)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,169,110,0.50)'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>

            {isOpen && (
              <div
                role="listbox"
                aria-label="Artist suggestions"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#111118',
                  border: '1px solid rgba(201,169,110,0.22)',
                  borderRadius: 8,
                  overflow: 'hidden',
                  zIndex: 100,
                  boxShadow: '0 20px 48px rgba(0,0,0,0.7)',
                  marginTop: 4,
                }}
              >
                {suggestions.map(artist => (
                  <button
                    key={artist}
                    role="option"
                    onMouseDown={() => handleSelect(i, artist)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid rgba(201,169,110,0.07)',
                      cursor: 'pointer',
                      padding: '12px 18px',
                      fontFamily: 'var(--font-ui)',
                      fontSize: 15,
                      color: 'rgba(240,235,224,0.80)',
                      transition: 'background 0.15s, color 0.15s',
                      minHeight: 44,
                    }}
                    onMouseEnter={e => {
                      const b = e.currentTarget as HTMLButtonElement
                      b.style.backgroundColor = 'rgba(201,169,110,0.09)'
                      b.style.color = 'rgba(240,235,224,0.95)'
                    }}
                    onMouseLeave={e => {
                      const b = e.currentTarget as HTMLButtonElement
                      b.style.backgroundColor = 'transparent'
                      b.style.color = 'rgba(240,235,224,0.80)'
                    }}
                  >
                    {artist}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.08em',
          color: 'rgba(240,235,224,0.45)',
          margin: '16px 0 0',
        }}
      >
        {filledCount === 0
          ? 'At least one name to continue'
          : `${filledCount} of 5`}
      </p>
    </div>
  )
}
