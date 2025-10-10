const openDialog = (msg, style) => {
  const body = document.querySelector('body')
  const dialog = document.createElement('dialog')
  dialog.style.width = `${400}px`
  dialog.style.height = `${200}px`
  dialog.style.border = '0px solid black'
  dialog.classList.add('border')
  if (style && style.width) {
    dialog.style.width = `${style.width}px`
  }

  if (style && style.height) {
    dialog.style.height = `${style.height}px`
  }

  if (style && style.backgroundColor) {
    dialog.style.backgroundColor = style.backgroundColor
  }

  const messageWrapper = document.createElement('div')
  messageWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'align-middle')
  const message = document.createElement('p')
  message.innerText = msg
  const button = document.createElement('button')
  button.classList.add('btn', 'btn-primary')
  button.innerText = '확인'
  button.onclick = () => {
    dialog.close()
    body.removeChild(dialog)
  }
  messageWrapper.appendChild(message)
  messageWrapper.appendChild(button)
  dialog.appendChild(messageWrapper)
  body.appendChild(dialog)
  dialog.showModal()
}

export default openDialog
