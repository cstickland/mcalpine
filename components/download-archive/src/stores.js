import { writable } from 'svelte/store'

export const allItems = writable([])
export const postsPerPage = writable(48)
export const currentPage = writable(1)
export const hasNextPage = writable(false)
export const endCursor = writable('null')
export const isLoading = writable(true)

export const initialQuery = `{
    downloads(first: 48, where: {orderby: {field: TITLE, order: ASC}}) {
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
    }
    downloadTypes(first: 100, where: {hideEmpty: true}) {
        nodes {
            id
            slug
            name
            taxonomyName
        }
    }
    downloadCategories(first: 100, where: {hideEmpty: true}) {
        nodes {
            id
            slug
            name
            taxonomyName
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

export async function setUp(
  postsPerPage,
  hasNextPage,
  endCursor,
  endCursorText
) {
  let data = await getData(
    initialQuery(
      postsPerPage,
      'null',
      'null',
      'null',
      'null',
      'TITLE',
      'ASC',
      endCursorText
    )
  )
  const urlParams = new URLSearchParams(window.location.search)
  currentPage.set(parseInt(urlParams.get('pagination')) || 1)
}

export function parseDownloads(downloads) {
  let items = []
  downloads.forEach((download) => {
    let date = new Date(
      Date.parse(download?.node?.downloadFields?.fileDownload?.dateGmt)
    )
    let downloadObject = {
      title: download.node.title,
      imageUrl: download?.node?.featuredImage?.node?.sourceUrl || '',
      imageAlt: download?.node?.featuredImage?.node?.altText || '',
      fileUrl: download?.node?.downloadFields?.fileDownload?.mediaItemUrl,
      date: date,
      fileType: download?.node?.downloadFields?.fileDownload?.mediaItemUrl
        ?.split(/[#?]/)[0]
        .split('.')
        .pop()
        .trim(),
      categories: download?.node?.downloadCategories?.nodes,
      downloadTypes: download?.node?.downloadTypes?.nodes,
    }
    items.push(downloadObject)
  })
  return items
}
