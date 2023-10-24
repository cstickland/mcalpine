document.addEventListener('DOMContentLoaded', () => {
  const homeHero = document.getElementById('home-hero-block')

  const homeHeroBackground = homeHero.querySelector(
    '.background-animated-images',
  )
  const slides = homeHeroBackground.querySelectorAll('.animated-image-slide')
  let activeSlide = 0
  slides[0].classList.add('show')
  if (window.innerWidth > 768) {
    function cycleSlides() {
      slides.forEach((slide) => {
        slide.classList.remove('show')
      })
      slides[activeSlide].classList.add('show')
      if (activeSlide < slides.length - 1) {
        activeSlide++
      } else {
        activeSlide = 0
      }

      setTimeout(cycleSlides, 5000)
    }
    cycleSlides()
    homeHero.addEventListener('mousemove', (e) => {
      centerX = homeHero.offsetLeft + homeHero.offsetWidth / 2

      centerY = homeHero.offsetTop + homeHero.offsetWidth / 2
      mouseX = e.pageX - centerX
      mouseY = e.pageY - centerY

      homeHeroBackground.style.top = -mouseY * 0.03 + 'px'
      homeHeroBackground.style.left = -mouseX * 0.03 + 'px'
    })
  }
})
