import { saveAs } from 'file-saver';
import { bytesToSize } from "./_utils.js";
import { addImageSidebar } from "./sidebar.js";
import { getCurrentSelectedImg } from "./sidebar.js";
import { getFullQualImgs, resetFullQualImgs } from "./sidebar.js";
import { newImgSizeColor } from "./img-size-style.js";

const fileInput = document.getElementById("fileInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imageCompare = document.querySelector('image-compare');
const downloadLink = document.getElementById("downloadLink");
const clearBtn = document.querySelector('button.clear');

var JSZip = require("jszip");

/** @type {string} url - The object URL of the compressed image */
let url

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
    getFullQualImgs().push(img.src);
    return;
  }

  // Set canvas size to the image original size to ensure enough space for the image
  canvas.width = img.width;
  canvas.height = img.height;
  // Draw the image onto the canvas without resizing
  ctx.drawImage(img, 0, 0);

  canvas.toBlob(
    function (blob) {
      url = "";                           // Clear existing object URL from memory
      url = URL.createObjectURL(blob);    // Save the object URL of the new compressed image

      imgEl.src = url;                   // Display the compressed image on the DOM
      if (fileInput.files.length > 1) {
        addImageSidebar(blob);
      }
      else {
        singleUploadInfos(blob);
      }
      selectCurrentImg();
    },
    "image/jpeg",
    quality
  );
}

export function compressImage()
{
  if (fileInput.files.length > 0)
  {
    resetFullQualImgs();
    document.getElementById("cardContainer").innerHTML = '';

    for (let i = 0; i < fileInput.files.length; i++) {
      let file = fileInput.files[i];
      let reader = new FileReader();
      let slider = document.getElementById("qualitySlider");
      // console.log(i + " | " + file);

      reader.onload = function (e) {
        const dataUrl = e.target.result

        let img = new Image();
        img.onload = event => {
          const img = event.target

          // Make <image-compare> the same width as the image
          imageCompare.style.setProperty('--image-compare-width', `${img.width}px`);

          // Load the original and compressed versions of the image
          // loadImage(img, 'image-1')
          loadImage(img, 'image-1')
          loadImage(img, 'image-2', slider.value)
        }
        img.src = dataUrl;
        // console.log(img.src);
      };
      reader.readAsDataURL(file);
    }
  }
}

//Check all images that are added.
function updateInputDOM() {
  let singleInfos = document.getElementById("compareContainer").getElementsByTagName("p");
  let outBtnContainer = document.getElementById("outDownloadBTN");
  let buttons = document.getElementById("buttons");
  let sidebar = document.getElementById("sidebar");
  let inputFile = document.getElementById("inputFile");

  if (fileInput.files.length > 0) {
    previewLayout();
    compressImage(); //Start compressing
    if (fileInput.files.length == 1){
      inputFile.style.height = "128px";
      outBtnContainer.style.display = "unset";
      outBtnContainer.append(buttons);                                     // Change buttons position below the image compare
      document.getElementById("sidebar").style.display = "none";          // Hide sidebar
      document.getElementById("compareContainer").style.height = "auto";
    }
    else if (fileInput.files.length > 1){
      sidebar.append(buttons);
      sidebar.prepend(inputFile);
      inputFile.style.width = "100%";
      inputFile.style.height = "128px";
      outBtnContainer.style.display = "none";
      for (let i = 0; i < singleInfos.length; i++){
        singleInfos[i].style.display = "none";
        document.getElementById("singleMark").style.display = "none";
        clearBtn.style.display = "inline";
      }
    }
    buttons.style.display = "flex"; //Display download and clear buttons
  }
}

// When an image is uploaded
fileInput.addEventListener("change", updateInputDOM);

//Download multiple image URLs
downloadLink.addEventListener("click", function() {
  const imgLinks = document.getElementsByClassName("imgLinks");
  const imgNames = document.getElementsByClassName("imgName");

  if (fileInput.files.length > 1){
    //Multiple image download in a zip file
    var zip = new JSZip();
    var photoZip = zip.folder("95kb");
    // this call will create photos/README
    for (let i = 0; i < imgLinks.length; i++) {
      let blob = fetch(imgLinks[i].src).then(r => r.blob());
      photoZip.file(imgNames[i].value, blob);
    }
    zip.generateAsync({type:"blob"})
    .then(function(content) {
      saveAs(content, "95kb.zip");
    });
  }
  else if (fileInput.files.length == 1){
    //Single image file download
    let compressedImg = imageCompare.querySelector(`[slot="image-2"]`);
    let dlEl = document.createElement("a");
    dlEl.href = compressedImg.src;
    dlEl.download = document.getElementById("singleFileName").value;
    dlEl.click();
  }
});

// Layout for a single image upload
function singleUploadInfos(u){
  let origSize = document.getElementById("origImgSize");
  let compressedSize = document.getElementById("compressedImgSize");
  let cardContainer = document.getElementById("cardContainer");
  let mark = document.getElementById("singleMark");
  let newSizeEl = document.getElementById("compressedImgSize");
  let newImgSize = bytesToSize(u.size);
  let imgName = document.getElementById("singleFileName");

  origSize.innerHTML = bytesToSize(fileInput.files[cardContainer.childElementCount].size); //Get and display image original size
  compressedSize.innerHTML = bytesToSize(u.size);                                          //Get and display image compressed size
  newImgSizeColor(newImgSize, mark, newSizeEl);                                                //Change text color style to red or green
  imgName.value = fileInput.files[cardContainer.childElementCount].name;
}

// Display the last card selected before recompressng
function selectCurrentImg(){
  let cardContainer = document.getElementById("cardContainer");

  if (cardContainer.childElementCount == fileInput.files.length){
    if (getCurrentSelectedImg() == ""){
      document.getElementById("card-0").click();        // Select the first card when currentSelectedImg is empty
    }
    else {
      // Loop through all cards
      for (let i = 0; i < fileInput.files; i++){
        if (getCurrentSelectedImg() == "card-"+i){
          document.getElementById("card-"+i).click();  // Trigger click event to display image to the image compare
        }
      }
    }
  }
}

// Clear image files uploaded
clearBtn.addEventListener('click', () => {
  // Reset file input
  fileInput.value = null
  updateInputDOM()
  displayFileInput()

  // Clear carousel and image preview
  cardContainer.innerHTML = ''
  imageCompare.firstElementChild.removeAttribute('src')
  imageCompare.lastElementChild.removeAttribute('src')
})

// Change elements displayed after images are uploaded
function previewLayout() {
  let previewContainer = document.getElementById("previewContainer");
  document.getElementById("previewSidebar").style.display = "flex";     // Display sidebar
  previewContainer.style.display = "flex";

  if (fileInput.files.length > 1) {
    previewContainer.style.flexDirection = "row-reverse";         // Change reverse direction so that the slider is in the left side of the image compare
    document.getElementById("sidebar").style.display = "inline";
  }
  else {
    previewContainer.style.flexDirection = "row";
  }
}

// Display back the file input element
function displayFileInput(){
  let inputFile = document.getElementById("inputFile");
  inputFile.style.width = "400px";
  inputFile.style.height = "400px";
  document.body.insertBefore(inputFile, document.getElementById("previewSidebar"));

  document.getElementById("inputFile").style.display = "block";
  document.getElementById("previewSidebar").style.display = "none";
  document.getElementById("outDownloadBTN").style.display = "none";
}
