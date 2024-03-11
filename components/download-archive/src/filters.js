import { writable } from 'svelte/store'

const initialFilters = {
  searchTerm: '',
  filters: new Set(),
  order: 'ASC',
  sort: 'TITLE',
}

export const allCategories = writable(new Set())
export const allFileTypes = writable(new Set())
export const allDownloadTypes = writable(new Set())
export const allActiveFilters = writable(initialFilters)

export function filteredQuery(
  searchTerm,
  downloadCategories,
  downloadTypes,
  orderBy,
  order,
  endCursor
) {
  let downloadCategoriesString = 'null'
  if (downloadCategories.length > 0) {
    downloadCategoriesString = JSON.stringify(downloadCategories)
  }

  let downloadTypesString = 'null'
  if (downloadTypes.length > 0) {
    downloadTypesString = JSON.stringify(downloadTypes)
  }
  let query = `{
    downloads(
        first: 48
        where: {search: "${searchTerm}", downloadCategories: ${downloadCategoriesString}, downloadTypes: ${downloadTypesString}, orderby: {field: ${orderBy}, order: ${order}}}
        after: "${endCursor}"
    ) {
        edges {
            node {
                id
                title   
                featuredImage {
                    node {
                        altText
                        sourceUrl(size: MEDIUM)
                    }
                }
                downloadFields {
                    fileDownload {
                        mediaItemUrl
                        dateGmt
                    }
                }
                databaseId
            }
        }
        pageInfo {
            endCursor
            hasNextPage
        }
    }}`
  return query
}
