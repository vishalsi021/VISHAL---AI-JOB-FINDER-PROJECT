import React, { useState } from 'react';
import { DashboardData, User } from '../types';
import { DetailedRecommendation, LinkedInEnhancement, GitHubEnhancement, TargetCompany, ProfileAnalysis } from '../types';
import { GrowthPlan } from './GrowthPlan';

interface DashboardProps {
    user: User;
    onUpdateProfile: (data: DashboardData) => Promise<void>;
    onGetRecommendation: (tier: string) => void;
    recommendation: DetailedRecommendation | null;
    isLoading: boolean;
    error: string | null;
    onAnalyzeRecommendation: () => void;
}

const FormInput: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; placeholder: string; icon?: string; }> = ({ label, name, value, onChange, placeholder, icon }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{label}</label>
        <div className="relative">
            {icon && <i className={`fab ${icon} absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400`}></i>}
            <input
                type="text"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full ${icon ? 'pl-9' : 'pl-4'} pr-4 py-2.5 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500`}
            />
        </div>
    </div>
);


const FormTextarea: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder: string; rows?: number; }> = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
    <div className="md:col-span-2">
        <label htmlFor={name} className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-2.5 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 resize-y"
        />
    </div>
);

const FormSelect: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; className?: string }> = ({ label, name, value, onChange, children, className }) => (
     <div className={className}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2.5 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-300"
        >
            {children}
        </select>
    </div>
)

const LinkedInEnhancementPlan: React.FC<{ enhancements: LinkedInEnhancement }> = ({ enhancements }) => (
    <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-300 dark:border-blue-700 space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center"><i className="fab fa-linkedin mr-3 text-blue-400"></i>Your LinkedIn Enhancement Plan</h3>
        <div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Headline Slogan:</p>
            <p className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-blue-600 dark:text-blue-300 italic">"{enhancements.headlineSlogan}"</p>
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Summary Keywords:</p>
            <div className="flex flex-wrap gap-2">
                {enhancements.summaryKeywords.map(keyword => (
                    <span key={keyword} className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-medium">{keyword}</span>
                ))}
            </div>
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Recommended LinkedIn Learning:</p>
            <ul className="space-y-2">
                {enhancements.recommendedCourses.map(course => (
                    <li key={course.title}>
                        <a href={course.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm group">
                            {course.title} <i className="fas fa-external-link-alt ml-1 text-xs transform group-hover:scale-110 inline-block"></i>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const GitHubEnhancementPlan: React.FC<{ enhancements: GitHubEnhancement }> = ({ enhancements }) => (
    <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-900/20 rounded-lg border border-gray-300 dark:border-gray-600 space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center"><i className="fab fa-github mr-3 text-gray-500 dark:text-gray-300"></i>Your GitHub Enhancement Plan</h3>
        <div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Portfolio Project Ideas:</p>
            <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300 text-sm">
                {enhancements.projectIdeas.map(idea => (
                    <li key={idea}>{idea}</li>
                ))}
            </ul>
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Profile Improvement Tips:</p>
            <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300 text-sm">
                {enhancements.profileTips.map(tip => (
                    <li key={tip}>{tip}</li>
                ))}
            </ul>
        </div>
    </div>
);

const ProfileAnalysisCard: React.FC<{ title: string; icon: string; analysis: ProfileAnalysis; iconColor: string }> = ({ title, icon, analysis, iconColor }) => (
    <div className="mt-8 p-6 bg-white/50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className={`text-xl font-bold text-gray-900 dark:text-white flex items-center`}><i className={`fab ${icon} mr-3 ${iconColor}`}></i>{title} Profile Analysis</h3>
        <div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center"><i className="fas fa-check-circle mr-2"></i>Strengths</p>
            <ul className="space-y-1.5 list-disc list-inside text-gray-600 dark:text-gray-300 text-sm">
                {analysis.strengths.map(strength => (
                    <li key={strength}>{strength}</li>
                ))}
            </ul>
        </div>
        <div className="mt-4">
            <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-2 flex items-center"><i className="fas fa-exclamation-triangle mr-2"></i>Areas for Improvement</p>
            <ul className="space-y-1.5 list-disc list-inside text-gray-600 dark:text-gray-300 text-sm">
                {analysis.weaknesses.map(weakness => (
                    <li key={weakness}>{weakness}</li>
                ))}
            </ul>
        </div>
    </div>
);

const CompanyTargetCard: React.FC<{ company: TargetCompany }> = ({ company }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 transition-all duration-300 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg dark:hover:shadow-teal-900/50">
        <div className="flex justify-between items-start">
            <h5 className="font-bold text-xl text-gray-900 dark:text-white">{company.companyName}</h5>
            <p className="font-semibold text-yellow-600 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1 rounded-full text-sm flex-shrink-0">{company.estimatedPackageLPA}</p>
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center"><i className="fas fa-bullseye mr-2 text-teal-500 dark:text-teal-400"></i>Target Roles</p>
            <div className="flex flex-wrap gap-2">
                {company.roles.map(role => (
                    <span key={role} className="bg-teal-100 dark:bg-teal-900/80 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-xs font-medium">{role}</span>
                ))}
            </div>
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center"><i className="fas fa-cogs mr-2 text-blue-500 dark:text-blue-400"></i>Key Skills Required</p>
             <div className="flex flex-wrap gap-2">
                {company.requiredSkills.map(skill => (
                    <span key={skill} className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-medium">{skill}</span>
                ))}
            </div>
        </div>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ user, onUpdateProfile, onGetRecommendation, recommendation, isLoading, error, onAnalyzeRecommendation }) => {
    const [tier, setTier] = useState<string>("Tier 1: Top National");
    const [isSaving, setIsSaving] = useState(false);
    const [profileData, setProfileData] = useState<DashboardData>(user);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [name]: value
            }
        }));
    };
    
    const handleSaveProfile = async () => {
        setIsSaving(true);
        await onUpdateProfile(profileData);
        setIsSaving(false);
    };

    const currentYear = new Date().getFullYear();
    const gradYears = Array.from({ length: 10 }, (_, i) => currentYear + i);
    
    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 mb-12 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 flex items-center">
                        <i className="fas fa-user-circle mr-3"></i>
                        My Professional Profile
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Provide detailed information for a hyper-personalized AI analysis.</p>
                </div>
                <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                    {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <FormInput label="Full Name" name="name" value={profileData.name} onChange={handleInputChange} placeholder="Your full name" />
                <FormInput label="College Name" name="college" value={profileData.college} onChange={handleInputChange} placeholder="e.g., University of Technology" />
                <FormSelect label="Expected Graduation Year" name="gradYear" value={profileData.gradYear} onChange={handleInputChange}>
                    {gradYears.map(year => <option key={year} value={year}>{year}</option>)}
                </FormSelect>
                <FormInput label="Current CGPA (out of 10 or 4)" name="cgpa" value={profileData.cgpa} onChange={handleInputChange} placeholder="e.g., 8.5 or 3.7" />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700/50 my-6"></div>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Skills & Expertise</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                <FormInput label="Languages" name="languages" value={profileData.skills.languages} onChange={handleSkillInputChange} placeholder="e.g., Python, JavaScript, Java" />
                <FormInput label="Frameworks & Libraries" name="frameworks" value={profileData.skills.frameworks} onChange={handleSkillInputChange} placeholder="e.g., React, Node.js, Django" />
                <FormInput label="Tools & Technologies" name="tools" value={profileData.skills.tools} onChange={handleSkillInputChange} placeholder="e.g., Docker, Git, Jenkins" />
                <FormInput label="Platforms" name="platforms" value={profileData.skills.platforms} onChange={handleSkillInputChange} placeholder="e.g., AWS, Google Cloud, Azure" />
                <div className="lg:col-span-2">
                 <FormInput label="Soft Skills" name="softSkills" value={profileData.skills.softSkills} onChange={handleSkillInputChange} placeholder="e.g., Communication, Teamwork, Problem-solving" />
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <FormTextarea label="Projects" name="projects" value={profileData.projects} onChange={handleInputChange} placeholder="Describe 1-2 key projects. Mention the tech stack and your role." rows={4}/>
                <FormTextarea label="Certifications" name="certifications" value={profileData.certifications} onChange={handleInputChange} placeholder="List any relevant certifications. e.g., 'AWS Certified Cloud Practitioner'" rows={4} />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700/50 my-6"></div>
            
             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Professional Presence (Optional)</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
                <FormInput label="LinkedIn Profile URL" name="linkedinUrl" value={profileData.linkedinUrl} onChange={handleInputChange} placeholder="https://linkedin.com/in/yourprofile" icon="fa-linkedin" />
                <FormInput label="GitHub Profile URL" name="githubUrl" value={profileData.githubUrl} onChange={handleInputChange} placeholder="https://github.com/yourusername" icon="fa-github" />
            </div>
            
            <div className="bg-white/50 dark:bg-gray-900/40 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">AI Career Strategist</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <FormSelect label="College Tier" name="tier" value={tier} onChange={(e) => setTier(e.target.value)} className="md:col-span-2">
                        <option>Tier 1: Top National</option>
                        <option>Tier 2: State/Regional</option>
                        <option>Tier 3: Other</option>
                    </FormSelect>
                    <button
                        onClick={() => onGetRecommendation(tier)}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed h-[46px]"
                    >
                        {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "Generate My Career Path"}
                    </button>
                </div>
                {error && !isLoading && <p className="text-red-500 dark:text-red-400 text-sm mt-3"><i className="fas fa-exclamation-circle mr-1"></i>{error}</p>}
                
                {recommendation && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-900/50 rounded-lg border border-teal-300 dark:border-teal-700 animate-fade-in">
                        
                        {recommendation.growthPlan && (
                            <GrowthPlan plan={recommendation.growthPlan} />
                        )}

                        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 my-6">
                            <p className="text-sm text-teal-600 dark:text-teal-300 font-semibold">AI Recommended Career Path (India Focus)</p>
                            <p className="text-gray-700 dark:text-gray-300 mt-2 italic">"{recommendation.summary}"</p>
                        </div>
                        
                        <div className="mt-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
                                <i className="fas fa-road mr-3 text-blue-400"></i>
                                Your 5-10 Year Career Timeline
                            </h3>
                            <div className="relative border-l-2 border-teal-400 dark:border-teal-700 pl-8 space-y-12 py-2">
                                 {recommendation.careerPath.map((step, index) => (
                                     <div key={index} className="relative">
                                        <div className="absolute -left-[42px] top-1 w-6 h-6 bg-teal-500 dark:bg-teal-400 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center font-bold text-white dark:text-gray-900 text-xs">
                                          {index + 1}
                                        </div>
                                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{step.duration}</p>
                                        <h4 className="text-xl font-bold text-teal-600 dark:text-teal-300">{step.title}</h4>
                                        <p className="text-md font-bold text-yellow-600 dark:text-yellow-400 mb-2">{step.potentialSalary}</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{step.summary}</p>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Skills to Master:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {step.skillsToMaster.map(skill => (
                                                    <span key={skill} className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-medium">{skill}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {index === 0 && step.targetCompanies && step.targetCompanies.length > 0 && (
                                            <div className="mt-6">
                                                <h5 className="text-md font-bold text-gray-800 dark:text-gray-100 mb-3">Top Companies to Target for Your First Role:</h5>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                    {step.targetCompanies.map(company => (
                                                        <CompanyTargetCard key={company.companyName} company={company} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                     </div>
                                 ))}
                            </div>
                        </div>
                        
                        {recommendation.linkedinAnalysis && (
                           <ProfileAnalysisCard title="LinkedIn" icon="fa-linkedin" analysis={recommendation.linkedinAnalysis} iconColor="text-blue-400"/>
                        )}

                        {recommendation.githubAnalysis && (
                           <ProfileAnalysisCard title="GitHub" icon="fa-github" analysis={recommendation.githubAnalysis} iconColor="text-gray-500 dark:text-gray-300"/>
                        )}

                        {recommendation.linkedinEnhancements && (
                           <LinkedInEnhancementPlan enhancements={recommendation.linkedinEnhancements} />
                        )}

                        {recommendation.githubEnhancements && (
                           <GitHubEnhancementPlan enhancements={recommendation.githubEnhancements} />
                        )}

                        {recommendation.careerPath && recommendation.careerPath.length > 0 && (
                             <button
                                onClick={onAnalyzeRecommendation}
                                className="mt-8 w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center group"
                            >
                               Deep Dive & Analyze Starting Role: {recommendation.careerPath[0].title}
                               <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                            </button>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};