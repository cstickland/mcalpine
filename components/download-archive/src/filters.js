import { writable } from 'svelte/store'

export const allCategories = writable(new Set())
export const allFileTypes = writable(new Set())
export const allDownloadTypes = writable(new Set())
export const allActiveFilters = writable(new Set())
export const filteredItems = writable(new Set())
export const sortBy = writable(3)
export const searchTerm = writable('')

export function filterItems(filters, items, searchTerm) {
  let filteredItems = new Set()
  items.forEach((item) => {
    if (isItemFilterMatch(filters, item, searchTerm)) {
      filteredItems.add(item)
    }
  })
  return filteredItems
}

function isItemFilterMatch(filters, item, searchTerm) {
  let isCategoryMatch = false
  let isDownloadTypeMatch = false
  let isFileTypeMatch = false

  let categoryFilters = []
  let fileTypeFilters = []
  let downloadTypeFilters = []

  if (searchTerm != '') {
    if (
      !item.fileUrl.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }
  }
  // separate filters by type
  filters.forEach((filter) => {
    if (filter.filterType === 'category') {
      categoryFilters.push(filter)
    }
    if (filter.filterType === 'downloadType') {
      downloadTypeFilters.push(filter)
    }
    if (filter.filterType === 'fileType') {
      fileTypeFilters.push(filter)
    }
  })
  //check if items matches category filters
  if (categoryFilters.length > 0) {
    categoryFilters.forEach((filter) => {
      item.categories.forEach((category) => {
        if (filter.id === category.id) {
          isCategoryMatch = true
        }
      })
    })
  } else {
    isCategoryMatch = true
  }

  //check if item matches downloadTypeFilters
  if (downloadTypeFilters.length > 0) {
    downloadTypeFilters.forEach((filter) => {
      item.downloadTypes.forEach((type) => {
        if (filter.id === type.id) {
          isDownloadTypeMatch = true
        }
      })
    })
  } else {
    isDownloadTypeMatch = true
  }

  // check if item matches fileTypeFilters
  if (fileTypeFilters.length > 0) {
    fileTypeFilters.forEach((filter) => {
      if (item.fileType === filter.id) {
        isFileTypeMatch = true
      }
    })
  } else {
    isFileTypeMatch = true
  }

  if (isFileTypeMatch && isDownloadTypeMatch && isCategoryMatch) {
    return true
  }
  return false
}
