import { useState, useMemo, useRef, useEffect } from 'react'
import { GENRES } from '../../data/onboardingData'

interface Props {
  selected: string[]
  onChange: (genres: string[]) => void
}

// Curated list of most popular genres
const CURATED_GENRES = [
  'Hip-hop', 'R&B', 'Rock', 'Pop', 'Electronic',
  'Jazz', 'Soul', 'Funk', 'Reggae', 'Classical',
  'Metal', 'Punk', 'Country', 'Folk', 'Indie Rock',
  'House', 'Techno', 'EDM', 'Alternative', 'Blues'
]

// Fuzzy match scoring
function fuzzyScore(query: string, target: string): number {
  if (!query) return 0
  const q = query.toLowerCase()
  const t = target.toLowerCase()
  if (t === q) return 1000
  if (t.startsWith(q)) return 500
  if (t.includes(q)) return 100

  let score = 0
  let qi = 0
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      score += 1
      qi++
    }
  }
  return qi === q.length ? score : 0
}

export default function StepGenres({ selected, onChange }: Props) {
  const [query, setQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fuzzy search suggestions (limited to 8-10)
  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    const scores = GENRES
      .filter(g => !selected.includes(g))
      .map(g => ({ genre: g, score: fuzzyScore(query, g) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
    return scores.map(item => item.genre)
  }, [query, selected])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggle(genre: string) {
    if (selected.includes(genre)) {
      onChange(selected.filter(g => g !== genre))
    } else if (selected.length < 5) {
      onChange([...selected, genre])
      setQuery('')
      setIsDropdownOpen(false)
      inputRef.current?.focus()
    }
  }

  function remove(genre: string) {
    onChange(selected.filter(g => g !== genre))
  }

  const isDisabledState = (genre: string) => !selected.includes(genre) && selected.length >= 5

  const TagButton = ({ genre, isSelected, isDisabled }: { genre: string; isSelected: boolean; isDisabled: boolean }) => (
    <button
      onClick={() => !isDisabled && toggle(genre)}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 14,
        fontWeight: isSelected ? 600 : 400,
        letterSpacing: '0.01em',
        padding: '8px 14px',
        borderRadius: 6,
        border: isSelected
          ? '1px solid rgba(201,169,110,0.80)'
          : '1px solid rgba(201,169,110,0.20)',
        backgroundColor: isSelected
          ? 'rgba(201,169,110,0.15)'
          : 'rgba(255,255,255,0.02)',
        color: isSelected
          ? 'rgba(240,235,224,0.95)'
          : 'rgba(240,235,224,0.60)',
        cursor: isDisabled ? 'default' : 'pointer',
        opacity: isDisabled ? 0.25 : 1,
        transition: 'all 0.2s cubic-bezier(0.32,0.72,0,1)',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        whiteSpace: 'nowrap',
        minHeight: 36,
      }}
      onMouseEnter={e => {
        if (isDisabled || isSelected) return
        const b = e.currentTarget as HTMLButtonElement
        b.style.borderColor = 'rgba(201,169,110,0.45)'
        b.style.color = 'rgba(240,235,224,0.85)'
      }}
      onMouseLeave={e => {
        if (isDisabled || isSelected) return
        const b = e.currentTarget as HTMLButtonElement
        b.style.borderColor = 'rgba(201,169,110,0.20)'
        b.style.color = 'rgba(240,235,224,0.60)'
      }}
    >
      {genre}
    </button>
  )

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Selected chips — TOP for immediate actions */}
      {selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {selected.map(g => (
            <button
              key={g}
              onClick={() => remove(g)}
              aria-label={`Remove ${g}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '7px 12px',
                borderRadius: 4,
                border: '1px solid rgba(201,169,110,0.70)',
                backgroundColor: 'rgba(201,169,110,0.18)',
                color: 'rgba(201,169,110,0.95)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minHeight: 36,
              }}
              onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.backgroundColor = 'rgba(201,169,110,0.25)'
                b.style.borderColor = '#c9a96e'
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.backgroundColor = 'rgba(201,169,110,0.18)'
                b.style.borderColor = 'rgba(201,169,110,0.70)'
              }}
            >
              {g}
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* Counter + guidance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'rgba(240,235,224,0.50)',
            letterSpacing: '0.06em',
          }}
        >
          {selected.length === 0
            ? 'Pick 2 to 5 genres'
            : selected.length < 2
            ? 'Pick 1 more to continue'
            : `${selected.length} selected`}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            color: selected.length >= 5
              ? 'rgba(201,169,110,0.95)'
              : 'rgba(240,235,224,0.35)',
            transition: 'color 0.3s',
          }}
        >
          {selected.length} / 5
        </span>
      </div>

      {/* Search with dropdown autosuggest */}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setIsDropdownOpen(true)
          }}
          onFocus={e => {
            if (query) setIsDropdownOpen(true)
            ;(e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(201,169,110,0.50)'
          }}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setQuery('')
              setIsDropdownOpen(false)
            }
          }}
          placeholder="Search for more styles..."
          aria-label="Search for more genres"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${query ? 'rgba(201,169,110,0.40)' : 'rgba(201,169,110,0.10)'}`,
            outline: 'none',
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            color: 'rgba(240,235,224,0.70)',
            letterSpacing: '0.01em',
            padding: '10px 0',
            transition: 'border-color 0.2s',
          }}
          onBlur={e => {
            (e.currentTarget as HTMLInputElement).style.borderColor = query
              ? 'rgba(201,169,110,0.40)'
              : 'rgba(201,169,110,0.10)'
          }}
        />
        {query && (
          <button
            onMouseDown={e => {
              e.preventDefault()
              setQuery('')
              setIsDropdownOpen(false)
              inputRef.current?.focus()
            }}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              color: 'rgba(201,169,110,0.50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 36,
              minHeight: 36,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,169,110,0.80)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,169,110,0.50)'
            }}
          >
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {/* Dropdown suggestions */}
        {isDropdownOpen && suggestions.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 8,
              backgroundColor: 'rgba(30, 26, 20, 0.95)',
              borderRadius: 8,
              border: '1px solid rgba(201,169,110,0.20)',
              backdropFilter: 'blur(8px)',
              zIndex: 10,
            }}
          >
            {suggestions.map((genre, index) => (
              <button
                key={genre}
                onClick={() => toggle(genre)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: index === 0 ? 'rgba(201,169,110,0.10)' : 'transparent',
                  border: 'none',
                  borderBottom: index < suggestions.length - 1 ? '1px solid rgba(201,169,110,0.10)' : 'none',
                  textAlign: 'left',
                  fontFamily: 'var(--font-display)',
                  fontSize: 14,
                  color: 'rgba(240,235,224,0.80)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(201,169,110,0.12)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(240,235,224,0.95)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(240,235,224,0.80)'
                }}
              >
                {genre}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Curated genres — fluid wrap layout */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {CURATED_GENRES.map(genre => {
          const isSelected = selected.includes(genre)
          const isDisabled = isDisabledState(genre)
          return <TagButton key={genre} genre={genre} isSelected={isSelected} isDisabled={isDisabled} />
        })}
      </div>
    </div>
  )
}
