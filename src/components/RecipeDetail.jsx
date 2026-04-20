import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRecipeById, parseIngredients } from '../services/api'

function BackIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SkeletonDetail() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse space-y-6">
      <div className="skeleton h-10 w-48 rounded-xl" />
      <div className="skeleton rounded-3xl aspect-[16/9] w-full" />
      <div className="skeleton h-9 w-3/4 rounded-xl" />
      <div className="flex gap-3">
        {[1,2].map(i => <div key={i} className="skeleton h-7 w-24 rounded-full" />)}
      </div>
      <div className="space-y-3">
        {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-5 rounded-lg" />)}
      </div>
    </div>
  )
}

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [meal, setMeal] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('ingredients')

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    getRecipeById(id)
      .then((data) => { if (!cancelled) { setMeal(data); setIsLoading(false) } })
      .catch((err) => { if (!cancelled) { setError(err.message); setIsLoading(false) } })

    return () => { cancelled = true }
  }, [id])

  if (isLoading) {
    return (
      <div className="px-4 py-10">
        <SkeletonDetail />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="font-display text-2xl text-ink-800 mb-2">Couldn't load recipe</h3>
        <p className="text-ink-400 text-sm mb-6">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-ink-900 text-cream-50 font-body font-medium px-6 py-2.5 rounded-xl hover:bg-ink-800 transition-colors"
        >
          Back to search
        </button>
      </div>
    )
  }

  const ingredients = parseIngredients(meal)
  const instructions = meal.strInstructions
    ?.split(/\r\n|\r|\n/)
    .map((s) => s.trim())
    .filter(Boolean) ?? []

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="
          flex items-center gap-2 text-ink-400 hover:text-ink-900
          font-body text-sm font-medium mb-8
          transition-colors group
        "
      >
        <span className="group-hover:-translate-x-1 transition-transform">
          <BackIcon />
        </span>
        Back to results
      </button>

      {/* Hero image */}
      <div className="relative rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(26,18,9,0.15)] mb-8">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full object-cover aspect-[16/9] sm:aspect-[21/9]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
        {/* Overlaid tags */}
        <div className="absolute bottom-5 left-5 flex gap-2 flex-wrap">
          {meal.strCategory && (
            <span className="bg-amber-400 text-ink-900 text-xs font-mono font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
              {meal.strCategory}
            </span>
          )}
          {meal.strArea && (
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-body font-medium px-3 py-1.5 rounded-full border border-white/30">
              {meal.strArea}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 leading-tight mb-2">
        {meal.strMeal}
      </h1>

      {/* YouTube link if available */}
      {meal.strYoutube && (
        <a
          href={meal.strYoutube}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex items-center gap-2 mt-3 mb-6
            text-red-600 hover:text-red-700 font-body text-sm font-medium
            transition-colors
          "
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/>
          </svg>
          Watch on YouTube
        </a>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-cream-100 rounded-xl w-fit mb-8 border border-cream-200">
        {['ingredients', 'instructions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-5 py-2 rounded-lg text-sm font-body font-medium capitalize transition-all duration-200
              ${activeTab === tab
                ? 'bg-white text-ink-900 shadow-sm border border-cream-200'
                : 'text-ink-400 hover:text-ink-700'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ingredients tab */}
      {activeTab === 'ingredients' && (
        <div className="animate-fade-in">
          <p className="text-ink-400 font-mono text-xs uppercase tracking-widest mb-5">
            {ingredients.length} ingredients
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ingredients.map(({ ingredient, measure }, i) => (
              <li
                key={i}
                className="
                  flex items-center justify-between
                  bg-white rounded-xl px-4 py-3
                  border border-cream-200
                  text-sm
                "
              >
                <span className="font-body text-ink-800 font-medium">{ingredient}</span>
                {measure && (
                  <span className="font-mono text-ink-400 text-xs ml-3 text-right">{measure}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructions tab */}
      {activeTab === 'instructions' && (
        <div className="animate-fade-in space-y-4">
          <p className="text-ink-400 font-mono text-xs uppercase tracking-widest mb-5">
            {instructions.length} steps
          </p>
          {instructions.map((step, i) => (
            <div key={i} className="flex gap-4">
              <span className="
                flex-shrink-0 w-7 h-7 rounded-full
                bg-amber-400 text-ink-900
                font-mono text-xs font-semibold
                flex items-center justify-center
                mt-0.5
              ">
                {i + 1}
              </span>
              <p className="font-body text-ink-700 text-[15px] leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
