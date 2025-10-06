import { useEffect, useState } from 'react'
import './Home.css'

const About = props => {
  const [about, setAbout] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        // Try in a safe order: explicit env var, then backend on localhost:5002, then same-origin
        const apiBase = process.env.REACT_APP_API_BASE || ''
        const candidates = []
        if (apiBase) candidates.push(`${apiBase.replace(/\/$/, '')}/about`)
        candidates.push('http://localhost:5002/about')
        candidates.push('/about')

        let lastErr = null
        for (const url of candidates) {
          try {
            const res = await fetch(url)
            if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`)
            const data = await res.json()
            setAbout(data.about)
            return
          } catch (err) {
            lastErr = err
            // try next candidate
          }
        }
        throw lastErr || new Error('No URL candidates available')
      } catch (err) {
        setError(err.message || String(err))
      }
    }
    fetchAbout()
  }, [])

  if (error) return <p>Failed to load About information: {error}</p>
  if (!about) return <p>Loading...</p>

  return (
    <div className="Home-root">
      <h1>About Us</h1>
      {about.paragraphs.map((p, idx) => (
        <p key={idx}>{p}</p>
      ))}
      {about.imageUrl && (
        <div>
          <img
            src={about.imageUrl}
            alt="About"
            style={{ maxWidth: '300px', borderRadius: '6px' }}
          />
        </div>
      )}
    </div>
  )
}

export default About
