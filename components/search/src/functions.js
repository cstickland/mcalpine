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
  productCategories(where: {search: "${searchTerm}"}) {
    edges {
      node {
        id
        name 
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

  response.data.posts.edges.forEach((post) => {
    post.node.postType = 'post'
    otherResults.push(post.node)
  })

  response.data.pages.edges.forEach((page) => {
    page.node.postType = 'page'
    otherResults.push(page.node)
  })
  otherResults.forEach((result) => {
    otherSimilarity.push(result.title)
  })
  let results = [
    'asd',
    'Help',
    'About',
    'History',
    'Contact',
    'Insights',
    'HomePage',
    'Categories',
    'Installers',
    'Hello world!',
    'Where To Buy',
    'International',
    'In sit in quis placerat eget ut',
    'Nibh faucibus vel rutrum orci sit',
    'Orci consectetur ut nullam metus proin arcu',
    'Lacus massa tellus orci vitae facilisi donec?',
    'Cras egestas massa cursus lacinia pulvinar et',
    'Consectetur vestibulum amet aliquam libero tellus',
    'Risus fames sem quis semper erat lobortis malesuada',
    'Sed ac bibendum scelerisque ultricies at adipiscing',
    'Vulputate molestie dui purus convallis urna fringilla',
    'Dictum eget eget ullamcorper amet elementum fusce viverra',
    'Quam ut amet orci augue in turpis neque non vel vulputate?',
    'Tellus sit faucibus rhoncus in fusce nec massa vel nibh urna',
    'Urna rhoncus pellentesque et faucibus nibh eget lacus eget adipiscing',
    'Sit facilisis mollis amet imperdiet tempus porttitor nisi gravida arcu amet id?',
    'Magnis tellus suspendisse egestas neque etiam convallis imperdiet nisl metus vitae amet',
  ]
  console.log(sortBySimilarity(results, searchTerm))
  response.data.productCategories.edges.forEach((category) => {
    categories.push(category.node.name)
  })

  if (categories.length > 0) {
    response.data.productCategories = sortBySimilarity(categories, searchTerm)
    previousSuggestions.set(sortBySimilarity(categories, searchTerm))
  } else {
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
