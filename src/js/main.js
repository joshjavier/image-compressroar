import '@cloudfour/image-compare'
// import "./slider.js"
// import "./compress.js"

import JSZip from 'jszip'
import { saveAs } from "file-saver"
import { bytesToSize } from "./_utils.js"

// Make imports accessible in global scope
window.JSZip = JSZip
window.saveAs = saveAs
window.bytesToSize = bytesToSize
