import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, CreateTaskData, UpdateTaskData } from '../types';
import { SelectOption } from './ui';
import { Button, Input, Select, Textarea } from './ui';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskData | UpdateTaskData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const priorityOptions: SelectOption[] = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' }
];

interface FormData {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  tags: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
}

export function TaskForm({ task, onSubmit, onCancel, isLoading = false }: TaskFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
        tags: task.tags ? task.tags.join(', ') : ''
      });
    }
  }, [task]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.dueDate = 'Data de vencimento não pode ser no passado';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      tags: tags.length > 0 ? tags : undefined
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpar erro do campo quando usuário começa a digitar
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {task ? 'Editar Tarefa' : 'Nova Tarefa'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <Input
          label="Título"
          value={formData.title}
          onChange={handleInputChange('title')}
          error={errors.title}
          placeholder="Digite o título da tarefa"
          disabled={isLoading}
        />

        {/* Descrição */}
        <Textarea
          label="Descrição"
          value={formData.description}
          onChange={handleInputChange('description')}
          error={errors.description}
          placeholder="Descreva a tarefa em detalhes"
          rows={4}
          disabled={isLoading}
        />

        {/* Prioridade */}
        <Select
          label="Prioridade"
          value={formData.priority}
          onChange={handleInputChange('priority')}
          options={priorityOptions}
          disabled={isLoading}
        />

        {/* Data de vencimento */}
        <Input
          label="Data de Vencimento"
          type="date"
          value={formData.dueDate}
          onChange={handleInputChange('dueDate')}
          error={errors.dueDate}
          disabled={isLoading}
        />

        {/* Tags */}
        <Input
          label="Tags"
          value={formData.tags}
          onChange={handleInputChange('tags')}
          placeholder="Separe as tags por vírgula (ex: trabalho, urgente, reunião)"
          helperText="Tags ajudam a organizar e filtrar suas tarefas"
          disabled={isLoading}
        />

        {/* Botões de ação */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : (task ? 'Atualizar' : 'Criar')}
          </Button>
        </div>
      </form>
    </div>
  );
}
