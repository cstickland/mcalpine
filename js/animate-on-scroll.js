window.addEventListener('DOMContentLoaded', () => {
  const itemsToAnimate = document.querySelectorAll('.animate')

  // Tell the observer which elements to track
  const ioConfiguration = {
    /**
     * This rootMargin creates a horizontal line vertically centered
     * that will help trigger an intersection at that the very point.
     */
    rootMargin: '-35% 0% -35% 0%',

    /**
     * This is the default so you could remove it.
     * I just wanted to leave it here to make it more explicit
     * as this threshold is the only one that works with the above
     * rootMargin
     */
    threshold: 0,
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // If the element is visible
      if (entry.isIntersecting) {
        // Add the animation class
        entry.target.classList.add('animated')
      }
    })
  }, ioConfiguration)

  // Tell the observer which elements to track
  itemsToAnimate.forEach((item) => {
    observer.observe(item)
  })
})
