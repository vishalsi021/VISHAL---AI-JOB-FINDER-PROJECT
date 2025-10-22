import React from 'react';
import { Course } from '../types';

const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
        case 'coursera':
            return 'fas fa-c';
        case 'udemy':
            return 'fas fa-u';
        case 'edx':
            return 'fas fa-e';
        default:
            return 'fas fa-school';
    }
};

export const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 flex flex-col md:flex-row items-start gap-6">
        <div className="text-3xl text-blue-400 bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className={getPlatformIcon(course.platform)}></i>
        </div>
        <div className="flex-grow">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{course.title}</h4>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{course.platform}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
            <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-semibold transition-colors group"
            >
                View Course
                <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
            </a>
        </div>
    </div>
  );
};