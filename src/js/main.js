import {onChangeSliderVal, onChangeInputVal} from "./slider.js"
import {compressImage, imageAdded} from "./compress.js"

// DOM elements
const fileInput = document.getElementById("fileInput")
const qualitySlider = document.getElementById("qualitySlider")
const qualityInput = document.getElementById("qualityInput")
const compressBtn = document.getElementById("compressBtn")

compressBtn.addEventListener('click', compressImage)
fileInput.addEventListener('change', imageAdded)

qualitySlider.addEventListener('change', onChangeSliderVal)
qualityInput.addEventListener('change', onChangeInputVal)
