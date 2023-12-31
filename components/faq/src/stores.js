import { writable } from 'svelte/store'

export const filters = writable(new Set())

export const query = `{
  posts(where: {categoryName: "faq"}, first: 200) {
    edges {
      node {
        postId
        title
        faqFields {
          answer
        }
        categories(where: {childless: true}) {
          edges {
            node {
              name
            }
          }
        }
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
