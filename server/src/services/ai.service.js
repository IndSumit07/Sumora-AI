import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { CONFIG } from "../configs/app.config.js";
import { generatePdfFromHtml } from "./pdfPool.service.js";

/**
 * Convert a Zod v4 schema to a Gemini-compatible JSON schema.
 * zod-to-json-schema returns an empty object with Zod v4, so we use
 * Zod's built-in toJSONSchema and strip fields Gemini doesn't support.
 */
function toGeminiSchema(zodSchema) {
  const strip = (node) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return node;
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === "$schema" || k === "additionalProperties") continue;
      out[k] = Array.isArray(v) ? v.map(strip) : strip(v);
    }
    return out;
  };
  return strip(z.toJSONSchema(zodSchema));
}

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const sectionScoreSchema = z.object({
  name: z.string().describe("The resume section being scored, e.g. Summary, Experience, Skills, Education, Projects, Formatting"),
  score: z.number().min(0).max(100).describe("Score for this section (0-100)"),
  feedback: z.string().describe("Constructive feedback on what's good and what needs improvement in this section"),
});

const atsIssueSchema = z.object({
  issue: z.string().describe("Description of the ATS parsing issue"),
  severity: z.enum(["low", "medium", "high"]).describe("How severely this impacts ATS parsing"),
  fix: z.string().describe("How to fix this issue"),
});

const keywordEntrySchema = z.object({
  keyword: z.string().describe("The keyword or skill term"),
  relevance: z.enum(["high", "medium", "low"]).describe("How relevant this keyword is to the target role"),
});

const contentQualitySchema = z.object({
  strengths: z.array(z.string()).describe("What the resume does well"),
  weaknesses: z.array(z.string()).describe("Areas where the resume falls short"),
  actionVerbScore: z.number().min(0).max(100).describe("Score for use of strong action verbs"),
  quantifiableScore: z.number().min(0).max(100).describe("Score for quantifiable achievements (metrics, numbers, percentages)"),
  redundancyFlags: z.array(z.string()).describe("Any repeated or redundant content found in the resume"),
  overallAssessment: z.string().describe("Overall content quality narrative"),
});

const skillGapSchema = z.object({
  skill: z.string().describe("The skill the candidate is lacking"),
  severity: z.enum(["low", "medium", "high"]).describe("How important this skill is for the job"),
  recommendation: z.string().describe("Practical advice on how to acquire or improve this skill for the resume"),
  learningResources: z.array(z.string()).describe("Specific courses, books, certifications, or projects to build this skill"),
});

const preparationPhaseSchema = z.object({
  phase: z.number().describe("Phase number in the preparation roadmap, starting from 1"),
  focus: z.string().describe("The main focus of this phase, e.g. resume rewriting, skill building, portfolio work, networking"),
  duration: z.string().describe("Estimated time for this phase, e.g. 3-5 days, 1-2 weeks"),
  tasks: z.array(z.string()).describe("Actionable tasks for this phase"),
  milestones: z.array(z.string()).describe("Key achievements that mark phase completion"),
});

const atsSuggestionSchema = z.object({
  section: z.string().describe("Which resume section this suggestion targets"),
  original: z.string().describe("What the resume currently shows (brief excerpt)"),
  improved: z.string().describe("ATS-optimized rewrite suggestion"),
  reason: z.string().describe("Why this change improves ATS compatibility"),
});

const roleMatchSchema = z.object({
  fittingRoles: z.array(z.object({
    title: z.string().describe("Job title the resume matches"),
    matchPercentage: z.number().min(0).max(100).describe("Match percentage for this role"),
  })).describe("Other job roles this resume is well-suited for"),
  careerPath: z.string().describe("Suggested career progression path based on current resume"),
  levelAssessment: z.string().describe("Assessment of the candidate's seniority level (junior, mid, senior, lead)"),
});

const interviewReportSchema = z.object({
  title: z.string().describe("The target job title derived from the job description"),
  matchScore: z.number().min(0).max(100).describe("Overall ATS match score between 0-100 indicating how well the resume fits the job"),
  sectionScores: z.array(sectionScoreSchema).length(6).describe("Individual scores for each resume section: Summary, Experience, Skills, Education, Projects, Formatting"),
  atsCompatibility: z.object({
    overallScore: z.number().min(0).max(100).describe("Overall ATS parsing compatibility score"),
    issues: z.array(atsIssueSchema).describe("ATS parsing issues found in the resume"),
    readability: z.number().min(0).max(100).describe("How readable the resume is for both ATS and humans"),
    keywordDensity: z.string().describe("Assessment of keyword density — too sparse, well-balanced, or keyword-stuffed"),
  }).describe("ATS compatibility analysis"),
  keywordAnalysis: z.object({
    matchedKeywords: z.array(keywordEntrySchema).describe("Keywords from the job description found in the resume"),
    missingKeywords: z.array(keywordEntrySchema).describe("Keywords from the job description missing from the resume"),
    overusedKeywords: z.array(z.string()).describe("Keywords that appear too frequently without meaningful context"),
  }).describe("Keyword matching analysis comparing resume to job description"),
  contentQuality: contentQualitySchema.describe("Quality assessment of the resume content, writing style, and effectiveness"),
  skillGaps: z.array(skillGapSchema).describe("Skills the candidate needs to add or improve for this role, with learning resources"),
  preparationPlan: z.array(preparationPhaseSchema).describe("Multi-phase preparation roadmap with milestones to become job-ready"),
  atsResumeSuggestions: z.array(atsSuggestionSchema).describe("Section-by-section ATS optimization suggestions with before/after rewrites"),
  roleMatch: roleMatchSchema.describe("Analysis of what roles this resume fits and career level assessment"),
});

/**
 * Safely extract text from a Gemini response.
 * In @google/genai v1.x, response.text can throw for thinking-model responses.
 */
function extractText(response) {
  try {
    const t = response.text;
    if (t) return t;
  } catch {
    /* fall through */
  }
  // Fallback: collect non-thought parts from candidates
  return (
    response.candidates?.[0]?.content?.parts
      ?.filter((p) => !p.thought)
      ?.map((p) => p.text ?? "")
      ?.join("") ?? ""
  );
}

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `You are an expert resume analyst and ATS optimization specialist. Perform a thorough, data-driven analysis of this candidate's resume against the target job description.

  RESUME:
  ${resume}

  SELF-DESCRIPTION (candidate notes about themselves):
  ${selfDescription}

  TARGET JOB DESCRIPTION:
  ${jobDescription}

  ANALYZE AND PROVIDE:

  1. SECTION SCORES — Score each of these 6 sections (0-100) with specific, actionable feedback:
     - Summary/Objective
     - Experience (depth, relevance, impact)
     - Skills (hard + soft, alignment with JD)
     - Education (relevance, placement)
     - Projects/Portfolio
     - Formatting & Structure

  2. ATS COMPATIBILITY — Analyze for ATS-friendliness:
     - Overall ATS parsing score (0-100)
     - Specific parsing issues (missing section headers, complex formatting, images, tables, columns, unusual fonts, PDF text extraction problems)
     - Readability score (0-100)
     - Keyword density assessment (too sparse / well-balanced / keyword-stuffed)

  3. KEYWORD ANALYSIS — Compare resume keywords to job description:
     - matchedKeywords: keywords from JD found in resume (rate each relevance as high/medium/low)
     - missingKeywords: important keywords from JD NOT found in resume (rate relevance)
     - overusedKeywords: keywords that appear too frequently without substance

  4. CONTENT QUALITY — Evaluate the writing:
     - What the resume does well (strengths)
     - Where it falls short (weaknesses)
     - Action verb usage score (0-100)
     - Quantifiable achievements score (0-100) — does it use numbers, metrics, percentages?
     - Redundant/repeated content found
     - Overall content quality narrative (be brutally honest)

  5. SKILL GAPS — For each skill the candidate lacks:
     - Skill name, severity (how critical for this job)
     - Practical recommendation on how to build/acquire it
     - 2-3 specific learning resources (real course names, certifications, projects, or books)

  6. PREPARATION ROADMAP — A multi-phase plan (5-7 phases) to become fully job-ready:
     - Each phase has: phase number, focus area, estimated duration (e.g. "5-7 days"), actionable tasks, and completion milestones
     - Early phases: resume fixes, keyword optimization
     - Middle phases: skill development, project work
     - Later phases: portfolio building, networking strategy, mock preparation

  7. ATS RESUME SUGGESTIONS — Give 5-8 specific before/after rewrites:
     - Target different resume sections
     - Show a brief original excerpt (what the resume currently shows)
     - Provide the ATS-optimized improved version
     - Explain why the change improves ATS parsing

  8. ROLE MATCH — Career analysis:
     - 3-5 other job roles this resume also fits well, with match percentages
     - Suggested career progression path
     - Seniority level assessment (junior/mid/senior/lead)

  CRITICAL: Be specific, data-driven, and brutally honest. Use exact numbers/percentages where possible. Do not flatter — this is for improvement. Every score below 70 MUST have clear reasoning on why and how to fix it. Ensure you generate exactly 6 sections in sectionScores (Summary, Experience, Skills, Education, Projects, Formatting — in that order).
`;

  const response = await ai.models.generateContent({
    model: CONFIG.ai.GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: toGeminiSchema(interviewReportSchema),
    },
  });

  const text = extractText(response);
  if (!text) throw new Error("Gemini returned an empty response");
  return JSON.parse(text);
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
      ),
  });

  const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        CRITICAL: The resume MUST be extremely concise and perfectly fit onto a single page when printed. Be very brief with descriptions, limit the number of bullet points, use a compact layout with minimal whitespace in the HTML/CSS, and exclude any unnecessary sections. Focus on quality rather than quantity.
                    `;

  const response = await ai.models.generateContent({
    model: CONFIG.ai.GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: toGeminiSchema(resumePdfSchema),
    },
  });

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

export { generateInterviewReport, generateResumePdf };
