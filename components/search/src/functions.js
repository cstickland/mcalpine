import { get } from 'svelte/store'

export function highlightResults(searchQuery, result) {
  let textToSearch = searchQuery
  let paragraph = result

  textToSearch = textToSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  let pattern = new RegExp(`${textToSearch}`, 'ig')

  paragraph = paragraph.replace(pattern, (match) => `<b>${match}</b>`)
  return paragraph
}

export async function getResults(searchTerm, previousSuggestions) {
  const query = `{
  posts(where: {search: "${searchTerm}"}, first: 100) {
    edges {
      node {
        link
        title
      }
    }
  }
  productCategories(where: {search: "${searchTerm}"}, first: 100) {
    edges {
      node {
        name
        products(first: 100) {
          nodes {
            customFields2 {
              skus {
                sku
                productImages {
                  productImage {
                    mediaItemUrl
                  }
                }
              }
            }
            link
            title
          }
        }
      }
    }
  }
  products(where: {search: "${searchTerm}"}, first: 1000) {
    nodes {
      customFields2 {
        skus {
          sku
          productImages {
            productImage {
              mediaItemUrl
            }
          }
        }
      }
      link
      title
    }
  }
  pages(where: {search: "${searchTerm}"}) {
    edges {
      node {
        title
        link
      }
    }
  }
}`
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
  let categories = []

  let otherResults = []
  let otherSimilarity = []
  let products = response.data.products.nodes
  let productCategories = response.data.productCategories.edges
  let posts = response.data.posts.edges
  let pages = response.data.pages.edges

  posts.forEach((post) => {
    post.node.postType = 'post'
    otherResults.push(post.node)
  })

  pages.forEach((page) => {
    page.node.postType = 'page'
    otherResults.push(page.node)
  })
  otherResults.forEach((result) => {
    otherSimilarity.push(result.title)
  })

  if (products.length == 0 && productCategories.length == 1) {
    response.data.products = productCategories[0].node.products
  }

  response.data.productCategories.edges.forEach((category) => {
    categories.push(category.node.name)
  })

  if (categories.length > 0) {
    response.data.productCategories = sortBySimilarity(categories, searchTerm)
    previousSuggestions.set(sortBySimilarity(categories, searchTerm))
  } else {
    response.data.productCategories = get(previousSuggestions)
  }
  console.log(response)
  return response
}

export function levenshteinDistance(a, b) {
  // Create a 2D array to store the distances
  let distances = new Array(a.length + 1)
  for (let i = 0; i <= a.length; i++) {
    distances[i] = new Array(b.length + 1)
  }

  // Initialize the first row and column
  for (let i = 0; i <= a.length; i++) {
    distances[i][0] = i
  }
  for (let j = 0; j <= b.length; j++) {
    distances[0][j] = j
  }

  // Fill in the rest of the array
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        distances[i][j] = distances[i - 1][j - 1]
      } else {
        distances[i][j] =
          Math.min(
            distances[i - 1][j],
            distances[i][j - 1],
            distances[i - 1][j - 1],
          ) + 1
      }
    }
  }

  // Return the final distance
  return distances[a.length][b.length]
}

export function sortBySimilarity(products, searchTerm) {
  // Create an array of objects to store the words and their distances
  let wordDistances = products.map((word) => ({
    word: word,
    distance: levenshteinDistance(word, searchTerm),
  }))

  // Sort the array by distance
  wordDistances.sort((a, b) => a.distance - b.distance)
  // Return the sorted list of words
  return wordDistances.map((wd) => wd.word)
}
