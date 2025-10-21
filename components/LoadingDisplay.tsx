import React from 'react';

interface LoadingDisplayProps {
  steps: string[];
  currentStep: number;
}

export const LoadingDisplay: React.FC<LoadingDisplayProps> = ({ steps, currentStep }) => {

  const getStepClass = (index: number) => {
    if (index < currentStep) {
      return 'text-green-400';
    }
    if (index === currentStep) {
      return 'text-teal-300 font-semibold';
    }
    return 'text-gray-500';
  };
  
  const getIcon = (index: number) => {
    if (index < currentStep) {
      return <i className="fas fa-check-circle text-green-400"></i>;
    }
    if (index === currentStep) {
      return <i className="fas fa-spinner fa-spin text-teal-300"></i>;
    }
    return <i className="far fa-clock text-gray-500"></i>;
  };

  return (
    <div className="my-12 max-w-xl mx-auto">
      <div className="bg-gray-800/50 p-6 md:p-8 rounded-2xl border border-gray-700">
        <h3 className="text-xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400">
          Simulating Backend Analysis...
        </h3>
        <div className="space-y-4">
          {steps.map((step, index) => (
             <div key={index} className={`flex items-center space-x-4 transition-all duration-300 ${getStepClass(index)}`}>
               <div className="w-5 text-center">{getIcon(index)}</div>
               <p className="text-sm">{step}</p>
             </div>
          ))}
        </div>
         <p className="text-xs text-gray-600 text-center mt-6">
            (This is a visual simulation of a Python backend process for project demonstration)
        </p>
      </div>
    </div>
  );
};
