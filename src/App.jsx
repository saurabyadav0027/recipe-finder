import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import SearchBar from './components/SearchBar'
import RecipeList from './components/RecipeList'
import RecipeDetail from './components/RecipeDetail'
import { searchRecipes, getRandomRecipes } from './services/api'
import { useDebounce } from './hooks/useDebounce'

const PAGE_SIZE = 8

// ─── Header ──────────────────────────────────────────────────────────────────

function Header({ query, onChange, isLoading }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isDetail = location.pathname.startsWith('/recipe/')

  return (
    <header className="sticky top-0 z-30 bg-cream-50/80 backdrop-blur-md border-b border-cream-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4 py-4">
          {/* Wordmark */}
          <button
            onClick={() => navigate('/')}
            className="flex-shrink-0 font-display font-bold text-xl text-ink-900 hover:text-amber-600 transition-colors"
          >
            Mise<span className="text-amber-400">.</span>
          </button>

          {/* Search bar — hidden on detail pages on mobile */}
          <div className={`flex-1 transition-all ${isDetail ? 'hidden sm:block' : ''}`}>
            <SearchBar value={query} onChange={onChange} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </header>
  )
}

// ─── Home page ────────────────────────────────────────────────────────────────

function HomePage({ query, onChange }) {
  const [meals, setMeals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [isSearchMode, setIsSearchMode] = useState(false)

  const debouncedQuery = useDebounce(query, 420)

  const fetchResults = useCallback(async (q) => {
    setIsLoading(true)
    setError(null)
    setPage(1)
    try {
      const results = q.trim()
        ? await searchRecipes(q.trim())
        : await getRandomRecipes(12)
      setMeals(results)
      setIsSearchMode(!!q.trim())
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchResults(debouncedQuery)
  }, [debouncedQuery, fetchResults])

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero heading (only when no query) */}
      {!isSearchMode && !isLoading && (
        <div className="mb-10 text-center animate-fade-in">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-ink-900 leading-tight">
            Discover your next
            <br />
            <span className="text-amber-500 italic">favourite meal.</span>
          </h2>
          <p className="mt-3 text-ink-400 font-body text-base max-w-md mx-auto">
            Search from thousands of recipes across every cuisine.
          </p>
        </div>
      )}

      {/* Section label */}
      {!isLoading && meals.length > 0 && (
        <p className="text-ink-400 font-mono text-xs uppercase tracking-widest mb-6">
          {isSearchMode
            ? `${meals.length} result${meals.length !== 1 ? 's' : ''} for "${query}"`
            : 'Suggested for you'}
        </p>
      )}

      <RecipeList
        meals={meals}
        isLoading={isLoading}
        error={error}
        hasQuery={isSearchMode}
        page={page}
        onLoadMore={() => setPage((p) => p + 1)}
        onRetry={() => fetchResults(debouncedQuery)}
      />
    </main>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [query, setQuery] = useState('')

  return (
    <div className="min-h-screen flex flex-col">
      <Header query={query} onChange={setQuery} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage query={query} onChange={setQuery} />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </div>

      <footer className="text-center py-6 text-ink-400 font-body text-xs border-t border-cream-200 mt-10">
        Powered by{' '}
        <a
          href="https://www.themealdb.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ink-700 transition-colors"
        >
          TheMealDB
        </a>
      </footer>
    </div>
  )
}
