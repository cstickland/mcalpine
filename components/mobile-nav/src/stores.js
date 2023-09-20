import { writable } from 'svelte/store'

export const open = writable(false)
export const searchOpen = writable(false)
export const searchQuery = writable('')
export const results = writable({})
export const action = 'advancedSearch'
export const ajaxUrl = writable('')
export const menus = writable({})
export const socials = writable({})
export const activeMenu = writable(0)
export const version = writable(0)
export const productCategories = writable({})
export const facebook = writable('https://www.facebook.com/')
export const twitter = writable('https://twitter.com/')
export const instagram = writable('https://www.instagram.com/')
export const linkedin = writable('https://uk.linkedin.com/')
export const youtube = writable('https://www.youtube.com/')
export const email = writable('email@email.com')
export const openClassVersionTwo = writable('closed')

export function highlightResults(searchQuery, result) {
  let textToSearch = searchQuery
  let paragraph = result

  textToSearch = textToSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  let pattern = new RegExp(`${textToSearch}`, 'ig')

  paragraph = paragraph.replace(pattern, (match) => `<b>${match}</b>`)
  return paragraph
}

export async function getData(graphQlUrl, menus, query, productCategories) {
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
  console.log(response)
  menus.set(response.data.menus.nodes)
  productCategories.set(response.data.productCategories.edges)
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
  menus {
    nodes {
      menuItems {
        nodes {
          parentId
          id
          url
          title: label
        }
      }
      name
    }
  }
}`
