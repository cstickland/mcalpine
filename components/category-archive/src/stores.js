export const categoryQuery = `{
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

export const warrantyQuery = `{
  warranties {
    edges {
      node {
        id
        title
        link
        featuredImage {
          node {
            altText
            sourceUrl(size: THUMBNAIL)
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

export function divideItemsIntoPages(postsPerPage, items, currentPage) {
  let count = 0
  let page = []
  let pagesArray = []

  currentPage = 1

  insights.forEach((insight, i) => {
    if (i < insights.length - 1) {
      if (postsPerPage - count >= insight.columnWidth) {
        count += insight.columnWidth
        page.push(insight)
        return
      }
      if (postsPerPage - count < insight.columnWidth) {
        page[page.length - 1].columnWidth = postsPerPage - count + 1
        pagesArray.push(page)
        page = []
        count = 0
        count += insight.columnWidth
        page.push(insight)
        return
      }
    }
    if (postsPerPage > page.length) {
      page.push(insight)
      pagesArray.push(page)
      return
    }
    pagesArray.push(page)
    page = []
    page.push(insight)
    pagesArray.push(page)
  })
  return pagesArray
}
