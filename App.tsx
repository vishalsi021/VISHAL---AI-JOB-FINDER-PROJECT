import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { MainApplication } from './components/MainApplication';

const App: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
        </div>
    );
  }

  return currentUser ? <MainApplication /> : <Auth />;
};

export default App;