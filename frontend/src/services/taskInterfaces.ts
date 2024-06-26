interface TaskState {
    tasks: Task[];
    fetchStatus: string;
};
  
interface Subtask {
    subTaskId: string;
    name: string;
    source: string;
};

interface subTaskDependency {
    parent: string;
    child: string;
}

interface Task {
    _id: string;
    taskId: string;
    task: string;
    subtasks?: Subtask[];
    subtask_order_matters: boolean;
    subtask_dependencies?: subTaskDependency[];
    completed: boolean;
};
 
export type { TaskState, Task, Subtask, subTaskDependency };