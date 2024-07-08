import * as qualitySlider from "./slider.js"

const fileInput = document.getElementById("fileInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const downloadLink = document.getElementById("downloadLink");
const imageCompare = document.querySelector('image-compare');

/**
 * Loads an image on a slot in the <image-preview> component
 * @param {HTMLImageElement} img - The image to be loaded
 * @param {'image-1'|'image-2'} slot - Left and right slots
 * @param {number|string} quality - Quality of the image between 0.0 and 1.0 (inclusive). If not specified, defaults to 1 (uncompressed)
 */
function loadImage(img, slot, quality = 1) {
  if (typeof quality === 'string') {
    quality = Number(quality); // Make sure quality is a number
  }

  // Set canvas size to the image original size to ensure enough space for the image
  canvas.width = img.width;
  canvas.height = img.height;
  // Draw the image onto the canvas without resizing
  ctx.drawImage(img, 0, 0);

  canvas.toBlob(
    function (blob) {
      let img = imageCompare.querySelector(`[slot="${slot}"]`);
      let url = URL.createObjectURL(blob);

      if (quality !== 1) {
        downloadLink.href = url; // Display the download link for the compressed image
      }

      img.onload = () => URL.revokeObjectURL(url);
      img.src = url;
    },
    "image/jpeg",
    quality
  );
}

export function compressImage()
{
  if (fileInput.files.length > 0)
  {
    let file = fileInput.files[0];
    let reader = new FileReader();

    reader.onload = function (e) {
      const dataUrl = e.target.result

      let img = new Image();
      img.onload = event => {
        const img = event.target

        // Make <image-compare> the same width as the image
        imageCompare.style.setProperty('--image-compare-width', `${img.width}px`);

        // Load the original and compressed versions of the image
        loadImage(img, 'image-1')
        loadImage(img, 'image-2', qualitySlider.slider.value)
      }
      img.src = dataUrl;
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
export function imageAdded(fileInput) {
  const compressBtn = document.getElementById("compressBtn");
  if (fileInput.files.length > 0) {
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
