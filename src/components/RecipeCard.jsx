import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function RecipeCard({ meal, style }) {
  const navigate = useNavigate()
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <article
      onClick={() => navigate(`/recipe/${meal.idMeal}`)}
      className="
        group relative bg-white rounded-2xl overflow-hidden
        border border-cream-200
        shadow-[0_2px_12px_rgba(26,18,9,0.06)]
        hover:shadow-[0_8px_32px_rgba(26,18,9,0.14)]
        hover:-translate-y-1
        transition-all duration-300 cursor-pointer
        animate-slide-up
      "
      style={style}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/recipe/${meal.idMeal}`)}
      aria-label={`View recipe for ${meal.strMeal}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-cream-100">
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={`${meal.strMealThumb}/preview`}
          alt={meal.strMeal}
          className={`
            w-full h-full object-cover
            group-hover:scale-105 transition-transform duration-500
            ${imgLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />
        {/* Category pill */}
        {meal.strCategory && (
          <span className="
            absolute top-3 left-3
            bg-white/90 backdrop-blur-sm
            text-ink-600 text-[11px] font-mono font-medium tracking-wider uppercase
            px-2.5 py-1 rounded-full
            border border-cream-200
          ">
            {meal.strCategory}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 pb-5">
        <h3 className="
          font-display font-semibold text-ink-900 text-[17px] leading-snug
          group-hover:text-amber-600 transition-colors duration-200
          line-clamp-2
        ">
          {meal.strMeal}
        </h3>

        <div className="flex items-center justify-between mt-3">
          {meal.strArea && (
            <span className="text-ink-400 text-[12px] font-body flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              {meal.strArea} cuisine
            </span>
          )}
          <span className="
            ml-auto text-amber-500
            translate-x-0 group-hover:translate-x-1 transition-transform duration-200
          ">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  )
}
