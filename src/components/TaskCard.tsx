import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task } from '../types';
import { Button } from './ui';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  onViewDetails?: (task: Task) => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
  urgent: 'bg-red-600 text-white'
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onViewDetails
}: TaskCardProps) {
  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== 'completed' && task.status !== 'cancelled';

  const handleStatusChange = (newStatus: Task['status']) => {
    onStatusChange?.(task.id, newStatus);
  };

  return (
    <div data-cy="task-card" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header com título e prioridade */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-3">
          {task.title}
        </h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority === 'low' && 'Baixa'}
          {task.priority === 'medium' && 'Média'}
          {task.priority === 'high' && 'Alta'}
          {task.priority === 'urgent' && 'Urgente'}
        </span>
      </div>

      {/* Descrição */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {task.description}
      </p>

      {/* Status */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors[task.status]}`}>
          {task.status === 'pending' && 'Pendente'}
          {task.status === 'in-progress' && 'Em Progresso'}
          {task.status === 'completed' && 'Concluída'}
          {task.status === 'cancelled' && 'Cancelada'}
        </span>

        {isOverdue && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Vencida
          </span>
        )}
      </div>

      {/* Data de vencimento */}
      {task.dueDate && (
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Vence em {format(task.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Datas */}
      <div className="text-xs text-gray-400 mb-4 space-y-1">
        <div>Criado em {format(task.createdAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</div>
        <div>Atualizado em {format(task.updatedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</div>
      </div>

      {/* Ações */}
      <div className="flex flex-wrap gap-2">
        {onViewDetails && (
          <Button
            data-cy="task-view-details-button"
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(task)}
          >
            Ver Detalhes
          </Button>
        )}

        {onEdit && (
          <Button
            data-cy="task-edit-button"
            variant="secondary"
            size="sm"
            onClick={() => onEdit(task)}
          >
            Editar
          </Button>
        )}

        {/* Botões de mudança de status */}
        {task.status === 'pending' && (
          <Button
            data-cy="task-start-button"
            variant="primary"
            size="sm"
            onClick={() => handleStatusChange('in-progress')}
          >
            Iniciar
          </Button>
        )}

        {task.status === 'in-progress' && (
          <Button
            data-cy="task-complete-button"
            variant="primary"
            size="sm"
            onClick={() => handleStatusChange('completed')}
          >
            Concluir
          </Button>
        )}

        {onDelete && task.status !== 'completed' && (
          <Button
            data-cy="task-delete-button"
            variant="danger"
            size="sm"
            onClick={() => onDelete(task.id)}
          >
            Excluir
          </Button>
        )}
      </div>
    </div>
  );
}
