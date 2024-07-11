import {compressImage} from "./compress.js"

const slider = document.getElementById("qualitySlider");
const inputQuality = document.getElementById("qualityInput");

// Set default value for the quality slider and input
function initialQualityVal(){
  const slider = document.getElementById("qualitySlider");
  const inputQuality = document.getElementById("qualityInput");
  inputQuality.value = 0.5;
  slider.value = 0.5;
}
initialQualityVal();

// On change value for quality slider
slider.addEventListener("click", function(){
    inputQuality.value = slider.value;
    compressImage();
});

// On change value for the quality number input
inputQuality.addEventListener("click", function(){
    const errorMSG = document.getElementById("errorMSG");
    if (inputQuality.value >= 0 && inputQuality.value <= 1)
    {
        slider.value = inputQuality.value; // Set slider value equal to number input
    }
    else if (inputQuality.value < 0)
    {
        slider.value = 0;                 // If input is negative, set slider
        inputQuality.value = 0;           // and number input to 0.
    }
    else if (inputQuality.value > 1)
    {
        slider.value = 1;                 // If input is over the value of 1,
        inputQuality.value = 1;           // set slider and number input to 1.
    }
    else
    {
        errorMSG.innerHTML = "Invalid Input. Please only input a value of 0 to 1."; // If input is not a number
    }
    compressImage();
});
