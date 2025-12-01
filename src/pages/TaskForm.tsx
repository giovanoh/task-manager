import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskContext } from '../contexts/TaskContext';
import { TaskForm as TaskFormComponent } from '../components/TaskForm';
import { CreateTaskData, UpdateTaskData } from '../types';

export function TaskForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, createTask, updateTask } = useTaskContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const task = id ? getTaskById(id) : null;
  const isEditing = !!task;

  const handleSubmit = async (data: CreateTaskData | UpdateTaskData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && id) {
        const updatedTask = updateTask(id, data as UpdateTaskData);
        if (updatedTask) {
          navigate(`/tasks/${id}`);
        } else {
          alert('Erro ao atualizar tarefa');
        }
      } else {
        const newTask = createTask(data as CreateTaskData);
        navigate(`/tasks/${newTask.id}`);
      }
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      alert('Erro ao salvar tarefa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditing && id) {
      navigate(`/tasks/${id}`);
    } else {
      navigate('/tasks');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <TaskFormComponent
        task={task || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSubmitting}
      />
    </div>
  );
}
