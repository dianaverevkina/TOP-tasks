/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/allTasks.js
const tasks = [];
/* harmony default export */ const allTasks = (tasks);
;// CONCATENATED MODULE: ./src/js/Task.js
class Task {
  constructor(id, name, pinned) {
    this.id = id;
    this.name = name;
    this.pinned = pinned;
  }
}
;// CONCATENATED MODULE: ./src/js/filterWidget.js


class FilterWidget {
  constructor(container, savedTasks, showList, filterTasks) {
    if (typeof container === 'string') {
      this.container = document.querySelector(container);
    }
    this.savedTasks = savedTasks;
    this.showList = showList;
    this.filterTasks = filterTasks;
    this.filterForm = this.container.querySelector('.filter-widget__form');
    this.filterText = this.container.querySelector('.filter-widget__text');
    this.addToTasksList = this.addToTasksList.bind(this);
    this.stopShowingError = this.stopShowingError.bind(this);
    this.filter = this.filter.bind(this);
    this.addEvents();
  }

  // Добавляем события
  addEvents() {
    this.filterForm.addEventListener('submit', this.addToTasksList);
    this.filterText.addEventListener('keydown', this.stopShowingError);
    this.filterText.addEventListener('input', this.filter);
  }

  // Добавляем задачу в список задач, если поле ввода не пусто и нажато enter
  // Отрисовываем список задач и очищаем поле ввода
  // Если поле ввода пустое, то просим написать задачу
  addToTasksList(e) {
    e.preventDefault();
    const cleanInput = this.filterText.value.trim().toLowerCase();
    if (!cleanInput) {
      this.showError();
      this.filterText.classList.add('filter-widget__text_red');
      return;
    }
    this.addTask();
    this.showList();
    this.filterForm.reset();
  }

  // Отображаем ошибку, если поле ввода пустое
  showError() {
    this.errorText = document.createElement('p');
    this.errorText.classList.add('filter-widget__error');
    this.errorText.textContent = 'Please write your task';
    this.container.append(this.errorText);
  }

  // Добавляем задачу в список задач в памяти
  // Сохраняем задачи в локальное хранилище
  addTask() {
    const task = this.createTask();
    allTasks.push(task);
    this.savedTasks.saveTasks(allTasks);
  }

  // Создаем задачу с помощью объекта класса Task
  createTask() {
    const input = this.filterText.value;
    const id = Math.floor(Math.random() * 1000000);
    return new Task(id, input, false);
  }

  // Если пользователь продолжает ввод в инпуте, то перестаем отображать ошибку
  stopShowingError(e) {
    if (e.code === 'Space') return;
    if (this.errorText) {
      this.errorText.remove();
      this.filterText.classList.remove('filter-widget__text_red');
    }
  }

  // Фильтруем задачи по введеному тексту в поле ввода, обновляем список через 0.3 сек
  filter(e) {
    e.preventDefault();
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    const text = this.filterText.value;
    this._timeout = setTimeout(() => this.filterTasks(text), 300);
  }
}
;// CONCATENATED MODULE: ./src/js/TasksList.js

class TasksList {
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
    savedAllTasks.forEach(savedTask => {
      allTasks.push(savedTask);
    });
    const pinnedTasks = allTasks.filter(task => task.pinned);
    if (pinnedTasks.length > 0) {
      pinnedTasks.forEach(pinnedTask => {
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
    items.forEach(item => item.remove());
  }

  // Отрисовываем все задачи, предварительно почистив контейнер
  renderItems(items) {
    this.clear();
    items.forEach(item => {
      const itemHtml = this.renderItem(item);
      this.allTasks.insertAdjacentHTML('beforeend', itemHtml);
    });
  }

  // Фильтруем незакрепленные задачи и отрисовываем их
  renderTasks() {
    this.tasks = allTasks.filter(task => !task.pinned);
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
    const task = allTasks.find(mission => mission.id === +taskId);
    task.pinned = isPinned;
    this.savedTasks.saveTasks(allTasks);
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
    this.tasks = allTasks.filter(task => !task.pinned);
    const filteredTasks = this.tasks.filter(task => {
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
;// CONCATENATED MODULE: ./src/js/savedTasks.js
class SavedTasks {
  constructor(storage) {
    this.storage = storage;
  }

  // Сохраняем задачи в локальное хранилище
  saveTasks(tasksList) {
    this.storage.setItem('tasks', JSON.stringify(tasksList));
  }

  // Загружаем задачи из локального хранилища
  load() {
    return JSON.parse(this.storage.getItem('tasks'));
  }
}
;// CONCATENATED MODULE: ./src/js/app.js



const savedTasks = new SavedTasks(localStorage);
const tasksList = new TasksList('.tasks', savedTasks);
tasksList.checkStorage();
const filter = new FilterWidget('.filter-widget', savedTasks, tasksList.renderTasks, tasksList.filterItemsByName);
console.log(filter);
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;
//# sourceMappingURL=main.js.map