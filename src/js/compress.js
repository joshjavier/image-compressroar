import { saveAs } from 'file-saver';

const fileInput = document.getElementById("fileInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imageCompare = document.querySelector('image-compare');
const downloadLink = document.getElementById("downloadLink");
const clearBtn = document.querySelector('button.clear')
const cardContainer = document.getElementById("card-container")

var JSZip = require("jszip");

/** @type {string} url - The object URL of the compressed image */
let url
let fullQualImgs = [];

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

  let imgEl = imageCompare.querySelector(`[slot="${slot}"]`);

  if (quality === 1) {
    imgEl.src = img.src; // Display the original image on the DOM
    fullQualImgs.push(img.src);
    return;
  }

  // Set canvas size to the image original size to ensure enough space for the image
  canvas.width = img.width;
  canvas.height = img.height;
  // Draw the image onto the canvas without resizing
  ctx.drawImage(img, 0, 0);

  canvas.toBlob(
    function (blob) {
      URL.revokeObjectURL(url);        // Clear existing object URL from memory
      url = URL.createObjectURL(blob); // Save the object URL of the new compressed image

      imgEl.src = url;                 // Display the compressed image on the DOM
      addImageCarousel(blob)
    },
    "image/jpeg",
    quality
  );
}

export function compressImage()
{
  if (fileInput.files.length > 0)
  {
    clearBtn.style.display = 'inline-block'
    fullQualImgs = [];                                        //Remove all array items
    document.getElementById("card-container").innerHTML = ''; //Remove child elements

    for (let i = 0; i < fileInput.files.length; i++) {
      let file = fileInput.files[i];
      let reader = new FileReader();
      let slider = document.getElementById("qualitySlider");

      reader.onload = function (e) {
        const dataUrl = e.target.result

        let img = new Image();
        img.onload = event => {
          const img = event.target

          // Make <image-compare> the same width as the image
          imageCompare.style.setProperty('--image-compare-width', `${img.width}px`);

          // Load the original and compressed versions of the image
          loadImage(img, 'image-1')
          loadImage(img, 'image-2', slider.value)
        }
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  }
  else {
    // Input is empty.
    let errorMSG = document.getElementById("errorMSG");
    errorMSG.innerHTML = "Please choose an image first."
  }
}

 //Check all images that are added.
function updateInputDOM() {
  const imgInputLabel = document.getElementById("imgInputLabel");

  if (fileInput.files.length === 0) {
    imgInputLabel.textContent = 'Upload/Drag an Image'
    imgInputLabel.removeAttribute('style')
  }

  if (fileInput.files.length > 0) {
    document.getElementById("errorMSG").innerHTML = "";

    //Ordered list of all image file names
    let imgNames = "<ol>";
    for (let i = 0; i < fileInput.files.length; i++){
      if (i == fileInput.files.length - 1){
        imgNames += "<li>" + fileInput.files[i].name + "</li></ol>";
      }
      else {
        imgNames += "<li>" + fileInput.files[i].name + "</li>";
      }
    }
    imgInputLabel.innerHTML = imgNames;
    imgInputLabel.style.textAlign = "left";
    imgInputLabel.style.top = "0";
    imgInputLabel.style.left = "0";

    compressImage();                        //Start compressing
    downloadLink.style.display = "inline"; //Display download button
  }
}

//Download multiple image URLs
downloadLink.addEventListener("click", function() {
  const imgLinks = document.getElementsByClassName("imgLinks");
  const linkHolder = document.createElement("a");

  var zip = new JSZip();
  var photoZip = zip.folder("photos");
  // this call will create photos/README
  for (let i = 0; i < imgLinks.length; i++) {
    let blob = fetch(imgLinks[i].src).then(r => r.blob());
    photoZip.file("Compressed_" + fileInput.files[i].name, blob);
    console.log(imgLinks[i].src);
    // linkHolder.download = "Compressed_" + fileInput.files[i].name;
    // linkHolder.href = imgLinks[i].src;
    // linkHolder.click();
  }
  zip.generateAsync({type:"blob"})
  .then(function(content) {
    saveAs(content, "example.zip");
  });
});

function addImageCarousel(u){
  let card = document.createElement("button"); //Create button element
  let newImg = document.createElement("img"); //Create image element
  let imgUrl = URL.createObjectURL(u);

  card.className = "card";
  card.id = "card-" + cardContainer.childElementCount;
  newImg.src = imgUrl;              //Assign compressed image as a thumbnail
  newImg.className = "imgLinks";    //Assign class name
  card.appendChild(newImg);         //Adding the image inside the button element
  cardContainer.appendChild(card); //Adding button inside the card-container div element

  //Adding on click event for switching image preview
  card.onclick = function() {
    document.querySelector(`[slot="image-1"]`).src = fullQualImgs[card.id.match(/\d+/)[0]];
    document.querySelector(`[slot="image-2"]`).src = imgUrl;
  };
}

fileInput.addEventListener('change', updateInputDOM)

clearBtn.addEventListener('click', () => {
  // Reset file input
  fileInput.value = null
  updateInputDOM()

  // Hide buttons
  clearBtn.style.display = 'none'
  downloadLink.style.display = 'none'

  // Clear carousel and image preview
  cardContainer.innerHTML = ''
  imageCompare.firstElementChild.removeAttribute('src')
  imageCompare.lastElementChild.removeAttribute('src')
})
