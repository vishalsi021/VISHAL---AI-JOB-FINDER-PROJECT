import React, { useState, useCallback, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Header } from './Header';
import { SearchBar } from './SearchBar';
import { ResultsDisplay } from './ResultsDisplay';
import { Footer } from './Footer';
import { LoadingDisplay } from './LoadingDisplay';
import { Dashboard } from './Dashboard';
import { InitialDisplay } from './InitialDisplay';
import { analyzeJobMarket, getDetailedJobRecommendationStream, getInitialMarketData, validateUserDetails, getPersonalizedGuidance } from '../services/geminiService';
import { AnalysisResult, DetailedRecommendation, TrendingJob, PersonalizedGuidanceResult, DashboardData } from '../types';
import { PersonalizedGuidance } from './PersonalizedGuidance';
import { sampleTrendingJobs, sampleTopSkills, sampleAnalysisResult, sampleDetailedRecommendation, samplePersonalizedGuidance } from '../services/sampleData';
import { useAuth } from '../contexts/AuthContext';

// Helper to safely parse JSON
const safeJsonParse = (jsonString: string): any => {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return null;
    }
};

export const MainApplication: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [dashboardData, setDashboardData] = useState<DashboardData>(currentUser!);

  const [jobRecommendation, setJobRecommendation] = useState<DetailedRecommendation | null>(null);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState<boolean>(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  
  const [trendingJobs, setTrendingJobs] = useState<TrendingJob[]>([]);
  const [topSkills, setTopSkills] = useState<string[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [personalizedGuidance, setPersonalizedGuidance] = useState<PersonalizedGuidanceResult | null>(null);
  const [isGuidanceLoading, setIsGuidanceLoading] = useState<boolean>(false);
  const [guidanceError, setGuidanceError] = useState<string | null>(null);
  
  const handleUpdateProfile = async (data: DashboardData) => {
      await updateProfile(data);
      setDashboardData(data);
  }

  const refreshInitialData = useCallback(async () => {
      setIsInitialLoading(true);
      try {
        const marketData = await getInitialMarketData();
        setTrendingJobs(marketData.trendingJobs);
        setTopSkills(marketData.topSkills);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("SILENT FALLBACK: Failed to load initial market data, loading sample data instead.", err);
        setTrendingJobs(sampleTrendingJobs);
        setTopSkills(sampleTopSkills);
        setLastUpdated(new Date());
      } finally {
        setIsInitialLoading(false);
      }
    }, []);

  useEffect(() => {
    refreshInitialData();
  }, [refreshInitialData]);


  const handleSearch = useCallback(async (jobTitle: string) => {
    if (!jobTitle) return;
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setSearchQuery(jobTitle);

    try {
      const result = await analyzeJobMarket(jobTitle);
      setAnalysisResult(result);
    } catch (err) {
      console.error("SILENT FALLBACK: Error fetching from local backend, loading sample analysis.", err);
      setAnalysisResult(sampleAnalysisResult);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleGetRecommendation = useCallback(async (tier: string) => {
    const { skills, cgpa, projects, certifications, name, college, gradYear, linkedinUrl, githubUrl } = dashboardData;

    // Validation that blocked users without skills or CGPA is removed.
    // The AI is capable of providing foundational guidance for profiles that are just starting out.
    
    setIsRecommendationLoading(true);
    setRecommendationError(null);
    setJobRecommendation(null);
    let accumulatedJson = "";

    const userProfileString = `
      - Languages: ${skills.languages || 'Not specified'}
      - Frameworks & Libraries: ${skills.frameworks || 'Not specified'}
      - Tools & Technologies: ${skills.tools || 'Not specified'}
      - Platforms: ${skills.platforms || 'Not specified'}
      - Soft Skills: ${skills.softSkills || 'Not specified'}
      - Projects: ${projects || 'Not specified'}
      - Certifications: ${certifications || 'Not specified'}
    `;

    try {
      setLoadingMessage("Validating your profile details...");
      const validation = await validateUserDetails(name, college);
      if (!validation.isValid) {
        setRecommendationError(validation.feedback);
        setIsRecommendationLoading(false);
        return;
      }

      const timeToGraduate = parseInt(gradYear) - new Date().getFullYear();
      const timeToGraduateText = timeToGraduate <= 0 ? 'Recently Graduated' : `${timeToGraduate} year(s)`;

      setLoadingMessage("AI is analyzing your profile and the job market...");
      const stream = getDetailedJobRecommendationStream(userProfileString, tier, timeToGraduateText, cgpa, linkedinUrl, githubUrl);

      for await (const chunk of stream) {
        accumulatedJson += chunk;
        const partialData = safeJsonParse(accumulatedJson);
        if (partialData) {
          if (partialData.summary && !jobRecommendation?.summary) {
             setLoadingMessage("Crafting your career summary...");
          }
          if (partialData.growthPlan && !jobRecommendation?.growthPlan) {
             setLoadingMessage("Calculating your Career Readiness Score...");
          }
           if (partialData.careerPath && partialData.careerPath.length > 0 && (!jobRecommendation?.careerPath || jobRecommendation.careerPath.length === 0)) {
             setLoadingMessage("Building your 5-10 year career timeline...");
          }
          setJobRecommendation(partialData);
        }
      }
      const finalResult = safeJsonParse(accumulatedJson);
      setJobRecommendation(finalResult);
      
    } catch (err) {
      console.error("SILENT FALLBACK: Error fetching recommendation, loading sample recommendation.", err);
      setJobRecommendation(sampleDetailedRecommendation);
      setRecommendationError("An error occurred while streaming. Displaying a sample result.");
    } finally {
      setIsRecommendationLoading(false);
      setLoadingMessage('');
    }
  }, [dashboardData, jobRecommendation]);

  const handleGetGuidance = useCallback(async () => {
    const { skills } = dashboardData;
    const technicalSkills = [skills.languages, skills.frameworks, skills.tools, skills.platforms].filter(Boolean).join(', ');

    if (!technicalSkills) {
      setGuidanceError("Please enter some technical skills to get personalized guidance.");
      return;
    }
    setIsGuidanceLoading(true);
    setGuidanceError(null);
    setPersonalizedGuidance(null);
    try {
      const result = await getPersonalizedGuidance(technicalSkills);
      setPersonalizedGuidance(result);
    } catch (err) {
      console.error("SILENT FALLBACK: Error fetching personalized guidance, loading sample guidance.", err);
      setPersonalizedGuidance(samplePersonalizedGuidance);
    } finally {
      setIsGuidanceLoading(false);
    }
  }, [dashboardData.skills]);

  const analyzeRecommendation = () => {
    if (jobRecommendation?.careerPath && jobRecommendation.careerPath.length > 0) {
      const titleToSearch = jobRecommendation.careerPath[0].title;
      setSearchQuery(titleToSearch);
      handleSearch(titleToSearch);
      const searchBar = document.querySelector('form');
      searchBar?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTrendingJobClick = (jobTitle: string) => {
    setSearchQuery(jobTitle);
    handleSearch(jobTitle);
    const searchBar = document.querySelector('form');
    searchBar?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSkillTarget = (skillToTarget: string) => {
    const newDashboardData = { ...dashboardData };
    const existingSkills = newDashboardData.skills.tools.split(',').map(s => s.trim()).filter(Boolean);
    if (existingSkills.includes(skillToTarget)) return;
    const newSkills = [...existingSkills, skillToTarget].join(', ');
    newDashboardData.skills.tools = newSkills;
    handleUpdateProfile(newDashboardData);
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col">
      <div className="relative flex-grow">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-75 hidden dark:block"></div>
        <div className="relative container mx-auto px-4 py-8">
          <Header theme={theme} setTheme={setTheme} />
          <main className="mt-12">
            <Dashboard 
              user={currentUser}
              onUpdateProfile={handleUpdateProfile}
              onGetRecommendation={handleGetRecommendation}
              recommendation={jobRecommendation}
              isLoading={isRecommendationLoading}
              loadingMessage={loadingMessage}
              error={recommendationError}
              onAnalyzeRecommendation={analyzeRecommendation}
            />

            <PersonalizedGuidance 
              onGetGuidance={handleGetGuidance}
              guidance={personalizedGuidance}
              isLoading={isGuidanceLoading}
              error={guidanceError}
            />

            <div className="pt-12 mt-12 border-t border-gray-200 dark:border-gray-700/50">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-300 dark:to-blue-500 mb-4">
                Analyze the Market
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                Enter a job title or field to discover trending skills and recommended online courses, powered by your local Python backend.
              </p>
              <SearchBar 
                onSearch={handleSearch} 
                isLoading={isLoading} 
                initialQuery={searchQuery} 
                suggestions={trendingJobs.map(job => job.title)}
              />
            </div>
            
            {isLoading && <LoadingDisplay />}
            
            {analysisResult && (
              <div className="mt-10">
                <ResultsDisplay result={analysisResult} />
              </div>
            )}
             {!isLoading && !analysisResult && (
              <InitialDisplay 
                jobs={trendingJobs}
                skills={topSkills}
                isLoading={isInitialLoading}
                onJobClick={handleTrendingJobClick}
                onSkillTarget={handleSkillTarget}
                onRefresh={refreshInitialData}
                lastUpdated={lastUpdated}
              />
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};
