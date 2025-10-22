import React, { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';

interface AuthProps {
    onBackToLanding: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onBackToLanding }) => {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col items-center justify-center p-4 animate-fade-in-fast">
            <div className="relative w-full max-w-md">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg blur opacity-75"></div>
                <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                    <div className="text-center mb-8">
                        <div className="flex justify-center items-center space-x-3 mb-2">
                            <i className="fas fa-chart-pie text-4xl text-teal-400"></i>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Vital Skill <span className="text-teal-400">Indicator</span>
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">Your AI-Powered Career Co-pilot</p>
                    </div>

                    {isLoginView ? <Login /> : <Register />}

                    <div className="mt-6 text-center text-sm">
                        <button
                            onClick={() => setIsLoginView(!isLoginView)}
                            className="text-teal-500 dark:text-teal-400 hover:underline"
                        >
                            {isLoginView ? "Don't have an account? Register" : "Already have an account? Login"}
                        </button>
                    </div>
                     <div className="mt-4 text-center text-xs">
                        <button
                            onClick={onBackToLanding}
                            className="text-gray-500 dark:text-gray-400 hover:underline"
                        >
                            &larr; Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};