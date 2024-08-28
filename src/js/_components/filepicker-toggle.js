class FilePickerToggle extends HTMLElement {
  set type(val) {
    this.setAttribute('type', val)
  }

  get type() {
    return this.getAttribute('type')
  }

  set label(val) {
    this.setAttribute('label', val)
  }

  get label() {
    return this.getAttribute('label')
  }

  connectedCallback() {
    this.style.display = 'contents'
    this.dom = {
      button: null,
      input: null,
      dropzone: null,
    }

    if (this.hasAttribute('for')) {
      this.dom.dropzone = document.querySelector(`#${this.getAttribute('for')}`)
    } else {
      this.dom.dropzone = document.querySelector('drop-zone')
    }

    this.render()
    this.dom.button.addEventListener('click', () => this.dom.input.click())
    this.dom.input.addEventListener('change', this.dom.dropzone)
  }

  render() {
    const button = document.createElement('button')
    button.classList.add(this.type === 'link' ? 'link' : 'btn')
    button.textContent = this.label
    if (this.type === 'button') {
      const addIcon = '<svg class="icon" width="24" height="24" aria-hidden="true" focusable="false"><use href="#icon-add"></svg> '
      button.insertAdjacentHTML('afterbegin', addIcon)
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.style.display = 'none'
    input.setAttribute('accept', 'image/*')

    this.append(button, input)
    this.dom = { ...this.dom, button, input }
  }
}

if (!customElements.get('filepicker-toggle')) {
  customElements.define('filepicker-toggle', FilePickerToggle)
}
