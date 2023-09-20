document.addEventListener('DOMContentLoaded', () => {
	if (window.acf) {
		// backend
		// window.acf.addAction('render_block_preview', heroSliderInit)
	} else {
		// frontend
		heroSliderInit()
	}

	function heroSliderInit() {
		const heroSliders = document.querySelectorAll('.hero-slider')
		heroSliders.forEach((slider) => {
			const heroSlides = slider.querySelectorAll('.hero-slide')
			const heroSlidesControls = slider.querySelectorAll('.hero-slide-control')
			changeSlides(heroSlides, heroSlidesControls)
		})
	}

	function changeSlides(slides, controls) {
		controls.forEach((control) => {
			control.addEventListener('click', () => {
				if (control.classList.contains('active')) return

				controls.forEach((el) => {
					el.classList.remove('active')
				})
				control.classList.add('active')

				const slideNumber = control.dataset.slideNumber
				slides.forEach((slide) => {
					if (slide.dataset.slideNumber == slideNumber) {
						slide.classList.add('active')
						return
					}
					slide.classList.remove('active')
				})
			})
		})
	}
})
