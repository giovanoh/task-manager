import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', dataCy: 'nav-dashboard', href: '/', current: location.pathname === '/' },
    { name: 'Todas as Tarefas', dataCy: 'nav-all-tasks', href: '/tasks', current: location.pathname === '/tasks' },
  ];

  return (
    <div data-cy="layout" className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo/Title */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
                Task Manager
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  data-cy={item.dataCy}
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Link to="/tasks/new" data-cy="nav-new-task">
                <Button variant="primary" size="sm">
                  Nova Tarefa
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <nav className="flex space-x-4 pb-4">
              {navigation.map((item) => (
                <Link
                  //data-cy={item.dataCy}
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
}
