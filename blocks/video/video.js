window.addEventListener('DOMContentLoaded', () => {
  const videoBlocks = document.querySelectorAll('.video-block')
  if (videoBlocks) {
    videoBlocks.forEach((block) => {
      const container = block.querySelector('.video-muted')
      const vimeoUrl = container.dataset.video
      const playButton = block.querySelector('.play-button')
      const videoMutedOptions = {
        url: vimeoUrl,
        responsive: true,
        autoplay: false,
        muted: true,
        dnt: true,
        byline: false,
        controls: true,
      }
      const playerMuted = new Vimeo.Player(container, videoMutedOptions)

      playButton.addEventListener('click', () => {
        playerMuted.play()
        playerMuted.setVolume(0.2)
      })

      playerMuted.on('play', () => {
        playButton.classList.add('hide')
      })

      playerMuted.on('pause', () => {
        playButton.classList.remove('hide')
      })
    })
  }
})
