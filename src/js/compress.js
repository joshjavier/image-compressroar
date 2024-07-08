import * as qualitySlider from "./slider.js"

export function compressImage()
{
  var fileInput = document.getElementById("fileInput");
  if (fileInput.files.length > 0) 
  {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var downloadLink = document.getElementById("downloadLink");
    var imgPreview = document.getElementById("imgPreview");

    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        canvas.width = img.width; // Set canvas size to the image original size to ensure enough space for the image
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0); // Draw the image onto the canvas without resizing

        canvas.toBlob(
          function (blob) {
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.style.display = "block"; //Enable download link for the compressed image.
            imgPreview.style.display = "block"; //Enable image element
            imgPreview.src = url; //Assign src of compress image
          },
          "image/jpeg",
          Number(qualitySlider.slider.value) // Adjust the compression quality here. Possible values are within 0.0 and 1.0.
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  else {
    // Input is empty.
    let errorMSG = document.getElementById("errorMSG");
    errorMSG.innerHTML = "Please choose an image first."
  }
}

 //Check if Input has an image
export function imageAdded(event) {
  const compressBtn = document.getElementById("compressBtn");
  if (event.target.files.length > 0) {
    document.getElementById("errorMSG").innerHTML = "";
    document.getElementById("imgInputLabel").innerHTML = fileInput.files[0].name;
    // Change compress button color to gold
    compressBtn.style.background = "gold";
    compressBtn.style.borderColor="gold";
    compressBtn.style.color="grey";
    compressBtn.style.animationName = "scalePop";
    compressBtn.style.animationDuration = "0.5s";
    // Remove scalePop animation after 0.55 seconds.
    setTimeout(removeScalePopClass, 550);
  }
}

//Remove scalePop animation.
function removeScalePopClass(){
  compressBtn.style.animationName = "";
}
