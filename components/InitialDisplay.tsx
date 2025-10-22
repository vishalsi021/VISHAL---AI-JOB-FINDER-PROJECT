import React from 'react';
import { TrendingJob } from '../types';

interface InitialDisplayProps {
    jobs: TrendingJob[];
    skills: string[];
    isLoading: boolean;
    onJobClick: (job: string) => void;
    onSkillTarget: (skill: string) => void;
    onRefresh: () => void;
    lastUpdated: Date | null;
}

const getIndustryIcon = (industry: string) => {
    const lowerIndustry = industry.toLowerCase();
    if (lowerIndustry.includes('fintech') || lowerIndustry.includes('finance')) return 'fa-university';
    if (lowerIndustry.includes('health')) return 'fa-heartbeat';
    if (lowerIndustry.includes('saas') || lowerIndustry.includes('software')) return 'fa-cogs';
    if (lowerIndustry.includes('e-commerce') || lowerIndustry.includes('retail')) return 'fa-shopping-cart';
    if (lowerIndustry.includes('data') || lowerIndustry.includes('analytics')) return 'fa-chart-bar';
    if (lowerIndustry.includes('cloud')) return 'fa-cloud';
    return 'fa-industry';
};

const GrowthBadge: React.FC<{ growth: 'Hot' | 'Growing' | 'Stable' }> = ({ growth }) => {
    const styles = {
        Hot: { icon: 'fa-fire', color: 'text-red-500 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/50' },
        Growing: { icon: 'fa-chart-line', color: 'text-green-500 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/50' },
        Stable: { icon: 'fa-check-circle', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/50' }
    };
    const style = styles[growth] || styles.Stable;
    return (
        <span className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.color}`}>
            <i className={`fas ${style.icon} mr-1.5`}></i>
            {growth}
        </span>
    );
};

export const InitialDisplay: React.FC<InitialDisplayProps> = ({ jobs, skills, isLoading, onJobClick, onSkillTarget, onRefresh, lastUpdated }) => {

    if (isLoading && !lastUpdated) { // Only show full-page loader on first load
        return (
            <div className="flex flex-col items-center justify-center my-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Fetching latest market trends...</p>
            </div>
        );
    }

    return (
        <div className="mt-12 animate-fade-in max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg flex items-center text-teal-600 dark:text-teal-300">
                            <i className="fas fa-chart-line mr-3"></i>
                            Trending Job Roles
                        </h3>
                         <div className="flex items-center gap-3">
                            {lastUpdated && (
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                    {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                            <button
                                onClick={onRefresh}
                                disabled={isLoading}
                                className="text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Refresh Trends"
                            >
                                <i className={`fas fa-sync ${isLoading ? 'fa-spin' : ''}`}></i>
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {jobs.map(job => (
                           <button
                             key={job.title}
                             onClick={() => onJobClick(job.title)}
                             className="text-left p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:border-teal-500 dark:hover:border-teal-600 border border-gray-200 dark:border-gray-700 transition-all duration-300 group space-y-3"
                           >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-300">{job.title}</p>
                                    <p className="text-sm text-yellow-600 dark:text-yellow-300/80 font-semibold">{job.salaryRange}</p>
                                </div>
                                <GrowthBadge growth={job.growth} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Top Industries:</p>
                                <div className="flex flex-wrap gap-x-3 gap-y-1">
                                    {job.topIndustries.map(industry => (
                                        <div key={industry} className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                                            <i className={`fas ${getIndustryIcon(industry)} mr-1.5 w-4 text-center text-gray-500 dark:text-gray-400`}></i>{industry}
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Key Skills:</p>
                                <div className="flex flex-wrap gap-1">
                                    {job.keySkills.map(skill => (
                                        <span key={skill} className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-md text-xs font-medium">{skill}</span>
                                    ))}
                                </div>
                            </div>
                           </button> 
                        ))}
                    </div>
                </div>
                 <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-lg mb-4 flex items-center text-yellow-600 dark:text-yellow-300">
                        <i className="fas fa-star mr-3"></i>
                        Top In-Demand Skills
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {skills.map(skill => (
                           <div key={skill} className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium overflow-hidden">
                               <span className="text-gray-800 dark:text-gray-200 pl-3 pr-2 py-1.5">{skill}</span>
                               <button
                                   onClick={() => onSkillTarget(skill)}
                                   className="text-yellow-600 dark:text-yellow-400 hover:text-black dark:hover:text-black bg-gray-300 dark:bg-gray-600 hover:bg-yellow-400 dark:hover:bg-yellow-400 font-semibold px-2.5 py-1.5 h-full transition-colors duration-200"
                                   title={`Target '${skill}'`}
                               >
                                   Target
                               </button>
                           </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};