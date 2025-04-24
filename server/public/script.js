//This file handles document uploads on the landing page
const dropZone = document.querySelector("#dropzone"),
  dragText = dropZone.querySelector("header"),
  button = dropZone.querySelector("#upload-button"),
  input = dropZone.querySelector("input"),
  submit = dropZone.querySelector("#submit-button");

let file;

button.onclick = () => {
  input.click();
}

input.addEventListener("change", function () {
  file = this.files[0];
  showFile(); //calling the showfile function
})

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault(); //prevent browsers default behavior
  dropZone.classList.add("active");
  dragText.textContent = "Release File to Upload"
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("active");
  dragText.textContent = "Drop A File Here to Upload"
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault(); //prevent browsers default behavior
  file = e.dataTransfer.files[0];
  showFile();  //call the show file function
});

function showFile() {
  let fileType = file.type;
  let fileName = file.name;
  let fileSize = file.size;
  console.log(fileName);

  let validExtensions = ["application/msword", "text/plain", "application/pdf", "application/msexcel", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
  if (validExtensions.includes(fileType)) {
    dropZone.classList.remove("active");
    submit.click();
    console.log("This is a document");
  } else {
    alert("That is not a document! Please Upload a valid document file.")
    dropZone.classList.remove("active");
  };
}