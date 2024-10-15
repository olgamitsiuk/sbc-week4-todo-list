document.addEventListener('DOMContentLoaded', function() {

let noteArray = JSON.parse(localStorage.getItem('noteArray')) || [];
let noteList = document.getElementById('noteList');
let newNoteInput = document.getElementById('newNoteInput');
let saveNoteButton = document.getElementById('saveNoteButton');
let cancelNoteButton = document.getElementById('cancelNoteButton');
let dropdownToggle = document.getElementById('dropdown-toggle');
let searchInput = document.getElementById('search-input');
let currentFilter = 'all';
let currentSearch = '';

let filters = document.querySelectorAll('.dropdown-item');
filters.forEach((filterItem) => {
    filterItem.addEventListener('click', function() {
        currentFilter = this.id;
        applyFilterAndSearch();
    });
});

const dropdown = dropdownToggle.closest('.dropdown');

dropdownToggle.addEventListener('click', function(e) {
    e.preventDefault();
    dropdown.classList.toggle('show');
});

document.addEventListener('click', function(e) {
    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

function cancel() {
    newNoteInput.value = '';
};

function save() {
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
            }, 50);
        }
        newNoteInput.value = '';
    }
};

saveNoteButton.addEventListener('click', save);
cancelNoteButton.addEventListener('click', cancel);

searchInput.addEventListener('input', function() {
    currentSearch = this.value;
    applyFilterAndSearch();
});

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
            let li = document.createElement('li');
            li.classList.add('note-item');
           
            li.innerHTML = `
                    <input type="checkbox" id="note${index}" class="note-checkbox">
                    <label for="note${index}" class="note-label">${note.value}</label>
            `;

            let checkbox = li.querySelector('.note-checkbox');

            if (note.checked) {
                li.classList.add('checked');
                checkbox.checked = true;
            }

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

            let modal = document.createElement('div');
            modal.classList.add('modal', 'fade');
            modal.id = `note${index}-modal`;
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('aria-labelledby', `note${index}-modal-label`);
            modal.setAttribute('aria-hidden', 'true');

            modal.innerHTML = `
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header border-bottom-0">
                            <h1 class="modal-title w-100 text-center fs-5 p-0" id="newNoteModalLabel">Edit note</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <input class="new-note-input border-purple" type="text" id="edit-note${index}-input" value=${note.value}>
                            </div>
                            <div class="modal-footer border-top-0 justify-content-between">
                            <button type="button" class="btn-transparent px-4 color-purple" id="cancel-note${index}-button" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn-purple px-4 color-white" id="save-note${index}-button" data-bs-dismiss="modal">Save</button>
                            </div>
                        </div>
                        </div>
                    </div>
                    `;
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
                    let saveNoteButton = document.getElementById(`save-note${index}-button`);
                    saveNoteButton.onclick = function() {
                        let editInput = document.getElementById(`edit-note${index}-input`);
                        let editInputValue = editInput.value;
                        if(editInputValue) {
                          note.value = editInputValue;
                          localStorage.setItem('noteArray', JSON.stringify(noteArray));
                          applyFilterAndSearch();
                        }
                    }
            }
   
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
            li.appendChild(modal);

            noteList.appendChild(li);
            
        });
    } else {
        noteList.innerHTML = `
        <div class="col-12 h-100 pt-5 d-flex justify-content-center alighn-items-center" >
            <img src="./assets/img/detective-check.png">
        </div>
        `
    }
}
applyFilterAndSearch();
})