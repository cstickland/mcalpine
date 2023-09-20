import { writable } from 'svelte/store'

export const open = writable(false)
export const ajaxUrl = writable('')
export const menus = writable({})
export const socials = writable({})
export const activeMenu = writable(0)
export const productCategories = writable({})

export function highlightResults(searchQuery, result) {
  let textToSearch = searchQuery
  let paragraph = result

  textToSearch = textToSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  let pattern = new RegExp(`${textToSearch}`, 'ig')

  paragraph = paragraph.replace(pattern, (match) => `<b>${match}</b>`)
  return paragraph
}

export async function getData(graphQlUrl, query, productCategories) {
  const fetchPromise = await fetch(graphQlUrl, {
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
  productCategories.set(response.data.productCategories.edges)
  console.log(response)
}

export const query = `{
  productCategories(first: 1000) {
    edges {
      node {
        id
        name
        parentId
        link
        customFields {
          categoryImage {
            altText
            sourceUrl(size: THUMBNAIL)
          }
        }
      }
    }
  }
}`
