
import React from 'react';
import { Skill } from '../types';

interface SkillCardProps {
  skill: Skill;
}

const RelevanceBar: React.FC<{ relevance: number }> = ({ relevance }) => {
    const width = `${relevance * 10}%`;
    const color = relevance > 7 ? 'bg-teal-500' : relevance > 4 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
            <div className={`${color} h-2.5 rounded-full`} style={{ width }}></div>
        </div>
    );
};

export const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-teal-500 transition-all duration-300 h-full flex flex-col">
      <div className="flex-grow">
        <div className="flex justify-between items-start">
            <h4 className="text-lg font-semibold text-gray-100">{skill.name}</h4>
            <span className="text-sm font-bold text-teal-300 bg-teal-900/50 px-2 py-1 rounded-md">{skill.relevance}/10</span>
        </div>
        <p className="text-sm text-gray-400 mt-2">{skill.description}</p>
      </div>
      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-1">Relevance</p>
        <RelevanceBar relevance={skill.relevance} />
      </div>
    </div>
  );
};
