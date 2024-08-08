import '@cloudfour/image-compare'
import './_components/spinner.js'
import { ImageCard } from './_components/image-card.js'
import { debounce } from "./_utils.js"
// import "./slider.js"
// import "./compress.js"

import JSZip from 'jszip'
import { saveAs } from "file-saver"

// Make imports accessible in global scope
window.JSZip = JSZip
window.saveAs = saveAs
window.ImageCard = ImageCard
window.debounce = debounce
