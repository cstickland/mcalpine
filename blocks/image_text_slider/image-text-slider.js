document.addEventListener('DOMContentLoaded', () => {
  const sliderBlocks = document.querySelectorAll('.image-text-slider-block')

  sliderBlocks.forEach((slider) => {
    initSlider(slider)
  })

  function initSlider(slider) {
    const slides = slider.querySelectorAll('.slide')
    let activeSlide = 0
    let slideCount = slides.length
    console.log(slideCount)

    const prevButton = slider.querySelector('.prev-button')

    const nextButton = slider.querySelector('.next-button')
    prevButton.addEventListener('click', () => {
      decrementSlide()
    })
    nextButton.addEventListener('click', () => {
      incrementSlide()
    })

    function decrementSlide() {
      slides[activeSlide].classList.remove('active')

      if (activeSlide == 0) {
        activeSlide = slideCount - 1
        slides[activeSlide].classList.add('active')
        return
      } else {
        activeSlide--
        slides[activeSlide].classList.add('active')
      }
    }

    function incrementSlide() {
      slides[activeSlide].classList.remove('active')

      if (activeSlide == slideCount - 1) {
        activeSlide = 0
        slides[activeSlide].classList.add('active')
        return
      } else {
        activeSlide++
        slides[activeSlide].classList.add('active')
        return
      }
    }
  }
})
