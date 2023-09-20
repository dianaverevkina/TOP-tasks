export default class SavedTasks {
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
