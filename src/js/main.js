// Import web components
import '@cloudfour/image-compare'
import './_components/spinner.js'
import './_components/filepicker-toggle.js'
import { ImageCard } from './_components/image-card.js'

// Import functions
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { debounce } from './_utils.js'

// Make imports accessible in global scope
window.JSZip = JSZip
window.saveAs = saveAs
window.ImageCard = ImageCard
window.debounce = debounce
