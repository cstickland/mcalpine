document.addEventListener('DOMContentLoaded', () => {
  const homeHero = document.getElementById('home-hero-block')

  const homeHeroBackground = homeHero.querySelector(
    '.background-animated-images',
  )

  homeHero.addEventListener('mousemove', (e) => {
    mouseX = e.pageX - homeHero.offsetLeft
    mouseY = e.pageY - homeHero.offsetTop
    console.log(mouseX)
    console.log(mouseY)
    homeHeroBackground.style.top = -mouseY * 0.025 + 'px'
    homeHeroBackground.style.left = -mouseX * 0.025 + 'px'
  })
})
