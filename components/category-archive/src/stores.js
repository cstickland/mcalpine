import { writable } from 'svelte/store'

export const allItems = writable([])
export const currentPage = writable(1)

export function getCategoryQuery(postsPerPage, endCursor) {
  return `{
      productCategories(first: ${postsPerPage}, after: "${endCursor}") {
        edges {
          node {
            id
            name
            parentId
            link
            customFields {
              categoryImage {
                altText
                sourceUrl(size: MEDIUM)
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }`
}

export function getWarrantyQuery(postsPerPage, endCursor) {
  return `{
      warranties(first: ${postsPerPage}, after: "${endCursor}") {
        edges {
          node {
            id
            title
            link
            featuredImage {
              node {
                altText
                sourceUrl(size: MEDIUM)
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }`
}

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
