// Simple Markdown Notes (localStorage + ASP.NET post)
(function () {
    "use strict";

    const STORAGE_KEY = "codexly_notes_v1";

    const listEl = document.getElementById("notes-list");
    const titleEl = document.getElementById("note-title");
    const bodyEl = document.getElementById("note-body");
    const previewEl = document.getElementById("preview-content");
    const editorSection = document.querySelector(".editor");
    const addBtn = document.getElementById("add-note");
    const deleteBtn = document.getElementById("delete-note");
    const saveIndicator = document.getElementById("save-indicator");
    const formEl = document.querySelector(".editor"); // your existing form

    /** @type {{ id:string, dbId?:string, title:string, body:string, updatedAt:number }[]} */
    let notes = [];
    let activeId = null;
    let saveTimeout = null;

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) notes = parsed;
            }
        } catch (_) { }

        if (!activeId && notes[0]) activeId = notes[0].id;
        renderList();
        renderEditor();
    }

    function persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }

    function createNote(title, body) {
        return {
            id: "n_" + Math.random().toString(36).slice(2, 10),
            title: title || "Untitled",
            body: body || "",
            updatedAt: Date.now(),
        };
    }

    function renderList() {
        listEl.innerHTML = "";
        const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
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
            persist();
            const active = notes.find(n => n.id === activeId);
            if (active && !active.dbId) postNoteToServer(active);
            saveIndicator.textContent = "Saved";
            setTimeout(() => (saveIndicator.textContent = ""), 1200);
        }, 300);
    }

    function postNoteToServer(note) {
        if (!formEl) return;
        // Use existing form
        formEl.Title.value = note.title;
        formEl.ContentMarkdown.value = note.body;
        formEl.submit();
    }

    // Event listeners
    addBtn.addEventListener("click", () => {
        const newNote = createNote("Untitled", "");
        notes.unshift(newNote);
        activeId = newNote.id;
        renderList();
        renderEditor();
        debounceSave();
    });

    deleteBtn.addEventListener("click", () => {
        if (!activeId) return;
        const idx = notes.findIndex(n => n.id === activeId);
        if (idx >= 0) {
            notes.splice(idx, 1);
            activeId = notes[0] ? notes[0].id : null;
            renderList();
            renderEditor();
            debounceSave();
        }
    });

    titleEl.addEventListener("input", e => {
        const active = notes.find(n => n.id === activeId);
        if (!active) return;
        active.title = e.target.value;
        active.updatedAt = Date.now();
        renderList();
        debounceSave();
    });

    bodyEl.addEventListener("input", e => {
        const active = notes.find(n => n.id === activeId);
        if (!active) return;
        active.body = e.target.value;
        active.updatedAt = Date.now();
        renderList();
        renderPreview();
        debounceSave();
    });

    load();
})();
