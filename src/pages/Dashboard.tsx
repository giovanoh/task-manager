import { Link } from 'react-router-dom';
import { useTaskContext } from '../contexts/TaskContext';
import { Button } from '../components/ui';

export function Dashboard() {
  const { getTaskStats, tasks } = useTaskContext();
  const stats = getTaskStats();

  const recentTasks = tasks
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  const upcomingTasks = tasks
    .filter(task => task.dueDate && task.dueDate > new Date() && task.status !== 'completed' && task.status !== 'cancelled')
    .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime())
    .slice(0, 5);

  const statsCards = [
    {
      name: 'Total de Tarefas',
      value: stats.total,
      color: 'bg-blue-500',
      href: '/tasks'
    },
    {
      name: 'Pendentes',
      value: stats.pending,
      color: 'bg-yellow-500',
      href: '/tasks?status=pending'
    },
    {
      name: 'Em Progresso',
      value: stats.inProgress,
      color: 'bg-blue-500',
      href: '/tasks?status=in-progress'
    },
    {
      name: 'Concluídas',
      value: stats.completed,
      color: 'bg-green-500',
      href: '/tasks?status=completed'
    },
    {
      name: 'Vencidas',
      value: stats.overdue,
      color: 'bg-red-500',
      href: '/tasks?overdue=true'
    }
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Visão geral das suas tarefas e produtividade
          </p>
        </div>
        <Link to="/tasks/new">
          <Button variant="primary">
            Nova Tarefa
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statsCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="block"
          >
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${stat.color} mr-3`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent and Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Tarefas Recentes</h2>
            <Link to="/tasks" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Ver todas
            </Link>
          </div>

          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="block p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {task.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Atualizado em {formatDate(task.updatedAt)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-3 ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      task.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status === 'completed' ? 'Concluída' :
                       task.status === 'in-progress' ? 'Em Progresso' :
                       task.status === 'cancelled' ? 'Cancelada' : 'Pendente'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhuma tarefa encontrada.</p>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Próximas Vencimentos</h2>
            <Link to="/tasks" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Ver todas
            </Link>
          </div>

          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="block p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {task.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Vence em {formatDate(task.dueDate!)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-3 ${
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
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhuma tarefa com vencimento próximo.</p>
          )}
        </div>
      </div>
    </div>
  );
}
