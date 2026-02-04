const axios = require('axios');

// Groq API Configuration (FREE, faster than OpenAI)
const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const AI_MODEL = 'llama3-8b-8192'; // Stable 8b model

// ... inside getFallbackQuestion ...
/**
 * Fallback questions if LLM fails
 */
function getFallbackQuestion(stage) {
    const fallbacks = {
        aptitude: [
            'If a clock shows 3:15, what is the angle between the hour and minute hands? (A) 0° (B) 7.5° (C) 15° (D) 22.5°',
            'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next? (A) (1/3) (B) (1/8) (C) (2/8) (D) (1/16)',
            'Which word does NOT belong with the others? (A) index (B) glossary (C) chapter (D) book',
            'Safe : Secure :: Protect : ? (A) Lock (B) Guard (C) Sure (D) Conserve',
            'Odometer is to mileage as compass is to: (A) speed (B) hiking (C) needle (D) direction'
        ],
        coding: [
            'Write a function to find the maximum sum of a contiguous subarray (Kadane\'s Algorithm).',
            'Explain how to detect a cycle in a linked list.',
            'Write a function to check if two strings are anagrams of each other.',
            'Implement a binary search algorithm.',
            'Find the first non-repeating character in a string.'
        ],
        technical: [
            'Explain the difference between synchronous and asynchronous programming.',
            'What is the Virtual DOM and how does it work?',
            'Explain the concept of closures in JavaScript.',
            'What are the differences between SQL and NoSQL databases?',
            'Explain RESTful API architecture principles.'
        ],
        hr: [
            'Tell me about a time when you faced a challenging deadline.',
            'Where do you see yourself in 5 years?',
            'Describe a situation where you had a conflict with a team member.',
            'What are your greatest strengths and weaknesses?',
            'Why do you want to join our company?'
        ]
    };

    const questions = fallbacks[stage] || fallbacks.hr;
    return questions[Math.floor(Math.random() * questions.length)];
}

/**
 * Generate interview question using OpenAI GPT
 * @param {Object} params - Parameters for question generation
 * @param {String} params.stage - Current interview stage (hr, technical, coding)
 * @param {Array} params.skills - Candidate skills
 * @param {Array} params.conversationHistory - Previous conversation
 * @param {Object} params.context - Additional context
 * @returns {Promise<Object>} Generated question and metadata
 */
async function generateQuestion({ stage, skills = [], conversationHistory = [], context = {} }) {
    try {
        console.log(`[LLM] Generating question for stage: ${stage}, skills: ${skills.join(', ')}`);
        const systemPrompt = getSystemPrompt(stage, skills, context);
        console.log(`[LLM] Using system prompt for ${stage}:`, systemPrompt.substring(0, 100) + '...');
        const messages = buildMessages(systemPrompt, conversationHistory);

        const response = await axios.post(
            GROQ_API_URL,
            {
                model: AI_MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 300
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiResponse = response.data.choices[0].message.content;

        return {
            question: aiResponse.trim(),
            stage,
            metadata: {
                model: AI_MODEL,
                tokens: response.data.usage.total_tokens
            }
        };
    } catch (error) {
        console.error('LLM Question Generation Error:', error.response?.data || error.message);
        // Fallback to default question
        return {
            question: getFallbackQuestion(stage, conversationHistory),
            stage,
            metadata: { fallback: true }
        };
    }
}

/**
 * Evaluate answer using OpenAI GPT
 * @param {Object} params - Parameters for evaluation
 * @param {String} params.question - The question asked
 * @param {String} params.answer - User's answer
 * @param {String} params.stage - Interview stage
 * @param {Array} params.skills - Expected skills
 * @returns {Promise<Object>} Evaluation with scores and next stage
 */
async function evaluateAnswer({ question, answer, stage, skills = [] }) {
    try {
        const evaluationPrompt = getEvaluationPrompt(question, answer, stage, skills);

        const response = await axios.post(
            GROQ_API_URL,
            {
                model: AI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert interview evaluator. Provide scores and actionable feedback in JSON format.'
                    },
                    {
                        role: 'user',
                        content: evaluationPrompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const evaluation = parseEvaluationResponse(response.data.choices[0].message.content);

        // Determine next stage based on current progress
        const nextStage = determineNextStage(stage, evaluation, answer);

        return {
            ...evaluation,
            nextStage,
            metadata: {
                model: 'gpt-3.5-turbo',
                tokens: response.data.usage.total_tokens
            }
        };
    } catch (error) {
        console.error('LLM Evaluation Error:', error.response?.data || error.message);
        // Fallback evaluation
        return {
            scores: {
                relevance: 5,
                clarity: 5,
                technical: stage === 'technical' ? 5 : 0,
                confidence: 5
            },
            feedback: 'Answer received.',
            nextStage: stage,
            metadata: { fallback: true }
        };
    }
}

/**
 * Build system prompt based on interview stage
 */
function getSystemPrompt(stage, skills, context) {
    const skillsList = skills.length > 0 ? skills.join(', ') : 'general software development';

    const prompts = {
        aptitude: `You are conducting an Aptitude Test. Ask ONE challenging aptitude question from these topics:
- Logical Reasoning
- Quantitative Aptitude
- Verbal Ability
- Data Interpretation
- Pattern Recognition
- Analytical Thinking
- Problem Solving
- Numerical Reasoning
- Abstract Reasoning
- Critical Thinking

Make the difficulty medium to high. Ask a clear, specific question with multiple choice options if applicable.
Total questions in this round: 10. Ask ONE question at a time.`,

        coding: `You are conducting a DSA Coding Round. Present a Data Structures & Algorithms problem.
Difficulty levels: Easy, Moderate, or Tough (randomly varied).
Focus on topics like:
- Arrays, Strings
- Linked Lists, Stacks, Queues
- Trees, Graphs
- Sorting, Searching
- Dynamic Programming
- Recursion

Provide:
1. Clear problem statement
2. Input/output examples
3. Constraints
Ask ONE problem. Total problems in this round: 2.`,

        technical: `You are conducting a Technical Interview based on the candidate's resume.
Skills from resume: ${skillsList}
${context.resumeProjects ? `Projects: ${context.resumeProjects}` : ''}

Ask in-depth questions about:
- Their specific projects and implementations
- Technologies they've mentioned (${skillsList})
- System design related to their experience
- Problem-solving in their project context
- Best practices in their tech stack

Ask ONE specific technical question based on THEIR resume. Make it detailed and challenging.`,

        hr: `You are conducting an HR Round. Ask behavioral and situational questions to assess soft skills.
This is an ADAPTIVE round - adjust number of questions (3-5) based on answers:
- Good/detailed answers → More questions
- Short/weak answers → Fewer questions

Focus on:
- How they handle pressure and deadlines
- Team collaboration experience
- Conflict resolution
- Leadership and initiative
- Career goals and motivation
- Work ethics and values

Ask ONE open-ended question at a time. Be professional and friendly.`
    };

    return prompts[stage] || prompts.aptitude;
}

/**
 * Build conversation messages for context
 */
function buildMessages(systemPrompt, conversationHistory) {
    const messages = [{ role: 'system', content: systemPrompt }];

    // Add conversation history (last 10 messages for context)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach(msg => {
        messages.push({
            role: msg.role === 'ai' ? 'assistant' : 'user',
            content: msg.content
        });
    });

    // Add instruction for next question
    messages.push({
        role: 'user',
        content: 'Ask the next interview question based on our conversation so far.'
    });

    return messages;
}

/**
 * Get evaluation prompt
 */
function getEvaluationPrompt(question, answer, stage, skills) {
    return `Evaluate this interview answer:

QUESTION: ${question}
ANSWER: ${answer}
STAGE: ${stage}
SKILLS: ${skills.join(', ')}

Provide evaluation in this JSON format:
{
  "scores": {
    "relevance": <1-10>,
    "clarity": <1-10>,
    "technical": <1-10>,
    "confidence": <1-10>
  },
  "feedback": "<brief constructive feedback>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<area 1>", "<area 2>"]
}

Be fair but critical. Consider:
- Relevance to the question
- Clarity of communication
- Technical accuracy (if applicable)
- Depth of knowledge
- Confidence in delivery`;
}

/**
 * Parse LLM evaluation response
 */
function parseEvaluationResponse(response) {
    try {
        // Try to parse JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                scores: parsed.scores || {},
                feedback: parsed.feedback || '',
                strengths: parsed.strengths || [],
                improvements: parsed.improvements || []
            };
        }
    } catch (e) {
        console.error('Failed to parse evaluation:', e);
    }

    // Fallback
    return {
        scores: { relevance: 6, clarity: 6, technical: 5, confidence: 6 },
        feedback: 'Good effort. Keep practicing.',
        strengths: ['Attempted the question'],
        improvements: ['Provide more detail']
    };
}

/**
 * Determine next interview stage
 */
function determineNextStage(currentStage, evaluation, answer) {
    // Check if user wants to end (simple heuristic)
    const endKeywords = ['end', 'finish', 'complete', 'stop', 'done', 'exit'];
    const answerlower = answer.toLowerCase();
    if (endKeywords.some(kw => answerlower.includes(kw)) && answerlower.length < 30) {
        return 'completed';
    }

    // Stage progression logic
    const avgScore = Object.values(evaluation.scores).reduce((a, b) => a + b, 0) /
        Object.values(evaluation.scores).length;

    if (currentStage === 'hr' && avgScore >= 5) {
        return 'technical';
    } else if (currentStage === 'technical' && avgScore >= 5) {
        return 'coding';
    } else if (currentStage === 'coding') {
        return 'completed';
    }

    // Stay in current stage if performance is low or default
    return currentStage;
}

/**
 * Fallback questions if LLM fails
 */
function getFallbackQuestion(stage, history = []) {
    const fallbacks = {
        aptitude: [
            'If a clock shows 3:15, what is the angle between the hour and minute hands? (A) 0° (B) 7.5° (C) 15° (D) 22.5°',
            'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next? (A) (1/3) (B) (1/8) (C) (2/8) (D) (1/16)',
            'Which word does NOT belong with the others? (A) index (B) glossary (C) chapter (D) book',
            'Safe : Secure :: Protect : ? (A) Lock (B) Guard (C) Sure (D) Conserve',
            'Odometer is to mileage as compass is to: (A) speed (B) hiking (C) needle (D) direction',
            'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies. (A) True (B) False (C) Cannot be determined (D) Partially true',
            'What comes next in this pattern: 1, 4, 9, 16, 25, __? (A) 30 (B) 36 (C) 49 (D) 35',
            'Which number is the odd one out: 2, 5, 7, 11, 13, 15? (A) 2 (B) 5 (C) 13 (D) 15',
            'If 5 workers can complete a task in 8 days, how many days will it take 10 workers? (A) 2 days (B) 4 days (C) 16 days (D) 6 days',
            'A train travels 60 km in 45 minutes. What is its speed in km/h? (A) 60 (B) 75 (C) 80 (D) 90',
            'Which of the following is always true? (A) All squares are rectangles (B) All rectangles are squares (C) All circles are ovals (D) None',
            'Complete the analogy: Book : Pages :: Tree : ? (A) Roots (B) Branches (C) Leaves (D) Trunk',
            'If TODAY is coded as UJEBZ, how is HELLO coded? (A) IFMMP (B) GDKKN (C) JFMMP (D) IFNMP',
            'Which shape completes the pattern: Circle, Square, Triangle, Circle, Square, __? (A) Circle (B) Triangle (C) Square (D) Pentagon',
            'A bat and ball cost $1.10. The bat costs $1 more than the ball. How much does the ball cost? (A) $0.10 (B) $0.05 (C) $0.15 (D) $0.20'
        ],
        coding: [
            'Write a function to find the maximum sum of a contiguous subarray (Kadane\'s Algorithm).',
            'Explain how to detect a cycle in a linked list.',
            'Write a function to check if two strings are anagrams of each other.',
            'Implement a binary search algorithm.',
            'Find the first non-repeating character in a string.',
            'Write a function to reverse a linked list.',
            'Implement a function to merge two sorted arrays.',
            'Write code to check if a string is a palindrome.',
            'Implement a stack using queues.',
            'Write a function to find the missing number in an array of 1 to N.',
            'Explain and implement the two-pointer technique for array problems.',
            'Write code to find the longest substring without repeating characters.',
            'Implement a function to validate balanced parentheses.',
            'Write a function to rotate an array by K positions.',
            'Explain the time complexity of quicksort and when it performs worst.'
        ],
        technical: [
            'Explain the difference between synchronous and asynchronous programming.',
            'What is the Virtual DOM and how does it work?',
            'Explain the concept of closures in JavaScript.',
            'What are the differences between SQL and NoSQL databases?',
            'Explain RESTful API architecture principles.'
        ],
        hr: [
            'Tell me about a time when you faced a challenging deadline.',
            'Where do you see yourself in 5 years?',
            'Describe a situation where you had a conflict with a team member.',
            'What are your greatest strengths and weaknesses?',
            'Why do you want to join our company?'
        ]
    };

    const allQuestions = fallbacks[stage] || fallbacks.hr;

    // Filter out questions that have already been asked
    // Only check AI messages (role === 'assistant' or 'ai') to avoid false positives from user answers
    const usedQuestions = new Set();
    if (history && Array.isArray(history)) {
        history.forEach(msg => {
            // Only add AI messages to used questions
            if (msg.role === 'assistant' || msg.role === 'ai') {
                const content = msg.content || msg.text || '';
                if (content) usedQuestions.add(content);
            }
        });
    }

    // Use exact match or check if question is substring of used message (not vice versa)
    const availableQuestions = allQuestions.filter(q => {
        return !Array.from(usedQuestions).some(uq => {
            // Check if this exact question was asked (strip whitespace for comparison)
            return uq.trim().toLowerCase().includes(q.trim().toLowerCase());
        });
    });

    const pool = availableQuestions.length > 0 ? availableQuestions : allQuestions;

    return pool[Math.floor(Math.random() * pool.length)];
}

module.exports = {
    generateQuestion,
    evaluateAnswer
};
