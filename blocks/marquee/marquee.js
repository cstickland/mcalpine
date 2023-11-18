function Marquee(selector) {
  containerElements = document.querySelectorAll(selector)

  containerElements.forEach((element) => {
    const containerElem = element
    const leftSideOfContainer = containerElem.getBoundingClientRect().left
    const listElem = element.querySelector('.marquee-text-container')
    let currentLeftValue = listElem.getBoundingClientRect().left

    function animationLoop() {
      const firstListItem = listElem.querySelector(':first-child')
      let rightSideOfFirstItem = firstListItem.getBoundingClientRect().right

      /*
      If first list item is out of viewable area, move it to the end of the list.
      Also, set the current left value to -1 so we won't stutter.
    */
      if (rightSideOfFirstItem < 0) {
        currentLeftValue = -1
        listElem.appendChild(firstListItem)
      }

      // The part that keeps it all going: animating the margin left value of the list.
      listElem.style.marginLeft = `${currentLeftValue}px`
      currentLeftValue = currentLeftValue - 0.25
    }

    window.setInterval(animationLoop, 10)
  })

  // Kick off for the animation function.

  /*
    Looks at first item in the list and checks if it goes out of the visible area
    by comparing the right position of the first list item to the left position
    of the containing element.
  */
}
window.addEventListener('DOMContentLoaded', () => {
  Marquee('.marquee-container')
})
