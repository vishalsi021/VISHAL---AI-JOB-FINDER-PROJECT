import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { MainApplication } from './components/MainApplication';
import { LandingPage } from './components/LandingPage';

const App: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (isLoading) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
        </div>
    );
  }

  if (currentUser) {
    return <MainApplication />;
  }
  
  if (showAuth) {
    return <Auth onBackToLanding={() => setShowAuth(false)} />;
  }

  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
};

export default App;