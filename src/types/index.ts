export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  tags?: string[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
  overdue?: boolean;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  overdue: number;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate?: Date;
  tags?: string[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: TaskStatus;
}

export type SortOption = 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';

export type SortDirection = 'asc' | 'desc';

export interface TaskSort {
  field: SortOption;
  direction: SortDirection;
}
