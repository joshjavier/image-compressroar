import {compressImage} from "./compress.js"

const slider = document.getElementById("qualitySlider");

// Set default value for the quality slider and input
function initialQualityVal(){
  const slider = document.getElementById("qualitySlider");
  slider.value = 0.1;
}
initialQualityVal();

// On change value for quality slider
slider.addEventListener("change", function(){
    // inputQuality.value = slider.value;
    compressImage();
});
