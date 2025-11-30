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

  function createPlan(planTitle) {
    planSequence += 1;

    const plan = createElement('article', { className: 'plan' });
    const color = planColors[(planSequence - 1) % planColors.length];
    plan.style.setProperty('--plan-bg', color);

    const header = createElement('div', { className: 'plan-header' });
    const title = createElement('div', { text: planTitle || `Plan ${planSequence}` });
    const actions = createElement('div', { className: 'plan-actions' });

    const checkAllLabel = createElement('label');
    const checkAllBox = createElement('input', { attrs: { type: 'checkbox' } });
    const checkAllText = createElement('span', { text: 'Check all' });
    checkAllLabel.append(checkAllBox, checkAllText);

    const editPlanButton = createElement('button', { text: 'Edit', attrs: { type: 'button', title: 'Rename plan' } });
    const deletePlanButton = createElement('button', { text: 'Delete', attrs: { type: 'button', title: 'Delete plan' } });

    actions.append(checkAllLabel, editPlanButton, deletePlanButton);
    header.append(title, actions);

    // Inline task adder (alternative to prompt button)
    const adder = createElement('div', { className: 'task-adder' });
    const adderInput = createElement('input', { attrs: { type: 'text', placeholder: 'Add task' } });
    const adderBtn = createElement('button', { text: 'Add', attrs: { type: 'button' } });
    adder.append(adderInput, adderBtn);

    const list = createElement('ul', { className: 'tasks' });
    const emptyHint = createElement('div', { className: 'empty-hint', text: 'No tasks yet.' });

    plan.append(header, adder, list, emptyHint);

    // Behavior: Add task from inline input
    function addFromInput() {
      const val = (adderInput.value || '').trim();
      if (!val) {
        adderInput.classList.add('invalid');
        adderInput.focus();
        return;
      }
      adderInput.classList.remove('invalid');
      addTask(list, val);
      adderInput.value = '';
      adderInput.focus();
      emptyHint.style.display = list.children.length ? 'none' : '';
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
      if (trimmed) title.textContent = trimmed;
    });

    // Behavior: Delete entire plan
    deletePlanButton.addEventListener('click', () => {
      const confirmed = window.confirm('Delete this plan and all its tasks?');
      if (!confirmed) return;
      plan.remove();
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

  function addTask(listEl, taskText) {
    const item = createElement('li', { className: 'task' });
    const checkbox = createElement('input', { attrs: { type: 'checkbox' } });
    const text = createElement('div', { className: 'task-text', text: taskText });
    const edit = createElement('button', { className: 'icon-btn edit', text: '✎', attrs: { title: 'Edit' } });
    const del = createElement('button', { className: 'icon-btn delete', text: '🗑', attrs: { title: 'Delete' } });

    checkbox.addEventListener('change', () => {
      item.classList.toggle('completed', checkbox.checked);
    });

    edit.addEventListener('click', () => {
      const current = text.textContent || '';
      const next = window.prompt('Edit task', current);
      if (next === null) return;
      const trimmed = next.trim();
      if (trimmed) text.textContent = trimmed;
    });

    del.addEventListener('click', () => {
      item.remove();
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
    const plan = createPlan(value);
    plansContainer.appendChild(plan);
    newPlanInput.value = '';
    newPlanInput.focus();
  }

  addPlanButton.addEventListener('click', handleAddPlan);
  newPlanInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAddPlan();
  });
})();


