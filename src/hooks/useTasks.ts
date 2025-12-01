import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Task,
  TaskFilters,
  TaskStats,
  CreateTaskData,
  UpdateTaskData,
  TaskSort
} from '../types';

const TASKS_STORAGE_KEY = 'task-manager-tasks';

// Tipo para dados armazenados no localStorage (com strings de data)
type StoredTask = Omit<Task, 'createdAt' | 'updatedAt' | 'dueDate'> & {
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
};

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Configurar projeto React',
    description: 'Configurar projeto React com TypeScript e dependências necessárias',
    status: 'completed',
    priority: 'high',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    tags: ['setup', 'react']
  },
  {
    id: '2',
    title: 'Implementar sistema de tarefas',
    description: 'Criar funcionalidade completa de CRUD para tarefas',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date('2025-12-31'),
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02'),
    tags: ['development', 'crud']
  },
  {
    id: '3',
    title: 'Adicionar filtros e busca',
    description: 'Implementar sistema de filtros e busca de tarefas',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2025-12-15'),
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-03'),
    tags: ['ui', 'filters']
  }
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar tarefas do localStorage
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = (JSON.parse(storedTasks) as StoredTask[]).map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }));
        setTasks(parsedTasks);
      } else {
        // Se não houver tarefas salvas, usar tarefas padrão
        setTasks(defaultTasks);
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(defaultTasks));
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      setTasks(defaultTasks);
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar tarefas no localStorage
  const saveTasks = useCallback((newTasks: Task[]) => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  }, []);

  // Criar nova tarefa
  const createTask = useCallback((data: CreateTaskData): Task => {
    const newTask: Task = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: 'pending',
      priority: data.priority,
      dueDate: data.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: data.tags || []
    };

    const newTasks = [...tasks, newTask];
    saveTasks(newTasks);
    return newTask;
  }, [tasks, saveTasks]);

  // Atualizar tarefa
  const updateTask = useCallback((id: string, data: UpdateTaskData): Task | null => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return null;

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...data,
      updatedAt: new Date()
    };

    const newTasks = [...tasks];
    newTasks[taskIndex] = updatedTask;
    saveTasks(newTasks);
    return updatedTask;
  }, [tasks, saveTasks]);

  // Deletar tarefa
  const deleteTask = useCallback((id: string): boolean => {
    const newTasks = tasks.filter(task => task.id !== id);
    if (newTasks.length !== tasks.length) {
      saveTasks(newTasks);
      return true;
    }
    return false;
  }, [tasks, saveTasks]);

  // Buscar tarefa por ID
  const getTaskById = useCallback((id: string): Task | null => {
    return tasks.find(task => task.id === id) || null;
  }, [tasks]);

  // Filtrar tarefas
  const filterTasks = useCallback((filters: TaskFilters): Task[] => {
    return tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDescription = task.description.toLowerCase().includes(searchLower);
        const matchesTags = task.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesTitle && !matchesDescription && !matchesTags) return false;
      }

      if (filters.tags && filters.tags.length > 0) {
        if (!task.tags || !filters.tags.some(tag => task.tags!.includes(tag))) return false;
      }

      if (filters.dueDateFrom && task.dueDate && task.dueDate < filters.dueDateFrom) return false;
      if (filters.dueDateTo && task.dueDate && task.dueDate > filters.dueDateTo) return false;

      if (filters.overdue) {
        const now = new Date();
        if (!task.dueDate || task.dueDate >= now || task.status === 'completed' || task.status === 'cancelled') {
          return false;
        }
      }

      return true;
    });
  }, [tasks]);

  // Ordenar tarefas
  const sortTasks = useCallback((tasksToSort: Task[], sort: TaskSort): Task[] => {
    return [...tasksToSort].sort((taskA, taskB) => {
      let aValue: string | number | Date | undefined = taskA[sort.field];
      let bValue: string | number | Date | undefined = taskB[sort.field];

      // Tratamento especial para datas
      if (sort.field === 'dueDate') {
        aValue = taskA.dueDate ? taskA.dueDate.getTime() : Infinity;
        bValue = taskB.dueDate ? taskB.dueDate.getTime() : Infinity;
      }

      // Tratamento especial para prioridade
      if (sort.field === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
        aValue = priorityOrder[taskA.priority];
        bValue = priorityOrder[taskB.priority];
      }

      // Tratamento para strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Garantir que ambos os valores sejam definidos para comparação
      const a = aValue ?? '';
      const b = bValue ?? '';

      if (a < b) return sort.direction === 'asc' ? -1 : 1;
      if (a > b) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, []);

  // Obter estatísticas das tarefas
  const getTaskStats = useCallback((): TaskStats => {
    const now = new Date();
    const stats = tasks.reduce(
      (acc, task) => {
        acc.total++;
        const statusKey = task.status === 'in-progress' ? 'inProgress' : task.status;
        acc[statusKey]++;

        if (task.dueDate && task.dueDate < now && task.status !== 'completed' && task.status !== 'cancelled') {
          acc.overdue++;
        }

        return acc;
      },
      {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
        overdue: 0
      } as TaskStats
    );

    return stats;
  }, [tasks]);

  // Obter tarefas filtradas e ordenadas
  const getFilteredTasks = useCallback((filters: TaskFilters, sort?: TaskSort): Task[] => {
    let filteredTasks = filterTasks(filters);
    if (sort) {
      filteredTasks = sortTasks(filteredTasks, sort);
    }
    return filteredTasks;
  }, [filterTasks, sortTasks]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    filterTasks,
    sortTasks,
    getTaskStats,
    getFilteredTasks
  };
}
