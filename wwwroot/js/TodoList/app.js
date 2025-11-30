(() => {
    const plansContainer = document.getElementById('plans');
    const newPlanInput = document.getElementById('new-plan-input');
    const addPlanButton = document.getElementById('add-plan-btn');

    let planSequence = 0;
    const planColors = [
        '#fde68a', // amber-200
        '#a7f3d0', // emerald-200
        '#bfdbfe', // blue-200
        '#fecaca', // red-200
        '#ddd6fe', // violet-200
        '#fbcfe8', // pink-200
        '#c7d2fe', // indigo-200
        '#bbf7d0', // green-200
    ];

    function createElement(tag, options = {}) {
        const el = document.createElement(tag);
        if (options.className) el.className = options.className;
        if (options.text) el.textContent = options.text;
        if (options.html) el.innerHTML = options.html;
        if (options.attrs) Object.entries(options.attrs).forEach(([k, v]) => el.setAttribute(k, v));
        return el;
    }

    function createPlan(planData) {
        planSequence += 1;

        const plan = createElement('article', { className: 'plan' });
        plan.dataset.planId = planData.id;
        const color = planColors[(planSequence - 1) % planColors.length];
        plan.style.setProperty('--plan-bg', color);

        const header = createElement('div', { className: 'plan-header' });
        const title = createElement('div', { text: planData.title || `Plan ${planSequence}` });
        const actions = createElement('div', { className: 'plan-actions' });

        const checkAllLabel = createElement('label');
        const checkAllBox = createElement('input', { attrs: { type: 'checkbox' } });
        const checkAllText = createElement('span', { text: 'Check all' });
        checkAllLabel.append(checkAllBox, checkAllText);

        const editPlanButton = createElement('button', { text: 'Edit', attrs: { type: 'button', title: 'Rename plan' } });
        const deletePlanButton = createElement('button', { text: 'Delete', attrs: { type: 'button', title: 'Delete plan' } });

        actions.append(checkAllLabel, editPlanButton, deletePlanButton);
        header.append(title, actions);

        // Inline task adder
        const adder = createElement('div', { className: 'task-adder' });
        const adderInput = createElement('input', { attrs: { type: 'text', placeholder: 'Add task' } });
        const adderBtn = createElement('button', { text: 'Add', attrs: { type: 'button' } });
        adder.append(adderInput, adderBtn);

        const list = createElement('ul', { className: 'tasks' });
        const emptyHint = createElement('div', { className: 'empty-hint', text: 'No tasks yet.' });

        plan.append(header, adder, list, emptyHint);

        // Load existing tasks
        if (planData.tasks && planData.tasks.length > 0) {
            planData.tasks.forEach(task => addTask(list, task));
            emptyHint.style.display = 'none';
        }

        // Behavior: Add task from inline input
        function addFromInput() {
            const val = (adderInput.value || '').trim();
            if (!val) {
                adderInput.classList.add('invalid');
                adderInput.focus();
                return;
            }
            adderInput.classList.remove('invalid');

            // Create task on server
            fetch('/TodoList/CreateTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ planId: planData.id, title: val })
            })
                .then(response => response.json())
                .then(data => {
                    addTask(list, data);
                    adderInput.value = '';
                    adderInput.focus();
                    emptyHint.style.display = list.children.length ? 'none' : '';
                })
                .catch(err => console.error('Error creating task:', err));
        }
        adderBtn.addEventListener('click', addFromInput);
        adderInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') addFromInput();
        });

        // Behavior: Edit plan title
        editPlanButton.addEventListener('click', () => {
            const current = title.textContent || '';
            const next = window.prompt('Plan name', current);
            if (next === null) return;
            const trimmed = next.trim();
            if (trimmed) {
                fetch('/TodoList/UpdatePlan', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: planData.id, title: trimmed })
                })
                    .then(() => {
                        title.textContent = trimmed;
                    })
                    .catch(err => console.error('Error updating plan:', err));
            }
        });

        // Behavior: Delete entire plan
        deletePlanButton.addEventListener('click', () => {
            const confirmed = window.confirm('Delete this plan and all its tasks?');
            if (!confirmed) return;

            fetch(`/TodoList/DeletePlan?id=${planData.id}`, {
                method: 'DELETE'
            })
                .then(() => {
                    plan.remove();
                })
                .catch(err => console.error('Error deleting plan:', err));
        });

        // Behavior: Toggle all tasks
        checkAllBox.addEventListener('change', () => {
            const shouldCheck = checkAllBox.checked;
            Array.from(list.querySelectorAll('input[type="checkbox"]')).forEach((box) => {
                box.checked = shouldCheck;
                box.dispatchEvent(new Event('change'));
            });
        });

        // When tasks change, sync the empty hint and the "check all" state
        const observer = new MutationObserver(() => {
            emptyHint.style.display = list.children.length ? 'none' : '';
            const boxes = Array.from(list.querySelectorAll('input[type="checkbox"]'));
            if (boxes.length === 0) {
                checkAllBox.checked = false;
                checkAllBox.indeterminate = false;
            } else {
                const checkedCount = boxes.filter((b) => b.checked).length;
                checkAllBox.checked = checkedCount === boxes.length;
                checkAllBox.indeterminate = checkedCount > 0 && checkedCount < boxes.length;
            }
        });
        observer.observe(list, { childList: true, subtree: true });

        return plan;
    }

    function addTask(listEl, taskData) {
        const item = createElement('li', { className: 'task' });
        item.dataset.taskId = taskData.id;
        if (taskData.isCompleted) item.classList.add('completed');

        const checkbox = createElement('input', { attrs: { type: 'checkbox' } });
        checkbox.checked = taskData.isCompleted || false;

        const text = createElement('div', { className: 'task-text', text: taskData.title });
        const edit = createElement('button', { className: 'icon-btn edit', text: '✎', attrs: { title: 'Edit' } });
        const del = createElement('button', { className: 'icon-btn delete', text: '🗑', attrs: { title: 'Delete' } });

        checkbox.addEventListener('change', () => {
            item.classList.toggle('completed', checkbox.checked);

            // Update task on server
            fetch('/TodoList/UpdateTask', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: taskData.id, isCompleted: checkbox.checked })
            })
                .catch(err => console.error('Error updating task:', err));
        });

        edit.addEventListener('click', () => {
            const current = text.textContent || '';
            const next = window.prompt('Edit task', current);
            if (next === null) return;
            const trimmed = next.trim();
            if (trimmed) {
                fetch('/TodoList/UpdateTask', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: taskData.id, title: trimmed })
                })
                    .then(() => {
                        text.textContent = trimmed;
                    })
                    .catch(err => console.error('Error updating task:', err));
            }
        });

        del.addEventListener('click', () => {
            fetch(`/TodoList/DeleteTask?id=${taskData.id}`, {
                method: 'DELETE'
            })
                .then(() => {
                    item.remove();
                })
                .catch(err => console.error('Error deleting task:', err));
        });

        item.append(checkbox, text, edit, del);
        listEl.appendChild(item);
    }

    function handleAddPlan() {
        const value = newPlanInput.value.trim();
        if (!value) {
            newPlanInput.classList.add('invalid');
            newPlanInput.focus();
            return;
        }
        newPlanInput.classList.remove('invalid');

        // Create plan on server
        fetch('/TodoList/CreatePlan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: value })
        })
            .then(response => response.json())
            .then(data => {
                const plan = createPlan(data);
                plansContainer.appendChild(plan);
                newPlanInput.value = '';
                newPlanInput.focus();
            })
            .catch(err => console.error('Error creating plan:', err));
    }

    addPlanButton.addEventListener('click', handleAddPlan);
    newPlanInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleAddPlan();
    });

    // Load existing plans on page load
    fetch('/TodoList/GetPlans')
        .then(response => response.json())
        .then(plans => {
            plans.forEach(planData => {
                const plan = createPlan(planData);
                plansContainer.appendChild(plan);
            });
        })
        .catch(err => console.error('Error loading plans:', err));
})();
