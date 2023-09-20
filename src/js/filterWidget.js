import tasks from './allTasks';
import Task from './Task';

export default class FilterWidget {
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
    tasks.push(task);

    this.savedTasks.saveTasks(tasks);
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
