window.addEventListener('DOMContentLoaded', () => {
  const timeline = document.getElementById('timeline')
  if (timeline) {
    const slideContainer = timeline.querySelector('.timeline-slides')
    const slides = timeline.querySelectorAll('.timeline-slide')

    slideContainer.addEventListener('scroll', () => {
      const scrollPosition = slideContainer.scrollLeft
      // console.log(scrollPosition)
      slides.forEach((slide) => {
        slide.classList.remove('active')
        console.log(slide.offsetLeft)
        if (slide.offsetLeft == scrollPosition) {
          slide.classList.add('active')
        }
      })
    })
  }
})
