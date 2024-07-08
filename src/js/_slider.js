export const qualitySlider = document.getElementById("qualitySlider")
export const qualityInput = document.getElementById("qualityInput")

export function onChangeSliderVal(){
    qualityInput.value = qualitySlider.value;
}
export function onChangeInputVal(){
    // var errorMSG = document.getElementById("errorMSG");
    if (qualityInput.value >= 0 && qualityInput.value <= 1)
    {
        qualitySlider.value = qualityInput.value;
    }
    else if (qualityInput.value < 0)
    {
        qualitySlider.value = 0;
        qualityInput.value = 0;
    }
    else if (qualityInput.value > 1)
    {
        qualitySlider.value = 1;
        qualityInput.value = 1;
    }
    else
    {
        errorMSG.innerHTML = "Invalid Input. Please only input a value of 0 to 1.";
    }
}

qualitySlider.addEventListener('change', onChangeSliderVal)
qualityInput.addEventListener('change', onChangeInputVal)

onChangeSliderVal();
