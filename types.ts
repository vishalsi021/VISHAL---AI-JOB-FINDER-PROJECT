
export interface Skill {
  name: string;
  description: string;
  relevance: number; // A score from 1 to 10
}

export interface Course {
  title: string;
  platform: string;
  url: string;
  description: string;
}

export interface AnalysisResult {
  jobTitle: string;
  summary: string;
  trendingSkills: Skill[];
  recommendedCourses: Course[];
}

export interface TrendingJob {
  title: string;
  salaryRange: string;
  growth: 'Hot' | 'Growing' | 'Stable';
  topIndustries: string[];
  keySkills: string[];
}

export interface TargetCompany {
  companyName: string;
  roles: string[];
  estimatedPackageLPA: string;
  requiredSkills: string[];
}

export interface CareerPathStep {
  title: string;
  duration: string;
  summary: string;
  skillsToMaster: string[];
  potentialSalary: string;
  targetCompanies?: TargetCompany[];
}

export interface LinkedInEnhancement {
  headlineSlogan: string;
  summaryKeywords: string[];
  recommendedCourses: {
    title: string;
    url: string;
  }[];
}

export interface GitHubEnhancement {
  projectIdeas: string[];
  profileTips: string[];
}

export interface ProfileAnalysis {
  strengths: string[];
  weaknesses: string[];
}

export interface GrowthPlanKPI {
  name: string;
  score: number;
  summary: string;
}

export interface GrowthPlanActionItem {
  description: string;
}

export interface GrowthPlan {
  readinessScore: number;
  kpis: GrowthPlanKPI[];
  actionItems: GrowthPlanActionItem[];
}

export interface DetailedRecommendation {
  summary: string;
  careerPath: CareerPathStep[];
  linkedinEnhancements?: LinkedInEnhancement;
  githubEnhancements?: GitHubEnhancement;
  linkedinAnalysis?: ProfileAnalysis;
  githubAnalysis?: ProfileAnalysis;
  growthPlan?: GrowthPlan;
}

export interface ValidationResult {
  isValid: boolean;
  feedback: string;
}

export interface PersonalizedCourse {
  title: string;
  platform: string;
  url: string;
  reason: string;
}

export interface JobPlatform {
  name: string;
  url: string;
  reason: string;
}

export interface PersonalizedGuidanceResult {
  recommendedCourses: PersonalizedCourse[];
  jobPlatforms: JobPlatform[];
}

export interface DashboardData {
  name: string;
  college: string;
  skills: {
    languages: string;
    frameworks: string;
    tools: string;
    platforms: string;
    softSkills: string;
  };
  projects: string;
  certifications: string;
  gradYear: string;
  cgpa: string;
  linkedinUrl: string;
  githubUrl: string;
}