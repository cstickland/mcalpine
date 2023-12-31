import { writable } from 'svelte/store'

export const previousSuggestions = writable([])
export const results = writable({})
export const searchQuery = writable('')

export const menuQuery = `{
  menus(where: {slug: "interest"}) {
    edges {
      node {
        id
        menuItems {
          nodes {
            url
            label
          }
        }
        name
      }
    }
  }
}`

export async function getData(query) {
  const fetchPromise = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': '<YOUR_RAPIDAPI_KEY>',
    },
    body: JSON.stringify({
      query: query,
    }),
  })

  const response = await fetchPromise.json()
  return response
}
