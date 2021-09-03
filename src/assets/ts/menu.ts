const input = document.getElementById('nickname-input')
const colorButtons = document.getElementsByClassName('color-button')

const playSP = document.getElementById('play-singleplayer-button')
const playLMP = document.getElementById('play-local-multiplayer-button')
const playOMP = document.getElementById('play-online-multiplayer-button')

if (playSP) {
  playSP.addEventListener('click', () => {
    const a = document.createElement('a')
    const location = window.location
    a.href = `${location.protocol}//${location.host}${location.pathname}game`
    a.click()
    a.remove()
  })
}

Array.from(colorButtons).forEach((button: HTMLButtonElement, index: number) => {
  button.addEventListener('click', () => {
    if (button.classList.contains('active')) {
      return
    }

    Array.from(colorButtons).forEach((b: HTMLButtonElement, i: number) => {
      if (i !== index) {
        b.classList.remove('active')
      }
    })

    button.classList.add('active')
    const color = button.classList.item(1)
    onColorClick(color)
  })
})

if (input) {
  input.addEventListener('input', (e: InputEvent) => {
    const target = e.target as HTMLInputElement
    onInput(target.value)
  })
}

function onInput(text: string): void {
  console.log(text)
}

function onColorClick(color: string): void {
  const spaceshipSkin = document.getElementById(
    'spaceship-skin',
  ) as HTMLImageElement

  if (spaceshipSkin) {
    spaceshipSkin.src = `./assets/svg/spaceship-${color}.svg`
  }
}
