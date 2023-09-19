import tasks from './allTasks';

export default class TasksList {
  constructor(container) {
    if (typeof container === 'string') {
      this.container = document.querySelector(container);
    }
    this.allTasks = this.container.querySelector('.tasks__list-all');
    this.pinnedTasks = this.container.querySelector('.tasks__list_pinned');

    this.renderTasks = this.renderTasks.bind(this);
    this.pinTask = this.pinTask.bind(this);
    this.unpinTask = this.unpinTask.bind(this);
    this.filterItems = this.filterItems.bind(this);

    this.allTasks.addEventListener('click', this.pinTask);
    this.pinnedTasks.addEventListener('click', this.unpinTask);
  }

  renderItem(item) {
    return `
      <li class="tasks__item item" data-id="${item.id}">
        <div class="item__wrapper">
          <div class="item__name">${item.name}</div>
          <div class="item__circle ${item.pinned ? 'item__circle_pinned' : ''}"></div>
        </div>
      </li>
    `;
  }

  renderItems(items) {
    this.clear();

    items.forEach((item) => {
      const itemHtml = this.renderItem(item);
      this.allTasks.insertAdjacentHTML('beforeend', itemHtml);
    });
  }

  renderTasks() {
    this.tasks = tasks.filter((task) => !task.pinned);
    this.renderItems(this.tasks);
  }

  filterItems(text) {
    this.tasks = tasks;
    const filteredTasks = this.tasks.filter((task) => {
      const cleanText = text.trim().toLowerCase();
      const taskName = task.name;
      return taskName.toLowerCase().includes(cleanText);
    });

    if (filteredTasks.length === 0) {
      this.clear();

      this.showText('No tasks found.', this.allTasks);
      return;
    }
    this.renderItems(filteredTasks);
  }

  showText(text, tasksList) {
    const message = document.createElement('p');
    message.classList.add('item__message');
    message.textContent = text;
    tasksList.append(message);
  }

  clear() {
    // debugger;
    const noTasks = this.allTasks.querySelector('.item__message');
    if (noTasks) {
      noTasks.remove();
    }

    const items = this.allTasks.querySelectorAll('.item');
    items.forEach((item) => item.remove());
  }

  pinTask(e) {
    const target = e.target.closest('.item__circle');
    if (!target) return;

    const task = this.searchTask(target, true);

    this.addToPinnedList(task);
    this.renderTasks();
  }

  addToPinnedList(item) {
    const pinnedItem = this.renderItem(item);
    this.pinnedTasks.insertAdjacentHTML('beforeend', pinnedItem);
  }

  unpinTask(e) {
    const target = e.target.closest('.item__circle');
    if (!target) return;

    const taskEl = this.searchTask(target, false);

    taskEl.remove();
    this.renderTasks();
  }

  searchTask(element, isPinned) {
    const taskElement = element.closest('.item');
    const taskId = taskElement.getAttribute('data-id');
    const task = tasks.find((mission) => mission.id === +taskId);

    task.pinned = isPinned;

    if (task.pinned) {
      return task;
    }

    return taskElement;
  }
}
