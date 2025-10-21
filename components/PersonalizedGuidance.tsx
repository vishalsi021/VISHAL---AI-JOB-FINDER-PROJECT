import React from 'react';
import { PersonalizedGuidanceResult } from '../types';

interface PersonalizedGuidanceProps {
    onGetGuidance: () => void;
    guidance: PersonalizedGuidanceResult | null;
    isLoading: boolean;
    error: string | null;
}

const GuidanceCard: React.FC<{ title: string; platform: string; reason: string; url: string; icon: string }> = ({ title, platform, reason, url, icon }) => (
    <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 h-full flex flex-col">
        <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
                <i className={`fas ${icon} text-xl text-teal-400`}></i>
                <div>
                    <h4 className="font-semibold text-white">{title}</h4>
                    <p className="text-xs text-gray-400">{platform}</p>
                </div>
            </div>
            <p className="text-sm text-gray-300 italic">"{reason}"</p>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors group mt-4 text-sm">
            Learn More
            <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
        </a>
    </div>
);

export const PersonalizedGuidance: React.FC<PersonalizedGuidanceProps> = ({ onGetGuidance, guidance, isLoading, error }) => {
    return (
        <div className="bg-gray-800/50 p-6 md:p-8 rounded-2xl border border-gray-700 mb-12 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400 flex items-center">
                <i className="fas fa-compass mr-3"></i>
                Personalized Guidance
            </h2>
            <p className="text-gray-400 mb-6 max-w-3xl">
                Based on your current skills, our AI can recommend the best online courses to level up and the most effective job platforms to target.
            </p>
            
            {!guidance && (
                 <button
                    onClick={onGetGuidance}
                    disabled={isLoading}
                    className="w-full md:w-auto bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-2.5 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "Get My Learning & Job Hunt Plan"}
                </button>
            )}

            {error && <p className="text-red-400 text-sm mt-4"><i className="fas fa-exclamation-circle mr-1"></i> {error}</p>}
            
            {guidance && (
                <div className="mt-6 animate-fade-in space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><i className="fas fa-graduation-cap mr-3 text-blue-400"></i>Recommended Courses</h3>
                             <div className="space-y-4">
                                {guidance.recommendedCourses.map(course => (
                                    <GuidanceCard 
                                        key={course.title}
                                        title={course.title}
                                        platform={course.platform}
                                        reason={course.reason}
                                        url={course.url}
                                        icon="fa-graduation-cap"
                                    />
                                ))}
                             </div>
                        </div>
                         <div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><i className="fas fa-briefcase mr-3 text-yellow-400"></i>Where to Apply</h3>
                             <div className="space-y-4">
                                {guidance.jobPlatforms.map(platform => (
                                     <GuidanceCard 
                                        key={platform.name}
                                        title={platform.name}
                                        platform="Job Platform / Community"
                                        reason={platform.reason}
                                        url={platform.url}
                                        icon="fa-briefcase"
                                    />
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};