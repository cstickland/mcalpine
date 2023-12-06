import { writable } from 'svelte/store'

export const allItems = writable([])

export const query = `{
  downloads(first: 1000) {
    edges {
      node {
        id
        title
        downloadCategories {
          nodes {
            name
          }
        }
        featuredImage {
          node {
            altText
            sourceUrl(size: MEDIUM)
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

export function divideItemsIntoPages(postsPerPage, items, currentPage) {
  let count = 0
  let page = []
  let pagesArray = []
  currentPage = 1

  items.forEach((item) => {
    page.push(item)

    if (page.length == postsPerPage) {
      pagesArray.push(page)
      page = []
      return
    }
  })
  if (page.length > 0) {
    pagesArray.push(page)
  }
  return pagesArray
}
