import '@cloudfour/image-compare'
import JSZip from 'jszip'
import { saveAs } from "file-saver"
import { bytesToSize } from "./utils.js";
// import "./slider.js"
// import "./compress.js"

// TEMPORARY: make some packages accessible globally
window.JSZip = JSZip
window.saveAs = saveAs
window.bytesToSize = bytesToSize
