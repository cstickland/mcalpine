import { writable } from 'svelte/store'

export const filters = writable(new Set())

export const allItems = writable([])

export function divideItemsIntoPages(
  postsPerPage,
  items,
  currentPage,
  filters,
) {
  let page = []
  let pagesArray = []
  currentPage = 1
  console.log(items)
  let currentItems = []

  if (filters.size == 0) {
    currentItems = items
  }

  if (filters.size > 0) {
    currentItems = []
    items.forEach((insight) => {
      if (insight.postType == 'post') {
        if (filters.has(insight.identifier)) {
          currentItems.push(insight)
          return
        }
      }
      if (insight.postType == 'product') {
        if (filters.has(insight.categoryName)) {
          currentItems.push(insight)
          return
        }
        insight.subcategoryName.forEach((name) => {
          if (filters.has(name)) {
            currentItems.push(insight)
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
