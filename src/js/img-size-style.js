// Change Compressed size text color and mark design
export function newImgSizeColor(newSize, markEl, newSizeEl){
  if (newSize.includes("bytes")) {
    markEl.innerHTML = "&#10004;";        // Check mark icon
    markEl.style.background = "#0ca626";  // Green background color
    newSizeEl.style.color = "green";      // Green text color
  }
  else if (newSize.includes("KB")){
    markEl.innerHTML = newSize.match(/\d+/)[0] < 100 ? "&#10004;" : "&#x2715;";    // If image size is below 100 then a check mark icon would be assign, "X" mark if not.
    markEl.style.background = newSize.match(/\d+/)[0] < 100 ? "#0ca626" : "red";  // Text color base on the image size
    newSizeEl.style.color = newSize.match(/\d+/)[0] < 100 ? "green" : "red";
  }
  else {
    markEl.innerHTML = "&#x2715;";    // Assign "X" mark
    markEl.style.background = "red";  // Red color for the mark background
    newSizeEl.style.color = "red";    // Red color for the text
  }
}
