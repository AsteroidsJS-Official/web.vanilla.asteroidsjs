import {
  AbstractEntity,
  addClass,
  appendChildren,
  destroyMultipleElements,
  Entity,
  getElement,
  getHtml,
  IOnDestroy,
  IOnStart,
  removeClass,
} from '@asteroidsjs'

@Entity()
export class Auth extends AbstractEntity implements IOnStart, IOnDestroy {
  public isSigningUp = false

  onStart(): void {
    this.insertAuthHtml()
  }

  onDestroy(): void {
    destroyMultipleElements('ast-auth')
  }

  private async insertAuthHtml(): Promise<void> {
    const html = await getHtml('auth', 'ast-auth')
    html.style.position = 'absolute'
    html.style.top = '0'
    html.style.left = '0'

    appendChildren(document.body, html)

    const cardTitle = getElement('.auth-modal-title')

    const confirmButton = getElement<HTMLButtonElement>('.auth-button')
    const closeButton = getElement<HTMLButtonElement>('.close-button.auth')
    const switchButton = getElement<HTMLButtonElement>('.auth-switch-button')

    const inputNicknameContainer = getElement<HTMLInputElement>(
      '.nickname-input-container',
    )

    const inputConfirmPWContainer = getElement<HTMLInputElement>(
      '.confirm-password-input-container',
    )

    if (
      !(
        confirmButton &&
        closeButton &&
        switchButton &&
        inputNicknameContainer &&
        inputConfirmPWContainer &&
        cardTitle
      )
    ) {
      return
    }

    closeButton.addEventListener('click', () => {
      removeClass('.modal-container', 'active')
    })

    switchButton.addEventListener('click', () => {
      this.isSigningUp = !this.isSigningUp

      if (this.isSigningUp) {
        addClass(inputNicknameContainer, 'active')
        addClass(inputConfirmPWContainer, 'active')
      } else {
        removeClass(inputNicknameContainer, 'active')
        removeClass(inputConfirmPWContainer, 'active')
      }

      if (this.isSigningUp) {
        cardTitle.innerHTML = 'SIGN UP'
        confirmButton.innerHTML = 'SIGN UP'
      } else {
        cardTitle.innerHTML = 'LOGIN'
        confirmButton.innerHTML = 'LOGIN'
      }
    })
  }
}
