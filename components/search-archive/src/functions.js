// Sort an array by closest comparison to string
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

export function determineProductResults(results) {
  const productResultsNumber = results?.data?.products?.nodes?.length || 0
  const categoryProductResultsNumber =
    results?.data?.productCategories?.edges[0]?.node?.products?.nodes?.length ||
    0

  if (productResultsNumber > categoryProductResultsNumber) {
    return results.data.products.nodes
  } else {
    return results?.data?.productCategories?.edges[0]?.node?.products.nodes
  }
}

export function getProductsLevenshtein(products, term) {
  let productsWithDistances = products.map((product) => ({
    item: product,
    distance: getProductDistance(product, term),
    postType: 'product',
  }))

  return productsWithDistances
}

// determine the lowest levelshtein distance of a product
function getProductDistance(product, term) {
  let items = []
  let distances = []
  items.push(product.title.toLowerCase())
  product.customFields2.skus.forEach((sku) => {
    if (sku.sku) {
      items.push(sku.sku.toLowerCase())
    }
  })

  items.forEach((item) => {
    let distance = levenshteinDistance(item.toLowerCase(), term.toLowerCase())
    distances.push(distance)
  })

  const lowest = Math.min(...distances)
  return lowest
}

export function getOthersLevenshtein(items, term) {
  let othersWithDistances = items.map((item) => ({
    item: item,
    distance: item.node.title.toLowerCase().includes(term.toLowerCase())
      ? 0
      : levenshteinDistance(item.node.title.toLowerCase(), term.toLowerCase()),
    postType: 'other',
  }))
  return othersWithDistances
}
