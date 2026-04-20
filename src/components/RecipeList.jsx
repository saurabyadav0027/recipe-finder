import RecipeCard from './RecipeCard'

const PAGE_SIZE = 8

// Skeleton placeholder card
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-cream-200 shadow-sm">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 rounded-lg w-3/4" />
        <div className="skeleton h-4 rounded-lg w-1/2" />
      </div>
    </div>
  )
}

// Empty state
function EmptyState({ isSearch }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="text-7xl mb-5 select-none">
        {isSearch ? '🔍' : '🍽️'}
      </div>
      <h3 className="font-display text-2xl text-ink-800 mb-2">
        {isSearch ? 'No recipes found' : 'Nothing here yet'}
      </h3>
      <p className="text-ink-400 font-body max-w-sm text-[15px] leading-relaxed">
        {isSearch
          ? 'Try a different keyword — maybe "pasta", "chicken", or "chocolate".'
          : 'Start typing above to discover recipes from around the world.'}
      </p>
    </div>
  )
}

// Error state
function ErrorState({ message, onRetry }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="text-6xl mb-5 select-none">⚠️</div>
      <h3 className="font-display text-2xl text-ink-800 mb-2">Something went wrong</h3>
      <p className="text-ink-400 font-body text-[15px] mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="
          bg-ink-900 text-cream-50 font-body font-medium text-sm
          px-6 py-2.5 rounded-xl
          hover:bg-ink-800 transition-colors
        "
      >
        Try again
      </button>
    </div>
  )
}

export default function RecipeList({
  meals,
  isLoading,
  error,
  hasQuery,
  page,
  onLoadMore,
  onRetry,
}) {
  const visibleMeals = meals.slice(0, page * PAGE_SIZE)
  const hasMore = visibleMeals.length < meals.length

  if (error) {
    return (
      <div className="grid">
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : visibleMeals.length === 0
          ? <EmptyState isSearch={hasQuery} />
          : visibleMeals.map((meal, i) => (
              <RecipeCard
                key={meal.idMeal}
                meal={meal}
                style={{ animationDelay: `${(i % PAGE_SIZE) * 40}ms` }}
              />
            ))
        }
      </div>

      {/* Load More */}
      {!isLoading && hasMore && (
        <div className="flex justify-center animate-fade-in">
          <button
            onClick={onLoadMore}
            className="
              group flex items-center gap-2
              border-2 border-ink-900 text-ink-900
              font-body font-medium text-sm
              px-8 py-3 rounded-xl
              hover:bg-ink-900 hover:text-cream-50
              transition-all duration-200
            "
          >
            Load more recipes
            <svg
              className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
