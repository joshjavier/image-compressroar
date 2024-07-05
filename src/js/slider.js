export var slider = document.getElementById("qualitySlider");
var inputQuality = document.getElementById("qualityInput");
export function onChangeSliderVal(){
    inputQuality.value = slider.value;
}
export function onChangeInputVal(){
    var errorMSG = document.getElementById("errorMSG");
    if (inputQuality.value >= 0 && inputQuality.value <= 1)
    {
        slider.value = inputQuality.value;
    }
    else if (inputQuality.value < 0)
    {
        slider.value = 0;
        inputQuality.value = 0;
    }
    else if (inputQuality.value > 1)
    {
        slider.value = 1;
        inputQuality.value = 1;
    }
    else 
    {
        errorMSG.innerHTML = "Invalid Input. Please only input a value of 0 to 1.";
    }
}
onChangeSliderVal();