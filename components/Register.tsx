import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }
        try {
            await register(name, email, password);
        } catch (err: any) {
            setError(err.message || 'Failed to create an account.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">Create Account</h2>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
                <label htmlFor="name-register" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
                <input
                    type="text"
                    id="name-register"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 w-full px-4 py-2.5 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
            </div>
            <div>
                <label htmlFor="email-register" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Email Address</label>
                <input
                    type="email"
                    id="email-register"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 w-full px-4 py-2.5 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
            </div>
            <div>
                <label htmlFor="password-register" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Password</label>
                <input
                    type="password"
                    id="password-register"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 w-full px-4 py-2.5 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Register'}
            </button>
        </form>
    );
};