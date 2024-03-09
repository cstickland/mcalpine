import { writable } from 'svelte/store'

export const allItems = writable([])
export const postsPerPage = writable(48)
export const currentPage = writable(1)

export const query = `{
  downloads(first: 1000) {
    edges {
      node {
        id
        title
        downloadCategories {
          nodes {
            name
            id
          }
        }
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
        downloadTypes {
          nodes {
            id
            name
          }
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

export async function setUp() {
  let items = []
  let data = await getData(query)
  const urlParams = new URLSearchParams(window.location.search)
  currentPage.set(parseInt(urlParams.get('pagination')) || 1)

  data.data.downloads.edges.forEach((download) => {
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
