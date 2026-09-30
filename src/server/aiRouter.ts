import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export const aiRouter = Router();

export const AVAILABLE_MODELS = [
  // Google Gemini Models
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash (Google)',
    provider: 'gemini',
    description: 'Ultra-fast, stable code generation and reasoning (Default)',
    isFree: true,
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash (Google)',
    provider: 'gemini',
    description: 'Next-gen reasoning and multimodal code synthesis',
    isFree: true,
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro (Google)',
    provider: 'gemini',
    description: 'Complex architectural design and deep debugging',
    isFree: false,
  },
  // OpenRouter Verified Free Models
  {
    id: 'openrouter/free',
    name: 'Auto Free Router (OpenRouter)',
    provider: 'openrouter',
    description: 'Smart router that dynamically selects the best currently active free model (Recommended)',
    isFree: true,
  },
  {
    id: 'qwen/qwen3.8-27b:free',
    name: 'Qwen 3.8 27B (Free)',
    provider: 'openrouter',
    description: 'Flagship Qwen open-weights coding model with high precision',
    isFree: true,
  },
  {
    id: 'nvidia/nemotron-3.5-lightning:free',
    name: 'NVIDIA Nemotron 3.5 Lightning (Free)',
    provider: 'openrouter',
    description: 'Ultra-low latency reasoning model optimized by NVIDIA',
    isFree: true,
  },
  {
    id: 'liquid/lfm-2.5-2.6b:free',
    name: 'Liquid LFM 2.5 (Free)',
    provider: 'openrouter',
    description: 'Ultra-fast lightweight model for instant code snippets',
    isFree: true,
  },
  {
    id: 'inclusionai/ling-3.0-flash-sante:free',
    name: 'Ling 3.0 Flash (Free)',
    provider: 'openrouter',
    description: 'High-speed code completions and instruction following',
    isFree: true,
  },
];

// In-memory cache for live OpenRouter free models
let cachedOpenRouterModels: any[] = [];
let lastCacheTime = 0;

async function refreshOpenRouterModels() {
  const now = Date.now();
  // Refresh cache at most once every 30 minutes
  if (cachedOpenRouterModels.length > 0 && now - lastCacheTime < 30 * 60 * 1000) {
    return;
  }

  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return;
    const json: any = await res.json();
    if (!Array.isArray(json?.data)) return;

    const freeModels = json.data
      .filter((m: any) => m.id === 'openrouter/free' || (m.id.endsWith(':free') && !m.id.includes('gemma-4-31b')) || (m.pricing && m.pricing.prompt === '0' && m.pricing.completion === '0'))
      .map((m: any) => ({
        id: m.id,
        name: m.name || m.id,
        provider: 'openrouter',
        description: m.description ? m.description.slice(0, 100) + '...' : 'Free model on OpenRouter',
        isFree: true,
      }));

    if (freeModels.length > 0) {
      cachedOpenRouterModels = freeModels;
      lastCacheTime = now;
    }
  } catch {
    // Non-critical, fallback to hardcoded list
  }
}

// API Route: Get available AI models and provider status
aiRouter.get('/models', async (_req: Request, res: Response) => {
  const hasServerGeminiKey = Boolean(process.env.GEMINI_API_KEY);
  const hasServerOpenRouterKey = Boolean(process.env.OPENROUTER_API_KEY);

  // Background refresh
  refreshOpenRouterModels().catch(() => {});

  let combinedModels = [...AVAILABLE_MODELS];
  if (cachedOpenRouterModels.length > 0) {
    const geminiModels = AVAILABLE_MODELS.filter(m => m.provider === 'gemini');
    // Ensure openrouter/free is always at the top of OpenRouter models
    const sortedOpenRouter = [
      ...cachedOpenRouterModels.filter(m => m.id === 'openrouter/free'),
      ...cachedOpenRouterModels.filter(m => m.id !== 'openrouter/free'),
    ];
    combinedModels = [...geminiModels, ...sortedOpenRouter];
  }

  return res.json({
    models: combinedModels,
    hasServerGeminiKey,
    hasServerOpenRouterKey,
  });
});

// API Route: Generate Code / Chat / Assist
aiRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const {
      provider = 'gemini',
      model = 'gemini-2.5-flash',
      prompt,
      code = '',
      language = 'plaintext',
      action = 'chat',
      targetLanguage,
      userApiKey,
      history = [],
      workspaceDocs = [],
    } = req.body;

    if (!prompt && !code && (!Array.isArray(workspaceDocs) || workspaceDocs.length === 0)) {
      return res.status(400).json({ error: 'Prompt or document context is required.' });
    }

    const systemInstruction = `You are GitHub Copilot built directly into Notepad++ Web Edition.
You write clean, high-performance, production-ready code with accurate syntax, comments, and modern idiomatic patterns.
When writing code snippets, always format them inside markdown code fences with the language identifier (e.g. \`\`\`javascript ... \`\`\`).
Provide actionable code that users can immediately insert into their documents or save as new files with one click.
Be concise, accurate, and prioritize working code.`;

    let fullMessage = '';

    switch (action) {
      case 'analyze':
        fullMessage = `Please conduct a deep GitHub Copilot code analysis of the following ${language} code. Analyze architecture, bugs, security vulnerabilities, edge-case flaws, performance bottlenecks, and adherence to clean code standards:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide actionable findings and corrected code blocks:\n${prompt || 'Deep analysis and code review'}`;
        break;

      case 'test':
        fullMessage = `Please generate comprehensive, runnable unit tests for the following ${language} code. Include test cases for typical paths, boundary conditions, and error cases:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n${prompt ? `Specific testing requirements: ${prompt}` : ''}`;
        break;

      case 'explain':
        fullMessage = `Please explain the following ${language} code clearly and concisely. Highlight core logic, data flow, complexity, and potential edge cases:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nAdditional user instructions: ${prompt || 'None'}`;
        break;

      case 'fix':
        fullMessage = `Please analyze the following ${language} code, identify any bugs, performance issues, or edge case failures, and provide the corrected code with a brief explanation:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nIssue reported: ${prompt || 'Find and fix all bugs'}`;
        break;

      case 'refactor':
        fullMessage = `Please refactor the following ${language} code to improve readability, efficiency, idiomatic standards, and modularity without changing its behavior:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nSpecific goals: ${prompt || 'Refactor and modernize'}`;
        break;

      case 'doc':
        fullMessage = `Please add comprehensive documentation, JSDoc/docstrings, and clear inline comments explaining non-trivial logic for the following ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;
        break;

      case 'translate':
        fullMessage = `Please convert/translate the following ${language} code into ${targetLanguage || 'JavaScript'}. Ensure idiomatic patterns for ${targetLanguage || 'JavaScript'}:\n\n\`\`\`${language}\n${code}\n\`\`\``;
        break;

      case 'generate':
        fullMessage = `Generate complete, functional code for the following request in ${language}:\n${prompt}\n\n${code ? `Existing context/file snippet:\n\`\`\`${language}\n${code}\n\`\`\`` : ''}`;
        break;

      case 'chat':
      default:
        fullMessage = prompt || 'Analyze this code';
        if (code) {
          fullMessage += `\n\n[Active Document Context (${language})]:\n\`\`\`${language}\n${code}\n\`\`\``;
        }
        break;
    }

    // Attach workspace open documents if requested
    if (Array.isArray(workspaceDocs) && workspaceDocs.length > 0) {
      fullMessage += `\n\n[Workspace Open Documents Context (${workspaceDocs.length} files)]:\n` +
        workspaceDocs
          .map((d: any) => `### File: ${d.name} (${d.language || 'text'})\n\`\`\`${d.language || 'text'}\n${(d.content || '').slice(0, 4000)}\n\`\`\``)
          .join('\n\n');
    }

    // Provider 1: Google Gemini (default or user selected)
    if (provider === 'gemini') {
      const apiKey = userApiKey || process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          error: 'Google Gemini API key not found. Please provide an API key in the AI Assistant settings or configure GEMINI_API_KEY.',
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Prepare ordered fallback candidates for high availability and zero quota blocking
      const candidateModels = Array.from(new Set([
        model,
        'gemini-2.5-flash',
        'gemini-3.8-flash',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
      ])).filter(Boolean);

      // Prepare conversation if history exists
      let contents: any = fullMessage;
      if (Array.isArray(history) && history.length > 0) {
        contents = [
          ...history.map((h: { role: string; content: string }) => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }],
          })),
          { role: 'user', parts: [{ text: fullMessage }] },
        ];
      }

      let responseText = '';
      let modelUsed = candidateModels[0];
      let lastError: any = null;

      for (const candidate of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: candidate,
            contents,
            config: {
              systemInstruction,
            },
          });
          responseText = response.text || '';
          modelUsed = candidate;
          break;
        } catch (err: any) {
          lastError = err;
          // Silently continue to next candidate on quota/rate-limit failure
          continue;
        }
      }

      if (!responseText && lastError) {
        return res.status(500).json({
          error: lastError?.message || 'Google Gemini request failed. Please verify API key or quota.',
        });
      }

      return res.json({
        text: responseText,
        provider: 'gemini',
        model: modelUsed,
      });
    }

    // Provider 2: OpenRouter
    if (provider === 'openrouter') {
      const apiKey = userApiKey || process.env.OPENROUTER_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          error: 'OpenRouter API key is required. Please paste your OpenRouter API key in the AI Assistant settings (free keys available at openrouter.ai).',
        });
      }

      const messages: Array<{ role: string; content: string }> = [
        { role: 'system', content: systemInstruction },
      ];

      if (Array.isArray(history) && history.length > 0) {
        for (const item of history) {
          messages.push({
            role: item.role === 'assistant' ? 'assistant' : 'user',
            content: item.content,
          });
        }
      }

      messages.push({ role: 'user', content: fullMessage });

      // Clean/normalize deprecated slugs
      let requestedModel = model;
      if (
        !requestedModel ||
        requestedModel.includes('qwen-2.5-coder') ||
        requestedModel.includes('llama-3.3-70b') ||
        requestedModel.includes('mistral-small') ||
        requestedModel.includes('gemma-4-31b')
      ) {
        requestedModel = 'openrouter/free';
      }

      const executeOpenRouterCall = async (modelSlug: string) => {
        return fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://notepad-plus-plus-web.app',
            'X-Title': 'Notepad++ Web Edition',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelSlug,
            messages,
            temperature: 0.2,
          }),
        });
      };

      let activeModel = requestedModel;
      let openRouterResponse = await executeOpenRouterCall(activeModel);

      // Automatic silent fallback if chosen model is deprecated or unavailable for free
      if (!openRouterResponse.ok) {
        const errBody = await openRouterResponse.text();
        let parsedError = errBody;
        try {
          const jsonErr = JSON.parse(errBody);
          parsedError = jsonErr.error?.message || jsonErr.message || errBody;
        } catch {}

        const isUnavailableForFree =
          openRouterResponse.status === 404 ||
          parsedError.toLowerCase().includes('unavailable for free') ||
          parsedError.toLowerCase().includes('slug instead') ||
          parsedError.toLowerCase().includes('not found') ||
          parsedError.toLowerCase().includes('provider returned error') ||
          openRouterResponse.status === 429;

        if (isUnavailableForFree && activeModel !== 'openrouter/free') {
          // Silently retry with openrouter/free
          activeModel = 'openrouter/free';
          openRouterResponse = await executeOpenRouterCall(activeModel);
        } else {
          return res.status(openRouterResponse.status).json({
            error: `OpenRouter API error (${openRouterResponse.status}): ${parsedError}`,
          });
        }
      }

      // If retry also failed, return parsed error
      if (!openRouterResponse.ok) {
        const errBody = await openRouterResponse.text();
        let parsedError = errBody;
        try {
          const jsonErr = JSON.parse(errBody);
          parsedError = jsonErr.error?.message || jsonErr.message || errBody;
        } catch {}
        return res.status(openRouterResponse.status).json({
          error: `OpenRouter API error (${openRouterResponse.status}): ${parsedError}`,
        });
      }

      const data: any = await openRouterResponse.json();
      const textOutput = data.choices?.[0]?.message?.content || '';

      return res.json({
        text: textOutput,
        provider: 'openrouter',
        model: activeModel,
      });
    }

    return res.status(400).json({ error: `Unsupported provider: ${provider}` });
  } catch (err: any) {
    return res.status(500).json({
      error: err?.message || 'An unexpected error occurred during AI code generation.',
    });
  }
});
