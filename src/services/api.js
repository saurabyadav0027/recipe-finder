const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

/**
 * Search meals by name keyword.
 * Returns array of meal objects or empty array.
 */
export async function searchRecipes(query) {
  const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  return data.meals ?? []
}

/**
 * Fetch a single meal by its ID.
 */
export async function getRecipeById(id) {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  if (!data.meals || data.meals.length === 0) throw new Error('Recipe not found')
  return data.meals[0]
}

/**
 * Fetch random meal (used for initial/empty state suggestions).
 */
export async function getRandomRecipes(count = 8) {
  const requests = Array.from({ length: count }, () =>
    fetch(`${BASE_URL}/random.php`).then((r) => r.json()).then((d) => d.meals?.[0])
  )
  const results = await Promise.allSettled(requests)
  return results
    .filter((r) => r.status === 'fulfilled' && r.value)
    .map((r) => r.value)
}

/**
 * Parse ingredient/measure pairs from a meal object into a clean array.
 */
export function parseIngredients(meal) {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]?.trim()
    const measure = meal[`strMeasure${i}`]?.trim()
    if (ingredient) {
      ingredients.push({ ingredient, measure: measure || '' })
    }
  }
  return ingredients
}
