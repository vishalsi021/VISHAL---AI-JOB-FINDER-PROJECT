import React from 'react';

interface LandingPageProps {
    onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col justify-center items-center p-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-75 hidden dark:block"></div>
            <div className="relative text-center z-10 animate-fade-in">
                <div className="flex justify-center items-center space-x-3 mb-4">
                    <i className="fas fa-chart-pie text-6xl text-teal-400"></i>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                  Vital Skill <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Indicator</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Your personal AI career co-pilot. Get a hyper-personalized career timeline, analyze the job market, and receive tailored guidance to land your dream job.
                </p>
                <button
                    onClick={onGetStarted}
                    className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                    Get Started
                </button>
            </div>
            <footer className="absolute bottom-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                <p>Powered by Google Gemini</p>
            </footer>
        </div>
    );
};