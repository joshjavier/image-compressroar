import { bytesToSize } from '../_utils.js'

export class ImageCard extends HTMLElement {
  set quality(val) {
    this.setAttribute('quality', val)
  }

  get quality() {
    return Number(this.getAttribute('quality'))
  }

  set valid(val) {
    const isValid = Boolean(val)
    if (isValid) {
      this.removeAttribute('aria-invalid')
    } else {
      this.setAttribute('aria-invalid', 'true')
    }
  }

  get valid() {
    return !this.getAttribute('aria-invalid')
  }

  set loading(bool) {
    if (bool) {
      const spinner = document.createElement('div')
      spinner.classList.add('spinner')
      this.dom.thumbnail.replaceChildren(spinner) // replace thumbnail with spinner
      this.dom.sizeCompressed.replaceChildren('') // replace compressed size with loader
    } else {
      // Replace loading indicator with thumbnail image
      this.dom.thumbnail.replaceChildren(this.data.image)
    }
  }

  get loading() {
    return this.querySelector('.spinner')
  }

  static get observedAttributes() {
    return ['quality']
  }

  attributeChangedCallback(name, _oldVal, _newVal) {
    if (!this.dom || !this.data.image) return
    switch (name) {
      case 'quality':
        this.compressImage()
        break
    }
  }

  constructor(file) {
    super()
    this.data = {
      file,
      image: null,
      compressed: {
        blob: null,
        url: null,
      },
    }
    if (this.data.file) {
      console.log(this.data.file)
    }
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="thumbnail"></div>
      <div class="text">
        <h3 class="filename">
          <button>
            <span>TEST-ATL_MS_1453462_MPP-1080x486.jpg</span>
          </button>
        </h3>
        <div class="details">
          <div class="size">
            <p class="compressed">Size: <strong></strong></p>
            <p class="original">Original: <span></span></p>
          </div>
          <svg class="icon icon-success" width="24" height="24">
            <use href="#check-solid">
          </svg>
          <svg class="icon icon-failure" width="24" height="24">
            <use href="#cross-solid">
          </svg>
        </div>
      </div>
    `
    this.classList.add('bleed')

    this.dom = {
      thumbnail: this.querySelector('.thumbnail'),
      filename: this.querySelector('.filename span'),
      button: this.querySelector('.filename button'),
      sizeCompressed: this.querySelector('.compressed strong'),
      sizeOriginal: this.querySelector('.original span'),
    }

    const cardselect = new CustomEvent('cardselect', { bubbles: true })
    this.addEventListener('pointerdown', (e) => {
      if (this.dom.button.contains(e.target)) return // prevent redundant clicks
      this.down = +new Date()
      this.addEventListener('pointerup', () => {
        this.up = +new Date()
        if ((this.up - this.down) < 200 && !this.loading) {
          this.dispatchEvent(cardselect)
        }
      }, { once: true })
    })

    this.dom.button.addEventListener('click', (e) => {
      e.stopPropagation()
      const selection = getSelection().toString()
      if (selection || this.loading)
        return // don't fire "cardselect" event when user is doing text selection or card is loading
      this.dispatchEvent(cardselect)
    })

    if (!this.quality) {
      this.quality = 0.5
    }

    if (this.data.file) {
      this.render()
    }
  }

  render() {
    this.loadImage()
    this.dom.filename.textContent = this.data.file.name
    this.dom.filename.title = this.data.file.name
    this.dom.sizeOriginal.textContent = bytesToSize(this.data.file.size)
  }

  loadImage() {
    this.data.image = new Image()
    const reader = new FileReader()
    reader.onloadend = () => {
      this.data.image.onload = () => this.onImageLoad()
      this.data.image.src = reader.result
    }
    reader.readAsDataURL(this.data.file)
  }

  onImageLoad() {
    // // Replace loading indicator with thumbnail image
    // this.dom.thumbnail.replaceChildren(this.data.image)
    // Compress image
    this.compressImage()
  }

  async compressImage() {
    this.loading = true // start compression

    if (this.data.file.type === 'image/png') {
      const compressed = await this.optimizePNG()
      this.data.compressed.blob = new Blob([compressed], { type: 'image/png' })
      console.log(this.data.compressed.blob)

      this.data.compressed.url = URL.createObjectURL(this.data.compressed.blob)
      this.dom.sizeCompressed.textContent = bytesToSize(this.data.compressed.blob.size)
    } else {
      const offscreenCanvas = new OffscreenCanvas(this.data.image.naturalWidth, this.data.image.naturalHeight)
      const ctx = offscreenCanvas.getContext('2d')

      ctx.drawImage(this.data.image, 0, 0)
      this.data.compressed.blob = await offscreenCanvas.convertToBlob({
        type: this.data.file.type, // must be image/jpeg or image/webp
        quality: this.quality,
      })
      console.log(this.data.compressed.blob)

      this.data.compressed.url = URL.createObjectURL(this.data.compressed.blob)
      this.dom.sizeCompressed.textContent = bytesToSize(this.data.compressed.blob.size)
    }

    this.loading = false // end compression

    // validate if compressed blob size is less than 100 KB
    this.valid = this.data.compressed.blob.size < 102400

    this.dispatchEvent(new CustomEvent('imagecompress', {
      bubbles: true,
      detail: {
        original: this.data.image.src,
        compressed: this.data.compressed.url,
      },
    }))
  }

  optimizePNG() {
    const worker = new Worker('/js/worker.js')
    const quality = Math.round(this.quality * 100)
    const min = quality < 15 ? 0 : quality - 15
    const max = quality > 85 ? 100 : quality + 15
    const options = {
      quality: min + '-' + max,
      // speed: '4',
    }
    console.log(options)

    return new Promise((resolve, _reject) => {
      worker.onmessage = (e) => {
        resolve(e.data.data)
        worker.terminate()
      }
      this.data.file.arrayBuffer().then((buf) => {
        worker.postMessage({
          file: new Uint8Array(buf),
          options,
        })
      })
    })
  }
}

if (!customElements.get('image-card')) {
  customElements.define('image-card', ImageCard)
}
