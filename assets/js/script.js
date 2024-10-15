document.addEventListener('DOMContentLoaded', function() {

let noteArray = JSON.parse(localStorage.getItem('noteArray')) || [];
const noteList = document.getElementById('noteList');
const newNoteInput = document.getElementById('newNoteInput');
const saveNoteButton = document.getElementById('saveNoteButton');
const cancelNoteButton = document.getElementById('cancelNoteButton');
const dropdownToggle = document.getElementById('dropdown-toggle');
const searchInput = document.getElementById('search-input');
let filters = document.querySelectorAll('.dropdown-item');
let currentFilter = 'all';
let currentSearch = '';


filters.forEach((filterItem) => {
    filterItem.addEventListener('click', function() {
        currentFilter = this.id;
        applyFilterAndSearch();
    });
});

saveNoteButton.addEventListener('click', saveNewNote);
cancelNoteButton.addEventListener('click', cancelNewNote);

searchInput.addEventListener('input', function() {
    currentSearch = this.value;
    applyFilterAndSearch();
});

function cancelNewNote() {
    newNoteInput.value = '';
};

function saveNewNote() {
    let newNoteInputValue = newNoteInput.value.trim();
    if (newNoteInputValue) {
        const newNote = {
            value: newNoteInputValue,
            checked: false
        };
        noteArray.push(newNote);
        localStorage.setItem('noteArray', JSON.stringify(noteArray));
        
        applyFilterAndSearch();
        
        const newNoteElement = noteList.lastElementChild;
        if (newNoteElement) {
            newNoteElement.style.transition = 'opacity 0.3s ease';
            newNoteElement.style.opacity = '0';
            setTimeout(() => {
                newNoteElement.style.opacity = '1';
            }, 100);
        }
        newNoteInput.value = '';
    }
};

function applyFilterAndSearch() {
    let filteredNotes = noteArray;
    
    switch (currentFilter) {
        case 'complete':
            filteredNotes = filteredNotes.filter(note => note.checked);
            dropdownToggle.textContent = 'complete';
            break;
        case 'incomplete':
            filteredNotes = filteredNotes.filter(note => !note.checked);
            dropdownToggle.textContent = 'incomplete';
            break;
        default:
                filteredNotes = noteArray;
                dropdownToggle.textContent = 'all';    
    }
    
    if (currentSearch) {
        filteredNotes = filteredNotes.filter(note => 
            note.value.toLowerCase().includes(currentSearch.toLowerCase())
        );
    }
    
    updateNoteList(filteredNotes);
}

function updateNoteList(filteredNotes) {

    if (filteredNotes.length != 0) {
        noteList.innerHTML = '';
        filteredNotes.forEach((note, index) => {
            let modal = document.getElementById('editNoteModal');
            let li = document.createElement('li');
            li.classList.add('note-item');
           
            li.innerHTML += `
                    <input type="checkbox" id="note${index}" class="note-checkbox">
                    <label for="note${index}" class="note-label">${note.value}</label>
            `;

            let checkbox = li.querySelector('.note-checkbox');

            if (note.checked) {
                li.classList.add('checked');
                checkbox.checked = true;
            };

            checkbox.addEventListener('change', function(e) {
                note.checked = e.target.checked;
                if (note.checked) {
                    li.classList.add('checked');
                } else {
                    li.classList.remove('checked');
                }
                localStorage.setItem('noteArray', JSON.stringify(noteArray));
                applyFilterAndSearch();
            });

            
            let div = document.createElement('div');
            div.classList.add('note-actions');

            let btnEdit = document.createElement('button');            
            btnEdit.classList.add('note-edit-btn');
            btnEdit.id = `note${index}-edit-btn`;
            btnEdit.innerHTML = `<img src="./assets/img/edit-icon.png" alt="Edit">`;
            btnEdit.setAttribute('data-bs-toggle', 'modal');
            btnEdit.setAttribute('data-bs-target', `#${modal.id}`);

            let btnDelete = document.createElement('button');
            btnDelete.classList.add('note-delete-btn');
            btnDelete.id = `note${index}-delete-btn`;
            btnDelete.innerHTML = `<img src="./assets/img/delete-icon.png" alt="Delete">`;

            btnEdit.onclick = function() {
                let editInput = document.getElementById('editNoteInput');
                editInput.value = note.value;
                let saveNoteButton = document.getElementById('saveEditNoteButton');
                
                saveNoteButton.onclick = function() {
                    let editInputValue = editInput.value;
                    if(editInputValue) {
                        note.value = editInputValue;
                        localStorage.setItem('noteArray', JSON.stringify(noteArray));
                        applyFilterAndSearch();
                    }
                }
            };
   
            btnDelete.onclick = function() {
                li.style.transition = 'opacity 0.3s ease';
                li.style.opacity = '0';
                setTimeout(() => {
                    noteArray = noteArray.filter((noteItem) => noteItem !== note);
                    localStorage.setItem('noteArray', JSON.stringify(noteArray));
                    applyFilterAndSearch();
                }, 300);
            }

            div.appendChild(btnEdit);
            div.appendChild(btnDelete);
            li.appendChild(div);

            noteList.appendChild(li);
            
        });
    } else {
        noteList.innerHTML = `
        <div class="col-12 h-100 pt-5 d-flex justify-content-center alighn-items-center" >
            <img src="./assets/img/detective-check.png">
        </div>
        `;
    }
}
applyFilterAndSearch();

{/* <input type="checkbox" id="note${index}" class="note-checkbox">
<label for="note${index}" class="note-label">${note.value}</label>
<div class="note-action">
    <button class="note-edit-btn" data-bs-toggle="modal" id="note${index}-edit-btn" data-bs-target="#note${index}-modal">
        <img src="./assets/img/edit-icon.png" alt="Edit">
    </button>
     <button class="note-delete-btn" id="note${index}-delete-btn">
        <img src="./assets/img/delete-icon.png" alt="Delete">
    </button>
</div>
</div> */}

})