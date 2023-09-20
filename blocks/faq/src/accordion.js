import './style.scss'
// document.addEventListener('DOMContentLoaded', () => {
;(function () {
	document.addEventListener('DOMContentLoaded', () => {
		if (window.acf) {
			window.acf.addAction('render_block_preview', accordionsInit)
		}
		accordionsInit()
	})

	function accordionsInit(block) {
		if (block) {
			const accordionsEditor = document.querySelectorAll('.accordion')
			toggleAccordions(accordionsEditor)
			return
		}
		const accordions = document.querySelectorAll('.accordion')
		toggleAccordions(accordions)
	}

	function toggleAccordions(elements) {
		elements.forEach((element) => {
			const question = element.querySelector('.question')
			const answer = element.querySelector('.answer')
			if (question && answer) {
				question.addEventListener('click', () => {
					answer.classList.toggle('show')
				})
			}
		})
	}
})()
// })
