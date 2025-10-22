import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="flex justify-between items-center py-4">
      <div className="flex items-center space-x-3">
        <i className="fas fa-chart-pie text-3xl text-teal-400"></i>
        <h1 className="text-2xl font-bold tracking-tight">
          Vital Skill <span className="text-teal-400">Indicator</span>
        </h1>
      </div>
      <div className="flex items-center space-x-4">
         {currentUser && (
            <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                    Welcome, {currentUser.name.split(' ')[0]}
                </span>
                <button
                    onClick={logout}
                    className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm font-semibold flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg"
                    title="Logout"
                >
                    <i className="fas fa-sign-out-alt"></i>
                    <span className="hidden md:inline">Logout</span>
                </button>
            </div>
        )}
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
};