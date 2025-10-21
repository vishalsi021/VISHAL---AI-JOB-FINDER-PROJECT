
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center py-4">
      <div className="flex items-center space-x-3">
        <i className="fas fa-chart-pie text-3xl text-teal-400"></i>
        <h1 className="text-2xl font-bold tracking-tight">
          Vital Skill <span className="text-teal-400">Indicator</span>
        </h1>
      </div>
      <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
        <i className="fab fa-github text-2xl"></i>
      </a>
    </header>
  );
};