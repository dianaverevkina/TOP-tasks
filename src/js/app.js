import FilterWidget from './filterWidget';
import TasksList from './TasksList';
import SavedTasks from './savedTasks';

const savedTasks = new SavedTasks(localStorage);

const tasksList = new TasksList('.tasks', savedTasks);
tasksList.checkStorage();
const filter = new FilterWidget('.filter-widget', savedTasks, tasksList.renderTasks, tasksList.filterItemsByName);
console.log(filter);
