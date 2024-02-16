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
  searchTerm = searchTerm.replace('&', '&amp;')
  searchTerm = searchTerm.replace('”', '%22')
  searchTerm = searchTerm.replace('″', '%22')

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
  console.log(response)
  let categories = []

  let otherResults = []
  let otherSimilarity = []
  let products = response?.data?.products?.nodes || []
  let productCategories = response?.data?.productCategories?.edges || []
  let posts = response?.data?.posts?.edges || []
  let pages = response?.data?.pages?.edges || []

  // put all posts and pages into an "other" array
  posts.forEach((post) => {
    post.node.postType = 'post'
    otherResults.push(post.node)
  })

  pages.forEach((page) => {
    page.node.postType = 'page'
    otherResults.push(page.node)
  })

  //sort other array by levenstein distance of title to searchTerm
  otherResults.forEach((result) => {
    otherSimilarity.push(result.title)
  })
  if (response.data) {
    response.data.other = sortOtherResultsBySimilarity(otherResults, searchTerm)
  }
  //if no products are found, but a product categories are then use products from the category
  if (products.length == 0 && productCategories.length == 1) {
    products = productCategories[0].node.products
  }

  //sort products by sku compared to search term using levenstein distance
  if (response?.data?.products) {
    response.data.products.nodes = sortProductsBySimilarity(
      products,
      searchTerm
    )
  }
  // move all category names into a single level array.
  if (response?.data) {
    response.data.productCategories.edges.forEach((category) => {
      categories.push(category.node.name)
    })
  }
  if (categories.length > 0) {
    // sort categories compared to search term using levenstein distance
    response.data.productCategories = sortBySimilarity(categories, searchTerm)
    //if categories are found then update the last found categories
    previousSuggestions.set(sortBySimilarity(categories, searchTerm))
  } else {
    // if no categories are found then use the previous found categories as suggestions
    response.data.productCategories = get(previousSuggestions)
  }
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
            distances[i - 1][j - 1]
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
    distance: levenshteinDistance(word.toLowerCase(), searchTerm.toLowerCase()),
  }))

  // Sort the array by distance
  wordDistances.sort((a, b) => a.distance - b.distance)
  // Return the sorted list of words
  return wordDistances.map((wd) => wd.word)
}

export function sortProductsBySimilarity(products, searchTerm) {
  let wordDistances = products.map((product) => ({
    product: product,
    distance: levenshteinDistance(
      getSkusList(product, searchTerm)[0],
      searchTerm
    ),
  }))

  wordDistances.sort((a, b) => a.distance - b.distance)

  return wordDistances.map((wd) => wd.product)
}

function getSkusList(product, searchTerm) {
  let skus = []
  let sortedSkus = []
  product.customFields2.skus.forEach((row) => {
    skus.push(row.sku.toLowerCase())
  })

  sortedSkus = sortBySimilarity(skus, searchTerm.toLowerCase())
  return sortedSkus
}

function sortOtherResultsBySimilarity(otherResults, searchTerm) {
  let wordDistances = otherResults.map((other) => ({
    other: other,
    distance: levenshteinDistance(
      other.title.toLowerCase,
      searchTerm.toLowerCase()
    ),
  }))
  wordDistances.sort((a, b) => a.distance - b.distance)

  return wordDistances.map((wd) => wd.other)
}
