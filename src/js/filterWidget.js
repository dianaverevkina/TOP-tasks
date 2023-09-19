import tasks from './allTasks';
import Task from './Task';

export default class FilterWidget {
  constructor(container, showList, filterTasks) {
    if (typeof container === 'string') {
      this.container = document.querySelector(container);
    }
    this.showList = showList;
    this.filterTasks = filterTasks;
    this.filterForm = this.container.querySelector('.filter-widget__form');
    this.filterText = this.container.querySelector('.filter-widget__text');

    this.addToTasksList = this.addToTasksList.bind(this);
    this.stopShowingError = this.stopShowingError.bind(this);
    this.filter = this.filter.bind(this);

    this.addEvents();
  }

  addEvents() {
    this.filterForm.addEventListener('submit', this.addToTasksList);
    this.filterText.addEventListener('keydown', this.stopShowingError);
    this.filterText.addEventListener('input', this.filter);
  }

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

  showError() {
    this.errorText = document.createElement('p');
    this.errorText.classList.add('filter-widget__error');
    this.errorText.textContent = 'Please write your task';

    this.container.append(this.errorText);
  }

  addTask() {
    const task = this.createTask();
    tasks.push(task);
  }

  createTask() {
    const input = this.filterText.value;
    const id = Math.floor(Math.random() * 1000000);
    return new Task(id, input, false);
  }

  stopShowingError(e) {
    if (e.code === 'Space') return;

    if (this.errorText) {
      this.errorText.remove();
      this.filterText.classList.remove('filter-widget__text_red');
    }
  }

  filter(e) {
    e.preventDefault();

    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    const text = this.filterText.value;
    this._timeout = setTimeout(() => this.filterTasks(text), 300);
  }
}
