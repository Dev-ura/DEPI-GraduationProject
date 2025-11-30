// Simple Markdown Notes (API-based)
(function () {
    "use strict";

    const listEl = document.getElementById("notes-list");
    const titleEl = document.getElementById("note-title");
    const bodyEl = document.getElementById("note-body");
    const previewEl = document.getElementById("preview-content");
    const editorSection = document.querySelector(".editor");
    const addBtn = document.getElementById("add-note");
    const deleteBtn = document.getElementById("delete-note");
    const saveIndicator = document.getElementById("save-indicator");

    let notes = [];
    let activeId = null;
    let saveTimeout = null;

    function load() {
        fetch('/Notes/GetNotes')
            .then(response => response.json())
            .then(data => {
                notes = data;
                if (!activeId && notes[0]) activeId = notes[0].id;
                renderList();
                renderEditor();
            })
            .catch(err => console.error("Error loading notes:", err));
    }

    function renderList() {
        listEl.innerHTML = "";
        // Sort by updatedAt descending
        const sorted = [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        for (const note of sorted) {
            const li = document.createElement("li");
            li.dataset.id = note.id;
            if (note.id === activeId) li.classList.add("active");

            const title = document.createElement("span");
            title.className = "note-title";
            title.textContent = note.title || "Untitled";

            const snippet = document.createElement("span");
            snippet.className = "note-snippet";
            snippet.textContent = (note.body || "").split(/\r?\n/)[0].slice(0, 40);

            li.appendChild(title);
            li.appendChild(snippet);

            li.addEventListener("click", () => {
                activeId = note.id;
                renderList();
                renderEditor();
            });

            listEl.appendChild(li);
        }
    }

    function renderPreview() {
        const active = notes.find(n => n.id === activeId);
        if (!active) {
            if (previewEl) previewEl.innerHTML = "";
            return;
        }
        const markdown = active.body || "";
        if (previewEl) {
            previewEl.innerHTML = (typeof marked !== "undefined") ? marked.parse(markdown) : markdown;
        }
    }

    function renderEditor() {
        const active = notes.find(n => n.id === activeId);
        if (!active) {
            if (editorSection) editorSection.style.display = "none";
            titleEl.value = "";
            bodyEl.value = "";
            deleteBtn.disabled = true;
            renderPreview();
            return;
        }
        if (editorSection) editorSection.style.display = "flex";
        deleteBtn.disabled = false;
        titleEl.value = active.title;
        bodyEl.value = active.body;
        renderPreview();
    }

    function debounceSave() {
        saveIndicator.textContent = "Saving…";
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            const active = notes.find(n => n.id === activeId);
            if (active) {
                saveNoteToServer(active);
            }
        }, 500);
    }

    function saveNoteToServer(note) {
        // If it has a temp ID (starts with "temp_"), it's new
        const isNew = note.id.toString().startsWith("temp_");
        const url = isNew ? '/Notes/CreateNote' : '/Notes/UpdateNote';
        const method = isNew ? 'POST' : 'PUT';

        const payload = {
            id: isNew ? null : note.id,
            title: note.title,
            body: note.body
        };

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (isNew) {
                    // Update the temp ID with real ID from server
                    note.id = data.id;
                    activeId = data.id; // Update activeId if we were editing the new note
                }
                note.updatedAt = new Date().toISOString();
                saveIndicator.textContent = "Saved";
                setTimeout(() => (saveIndicator.textContent = ""), 1200);
                renderList(); // Re-render to update ID/sort
            })
            .catch(err => {
                console.error("Error saving note:", err);
                saveIndicator.textContent = "Error";
            });
    }

    // Event listeners
    addBtn.addEventListener("click", () => {
        // Create a temporary note object
        const newNote = {
            id: "temp_" + Date.now(),
            title: "Untitled",
            body: "",
            updatedAt: new Date().toISOString()
        };
        notes.unshift(newNote);
        activeId = newNote.id;
        renderList();
        renderEditor();
        // Save immediately to get a real ID
        saveNoteToServer(newNote);
    });

    deleteBtn.addEventListener("click", () => {
        if (!activeId) return;
        const note = notes.find(n => n.id === activeId);
        if (!note) return;

        if (confirm("Are you sure you want to delete this note?")) {
            // If it's a temp note that hasn't been saved yet, just remove locally
            if (note.id.toString().startsWith("temp_")) {
                removeLocalNote(note.id);
                return;
            }

            fetch(`/Notes/DeleteNote?id=${note.id}`, {
                method: 'DELETE'
            })
                .then(() => {
                    removeLocalNote(note.id);
                })
                .catch(err => console.error("Error deleting note:", err));
        }
    });

    function removeLocalNote(id) {
        const idx = notes.findIndex(n => n.id === id);
        if (idx >= 0) {
            notes.splice(idx, 1);
            activeId = notes[0] ? notes[0].id : null;
            renderList();
            renderEditor();
        }
    }

    titleEl.addEventListener("input", e => {
        const active = notes.find(n => n.id === activeId);
        if (!active) return;
        active.title = e.target.value;
        renderList(); // Update title in list
        debounceSave();
    });

    bodyEl.addEventListener("input", e => {
        const active = notes.find(n => n.id === activeId);
        if (!active) return;
        active.body = e.target.value;
        renderPreview();
        debounceSave();
    });

    // Prevent form submission (since we use AJAX)
    const form = document.getElementById("note-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
        });
    }

    load();
})();
