
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, DetailedRecommendation, ValidationResult, InitialMarketData, PersonalizedGuidanceResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set for Gemini features.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * This function now calls the local Python backend to perform web scraping and analysis.
 * It's a real fetch request to a server you will run on your machine.
 */
export const analyzeJobMarket = async (jobTitle: string): Promise<AnalysisResult> => {
  const backendUrl = 'http://127.0.0.1:5000/analyze'; // Standard local Flask server address

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ job_title: jobTitle }),
    });

    if (!response.ok) {
      // Try to get a more specific error from the backend response
      const errorData = await response.json().catch(() => ({ error: 'An unknown backend error occurred.' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result: AnalysisResult = await response.json();
    return result;

  } catch (error) {
    console.error("Error fetching from local backend:", error);
    throw new Error("Could not connect to the local Python server.");
  }
};


const recommendationSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A high-level summary of the entire recommended career path."
        },
        careerPath: {
            type: Type.ARRAY,
            description: "A chronological, multi-step career timeline for the next 5-10 years.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The job title for this career stage." },
                    duration: { type: Type.STRING, description: "The typical duration of this stage (e.g., 'Years 0-2')." },
                    summary: { type: Type.STRING, description: "Key goals and responsibilities during this stage." },
                    skillsToMaster: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Key skills to acquire or master in this stage."
                    },
                    potentialSalary: { type: Type.STRING, description: "The estimated salary range for this role/stage in Indian Rupees (LPA)." },
                    targetCompanies: {
                        type: Type.ARRAY,
                        description: "For the first career step ONLY, a list of top companies in India hiring for this role.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                companyName: { type: Type.STRING },
                                roles: { type: Type.ARRAY, items: { type: Type.STRING } },
                                estimatedPackageLPA: { type: Type.STRING, description: "Salary in format '₹X-Y LPA'" },
                                requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } }
                            },
                            required: ["companyName", "roles", "estimatedPackageLPA", "requiredSkills"]
                        }
                    }
                },
                required: ["title", "duration", "summary", "skillsToMaster", "potentialSalary"]
            }
        },
        linkedinEnhancements: {
            type: Type.OBJECT,
            properties: {
                headlineSlogan: { type: Type.STRING, description: "A powerful, keyword-rich headline slogan for the LinkedIn profile." },
                summaryKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of essential keywords to include in the profile summary."
                },
                recommendedCourses: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            url: { type: Type.STRING }
                        },
                        required: ["title", "url"]
                    },
                    description: "A list of relevant LinkedIn Learning courses."
                }
            },
            required: ["headlineSlogan", "summaryKeywords", "recommendedCourses"]
        },
        githubEnhancements: {
            type: Type.OBJECT,
            properties: {
                projectIdeas: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of project ideas to showcase skills for the recommended career path."
                },
                profileTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Actionable tips for improving the GitHub profile README, pinned repositories, etc."
                }
            },
            required: ["projectIdeas", "profileTips"]
        },
        linkedinAnalysis: {
            type: Type.OBJECT,
            properties: {
                strengths: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of key strengths observed from the LinkedIn profile in relation to the career path."
                },
                weaknesses: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of key areas for improvement on the LinkedIn profile."
                }
            },
            required: ["strengths", "weaknesses"]
        },
        githubAnalysis: {
            type: Type.OBJECT,
            properties: {
                strengths: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of key strengths observed from the GitHub profile (e.g., good project variety, clean code)."
                },
                weaknesses: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of key areas for improvement on the GitHub profile (e.g., needs more documentation, inactive)."
                }
            },
            required: ["strengths", "weaknesses"]
        },
        growthPlan: {
            type: Type.OBJECT,
            description: "An AI-generated performance review and growth plan.",
            properties: {
                readinessScore: {
                    type: Type.INTEGER,
                    description: "An overall score from 0-100 indicating the user's readiness for their recommended career path."
                },
                kpis: {
                    type: Type.ARRAY,
                    description: "A breakdown of the readiness score into key performance indicators.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "The name of the KPI (e.g., 'Technical Skill Alignment')." },
                            score: { type: Type.INTEGER, description: "The score for this KPI from 0-100." },
                            summary: { type: Type.STRING, description: "A brief analysis of the user's performance in this area." }
                        },
                        required: ["name", "score", "summary"]
                    }
                },
                actionItems: {
                    type: Type.ARRAY,
                    description: "A checklist of concrete, actionable next steps for the user to improve.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: { type: Type.STRING, description: "A single, actionable task." }
                        },
                        required: ["description"]
                    }
                }
            },
            required: ["readinessScore", "kpis", "actionItems"]
        }
    },
    required: ["summary", "careerPath"]
};

const getPromptForRecommendation = (
  userProfile: string,
  collegeTier: string,
  timeToGraduate: string,
  cgpa: string,
  linkedinUrl?: string,
  githubUrl?: string,
): string => `
    Act as an elite career strategist, performance review coach, and industry insider with deep expertise in the **Indian job market**. 
    Your response MUST be a comprehensive, actionable, multi-year career plan based on a rich, structured user profile.

    **CRITICAL INSTRUCTIONS:**
    1.  **INDIAN CONTEXT:** All recommendations must be relevant to the Indian job market.
    2.  **CURRENCY & SALARY FORMAT:** All salary figures MUST be in **Indian Rupees (₹)** and use the **Lakhs Per Annum (LPA)** format (e.g., '₹8-12 LPA').
    3.  **DEEP ANALYSIS:** Leverage all the detailed information provided in the user's profile for a hyper-personalized analysis.

    **Student's Comprehensive Profile:**
    ${userProfile}
    - College Tier: ${collegeTier}
    - Time until graduation: ${timeToGraduate}
    - Current CGPA: ${cgpa}
    - LinkedIn Profile: ${linkedinUrl || 'Not provided'}
    - GitHub Profile: ${githubUrl || 'Not provided'}

    Based on this **ENTIRE DETAILED PROFILE**, generate the following, adhering strictly to the JSON schema:

    1.  **Career Timeline (5-10 years)**: Create a detailed, step-by-step career progression.
        -   For **THE VERY FIRST STEP** of the timeline, you MUST provide a detailed analysis of **3-4 top companies that hire for this role in India** (e.g., TCS, Infosys, Amazon, Microsoft, etc.). For each company, specify:
            -   The company's name.
            -   The exact entry-level roles to target.
            -   The specific skills required for those roles at that company (cross-reference with the user's skills).
            -   An estimated salary package in LPA format.
        -   For ALL subsequent steps, provide the job title, duration, summary, skills to master, and potential salary in LPA. Omit 'targetCompanies'.

    2.  **Overall Summary**: A brief, high-level summary of the entire career path.
    
    3.  **LinkedIn Analysis & Enhancement (Only if LinkedIn URL is provided)**:
        -   Perform a **Strength & Weakness Analysis** based on the user's projects, skills, and certifications.
        -   Provide a **LinkedIn Enhancement Plan**.

    4.  **GitHub Analysis & Enhancement (Only if GitHub URL is provided)**:
        -   Perform a **Strength & Weakness Analysis** of their profile and projects.
        -   Provide a **GitHub Enhancement Plan** with project ideas that fill gaps identified in their profile.
        
    5.  **AI Performance Review & Growth Plan**:
        - Analyze the user's **complete profile** (skills, projects, certifications) against their recommended career path.
        - Generate a **"Career Readiness Score"** (0-100).
        - Break this score down into 3-4 **Key Performance Indicators (KPIs)**, like 'Technical Skill Alignment', 'Project Experience Quality', and 'Professional Branding'. Provide a score and a brief, personalized summary for each KPI.
        - Formulate a concrete **"Growth Plan"** with a checklist of 3-5 actionable next steps (e.g., "Your projects lack a deployed frontend; build a small React app and host it on Vercel.").

    Your entire output MUST be a single JSON object that strictly validates against the provided schema.
  `;


export const getDetailedJobRecommendation = async (
  userProfile: string,
  collegeTier: string,
  timeToGraduate: string,
  cgpa: string,
  linkedinUrl?: string,
  githubUrl?: string,
): Promise<DetailedRecommendation> => {
  const prompt = getPromptForRecommendation(userProfile, collegeTier, timeToGraduate, cgpa, linkedinUrl, githubUrl);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: recommendationSchema,
        temperature: 0.5,
      }
    });

    const jsonText = response.text.trim();
    const result: DetailedRecommendation = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error calling Gemini API for job recommendation:", error);
    throw new Error("Failed to get job recommendation from AI service.");
  }
};

export async function* getDetailedJobRecommendationStream(
  userProfile: string,
  collegeTier: string,
  timeToGraduate: string,
  cgpa: string,
  linkedinUrl?: string,
  githubUrl?: string,
): AsyncGenerator<string> {
  const prompt = getPromptForRecommendation(userProfile, collegeTier, timeToGraduate, cgpa, linkedinUrl, githubUrl);

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: recommendationSchema,
        temperature: 0.5,
      }
    });

    for await (const chunk of response) {
      yield chunk.text;
    }

  } catch (error) {
    console.error("Error calling Gemini API for streaming job recommendation:", error);
    throw new Error("Failed to get streaming job recommendation from AI service.");
  }
}

const initialMarketDataSchema = {
    type: Type.OBJECT,
    properties: {
        trendingJobs: {
            type: Type.ARRAY,
            description: "A list of 6-8 trending job objects for the Indian market.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The job title." },
                    salaryRange: { type: Type.STRING, description: "Estimated annual salary range in Indian Rupees (e.g., '₹12-18 LPA')." },
                    growth: { type: Type.STRING, enum: ['Hot', 'Growing', 'Stable'], description: "The growth trajectory of this role." },
                    topIndustries: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 3 industries hiring for this role." },
                    keySkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 3 key skills required for this role." }
                },
                required: ["title", "salaryRange", "growth", "topIndustries", "keySkills"]
            }
        },
        topSkills: {
            type: Type.ARRAY,
            description: "A list of 8 of the most in-demand skills in the current job market.",
            items: {
                type: Type.STRING,
            },
        },
    },
    required: ["trendingJobs", "topSkills"]
};

export const getInitialMarketData = async (): Promise<InitialMarketData> => {
    const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const prompt = `
        Act as a premium market intelligence analyst for the Indian job market for ${currentMonthYear}.
        Your task is to provide a single, comprehensive market overview.
        Generate a JSON object containing two key properties:
        1. 'trendingJobs': An array of 6-8 high-demand job roles. For each job, provide a detailed object including its title, an estimated annual salary range in Indian Rupees (LPA format), a growth assessment ('Hot', 'Growing', or 'Stable'), the top 3 hiring industries, and the top 3 key skills.
        2. 'topSkills': An array of 8 of the most in-demand skills in the current market, focusing on what has become critical recently. Include a mix of technical and soft skills.
        The entire output must be a single JSON object that strictly validates against the provided schema.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: initialMarketDataSchema,
                temperature: 0.5,
            },
        });
        const jsonText = response.text.trim();
        const result: InitialMarketData = JSON.parse(jsonText);
        return result;
    } catch (error) {
        console.error("Error calling Gemini API for initial market data:", error);
        throw new Error("Failed to get initial market data from AI service.");
    }
};

const validationSchema = {
    type: Type.OBJECT,
    properties: {
        isValid: {
            type: Type.BOOLEAN,
            description: "True if the details appear valid, false if they seem like placeholders or test data."
        },
        feedback: {
            type: Type.STRING,
            description: "A user-friendly feedback message if isValid is false. Explain what seems wrong (e.g., 'The name or college appears to be a placeholder')."
        }
    },
    required: ["isValid", "feedback"]
};

export const validateUserDetails = async (name: string, college: string): Promise<ValidationResult> => {
    const prompt = `
        Act as a data validator. Analyze the provided user details.
        - Name: "${name}"
        - College: "${college}"

        Your task is to check if these details seem like real, legitimate user inputs or if they are likely placeholders, test data, or nonsensical entries (e.g., "Test User", "asdf", "My College").
        A an empty or generic college name is not valid. The name 'Vishal Singh' is a valid default and should pass validation if the college is also valid.
        Return a JSON object indicating if the data is valid. If it's not valid, provide a friendly feedback message explaining why. For example, "The college name seems to be a placeholder. Please provide your actual college for a better recommendation."
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: validationSchema,
                temperature: 0.1,
            }
        });

        const jsonText = response.text.trim();
        const result: ValidationResult = JSON.parse(jsonText);
        return result;

    } catch (error) {
        console.error("Error calling Gemini API for user detail validation:", error);
        // In case of validation error, assume it's valid to not block the user.
        return { isValid: true, feedback: '' };
    }
};

const personalizedGuidanceSchema = {
    type: Type.OBJECT,
    properties: {
        recommendedCourses: {
            type: Type.ARRAY,
            description: "A list of 3-4 highly relevant online courses tailored to the user's skills.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    platform: { type: Type.STRING },
                    url: { type: Type.STRING },
                    reason: { type: Type.STRING, description: "A brief, personalized reason why this course is a good fit." }
                },
                required: ["title", "platform", "url", "reason"]
            }
        },
        jobPlatforms: {
            type: Type.ARRAY,
            description: "A list of 3-4 recommended job platforms or communities for the user.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "e.g., LinkedIn, Naukri.com, AngelList" },
                    url: { type: Type.STRING },
                    reason: { type: Type.STRING, description: "A brief, personalized reason why this platform is suitable." }
                },
                required: ["name", "url", "reason"]
            }
        }
    },
    required: ["recommendedCourses", "jobPlatforms"]
};

export const getPersonalizedGuidance = async (skills: string): Promise<PersonalizedGuidanceResult> => {
    const prompt = `
        Act as a helpful career coach. The user has provided their current skills. 
        Based ONLY on these skills, provide personalized recommendations for:
        1.  **Online Courses**: Suggest 3-4 specific online courses from reputable platforms (like Coursera, Udemy, edX) that would help the user either deepen their existing skills or learn complementary new ones. For each course, provide a short, personalized reason why it's a good fit.
        2.  **Job Platforms**: Suggest 3-4 of the most effective job platforms or communities for someone with this skill set to find opportunities. For each platform, provide a brief, personalized reason explaining why it's a good place for them to look.

        User's Skills: "${skills}"

        Your entire output must be a single JSON object that strictly validates against the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: personalizedGuidanceSchema,
                temperature: 0.6,
            }
        });

        const jsonText = response.text.trim();
        const result: PersonalizedGuidanceResult = JSON.parse(jsonText);
        return result;

    } catch (error) {
        console.error("Error calling Gemini API for personalized guidance:", error);
        throw new Error("Failed to get personalized guidance from AI service.");
    }
};