import { writable } from 'svelte/store'

export const allItems = writable([])

export const filters = writable(new Set())

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
        downloadFields {
          fileType
          fileDownload {
            mediaItemUrl
            dateGmt
          }
          fileMessage
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

export function divideItemsIntoPages(
  postsPerPage,
  items,
  currentPage,
  filters
) {
  let page = []
  let pagesArray = []
  currentPage = 1

  items.forEach((item) => {
    let addItem = false
    if (filters.size == 0) {
      addItem = true
    }
    item.categories.forEach((category) => {
      if (filters.has(category.name)) {
        addItem = true
      }
    })
    if (addItem) {
      page.push(item)

      if (page.length == postsPerPage) {
        pagesArray.push(page)
        page = []
        return
      }
    }
  })
  if (page.length > 0) {
    pagesArray.push(page)
  }
  return pagesArray
}
