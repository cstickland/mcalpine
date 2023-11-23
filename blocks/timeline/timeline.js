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

    dots.forEach((dot) => {
      const slideLeft = activeDot.getBoundingClientRect().left
      const timelineLeft = timeline.getBoundingClientRect().left
      marginValue = slideLeft + arrow.offsetWidth / 2 - timelineLeft
      arrow.style.marginLeft = `${marginValue}px`

      dot.addEventListener('click', () => {
        activeSlide = dot.dataset.year

        setActiveSlide(activeSlide, slides)
        setActiveSlide(activeSlide, dots)
        setInterval(() => {
          const slideLeft = activeDot.getBoundingClientRect().left
          const timelineLeft = timeline.getBoundingClientRect().left
          marginValue = slideLeft + arrow.offsetWidth / 2 - timelineLeft
          arrow.style.marginLeft = `${marginValue}px`
        }, 1)
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
            if (window.innerWidth < 1024) {
              slide.scrollIntoView({ inline: 'center', block: 'nearest' })
            }
          }
        } else {
          slide.classList.remove('active')
        }
      })
    }
  }
})
