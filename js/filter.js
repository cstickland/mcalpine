;(() => {
  const fileInputs = document.getElementById('file__dropdown-container')
  const fileDropdown = document.getElementById('file-type__dropdown')
  const tagsInputs = document.getElementById('tags__dropdown-container')
  const tagsDropdown = document.getElementById('tags__dropdown')
  const categoryInputs = document.getElementById('category__dropdown-container')
  const categoryDropdown = document.getElementById('category__dropdown')
  const resourceInputs = document.getElementById('resource__dropdown-container')
  const resourceDropdown = document.getElementById('resource-type__dropdown')
  const sortInputs = document.getElementById('sort__dropdown-container')
  const sortDropdown = document.getElementById('sort-type__dropdown')
  const checkboxes = document.getElementsByClassName('checkbox')
  const sideCheckboxes = document.getElementsByClassName('checkbox-side')
  const filter = document.querySelector('#filter')
  const sideFilter = document.getElementById('side-filter')
  const page = document.getElementById('page')
  const pageSide = document.getElementById('page-side')
  const columnsOne = document.getElementById('set-columns__one')
  const columnsTwo = document.getElementById('set-columns__two')
  const responseGrid = document.getElementById('response')
  const sideFilterOpen = document.getElementById('side-filter_open')
  const sideFilterClose = document.getElementById('side-filter_close')
  const sideFilterContainer = document.getElementById('side-filters')
  const sideFilterForm = document.getElementById('side-filters_form')
  const sideFilterInputOpen = document.getElementsByClassName(
    'resource-dropdown__container-side'
  )
  const activeFilters = document.getElementById('active-filters')
  const activeFiltersContainer = document.getElementById(
    'active-filters__container'
  )
  const numberResults = document.getElementById('number-results')

  // get active checkboxes and display their value in a list
  function getCheckboxValues() {
    let result = []
    activeFilters.innerHTML = ''
    if (window.innerWidth > 800) {
      for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          result.push(checkboxes[i].value)
        }
      }
    } else {
      for (let i = 0; i < sideCheckboxes.length; i++) {
        if (sideCheckboxes[i].checked) {
          result.push(sideCheckboxes[i].value)
        }
      }
    }
    if (result.length == 0) {
      activeFiltersContainer.classList.remove('show')
    } else {
      activeFiltersContainer.classList.add('show')
    }

    result.forEach((element) => {
      const capitalised = element.replace(/\w\S*/g, (w) =>
        w.replace(/^\w/, (c) => c.toUpperCase())
      )
      activeFilters.insertAdjacentHTML(
        'beforeend',
        `<li>
        <img data-value="${element}" class="remove-active-filter" src="${closeSvg}" alt="close image">
        ${capitalised}
        </li>`
      )
    })
  }

  // remove a filter and change it's checkbox state accordingly
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-active-filter'))
      if (window.innerWidth > 800) {
        for (let i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i].value === e.target.dataset.value) {
            checkboxes[i].checked = false
            filter.dispatchEvent(evt)
          }
          if (sideCheckboxes[i].checked != checkboxes[i].checked) {
            sideCheckboxes[i].checked = checkboxes[i].checked
          }
        }
      } else {
        for (let i = 0; i < sideCheckboxes.length; i++) {
          if (sideCheckboxes[i].value === e.target.dataset.value) {
            sideCheckboxes[i].checked = false
            sideFilter.dispatchEvent(evt)
          }
          if (checkboxes[i].checked != sideCheckboxes[i].checked) {
            checkboxes[i].checked = sideCheckboxes[i].checked
          }
        }
      }
  })

  columnsOne.addEventListener('click', () => {
    if (!responseGrid.classList.contains('single'))
      responseGrid.classList.add('single')

    if (!columnsOne.classList.contains('blue')) columnsOne.classList.add('blue')

    if (columnsTwo.classList.contains('blue'))
      columnsTwo.classList.remove('blue')
  })

  columnsTwo.addEventListener('click', () => {
    if (responseGrid.classList.contains('single'))
      responseGrid.classList.remove('single')

    if (!columnsTwo.classList.contains('blue')) columnsTwo.classList.add('blue')

    if (columnsOne.classList.contains('blue'))
      columnsOne.classList.remove('blue')
  })

  sideFilterOpen.addEventListener('click', () => {
    if (!sideFilterContainer.classList.contains('show'))
      sideFilterContainer.classList.add('show')

    window.setTimeout(() => {
      if (!sideFilterForm.classList.contains('slide'))
        sideFilterForm.classList.add('slide')
    }, 15)
  })

  sideFilterClose.addEventListener('click', () => {
    if (sideFilterForm.classList.contains('slide'))
      sideFilterForm.classList.remove('slide')

    window.setTimeout(() => {
      if (sideFilterContainer.classList.contains('show'))
        sideFilterContainer.classList.remove('show')
    }, 150)
  })

  document.addEventListener('click', (e) => {
    if (e.target != fileInputs && !fileInputs.contains(e.target))
      fileInputs.classList.remove('open')

    if (tagsInputs) {
      if (e.target != tagsInputs && !tagsInputs.contains(e.target))
        tagsInputs.classList.remove('open')
    }

    if (
      categoryInputs &&
      e.target != categoryInputs &&
      !categoryInputs.contains(e.target)
    )
      categoryInputs.classList.remove('open')

    if (e.target != resourceInputs && !resourceInputs.contains(e.target))
      resourceInputs.classList.remove('open')

    if (e.target != sortInputs && !sortInputs.contains(e.target))
      sortInputs.classList.remove('open')

    if (e.target.classList.contains('checkbox-sort')) {
      const sortBoxes = document.getElementsByClassName('checkbox-sort')
      for (let i = 0; i < sortBoxes.length; i++) {
        if (sortBoxes[i] != e.target) {
          sortBoxes[i].checked = false
        }
      }
      page.value = 1
      filter.dispatchEvent(evt)
    }

    if (e.target.classList.contains('checkbox-side-sort')) {
      const sortSideBoxes =
        document.getElementsByClassName('checkbox-side-sort')
      for (let i = 0; i < sortSideBoxes.length; i++) {
        if (sortSideBoxes[i] != e.target) {
          document.getElementById('page')
          sortSideBoxes[i].checked = false
        }
      }
    }

    for (let i = 0; i < sideFilterInputOpen.length; i++) {
      let inputOpen = sideFilterInputOpen[i]
      if (
        inputOpen == e.target ||
        (inputOpen.contains(e.target) &&
          !e.target.classList.contains(
            'resource-dropdown__input-container-side'
          ) &&
          !e.target.classList.contains('input-container') &&
          !e.target.classList.contains('checkbox-side') &&
          !e.target.classList.contains('term-name'))
      ) {
        if (!inputOpen.classList.contains('open')) {
          inputOpen.classList.add('open')
        } else {
          inputOpen.classList.remove('open')
        }
      }
    }
  })

  fileDropdown.addEventListener('click', () => {
    if (resourceInputs.classList.contains('open')) {
      resourceInputs.classList.remove('open')
    }
    if (sortInputs.classList.contains('open')) {
      sortInputs.classList.remove('open')
    }
    if (fileInputs.classList.contains('open')) {
      fileInputs.classList.remove('open')
    } else {
      fileInputs.classList.add('open')
    }
  })

  if (categoryDropdown && categoryInputs) {
    categoryDropdown.addEventListener('click', () => {
      if (resourceInputs.classList.contains('open')) {
        resourceInputs.classList.remove('open')
      }
      if (sortInputs.classList.contains('open')) {
        sortInputs.classList.remove('open')
      }
      if (categoryInputs.classList.contains('open')) {
        categoryInputs.classList.remove('open')
      } else {
        categoryInputs.classList.add('open')
      }
    })
  }

  resourceDropdown.addEventListener('click', () => {
    if (fileInputs.classList.contains('open')) {
      fileInputs.classList.remove('open')
    }
    if (sortInputs.classList.contains('open')) {
      sortInputs.classList.remove('open')
    }
    if (resourceInputs.classList.contains('open')) {
      resourceInputs.classList.remove('open')
    } else {
      resourceInputs.classList.add('open')
    }
  })

  if (tagsDropdown) {
    tagsDropdown.addEventListener('click', () => {
      if (fileInputs.classList.contains('open')) {
        fileInputs.classList.remove('open')
      }
      if (sortInputs.classList.contains('open')) {
        sortInputs.classList.remove('open')
      }
      if (tagsInputs.classList.contains('open')) {
        tagsInputs.classList.remove('open')
      } else {
        tagsInputs.classList.add('open')
      }
    })
  }

  sortDropdown.addEventListener('click', () => {
    if (fileInputs.classList.contains('open')) {
      fileInputs.classList.remove('open')
    }
    if (resourceInputs.classList.contains('open')) {
      resourceInputs.classList.remove('open')
    }
    if (sortInputs.classList.contains('open')) {
      sortInputs.classList.remove('open')
    } else {
      sortInputs.classList.add('open')
    }
  })
  document.addEventListener('click', (e) => {
    if (
      e.target.classList.contains('checkbox') &&
      !e.target.classList.contains('checkbox-sort')
    ) {
      page.value = 1
      filter.dispatchEvent(evt)
    }
  })

  //show more results on scroll
  var timer
  let aDiv = document.getElementById('response')
  window.onscroll = () => {
    if (timer) {
      window.clearTimeout(timer)
    }
    timer = window.setTimeout(() => {
      let y = window.scrollY
      let windowHeight = window.innerHeight
      let bottomVal = aDiv.offsetTop + aDiv.offsetHeight - windowHeight
      if (y > bottomVal && y < bottomVal + windowHeight) {
        let pageNumber = parseInt(page.value)
        let pageSideNumber = parseInt(pageSide.value)
        pageNumber++
        pageSideNumber++
        page.value = pageNumber
        pageSide.value = pageSideNumber
        if (window.innerWidth > 800) {
          filter.dispatchEvent(evt)
        } else {
          sideFilter.dispatchEvent(evt)
        }
      }
    }, 500)
  }

  // submit filters on mobile
  sideFilter.addEventListener('submit', (event) => {
    event.preventDefault()
    if (sideFilterForm.classList.contains('slide')) {
      sideFilterForm.classList.remove('slide')
    }
    window.setTimeout(() => {
      if (sideFilterContainer.classList.contains('show')) {
        sideFilterContainer.classList.remove('show')
      }
    }, 150)
    getFilterResults(sideFilter)
    getCheckboxValues()
    equilizeForms()
  })

  //submit filters on desktop
  filter.addEventListener('submit', (event) => {
    event.preventDefault()
    getFilterResults(filter)
    getCheckboxValues()
    equilizeForms()
  })

  function equilizeForms() {
    if (window.innerWidth > 800) {
      for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked != sideCheckboxes[i].checked) {
          sideCheckboxes[i].checked = checkboxes[i].checked
        }
      }
    } else {
      for (let i = 0; i < sideCheckboxes.length; i++) {
        if (sideCheckboxes[i].checked != checkboxes[i].checked) {
          checkboxes[i].checked = sideCheckboxes[i].checked
        }
      }
    }
  }

  // submit the filters and display the results
  function getFilterResults(form) {
    fetch(form.getAttribute('action'), {
      method: 'POST',
      body: new FormData(form),
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          Promise.reject(response)
        }
      })
      .then((data) => {
        if (page.value === '1') {
          responseGrid.innerHTML = ''
        }
        data.forEach((post) => {
          responseGrid.insertAdjacentHTML('beforeend', getCardHtml(post))
        })
        if (data.length > 0 && data.length != 1) {
          numberResults.classList.add('show')
          numberResults.innerHTML = `${data[0].number_posts_found} Results Found`
        } else if (data.length === 1) {
          numberResults.classList.add('show')
          numberResults.innerHTML = `${data[0].number_posts_found} Result Found`
        } else {
          numberResults.classList.remove('show')
        }
      })
      .catch((error) => {
        if (page.value === '1') {
          responseGrid.innerHTML = 'No Posts with those filters'
        }
      })
  }

  // create HTML for the card based on the requested post data
  function getCardHtml(post) {
    let card = `
        <li>
            <div class="resource__card-header"> 
                <img class='resource__card-featured' src="${post.featured_image}">`
    if (post.favourites_image) {
      card += `<span class="sl-wrapper">
                    <a href="http://fillshill.local/wp-admin/admin-ajax.php?action=process_simple_like&amp;post_id=${post.id}&amp;nonce=${post.nonce}&amp;is_comment=0&amp;disabled=true" class="sl-button sl-button-${post.id} liked" data-nonce="${post.nonce}" data-post-id="${post.id}" data-iscomment="0" title="Unlike">
                        <span class="sl-icon">
                            <img src="${post.favourites_image}">
                        </span>
                    </a>
                    <span id="sl-loader"></span>
                </span>`
    }

    card += `</div>
            <div class="resource__card-content">
                <h5>
                    <a href="${post.permalink ? post.permalink : null}">
                        ${post.title}
                    </a>
                </h5>

                <div class="resource__resources-wrapper">
                    <div class="resource-container">`
    if (post.resource_types && post.resource_types.length > 0) {
      if (post.resource_types.length > 1) {
        for (let i = 0; i < 2; i++) {
          card +=
            '<div class="resource">' + post.resource_types[i].name + '</div>'
        }
        if (post.resource_types.length > 2) {
          card += `<div class="resource-dropdown__container">
				                    <span>+${post.resource_types.length - 2}</span>
                                    <ul class="resource-dropdown__list">`
          for (let index = 2; index < post.resource_types.length; index++) {
            card += `<li class="resource-dropdown__item">${post.resource_types[index].name}</li>`
          }
          card += `</ul></div>`
        }
      } else {
        card +=
          '<div class="resource">' + post.resource_types[0].name + '</div>'
      }
    }
    card += `</div>`
    card += `<div class="resource-container__mobile">`
    if (post.resource_types && post.resource_types.length > 0) {
      if (post.resource_types.length > 1) {
        for (let i = 0; i < 1; i++) {
          card +=
            '<div class="resource">' + post.resource_types[i].name + '</div>'
        }
        if (post.resource_types.length > 1) {
          card += `<div class="resource-dropdown__container">
				                    <span>+${post.resource_types.length - 1}</span>
                                    <ul class="resource-dropdown__list">`
          for (let index = 1; index < post.resource_types.length; index++) {
            card += `<li class="resource-dropdown__item">${post.resource_types[index].name}</li>`
          }
          card += `</ul></div>`
        }
      } else {
        card +=
          '<div class="resource">' + post.resource_types[0].name + '</div>'
      }
    }
    card += `</div>`
    card += `</div>
                <div class="resource__excerpt-container">
                    <p>${post.excerpt}</p>
                </div>
                <a class="resource-view__full" href="${
                  post.permalink ? post.permalink : null
                }">
                    View in Full
                    <img src="${post.arrow}"/>
                </a>
            </div>`
    if (post.download_url != '') {
      card += `<a href="${post.download_url}" download class="resource__download-link">
                            <img class="post-block__favourite-icon" src="${post.download_image}"/>
                        </a> `
    }

    card += `</li>`
    return card
  }
})()

// add a new event to submit form properly via JS
;(function () {
  if (typeof window.CustomEvent === 'function') return false

  function CustomEvent(event, params) {
    params = params || { bubbles: true, cancelable: true, detail: undefined }
    var evt = document.createEvent('submit')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }

  CustomEvent.prototype = window.Event.prototype

  window.CustomEvent = CustomEvent
})()
var evt = new CustomEvent('submit', { bubbles: true, cancelable: true })
