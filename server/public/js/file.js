//This file handles retrieval of files and file info from the database for display on the user dashboard
const docuZone = document.querySelector('#docuArea');
console.log(docuZone);

let fileBody = document.querySelector('#fileList');

async function fileFiller() {
    const response = await fetch("http://`${host}`:`${port}`/api/getAll");

    const file = await response.json();
    console.log(file);
    fileBody.append(create_document_area(file));
}

fileFiller()

// .then(res => res.json())
// .then(json => {
// console.log(json);
// return files;
// json.map(data => {
//     console.log(data);
//     file = data;
// })
// })
// .then(() => {
// });

function create_document_area(file) {
    console.log(file);
    let fileData = document.createElement('tr');
    fileData.innerHTML = `
    <td>
        <div class="text-center" style="padding: 10px;">
            ${file.name}
        </div>
    </td>
    <td>
        <div class="text-center" style="padding: 10px;">
            ${size}
        </div>
    </td>
    <td>
        <div class="text-center" style="padding: 10px;">
            ${number}
        </div>
    </td>
    <td>
        <div class="text-center" style="padding: 10px;">
            ${message}
        </div>
    </td>
    `;
    return fileData
}