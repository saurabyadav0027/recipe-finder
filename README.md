# Recipe Finder
A React-based web application to search and view recipes using a public API.

## Features
* Search recipes by keyword
* Debounced input to reduce API calls
* Responsive grid layout
* Detailed recipe view (ingredients, instructions, image)
* Loading and error handling
* Empty state when no results are found
* Basic pagination or load more support

## Setup
Clone the repository:
git clone https://github.com/YOUR_USERNAME/recipe-finder.git
cd recipe-finder

Install dependencies:
npm install

Run development server:
npm run dev

## API
The project uses TheMealDB public API.

Search:
https://www.themealdb.com/api/json/v1/1/search.php?s=chicken

Lookup by ID:
https://www.themealdb.com/api/json/v1/1/lookup.php?i=MEAL_ID

## Build
npm run build

Preview build:
npm run preview
