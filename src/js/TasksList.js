import tasks from './allTasks';

export default class TasksList {
  constructor(container, savedTasks) {
    if (typeof container === 'string') {
      this.container = document.querySelector(container);
    }
    this.allTasks = this.container.querySelector('.tasks__list-all');
    this.pinnedTasks = this.container.querySelector('.tasks__list_pinned');
    this.savedTasks = savedTasks;

    this.renderTasks = this.renderTasks.bind(this);
    this.pinTask = this.pinTask.bind(this);
    this.unpinTask = this.unpinTask.bind(this);
    this.filterItemsByName = this.filterItemsByName.bind(this);

    this.allTasks.addEventListener('click', this.pinTask);
    this.pinnedTasks.addEventListener('click', this.unpinTask);
  }

  // Проверяем, есть ли сохраненные задачи в локальном хранилище
  checkStorage() {
    const savedAllTasks = this.savedTasks.load();

    if (!savedAllTasks) return;

    savedAllTasks.forEach((savedTask) => {
      tasks.push(savedTask);
    });

    const pinnedTasks = tasks.filter((task) => task.pinned);

    if (pinnedTasks.length > 0) {
      pinnedTasks.forEach((pinnedTask) => {
        this.addToPinnedList(pinnedTask);
      });
    } else {
      this.showMessage('No pinned tasks.', this.pinnedTasks);
    }

    this.renderTasks();
  }

  // Показываем сообщение, что задач нет.
  showMessage(text, tasksList) {
    const message = document.createElement('p');
    message.classList.add('item__message');
    message.textContent = text;
    tasksList.append(message);
  }

  // Создаем HTML-элемент задачи.
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

  // Удаляем все задачи, и проверяем, есть ли сообщение об отсутствии задач.
  // Если оно есть, то удаляем его.
  clear() {
    const noTasks = this.allTasks.querySelector('.item__message');
    if (noTasks) {
      noTasks.remove();
    }

    const items = this.allTasks.querySelectorAll('.item');
    items.forEach((item) => item.remove());
  }

  // Отрисовываем все задачи, предварительно почистив контейнер
  renderItems(items) {
    this.clear();

    items.forEach((item) => {
      const itemHtml = this.renderItem(item);
      this.allTasks.insertAdjacentHTML('beforeend', itemHtml);
    });
  }

  // Фильтруем незакрепленные задачи и отрисовываем их
  renderTasks() {
    this.tasks = tasks.filter((task) => !task.pinned);
    this.renderItems(this.tasks);
  }

  // Закрепляем задачу, и обновляем все задачи
  pinTask(e) {
    const target = e.target.closest('.item__circle');
    if (!target) return;

    const task = this.searchTask(target, true);

    this.addToPinnedList(task);
    this.renderTasks();
  }

  // Поиск задачи по id в списке задач, в памяти меняем состояние pinned
  // Сохраняем задачи в локальное хранилище
  searchTask(element, isPinned) {
    const taskElement = element.closest('.item');
    const taskId = taskElement.getAttribute('data-id');
    const task = tasks.find((mission) => mission.id === +taskId);

    task.pinned = isPinned;

    this.savedTasks.saveTasks(tasks);

    if (task.pinned) {
      return task;
    }

    return taskElement;
  }

  // Отрисовываем задачу в закрепленных и убираем сообщение об
  // отсутствии закрепленных задач, если оно есть
  addToPinnedList(item) {
    const noPinnedTasks = this.pinnedTasks.querySelector('.item__message');

    if (noPinnedTasks) {
      noPinnedTasks.remove();
    }

    const pinnedItem = this.renderItem(item);
    this.pinnedTasks.insertAdjacentHTML('beforeend', pinnedItem);
  }

  // Открепляем задачу, удаляем задачу из закрепленных
  // Если закрепленных больше нет, отображаем сообщение об этом
  // Обновляем все задачи
  unpinTask(e) {
    const target = e.target.closest('.item__circle');
    if (!target) return;

    const taskEl = this.searchTask(target, false);

    taskEl.remove();
    const pinnedTasksElements = this.pinnedTasks.querySelectorAll('.item');

    if (pinnedTasksElements.length === 0) {
      this.showMessage('No pinned tasks.', this.pinnedTasks);
    }

    this.renderTasks();
  }

  // Фильтруем задачи в зависимости от поиска, если таких задач нет,
  // то отображаем сообщение - 'задач не найдено'
  filterItemsByName(text) {
    this.tasks = tasks.filter((task) => !task.pinned);
    const filteredTasks = this.tasks.filter((task) => {
      const cleanText = text.trim().toLowerCase();
      const taskName = task.name;
      return taskName.toLowerCase().includes(cleanText);
    });

    if (filteredTasks.length === 0) {
      this.clear();

      this.showMessage('No tasks found.', this.allTasks);
      return;
    }

    this.renderItems(filteredTasks);
  }
}
