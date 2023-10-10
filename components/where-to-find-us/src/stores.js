export const query = `{
  themeGeneralSettings {
    themeSettings {
      mapLocations {
        phoneNumber
        title
        location {
          postCode
          city
          streetNumber
          streetName
          state
          countryShort
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
      'X-RapidAPI-Key': '<YOUR_RAPIDAPI_KEY>',
    },
    body: JSON.stringify({
      query: query,
    }),
  })

  const response = await fetchPromise.json()
  return response
}
