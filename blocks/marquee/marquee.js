function Marquee(selector) {
  containerElements = document.querySelectorAll(selector)

  containerElements.forEach((element, i) => {
    const listElem = element.querySelector('.marquee-text-container')
    let currentLeftValue = listElem.getBoundingClientRect().left

    function animationLoop() {
      const firstListItem = listElem.querySelector(':first-child')
      const lastListItem = listElem.querySelector(':last-child')
      let rightSideOfFirstItem = firstListItem.getBoundingClientRect().right
      let widthOfFirstItem = firstListItem.offsetWidth

      if (i === 0 || i % 2 == 0) {
        currentLeftValue = currentLeftValue - 0.25
        if (rightSideOfFirstItem < 0) {
          currentLeftValue = -1
          listElem.appendChild(firstListItem)
        }
      } else {
        currentLeftValue = currentLeftValue + 0.25

        if (currentLeftValue >= -1) {
          currentLeftValue = -32 - widthOfFirstItem

          listElem.style.marginLeft = `${currentLeftValue}px`
          listElem.prepend(lastListItem)
        }
      }

      listElem.style.marginLeft = `${currentLeftValue}px`
    }
    window.setInterval(animationLoop, 10)
  })
}

window.addEventListener('DOMContentLoaded', () => {
  Marquee('.marquee-container')
})
