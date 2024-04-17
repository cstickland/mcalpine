export async function getData(query, variables) {
  const fetchPromise = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': '<YOUR_RAPIDAPI_KEY>',
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  })

  const response = await fetchPromise.json()
  return response
}

export const query = `
query initialInsightQuery($faqCategories: [String], $categories: [String], $relation: String = "OR", $after: String) {
  contentNodes(
    where: {contentTypes: [POST, FAQ], faqCategories: $faqCategories, categories: $categories, relation: $relation}
    first: 48
    after: $after 
  ) {
    nodes {
      ... on Post {
        id
        featuredImage {
          node {
            altText
            sourceUrl(size: MEDIUM)
          }
        }
        link
        title
        categories(where: {parent: 0}) {
          nodes {
            name
          }
        }
      }
      ... on Faq {
        databaseId
        title
        contentTypeName
        faqCategories(where: {parent: 0}) {
          nodes {
            name
            id
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`
