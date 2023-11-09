window.addEventListener('DOMContentLoaded', () => {
  productHeroes = document.querySelectorAll('.product-hero')

  if (productHeroes) {
    productHeroes.forEach((productHero) => {
      const images = productHero.querySelectorAll('.product-image')
      const controlImages = productHero.querySelectorAll(
        '.product-image-thumbnail',
      )
      console.log(controlImages)
      controlImages.forEach((controlImage) => {
        controlImage.addEventListener('click', () => {
          clearImages(images)
          activateSlide(controlImage.dataset.sku, images)
        })
      })
    })
  }
  function clearImages(images) {
    images.forEach((image) => {
      image.classList.remove('active')
    })
  }

  function activateSlide(sku, images) {
    images.forEach((image) => {
      if (image.dataset.sku == sku) {
        image.classList.add('active')
      }
    })
  }
})
