export function getCategories() {
  const categories = new Set()

  allInsights.forEach((insight) => {
    categories.add(insight.identifier)
  })
  return categories
}

export function divideInsightsIntoPages(filters) {
  let count = 0
  let page = []
  let pagesArray = []
  let insights = []
  const postsPerPage = 6

  if (filters.size == 0) {
    insights = allInsights
  }

  if (filters.size > 0) {
    insights = []
    allInsights.forEach((insight) => {
      if (filters.has(insight.identifier)) {
        insights.push(insight)
      }
    })
  }

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
