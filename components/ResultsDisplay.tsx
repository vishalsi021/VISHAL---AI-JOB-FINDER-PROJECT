import React from 'react';
import { AnalysisResult } from '../types';
import { SkillCard } from './SkillCard';
import { CourseCard } from './CourseCard';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-12 animate-fade-in">
      <section className="bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Market Analysis for "{result.jobTitle}"
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{result.summary}</p>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <i className="fas fa-bolt text-yellow-400 mr-3"></i>
          Trending Skills
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.trendingSkills.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <i className="fas fa-graduation-cap text-blue-400 mr-3"></i>
          Recommended Courses
        </h3>
        <div className="space-y-6">
          {result.recommendedCourses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
};
