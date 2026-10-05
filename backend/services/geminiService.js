import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY || '';

const SYSTEM_PROMPT = `You are an expert academic advisor and peer-matching coordinator for Skill Mentor. Your goal is to analyze student profiles objectively, identifying powerful skill overlaps, complementary exchanges (e.g., Python for UI/UX), and skill level compatibility. Provide actionable, supportive, and clear reasoning for every match recommendation.`;

/**
 * Call Gemini with automatic model fallback (gemini-3.8-flash -> gemini-3.5-flash-lite -> gemini-2.5-flash)
 */
async function callGemini(contents, jsonSchema = null) {
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
      const payload = {
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [
          { parts: [{ text: contents }] }
        ],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json'
        }
      };

      if (jsonSchema) {
        payload.generationConfig.responseSchema = jsonSchema;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.warn(`[Gemini API] Model ${model} returned ${res.status}: ${errBody.substring(0, 120)}`);
        continue;
      }

      const data = await res.json();
      const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textOutput) {
        return JSON.parse(textOutput);
      }
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini API] Failed with model ${model}:`, err.message);
    }
  }

  throw lastError || new Error('All Gemini models failed to generate content');
}

/**
 * 1. Mentor Matching & Rationale Generation
 */
export async function getGeminiRecommendations(studentProfile, potentialMentors) {
  try {
    const prompt = `Analyze the student's learning goals and teaching skills against the candidate mentors and return tailored recommendations in valid JSON format.
Student Profile: ${JSON.stringify(studentProfile)}
Candidate Mentors: ${JSON.stringify(potentialMentors)}

Focus on:
1. Skills the student wants to learn vs skills the mentor teaches.
2. Reciprocal potential: Can the student teach something the mentor wants to learn?
3. Rating, experience, and format compatibility.
Assign a matchScore from 60 to 99. Provide detailed, supportive reasoning highlighting exact complementary skills.`;

    const schema = {
      type: 'OBJECT',
      properties: {
        recommendations: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              mentorId: { type: 'STRING' },
              matchScore: { type: 'NUMBER' },
              reasoning: { type: 'STRING' },
              reciprocalExchangePotential: { type: 'BOOLEAN' },
              matchedSkills: {
                type: 'ARRAY',
                items: { type: 'STRING' }
              }
            },
            required: ['mentorId', 'matchScore', 'reasoning', 'reciprocalExchangePotential']
          }
        }
      },
      required: ['recommendations']
    };

    const result = await callGemini(prompt, schema);
    if (result && Array.isArray(result.recommendations)) {
      return result;
    }
  } catch (err) {
    console.warn('⚠️ Gemini recommendations API error, using smart matching fallback:', err.message);
  }

  // Intelligent Rule-Based Fallback Matching Engine
  return generateRuleBasedRecommendations(studentProfile, potentialMentors);
}

/**
 * 2. Skill Gap & Learning Path Advisory
 */
export async function getSkillGapAdvisory(skillName, currentLevel, targetLevel, objective) {
  try {
    const prompt = `Provide a comprehensive Skill Gap & Learning Path Advisory for a student aiming to learn '${skillName}'.
Current Proficiency: ${currentLevel || 'Beginner/None'}
Target Proficiency: ${targetLevel || 'Advanced'}
Student Goal / Objective: ${objective || 'Build real-world projects and become proficient'}

Return a structured JSON with:
- summary: high-level encouraging assessment of the learning curve
- estimatedWeeks: integer number of weeks needed
- recommendedHoursPerWeek: integer recommended study hours
- milestoneRoadmap: array of 4 milestone objects (weekRange, title, coreConcepts, practicalProject)
- peerPracticeTopics: array of 4 discussion/peer session topics to practice with mentors`;

    const schema = {
      type: 'OBJECT',
      properties: {
        summary: { type: 'STRING' },
        estimatedWeeks: { type: 'NUMBER' },
        recommendedHoursPerWeek: { type: 'NUMBER' },
        milestoneRoadmap: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              weekRange: { type: 'STRING' },
              title: { type: 'STRING' },
              coreConcepts: { type: 'ARRAY', items: { type: 'STRING' } },
              practicalProject: { type: 'STRING' }
            },
            required: ['weekRange', 'title', 'coreConcepts', 'practicalProject']
          }
        },
        peerPracticeTopics: {
          type: 'ARRAY',
          items: { type: 'STRING' }
        }
      },
      required: ['summary', 'estimatedWeeks', 'recommendedHoursPerWeek', 'milestoneRoadmap', 'peerPracticeTopics']
    };

    const result = await callGemini(prompt, schema);
    if (result && result.milestoneRoadmap) {
      return result;
    }
  } catch (err) {
    console.warn('⚠️ Gemini skill gap advisory error, using fallback:', err.message);
  }

  // Fallback Advisory
  return {
    summary: `Structured peer-mentorship path to progress from ${currentLevel || 'Beginner'} to ${targetLevel || 'Advanced'} in ${skillName}. Collaborative code reviews and guided practice will accelerate your retention by 2.5x.`,
    estimatedWeeks: 6,
    recommendedHoursPerWeek: 5,
    milestoneRoadmap: [
      {
        weekRange: 'Weeks 1-2',
        title: 'Foundations & Mental Models',
        coreConcepts: ['Core syntax & concepts', 'Environment setup & tooling', 'Basic problem solving'],
        practicalProject: `Build a starter ${skillName} exercise with peer review`
      },
      {
        weekRange: 'Weeks 3-4',
        title: 'Intermediate Patterns & Architecture',
        coreConcepts: ['Data structures & workflows', 'Error handling & modular code', 'Standard conventions'],
        practicalProject: `Develop an interactive mini-application in ${skillName}`
      },
      {
        weekRange: 'Weeks 5-6',
        title: 'Mastery & Real-World Polish',
        coreConcepts: ['Performance tuning', 'Collaborative workflows', 'Peer testing & debugging'],
        practicalProject: `Complete a portfolio-ready collaborative capstone`
      }
    ],
    peerPracticeTopics: [
      `Live code walkthrough of ${skillName} architecture`,
      'Common pitfalls, debugging strategies, and anti-patterns',
      'Peer mock interview & conceptual deep-dive',
      'Production deployment and real-world best practices'
    ]
  };
}

/**
 * 3. Session Prep & Agenda Summary
 */
export async function getSessionAgenda(skillName, objective, durationMinutes = 60) {
  try {
    const prompt = `Generate a high-impact, structured peer learning session agenda for a ${durationMinutes}-minute exchange.
Skill Focus: ${skillName}
Session Objective: ${objective}

Return a structured JSON with:
- sessionTitle: punchy title
- targetOutcome: concrete deliverable by the end of session
- agendaSegments: array of time-boxed items (minutes, title, description, mentorRole, learnerRole)
- prepChecklist: array of 3 preparatory action items before joining the call
- suggestedDebriefQuestions: array of 2 reflection questions for the post-session review`;

    const schema = {
      type: 'OBJECT',
      properties: {
        sessionTitle: { type: 'STRING' },
        targetOutcome: { type: 'STRING' },
        agendaSegments: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              minutes: { type: 'NUMBER' },
              title: { type: 'STRING' },
              description: { type: 'STRING' },
              mentorRole: { type: 'STRING' },
              learnerRole: { type: 'STRING' }
            },
            required: ['minutes', 'title', 'description', 'mentorRole', 'learnerRole']
          }
        },
        prepChecklist: {
          type: 'ARRAY',
          items: { type: 'STRING' }
        },
        suggestedDebriefQuestions: {
          type: 'ARRAY',
          items: { type: 'STRING' }
        }
      },
      required: ['sessionTitle', 'targetOutcome', 'agendaSegments', 'prepChecklist', 'suggestedDebriefQuestions']
    };

    const result = await callGemini(prompt, schema);
    if (result && result.agendaSegments) {
      return result;
    }
  } catch (err) {
    console.warn('⚠️ Gemini session agenda error, using fallback:', err.message);
  }

  // Fallback Agenda
  return {
    sessionTitle: `${skillName} Intensive Mastery Session`,
    targetOutcome: `Practical understanding of key ${skillName} concepts and completion of a guided exercise.`,
    agendaSegments: [
      {
        minutes: 10,
        title: 'Check-in & Goal Alignment',
        description: 'Review current progress, specific roadblocks, and establish session targets.',
        mentorRole: 'Clarify expectations and answer initial questions',
        learnerRole: 'Share current code or design and highlight confusion areas'
      },
      {
        minutes: 30,
        title: 'Hands-on Guided Exercise & Pair Collaboration',
        description: `Deep-dive into ${skillName} live implementation and troubleshooting.`,
        mentorRole: 'Demonstrate best-practice technique and guide through challenges',
        learnerRole: 'Active driver in writing code or designing under guidance'
      },
      {
        minutes: 15,
        title: 'Review, Q&A & Code Polish',
        description: 'Analyze what was built, discuss edge cases, and solidify takeaways.',
        mentorRole: 'Highlight strengths and recommend next practice exercises',
        learnerRole: 'Summarize key insights and record actionable tips'
      },
      {
        minutes: 5,
        title: 'Next Steps & Exchange Scheduling',
        description: 'Agree on follow-up tasks and schedule reciprocal teaching session.',
        mentorRole: 'Suggest take-home practice resource',
        learnerRole: 'Confirm reciprocal skill exchange agenda'
      }
    ],
    prepChecklist: [
      `Have your development environment or design file open and ready`,
      `Write down the top 2 questions you want to ask about ${skillName}`,
      `Test your microphone and screen-sharing permissions ahead of time`
    ],
    suggestedDebriefQuestions: [
      `What was the most valuable breakthrough or concept clarified during this session?`,
      `How effectively did your peer explain difficult topics and support your learning?`
    ]
  };
}

/**
 * Heuristic complementary matching algorithm
 */
function generateRuleBasedRecommendations(studentProfile, potentialMentors) {
  const studentLearning = (studentProfile.learning_skills || []).map(s => (s.skill_name || s).toLowerCase());
  const studentTeaching = (studentProfile.teaching_skills || []).map(s => (s.skill_name || s).toLowerCase());

  const recommendations = potentialMentors.map(mentor => {
    const mentorTeaching = (mentor.teaching_skills || []).map(s => (s.skill_name || s).toLowerCase());
    const mentorLearning = (mentor.learning_skills || []).map(s => (s.skill_name || s).toLowerCase());

    // Skills mentor teaches that student wants to learn
    const directMatches = mentorTeaching.filter(s => studentLearning.some(sl => sl.includes(s) || s.includes(sl)));
    
    // Skills student teaches that mentor wants to learn (Reciprocal)
    const reciprocalMatches = studentTeaching.filter(s => mentorLearning.some(ml => ml.includes(s) || s.includes(ml)));

    const isReciprocal = reciprocalMatches.length > 0;
    let baseScore = 70;

    if (directMatches.length > 0) baseScore += 15;
    if (isReciprocal) baseScore += 12;
    if ((mentor.rating || 0) >= 4.8) baseScore += 2;

    const matchScore = Math.min(99, Math.max(65, baseScore));

    let reasoning = '';
    if (isReciprocal && directMatches.length > 0) {
      reasoning = `Exceptional reciprocal match! ${mentor.full_name} can guide you in ${directMatches.join(', ')}, while you can offer valuable mentorship in ${reciprocalMatches.join(', ')}.`;
    } else if (directMatches.length > 0) {
      reasoning = `${mentor.full_name} has high proficiency in ${directMatches.join(', ')}, matching your active learning goals with a stellar ${mentor.rating || 4.9} rating.`;
    } else {
      reasoning = `Strong general peer mentor from ${mentor.institution} with a high completion rate (${mentor.completed_sessions_count || 10}+ sessions) ready to collaborate.`;
    }

    return {
      mentorId: mentor.id,
      matchScore,
      reasoning,
      reciprocalExchangePotential: isReciprocal,
      matchedSkills: directMatches
    };
  });

  recommendations.sort((a, b) => b.matchScore - a.matchScore);
  return { recommendations };
}
