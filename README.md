# Task Manager

Aplicativo web de gerenciamento de tarefas desenvolvido com React, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

- **CRUD completo de tarefas** - Criar, visualizar, editar e excluir tarefas
- **Sistema de status** - Pendente, Em Progresso, Concluída, Cancelada
- **Prioridades** - Baixa, Média, Alta, Urgente
- **Datas de vencimento** - Controle de prazos com alertas de vencimento
- **Sistema de tags** - Organização por etiquetas personalizáveis
- **Busca e filtros** - Encontre tarefas rapidamente por diversos critérios
- **Ordenação** - Organize tarefas por data, prioridade, título, etc.
- **Dashboard** - Visão geral com estatísticas e tarefas recentes
- **Persistência local** - Dados salvos no navegador (LocalStorage)
- **Interface responsiva** - Funciona perfeitamente em desktop, tablet e mobile
- **SPA (Single Page Application)** - Navegação fluida sem recarregar a página

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca principal para construção da interface
- **TypeScript** - Tipagem estática para maior segurança e produtividade
- **React Router** - Roteamento para navegação SPA
- **Tailwind CSS** - Framework CSS utilitário para estilização
- **Vite** - Build tool moderno e rápido
- **date-fns** - Biblioteca para manipulação de datas
- **UUID** - Geração de identificadores únicos
- **clsx** - Utilitário para manipulação de classes CSS
- **Cypress** - Framework de testes end-to-end e de componentes

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de UI básicos (Button, Input, etc.)
│   ├── Layout.tsx      # Layout principal da aplicação
│   ├── TaskCard.tsx    # Card para exibição de tarefas
│   └── TaskForm.tsx    # Formulário de criação/edição
├── contexts/           # Context API para estado global
│   └── TaskContext.tsx
├── hooks/              # Hooks customizados
│   └── useTasks.ts
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx
│   ├── TaskList.tsx
│   ├── TaskDetail.tsx
│   └── TaskForm.tsx
├── types/              # Definições de tipos TypeScript
│   └── index.ts
├── utils/              # Utilitários diversos
├── App.tsx             # Componente raiz
├── AppRouter.tsx       # Configuração de rotas
├── main.tsx            # Ponto de entrada da aplicação
└── index.css           # Estilos globais
```

## 🚀 Como Executar

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd task-manager
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Abra no navegador**
   - Acesse `http://localhost:5173`

## 📱 Como Usar

### Criando uma Nova Tarefa
1. Clique em "Nova Tarefa" no header ou dashboard
2. Preencha o título e descrição
3. Selecione a prioridade
4. Defina uma data de vencimento (opcional)
5. Adicione tags separadas por vírgula (opcional)
6. Clique em "Criar"

### Gerenciando Tarefas
- **Visualizar**: Clique em "Ver Detalhes" em qualquer tarefa
- **Editar**: Clique em "Editar" na página de detalhes
- **Alterar Status**: Use os botões de ação rápida nos cards
- **Excluir**: Clique em "Excluir" e confirme a ação

### Busca e Filtros
- Use a barra de busca para encontrar tarefas por título, descrição ou tags
- Filtre por status e prioridade usando os selects
- Ordene as tarefas por diferentes critérios

## 🎨 Design System

### Cores de Status
- **Pendente**: Amarelo
- **Em Progresso**: Azul
- **Concluída**: Verde
- **Cancelada**: Vermelho

### Cores de Prioridade
- **Baixa**: Cinza
- **Média**: Amarelo
- **Alta**: Laranja
- **Urgente**: Vermelho

## 🧪 Testes

O projeto utiliza **Cypress** para testes end-to-end (E2E) e testes de componentes.

### Executando os Testes

#### Testes E2E (End-to-End)
```bash
# Abrir interface interativa do Cypress
npm run cypress:open

# Executar testes E2E em modo headless
npm run test:e2e
# ou
npm run cypress:run:e2e
```

#### Testes de Componentes
```bash
# Executar testes de componentes em modo headless
npm run test:component
# ou
npm run cypress:run:component
```

#### Executar Todos os Testes
```bash
# Executa todos os testes (E2E + Componentes)
npm run cypress:run
```

### Estrutura de Testes

```
cypress/
├── e2e/              # Testes end-to-end
├── component/        # Testes de componentes
├── fixtures/         # Dados de teste
├── support/          # Comandos e configurações customizadas
└── tsconfig.json     # Configuração TypeScript para Cypress
```

### Tipos de Testes

- **Testes E2E**: Testam o fluxo completo da aplicação, desde a navegação até as interações do usuário
- **Testes de Componentes**: Testam componentes isolados, verificando renderização, props e interações

## 🔧 Desenvolvimento

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter
- `npm run cypress:open` - Abre a interface do Cypress
- `npm run cypress:run` - Executa todos os testes em modo headless
- `npm run test:e2e` - Executa apenas testes E2E
- `npm run test:component` - Executa apenas testes de componentes

### Estrutura de Dados

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}
```
