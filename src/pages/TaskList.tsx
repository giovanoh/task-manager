import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTaskContext } from '../contexts/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { Button, Input, Select } from '../components/ui';
import { Task, TaskFilters, TaskSort, TaskStatus, TaskPriority } from '../types';

export function TaskList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getFilteredTasks, updateTask, deleteTask } = useTaskContext();

  // Inicializar filtros com valores da URL
  const [filters, setFilters] = useState<TaskFilters>({
    status: (searchParams.get('status') as TaskStatus) || undefined,
    priority: (searchParams.get('priority') as TaskPriority) || undefined,
    overdue: searchParams.get('overdue') === 'true' || undefined,
  });

  const [sort, setSort] = useState<TaskSort>({ field: 'createdAt', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Atualizar URL quando filtros mudam
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.overdue) params.set('overdue', 'true');
    if (searchTerm) params.set('search', searchTerm);

    // Atualizar URL sem causar nova navegação
    setSearchParams(params, { replace: true });
  }, [filters, searchTerm, setSearchParams]);

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'in-progress', label: 'Em Progresso' },
    { value: 'completed', label: 'Concluída' },
    { value: 'cancelled', label: 'Cancelada' }
  ];

  const priorityOptions = [
    { value: '', label: 'Todas as prioridades' },
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Data de criação' },
    { value: 'updatedAt', label: 'Última atualização' },
    { value: 'dueDate', label: 'Data de vencimento' },
    { value: 'priority', label: 'Prioridade' },
    { value: 'title', label: 'Título' }
  ];

  const filteredTasks = useMemo(() => {
    const searchFilters: TaskFilters = {
      ...filters,
      search: searchTerm || undefined
    };
    return getFilteredTasks(searchFilters, sort);
  }, [filters, searchTerm, sort, getFilteredTasks]);

  // Aplicar filtros da URL nos selects
  const currentStatus = filters.status || '';
  const currentPriority = filters.priority || '';

  const handleFilterChange = (key: keyof TaskFilters) => (value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleSortChange = (field: string) => {
    setSort(prev => ({
      field: field as TaskSort['field'],
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    // Limpar também os parâmetros da URL
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const handleViewDetails = (task: Task) => {
    navigate(`/tasks/${task.id}`);
  };

  const handleEdit = (task: Task) => {
    navigate(`/tasks/${task.id}/edit`);
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.')) {
      try {
        const success = deleteTask(taskId);
        if (!success) {
          alert('Erro ao excluir tarefa');
        }
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        alert('Erro ao excluir tarefa');
      }
    }
  };

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    try {
      const updatedTask = updateTask(taskId, { status });
      if (!updatedTask) {
        alert('Erro ao atualizar status da tarefa');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status da tarefa');
    }
  };

  return (
    <div data-cy="task-list" className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
          <p className="mt-2 text-gray-600">
            Gerencie todas as suas tarefas
          </p>
        </div>
        <Link to="/tasks/new">
          <Button variant="primary">
            Nova Tarefa
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Input
            data-cy="task-filter-search-input"
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            data-cy="task-filter-status-select"
            placeholder="Filtrar por status"
            options={statusOptions}
            value={currentStatus}
            onChange={(e) => handleFilterChange('status')(e.target.value)}
          />

          <Select
            data-cy="task-filter-priority-select"
            placeholder="Filtrar por prioridade"
            options={priorityOptions}
            value={currentPriority}
            onChange={(e) => handleFilterChange('priority')(e.target.value)}
          />

          <div className="flex items-end">
            <Button
              data-cy="task-filter-clear-filters-button"
              variant="outline"
              onClick={clearFilters}
              className="w-full"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
          <Select
            options={sortOptions}
            value={sort.field}
            onChange={(e) => handleSortChange(e.target.value)}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSort(prev => ({
              ...prev,
              direction: prev.direction === 'asc' ? 'desc' : 'asc'
            }))}
          >
            {sort.direction === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? 's' : ''} encontrada{filteredTasks.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma tarefa encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || Object.keys(filters).length > 0
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando sua primeira tarefa.'}
          </p>
          <div className="mt-6">
            <Link to="/tasks/new">
              <Button variant="primary">
                Criar Primeira Tarefa
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
