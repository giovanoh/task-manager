import { createContext, useContext, ReactNode } from 'react';
import { useTasks } from '../hooks/useTasks';
import {
  Task,
  TaskFilters,
  TaskStats,
  CreateTaskData,
  UpdateTaskData,
  TaskSort
} from '../types';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  createTask: (data: CreateTaskData) => Task;
  updateTask: (id: string, data: UpdateTaskData) => Task | null;
  deleteTask: (id: string) => boolean;
  getTaskById: (id: string) => Task | null;
  filterTasks: (filters: TaskFilters) => Task[];
  sortTasks: (tasks: Task[], sort: TaskSort) => Task[];
  getTaskStats: () => TaskStats;
  getFilteredTasks: (filters: TaskFilters, sort?: TaskSort) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const taskMethods = useTasks();

  return (
    <TaskContext.Provider value={taskMethods}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext(): TaskContextType {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
