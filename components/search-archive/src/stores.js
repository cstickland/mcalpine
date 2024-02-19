import { writable } from 'svelte/store'

export const filters = writable(new Set())
export const allItems = writable([])
const urlParams = new URLSearchParams(window.location.search)

export const currentPage = writable(parseInt(urlParams.get('page')) || 1)

export function divideItemsIntoPages(
  postsPerPage,
  items,
  currentPage,
  filters
) {
  let page = []
  let pagesArray = []
  let currentItems = []

  if (filters.size == 0) {
    currentItems = items
  }

  if (filters.size > 0) {
    currentItems = []
    items.forEach((insight) => {
      if (insight.item.postType == 'post') {
        insight.item.node.terms.nodes.forEach((term) => {
          if (filters.has(term.name)) {
            currentItems.push(insight)
            return
          }
        })
      }
      if (insight.postType == 'product') {
        insight.item.terms.nodes.forEach((term) => {
          if (filters.has(term.name)) {
            currentItems.push(insight)
            return
          }
        })
      }
    })
  }

  currentItems.forEach((item) => {
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
