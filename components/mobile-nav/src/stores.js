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
export const menuParentId = writable('')
export const navBarMenu = writable({})
export const menuParentTitle = writable('')
export const imageLinks = writable({})

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
  menus.set(response.data.menus.nodes)
  productCategories.set(
    response.data.themeGeneralSettings.themeSettings.parentCategories
  )
  imageLinks.set(response.data.themeGeneralSettings.themeSettings.imageLinks)
}

export const query = `{
  menus {
    nodes {
      menuItems(where: {parentId: null}) {
        nodes {
          parentId
          id
          url
          title: label
        }
      }
      name
      slug
    }
  }
  themeGeneralSettings {
    themeSettings {
      parentCategories {
        id
        name
        link
        customFields {
          categoryImage {
            sourceUrl(size: THUMBNAIL)
          }
          categoryImageHeight
        }
        children {
          edges {
            node {
              id
              name
              link
              customFields {
                categoryImage {
                  sourceUrl(size: THUMBNAIL)
                }
                categoryImageHeight
              }
            }
          }
        }
      }
      imageLinks {
        backgroundImage {
          sourceUrl(size: MEDIUM_LARGE)
        }
        textAlignment
        textColor
        text
        linkUrl
      }
    }
  }
}`
