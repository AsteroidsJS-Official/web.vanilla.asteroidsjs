export function loadMenu(): void {
  const inputGuest = document.getElementById(
    'nickname-guest-input',
  ) as HTMLInputElement

  const inputNicknameContainer = document.querySelector(
    '.nickname-input-container',
  ) as HTMLInputElement

  const inputConfirmPWContainer = document.querySelector(
    '.confirm-password-input-container',
  ) as HTMLInputElement

  const colorButtons: HTMLButtonElement[] = []

  const authButton = document.getElementsByClassName('auth-button')[0]

  const authCloseButton: HTMLButtonElement = document.querySelector(
    'button.close-button.auth',
  )

  const loginButton: HTMLButtonElement = document.querySelector(
    'button.login-button',
  )

  const authSwitchButton: HTMLButtonElement = document.querySelector(
    'button.auth-switch-button',
  )

  let isSigningUp = false

  if (authCloseButton) {
    authCloseButton.addEventListener('click', () => {
      document
        .getElementsByClassName('modal-container')[0]
        ?.classList.remove('active')
    })
  }

  if (loginButton) {
    loginButton.addEventListener('click', () => {
      document
        .getElementsByClassName('modal-container')[0]
        ?.classList.add('active')
    })
  }

  if (authSwitchButton) {
    authSwitchButton.addEventListener('click', () => {
      const authModalTitle = document.getElementById('auth-modal-title')

      isSigningUp = !isSigningUp

      if (inputNicknameContainer && inputConfirmPWContainer) {
        if (isSigningUp) {
          inputNicknameContainer.classList.add('active')
          inputConfirmPWContainer.classList.add('active')
        } else {
          inputNicknameContainer.classList.remove('active')
          inputConfirmPWContainer.classList.remove('active')
        }
      }

      if (authModalTitle && authButton) {
        if (isSigningUp) {
          authModalTitle.innerHTML = 'SIGN UP'
          authButton.innerHTML = 'SIGN UP'
        } else {
          authModalTitle.innerHTML = 'LOGIN'
          authButton.innerHTML = 'LOGIN'
        }
      }
    })
  }

  const spaceshipColors = [
    {
      name: 'grey',
      color: '#888888',
    },
    {
      name: 'red',
      color: '#ff0055',
    },
    {
      name: 'blue',
      color: '#0084ff',
    },
    {
      name: 'orange',
      color: '#ff9c41',
    },
    {
      name: 'green',
      color: '#59c832',
    },
    {
      name: 'purple',
      color: '#d45aff',
    },
  ]

  const colorPicker = document.getElementsByClassName(
    'spaceship-color-picker',
  )[0]
  spaceshipColors.forEach((spaceshipColor, index) => {
    const colorButton = document.createElement('button')
    colorButton.classList.add('color-button')
    colorButton.classList.add(spaceshipColor.name)

    if (index === 0) {
      colorButton.classList.add('active')
    }

    colorButton.style.backgroundColor = spaceshipColor.color

    colorButtons.push(colorButton)

    if (colorPicker) {
      colorPicker.appendChild(colorButton)
    }
  })

  const localColor = window.localStorage.getItem('asteroidsjs_spaceship_color')

  if (localColor) {
    const colorName = JSON.parse(localColor).name

    Array.from(colorButtons).forEach((button: HTMLButtonElement) => {
      if (button.classList.contains(colorName)) {
        button.classList.add('active')
      } else {
        button.classList.remove('active')
      }
    })

    onColorClick(colorName)
  }

  const localNickname = window.localStorage.getItem('asteroidsjs_nickname')

  if (inputGuest && localNickname) {
    inputGuest.value = localNickname
  }

  Array.from(colorButtons).forEach(
    (button: HTMLButtonElement, index: number) => {
      button.addEventListener('click', () => {
        if (button.classList.contains('active')) {
          return
        }

        Array.from(colorButtons).forEach((b: HTMLButtonElement, i: number) => {
          if (i !== index) {
            b.classList.remove('active')
          }
        })

        window.localStorage.setItem(
          'asteroidsjs_spaceship_color',
          JSON.stringify({
            rgb: button.style.backgroundColor,
            name: button.classList.item(1),
          }),
        )

        button.classList.add('active')
        const color = button.classList.item(1)
        onColorClick(color)
      })
    },
  )

  if (inputGuest) {
    inputGuest.addEventListener('input', (e: InputEvent) => {
      const target = e.target as HTMLInputElement
      onInput(target.value)
    })
  }

  function onInput(text: string): void {
    window.localStorage.setItem('asteroidsjs_nickname', text)
  }

  function onColorClick(color: string): void {
    const spaceshipSkin = document.getElementById(
      'spaceship-skin',
    ) as HTMLImageElement

    if (spaceshipSkin) {
      spaceshipSkin.src = `./assets/svg/spaceship-${color}.svg`
    }
  }
}
