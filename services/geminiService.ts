
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, DetailedRecommendation, ValidationResult, TrendingJob, PersonalizedGuidanceResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    jobTitle: {
      type: Type.STRING,
      description: "The job title that was analyzed.",
    },
    summary: {
        type: Type.STRING,
        description: "A brief summary of the current job market trends for this role.",
    },
    trendingSkills: {
      type: Type.ARRAY,
      description: "A list of the top 5-10 trending skills for the specified job title.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the skill.",
          },
          description: {
            type: Type.STRING,
            description: "A brief explanation of why this skill is important for the role.",
          },
          relevance: {
            type: Type.INTEGER,
            description: "A score from 1 to 10 indicating the skill's current relevance in the market."
          }
        },
        required: ["name", "description", "relevance"],
      },
    },
    recommendedCourses: {
        type: Type.ARRAY,
        description: "A list of 3-5 recommended online courses to learn the trending skills.",
        items: {
            type: Type.OBJECT,
            properties: {
                title: {
                    type: Type.STRING,
                    description: "The title of the course."
                },
                platform: {
                    type: Type.STRING,
                    description: "The platform offering the course (e.g., Coursera, Udemy, edX)."
                },
                url: {
                    type: Type.STRING,
                    description: "A direct link to the course page."
                },
                description: {
                    type: Type.STRING,
                    description: "A brief summary of what the course covers and which skills it addresses."
                }
            },
            required: ["title", "platform", "url", "description"]
        }
    }
  },
  required: ["jobTitle", "summary", "trendingSkills", "recommendedCourses"],
};


export const analyzeJobMarket = async (jobTitle: string): Promise<AnalysisResult> => {
  const prompt = `
    Act as a simulated Python-based job analysis engine.
    You have just completed a multi-step backend process:
    1. Scraped job portals (like LinkedIn, Indeed) for the role of "${jobTitle}" using the BeautifulSoup library.
    2. Processed the scraped text data using the NLTK library for Natural Language Processing to extract key skills and requirements.
    3. Queried a local SQLite database of online courses to find relevant matches for the extracted skills.
    
    Now, compile the results of this simulated process into a single, structured JSON object.
    Based on the "scraped" data, provide:
    - A brief summary of the demand and outlook for this role.
    - A list of the top 5-10 most in-demand skills identified by your "NLTK process".
    - A list of 3-5 high-quality online courses from your "SQLite database" that would help someone acquire these skills.

    Your entire output MUST be a JSON object that strictly validates against the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });
    
    const jsonText = response.text.trim();
    const result: AnalysisResult = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI service.");
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


export const getDetailedJobRecommendation = async (
  userProfile: string,
  collegeTier: string,
  timeToGraduate: string,
  cgpa: string,
  linkedinUrl?: string,
  githubUrl?: string,
): Promise<DetailedRecommendation> => {
  const prompt = `
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

const stringListSchema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      description: "A list of strings.",
      items: {
        type: Type.STRING,
      },
    },
  },
  required: ["items"],
};

const trendingJobSchema = {
  type: Type.OBJECT,
  properties: {
    jobs: {
      type: Type.ARRAY,
      description: "A list of trending job objects.",
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
    }
  },
  required: ["jobs"]
};


export const getTrendingJobs = async (): Promise<TrendingJob[]> => {
  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const prompt = `Act as a premium market intelligence analyst for the Indian job market for ${currentMonthYear}. Based on recent market data, identify 6-8 high-demand job roles that have seen significant growth. For each job, provide a comprehensive data object including: 1. The job title. 2. An estimated annual salary range in Indian Rupees (LPA format). 3. A growth assessment ('Hot', 'Growing', or 'Stable'). 4. The top 3 industries hiring for this role. 5. The top 3 key skills required for this role. The list should be diverse. Return a JSON object with a single key 'jobs' containing an array of job objects.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: trendingJobSchema,
        temperature: 0.5,
      },
    });
    const jsonText = response.text.trim();
    const result: { jobs: TrendingJob[] } = JSON.parse(jsonText);
    return result.jobs;
  } catch (error) {
    console.error("Error calling Gemini API for trending jobs:", error);
    throw new Error("Failed to get trending jobs from AI service.");
  }
};

export const getTopSkills = async (): Promise<string[]> => {
    const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const prompt = `Act as a talent acquisition analyst for ${currentMonthYear}. Identify 8 of the most in-demand skills in the current job market, focusing on what has become critical in the last 3-4 months. Include a mix of technical and soft skills (e.g., 'AI & Machine Learning', 'Cloud Computing', 'Adaptability'). Return the response as a JSON object with a single key 'items' containing an array of skill name strings.`;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: stringListSchema,
          temperature: 0.5,
        },
      });
      const jsonText = response.text.trim();
      const result: { items: string[] } = JSON.parse(jsonText);
      return result.items;
    } catch (error) {
      console.error("Error calling Gemini API for top skills:", error);
      throw new Error("Failed to get top skills from AI service.");
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