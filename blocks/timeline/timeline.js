window.addEventListener('DOMContentLoaded', () => {
  const timeline = document.getElementById('timeline')
  if (timeline) {
    const slideContainer = timeline.querySelector('.timeline-slides')
    const slides = timeline.querySelectorAll('.timeline-slide')
    let activeSlide = slides[0].dataset.year
    const dotsContainer = timeline.querySelector('.timeline-dots')
    const dots = timeline.querySelectorAll('.timeline-dot')
    const arrow = timeline.querySelector('.dots-indicator-triangle')
    let activeDot = dots[0]

    setActiveSlide(activeSlide, slides)
    setActiveSlide(activeSlide, dots)
    dots.forEach((dot) => {
      const slideLeft = activeDot.getBoundingClientRect().left
      const timelineLeft = timeline.getBoundingClientRect().left
      marginValue = slideLeft + arrow.offsetWidth / 2 - timelineLeft

      dot.addEventListener('click', () => {
        activeSlide = dot.dataset.year

        setActiveSlide(activeSlide, slides)
        setActiveSlide(activeSlide, dots)
      })
    })

    function setActiveSlide(activeSlide, slides) {
      slides.forEach((slide) => {
        if (slide.dataset.year == activeSlide) {
          slide.classList.add('active')

          if (slide.classList.contains('timeline-slide')) {
            // slideContainer.scrollLeft = slide.offsetLeft
            slideContainer.scrollTo({
              top: 0,
              left: slide.offsetLeft,
              behaviour: 'smooth',
            })
          }
          if (slide.classList.contains('timeline-dot')) {
            activeDot = slide
            // slide.scrollIntoView({ inline: 'center', block: 'nearest' })
            dotsContainer.scrollTo({
              top: 0,
              left:
                slide.offsetLeft -
                dotsContainer.clientWidth / 2 +
                slide.clientWidth / 2,
              behaviour: 'smooth',
            })
          }
        } else {
          slide.classList.remove('active')
        }
      })
    }
  }
})
