// ;(() => {
//   const searchTerm = document.getElementById('search-field')
//   const searchForm = document.getElementById('search-form')
//   const searchTermMobile = document.getElementById('search-field__mobile')
//   const searchFormMobile = document.getElementById('search-form__mobile')
//   const resultsContainer = document.getElementById('results-container')
//   const resultsContainerMobile = document.getElementById(
//     'results-container__mobile'
//   )
//   const searchResultsResources = document.getElementById(
//     'search-results__resources'
//   )
//   const searchSuggestions = document.getElementById(
//     'search-results__suggestions'
//   )
//   const searchResultsOther = document.getElementById('search-results__other')
//   const searchResultsResourcesMobile = document.getElementById(
//     'search-results__resources-mobile'
//   )
//
//   const getSidenav = document.getElementById('sidenav')
//   const hamburger = document.getElementById('hamburger')
//   const mobileLinks = document.getElementById('nav-links__mobile')
//
//   let isMobile
//
//   hamburger.addEventListener('click', () => toggleDisplay(mobileLinks))
//
//   function toggleDisplay(element) {
//     if (element) {
//       if (element.classList.contains('show')) {
//         element.classList.remove('show')
//       } else {
//         element.classList.add('show')
//       }
//     }
//   }
//   searchTerm.addEventListener('keyup', () => {
//     isMobile = false
//     showResults()
//   })
//   searchTerm.addEventListener('search', () => {
//     isMobile = false
//     showResults()
//   })
//   searchTermMobile.addEventListener('keyup', () => {
//     isMobile = true
//     showResults()
//   })
//   searchTermMobile.addEventListener('search', () => {
//     isMobile = true
//     showResults()
//   })
//
//   function showResults() {
//     if (!isMobile) {
//       if (searchTerm.value == '') {
//         resultsContainer.classList.remove('show')
//       } else {
//         getResults()
//         resultsContainer.classList.add('show')
//       }
//     } else {
//       if (searchTermMobile.value == '') {
//         resultsContainerMobile.classList.remove('show')
//       } else {
//         getResults()
//         resultsContainerMobile.classList.add('show')
//       }
//     }
//   }
//
//   function getResults() {
//     if (!isMobile) {
//       const postData = new FormData(searchForm)
//       fetch('/wp-admin/admin-ajax.php', {
//         method: 'POST',
//         body: postData,
//       })
//         .then((response) => {
//           return response.json()
//         })
//         .then((data) => {
//           searchResultsResources.innerHTML = ''
//           getResources(data)
//         })
//     } else {
//       const postData = new FormData(searchFormMobile)
//       fetch('/wp-admin/admin-ajax.php', {
//         method: 'POST',
//         body: postData,
//       })
//         .then((response) => {
//           return response.json()
//         })
//         .then((data) => {
//           searchResultsResourcesMobile.innerHTML = ''
//           getResources(data)
//         })
//     }
//   }
//
//   function getResources(data, isMobile) {
//     let resources = []
//     let products = []
//     let other = []
//     data.forEach((post) => {
//       if (post.post_type == 'post' || post.post_type == 'page') other.push(post)
//     })
//     console.log(resources)
//     for (let i = 0; i < 8 && i < other.length; i++) {
//       searchResultsOther.insertAdjacentHTML(
//         'beforeend',
//         `<div class="result-link__container">
//                ${
//                  other[i].thumbnail
//                    ? `<img class="resultImage" src="${other[i].thumbnail}">`
//                    : '<div class="resultImage no-border"></div>'
//                }
//                 <a class="result-link" href="${other[i].permalink}">${
//           other[i].name
//         }</a>
//             </div>`
//       )
//     }
//     if (resources.length === 0) {
//       searchResultsResources.insertAdjacentHTML(
//         'beforeend',
//         `<div class="result-link__container">
//         <span class="result-link"> No Resources Found</span>
//         </div>`
//       )
//     }
//   }
// })()
