import { convertFileSize } from "./convert-img-size.js";
import { newImgSizeColor } from "./img-size-style.js";

var currentSelectedImg = "";
var fullQualImgs = [];

//return the value of currentSelectedImg
export function getCurrentSelectedImg() {
  return currentSelectedImg;
}
//return the value of FullQualImgs
export function getFullQualImgs() {
  return fullQualImgs;
}
//Reset FillQualImgs value
export function resetFullQualImgs() {
  fullQualImgs = [];
}

export function addImageSidebar(u){
  let cardContainer = document.getElementById("cardContainer");
  let imgUrl = URL.createObjectURL(u);
  let newImgSize = convertFileSize(u.size);
  let origImgSize = convertFileSize(fileInput.files[cardContainer.childElementCount].size);

  //Card main element
  let buttonCard = document.createElement("button");
  buttonCard.classList.add("card");
  buttonCard.id = "card-" + String(cardContainer.childElementCount);

  //Image for the card
  let imgContainer = document.createElement("span");
  imgContainer.classList.add("imgContainer");
  let cardImg = document.createElement("img");
  cardImg.classList.add("imgLinks");
  cardImg.src = imgUrl;
  cardImg.alt = "Preview image";
  imgContainer.appendChild(cardImg);

  //Image informations
  let cardInfo = document.createElement("span");                                                      // Span element that hold all element containing informations of the image
  cardInfo.classList.add("cardInfo");
  cardInfo.id = "cardInfo-" + String(cardContainer.childElementCount);                                // Add id

  let fileName = document.createElement("textarea");                                                  // Textarea for the file name
  fileName.rows = "2";
  fileName.classList.add("imgName");
  fileName.value = fileInput.files[cardContainer.childElementCount].name;                             // File name base on the image uploaded
  cardInfo.appendChild(fileName);

  let newFileSize = document.createElement("p");                                                      // p element to display the new image size
  newFileSize.innerHTML = "Size: " + newImgSize;
  cardInfo.appendChild(newFileSize);
  let origFileSize = document.createElement("p");                                                     // p element to display the original image size
  origFileSize.innerHTML = "Original: " + origImgSize;
  cardInfo.appendChild(origFileSize);
  let mark = document.createElement("span");

  // Check if image size is bellow 100KB
  newImgSizeColor(newImgSize, mark, newFileSize);
  mark.classList.add("mark");
  cardInfo.appendChild(mark);

  buttonCard.appendChild(imgContainer);
  buttonCard.appendChild(cardInfo);
  cardContainer.appendChild(buttonCard);
  //Adding on click event for switching image preview
  buttonCard.onclick = function() {
    document.querySelector(`[slot="image-1"]`).src = fullQualImgs[this.id.match(/\d+/)[0]];     // Display original image to the first slot of image preview
    document.querySelector(`[slot="image-2"]`).src = imgUrl;                                    // Display compressed image to the first slot of image preview
    currentSelectedImg = String(this.id);                                                       // Save current selected card
  };
}
