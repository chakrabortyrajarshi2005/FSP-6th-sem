const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const lists = {
	todo: document.getElementById('todo'),
	doing: document.getElementById('doing'),
	done: document.getElementById('done'),
};

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function save() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function render() {
	Object.values(lists).forEach((l) => (l.innerHTML = ''));

	tasks.forEach((t, i) => {
		const el = document.createElement('div');
		el.className = `task priority-${t.priority} ${t.completed ? 'done' : ''}`;
		el.draggable = true;

		el.innerHTML = `
      <span onclick="toggle(${i})">${t.text}</span>
      <button onclick="del(${i})">✕</button>
    `;

		el.addEventListener('dragstart', () => (dragIndex = i));

		lists[t.col].appendChild(el);
	});

	document.getElementById('stats').innerText =
		`${tasks.filter((t) => t.completed).length}/${tasks.length}`;
}

function add() {
	if (!input.value) return;

	tasks.push({
		text: input.value,
		priority: document.getElementById('priority').value,
		col: 'todo',
		completed: false,
	});

	input.value = '';
	save();
	render();
}

function del(i) {
	tasks.splice(i, 1);
	save();
	render();
}

function toggle(i) {
	tasks[i].completed = !tasks[i].completed;
	if (tasks[i].completed) tasks[i].col = 'done';
	save();
	render();
}

/* Drag Drop */
let dragIndex;

document.querySelectorAll('.column').forEach((col) => {
	col.addEventListener('dragover', (e) => e.preventDefault());
	col.addEventListener('drop', () => {
		tasks[dragIndex].col = col.dataset.col;
		save();
		render();
	});
});

/* Events */
addBtn.onclick = add;
input.addEventListener('keypress', (e) => e.key === 'Enter' && add());

document.getElementById('themeToggle').onclick = () => {
	document.body.classList.toggle('dark');
};

render();
