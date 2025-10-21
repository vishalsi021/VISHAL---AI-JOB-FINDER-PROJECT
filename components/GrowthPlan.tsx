import React from 'react';
import { GrowthPlan as GrowthPlanType } from '../types';

interface GrowthPlanProps {
    plan: GrowthPlanType;
}

const KpiBar: React.FC<{ score: number }> = ({ score }) => {
    const width = `${score}%`;
    let colorClass = 'bg-red-500';
    if (score > 75) {
        colorClass = 'bg-green-500';
    } else if (score > 50) {
        colorClass = 'bg-teal-500';
    } else if (score > 25) {
        colorClass = 'bg-yellow-500';
    }

    return (
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className={`${colorClass} h-2.5 rounded-full transition-all duration-500 ease-out`} style={{ width }}></div>
        </div>
    );
};


export const GrowthPlan: React.FC<GrowthPlanProps> = ({ plan }) => {
    return (
        <div className="mb-8 p-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-lg border border-yellow-500 space-y-8 animate-fade-in">
            <h3 className="text-2xl font-bold text-white flex items-center">
                <i className="fas fa-rocket mr-3 text-yellow-400"></i>
                AI Performance Review & Growth Plan
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col items-center justify-center bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                    <p className="font-semibold text-gray-300 mb-2">Career Readiness Score</p>
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 36 36" style={{transform: 'rotate(-90deg)'}}>
                            <path className="text-gray-700"
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3" />
                            <path className="text-yellow-400"
                                strokeDasharray={`${plan.readinessScore}, 100`}
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white">{plan.readinessScore}</span>
                            <span className="text-lg text-gray-400 ml-1">/100</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-200">Performance Breakdown</h4>
                    {plan.kpis.map(kpi => (
                        <div key={kpi.name} className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-medium text-gray-300">{kpi.name}</p>
                                <p className="font-bold text-teal-300">{kpi.score}/100</p>
                            </div>
                            <KpiBar score={kpi.score} />
                            <p className="text-xs text-gray-400 mt-2 italic">"{kpi.summary}"</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                 <h4 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <i className="fas fa-tasks mr-2 text-blue-400"></i>
                    Your Actionable Growth Plan
                </h4>
                <div className="space-y-3">
                    {plan.actionItems.map((item, index) => (
                        <div key={index} className="flex items-start p-3 bg-gray-800/70 rounded-lg border border-transparent hover:border-blue-500 transition-colors">
                            <i className="fas fa-bullseye text-blue-400 mt-1 mr-4"></i>
                            <p className="text-gray-300 text-sm">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
