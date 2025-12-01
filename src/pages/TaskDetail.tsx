import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTaskContext } from '../contexts/TaskContext';
import { Button } from '../components/ui';
import { Task } from '../types';

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, updateTask, deleteTask } = useTaskContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const task = id ? getTaskById(id) : null;

  if (!task) {
    return (
      <div className="text-center py-12">
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
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.966-5.5-2.5M12 4.5C7.305 4.5 3.5 8.305 3.5 13s3.805 8.5 8.5 8.5 8.5-3.805 8.5-8.5-3.805-8.5-8.5-8.5z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Tarefa não encontrada</h3>
        <p className="mt-1 text-sm text-gray-500">
          A tarefa que você está procurando não existe ou foi removida.
        </p>
        <div className="mt-6">
          <Link to="/tasks">
            <Button variant="primary">
              Voltar para Tarefas
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    setIsUpdating(true);
    try {
      updateTask(taskId, { status });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status da tarefa');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.')) {
      try {
        const success = deleteTask(task.id);
        if (success) {
          navigate('/tasks');
        } else {
          alert('Erro ao excluir tarefa');
        }
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        alert('Erro ao excluir tarefa');
      }
    }
  };

  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== 'completed' && task.status !== 'cancelled';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Detalhes da Tarefa</h1>
          <p className="mt-2 text-gray-600">
            Informações completas sobre a tarefa
          </p>
        </div>
        <div className="flex space-x-3">
          <Link to={`/tasks/${task.id}/edit`}>
            <Button variant="secondary">
              Editar
            </Button>
          </Link>
          <Button
            variant="danger"
            onClick={handleDelete}
          >
            Excluir
          </Button>
          <Link to="/tasks">
            <Button variant="outline">
              Voltar
            </Button>
          </Link>
        </div>
      </div>

      {/* Task Detail Card */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="space-y-6">
          {/* Title and Status */}
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                task.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {task.status === 'completed' ? 'Concluída' :
                 task.status === 'in-progress' ? 'Em Progresso' :
                 task.status === 'cancelled' ? 'Cancelada' : 'Pendente'}
              </span>

              {isOverdue && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Vencida
                </span>
              )}
            </div>
          </div>

          {/* Priority */}
          <div>
            <span className="text-sm font-medium text-gray-500">Prioridade: </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
              task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
              task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {task.priority === 'urgent' ? 'Urgente' :
               task.priority === 'high' ? 'Alta' :
               task.priority === 'medium' ? 'Média' : 'Baixa'}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Descrição</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Data de Vencimento</h3>
              <p className={`text-gray-600 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                {format(task.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
                {isOverdue && ' (Vencida)'}
              </p>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Técnicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Criada em:</span>
                <br />
                {format(task.createdAt, 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
              </div>
              <div>
                <span className="font-medium">Última atualização:</span>
                <br />
                {format(task.updatedAt, 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
              </div>
            </div>
          </div>

          {/* Actions */}
          {task.status !== 'completed' && task.status !== 'cancelled' && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="flex flex-wrap gap-3">
                {task.status === 'pending' && (
                  <Button
                    variant="primary"
                    onClick={() => handleStatusChange(task.id, 'in-progress')}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Atualizando...' : 'Iniciar Tarefa'}
                  </Button>
                )}

                {task.status === 'in-progress' && (
                  <Button
                    variant="primary"
                    onClick={() => handleStatusChange(task.id, 'completed')}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Atualizando...' : 'Marcar como Concluída'}
                  </Button>
                )}

                <Button
                  variant="danger"
                  onClick={() => handleStatusChange(task.id, 'cancelled')}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Atualizando...' : 'Cancelar Tarefa'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
