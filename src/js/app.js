import FilterWidget from './filterWidget';
import TasksList from './TasksList';

const tasksList = new TasksList('.tasks');
const filter = new FilterWidget('.filter-widget', tasksList.renderTasks, tasksList.filterItems);
console.log(filter);
