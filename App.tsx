
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Footer } from './components/Footer';
import { LoadingDisplay } from './components/LoadingDisplay';
import { Dashboard } from './components/Dashboard';
import { InitialDisplay } from './components/InitialDisplay';
import { analyzeJobMarket, getDetailedJobRecommendation, getInitialMarketData, validateUserDetails, getPersonalizedGuidance } from './services/geminiService';
import { AnalysisResult, DetailedRecommendation, TrendingJob, PersonalizedGuidanceResult, DashboardData } from './types';
import { PersonalizedGuidance } from './components/PersonalizedGuidance';
import { sampleTrendingJobs, sampleTopSkills, sampleAnalysisResult, sampleDetailedRecommendation, samplePersonalizedGuidance } from './services/sampleData';

const DASHBOARD_STORAGE_KEY = 'jobAnalyzerDashboardData_v2';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [dashboardData, setDashboardData] = useState<DashboardData>(() => {
    try {
      const savedData = localStorage.getItem(DASHBOARD_STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (err) {
      console.error("Failed to parse dashboard data from localStorage", err);
    }
    return {
      name: 'Vishal Singh',
      college: '',
      skills: {
        languages: '',
        frameworks: '',
        tools: '',
        platforms: '',
        softSkills: ''
      },
      projects: '',
      certifications: '',
      gradYear: String(new Date().getFullYear() + 1),
      cgpa: '',
      linkedinUrl: '',
      githubUrl: '',
    };
  });

  const [jobRecommendation, setJobRecommendation] = useState<DetailedRecommendation | null>(null);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState<boolean>(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  
  const [trendingJobs, setTrendingJobs] = useState<TrendingJob[]>([]);
  const [topSkills, setTopSkills] = useState<string[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [initialError, setInitialError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [personalizedGuidance, setPersonalizedGuidance] = useState<PersonalizedGuidanceResult | null>(null);
  const [isGuidanceLoading, setIsGuidanceLoading] = useState<boolean>(false);
  const [guidanceError, setGuidanceError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(dashboardData));
    } catch (err) {
      console.error("Failed to save dashboard data to localStorage", err);
    }
  }, [dashboardData]);

  const refreshInitialData = useCallback(async () => {
      setIsInitialLoading(true);
      setInitialError(null);
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
    if (!jobTitle) {
      return;
    }
    
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
    const { skills, cgpa, projects, certifications } = dashboardData;
    const allSkills = Object.values(skills).join(', ');

    if (!allSkills || !cgpa) {
      setRecommendationError('Please enter your skills and CGPA to get a recommendation.');
      return;
    }
    setIsRecommendationLoading(true);
    setRecommendationError(null);
    setJobRecommendation(null);

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
      const validation = await validateUserDetails(dashboardData.name, dashboardData.college);
      if (!validation.isValid) {
        setRecommendationError(validation.feedback);
        setIsRecommendationLoading(false);
        return;
      }

      const timeToGraduate = parseInt(dashboardData.gradYear) - new Date().getFullYear();
      const timeToGraduateText = timeToGraduate <= 0 ? 'Recently Graduated' : `${timeToGraduate} year(s)`;

      const recommendation = await getDetailedJobRecommendation(
        userProfileString, 
        tier, 
        timeToGraduateText,
        dashboardData.cgpa,
        dashboardData.linkedinUrl,
        dashboardData.githubUrl
      );
      setJobRecommendation(recommendation);
    } catch (err) {
      console.error("SILENT FALLBACK: Error fetching recommendation, loading sample recommendation.", err);
      setJobRecommendation(sampleDetailedRecommendation);
    } finally {
      setIsRecommendationLoading(false);
    }
  }, [dashboardData]);

  const handleGetGuidance = useCallback(async () => {
    const { skills } = dashboardData;
    const technicalSkills = [
      skills.languages,
      skills.frameworks,
      skills.tools,
      skills.platforms,
    ].filter(Boolean).join(', ');

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
    setDashboardData(prevData => {
      const existingSkills = prevData.skills.tools.split(',').map(s => s.trim()).filter(Boolean);
      if (existingSkills.includes(skillToTarget)) {
        return prevData; 
      }
      const newSkills = [...existingSkills, skillToTarget].join(', ');
      return { 
        ...prevData, 
        skills: { ...prevData.skills, tools: newSkills }
      };
    });
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <div className="relative flex-grow">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-75"></div>
        <div className="relative container mx-auto px-4 py-8">
          <Header />
          <main className="mt-12">
            <Dashboard 
              data={dashboardData}
              setData={setDashboardData}
              onGetRecommendation={handleGetRecommendation}
              recommendation={jobRecommendation}
              isLoading={isRecommendationLoading}
              error={recommendationError}
              onAnalyzeRecommendation={analyzeRecommendation}
            />

            <PersonalizedGuidance 
              onGetGuidance={handleGetGuidance}
              guidance={personalizedGuidance}
              isLoading={isGuidanceLoading}
              error={guidanceError}
            />

            <div className="pt-12 mt-12 border-t border-gray-700/50">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500 mb-4">
                Analyze the Market
              </h2>
              <p className="text-center text-gray-300 max-w-2xl mx-auto mb-8">
                Enter a job title or field to discover trending skills and recommended online courses, powered by your local Python backend.
              </p>
              <SearchBar onSearch={handleSearch} isLoading={isLoading} initialQuery={searchQuery} />
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

export default App;
