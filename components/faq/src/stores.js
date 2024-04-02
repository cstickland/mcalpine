import { writable } from 'svelte/store'

export const filters = writable(new Set())

export const query = `{
  faqs(first: 200) {
    edges {
      node {
        title
        faqFields {
          answer
        }
        faqCategories(where: {childless: true}) {
          edges {
            node {
              name
            }
          }
        }
        faqId
      }
    }
  }
}`

export async function getData(query) {
  const fetchPromise = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query,
    }),
  })

  const response = await fetchPromise.json()
  return response
}
