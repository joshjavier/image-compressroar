import {compressImage, imageAdded} from "./compress.js"

// DOM elements
const fileInput = document.getElementById("fileInput")
const compressBtn = document.getElementById("compressBtn")

compressBtn.addEventListener('click', compressImage)
fileInput.addEventListener('change', imageAdded)
