import React from 'react';

export const LoadingDisplay: React.FC = () => {
  return (
    <div className="my-12 max-w-xl mx-auto">
      <div className="bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        <h3 className="text-xl font-bold mt-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Analyzing Job Market...
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Contacting Python backend for scraping and NLP analysis. This may take a moment.
        </p>
      </div>
    </div>
  );
};
