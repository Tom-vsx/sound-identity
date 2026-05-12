import { findMatchingCard } from '../lib/cardMatcher'

export default function DebugPage() {
  const testGenres = [
    ['rock', 'punk'],
    ['folk', 'indie folk'],
    ['hip-hop', 'rap'],
    ['ambient', 'drone'],
    ['metal', 'death metal'],
    ['disco', 'funk'],
  ]

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', backgroundColor: '#0a0a0f', color: '#f0ebe0', minHeight: '100vh' }}>
      <h1>Card Matching Debug</h1>

      <div style={{ marginTop: '20px' }}>
        {testGenres.map((genres) => {
          const card = findMatchingCard(genres)
          return (
            <div key={genres.join('+')} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #c9a96e', borderRadius: '4px' }}>
              <div><strong>Genres:</strong> {genres.join(', ')}</div>
              <div><strong>Matched Card:</strong> {card?.file || 'NULL (no match!)'}</div>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>Energy: {card?.energy || 'N/A'}</div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '40px', fontSize: '14px', maxWidth: '600px' }}>
        <h3>Debug Info:</h3>
        <ul>
          <li>If all cards say "NULL", the matching data didn't load</li>
          <li>If cards are different for different genres, matching is working</li>
          <li>If cards are always the same, the matching algorithm might have an issue</li>
        </ul>
      </div>

      <div style={{ marginTop: '40px' }}>
        <a href="/" style={{ color: '#c9a96e', textDecoration: 'underline' }}>← Back to app</a>
      </div>
    </div>
  )
}
