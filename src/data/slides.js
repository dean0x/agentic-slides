import { Terminal, Brain, Layers, Code, Cpu, Image, Share2, Network, Server, MessageSquare, Zap, AlertTriangle, Rocket, TrendingUp, Activity, GitBranch, Search, CheckCircle, BookOpen, Database, Lock, Users, Target, Clock, Shield, File, Filter } from 'lucide-react';

import introImg from '../assets/intro_slide.jpg';
import heroImg from '../assets/hero.png';
import networkImg from '../assets/network.png';
import ragImg from '../assets/rag.png';
import foundationsImg from '../assets/user_foundations.jpg';
import promptImg from '../assets/prompt_engineering_v2.jpg';
import structuredImg from '../assets/structured_output_v2.jpg';
import apisImg from '../assets/apis_v2.jpg';
import ragModuleImg from '../assets/rag-module.jpg';
import toolUseImg from '../assets/tool_use.jpg';
import mcpImg from '../assets/mcp.jpg';
import agentsImg from '../assets/agents.png';
import agenticLoopImg from '../assets/agentic-loop.png';
import letBuildImg from '../assets/let-build.png';

export const slides = [
  // --- OPENING ---
  {
    id: 1,
    title: "Gen AI Hackathon Education Session",
    subtitle: "Curriculum",
    content: "Equipping you with the knowledge and tools to succeed in the Gen AI Hackathon.",
    image: introImg,
    icon: Rocket,
    type: "title"
  },
  {
    id: 2,
    title: "Session Overview",
    subtitle: "Agenda",
    content: "What we will cover today (~2 hours).",
    items: [
      { title: "1. Foundations", text: "Understanding LLMs" },
      { title: "2. Prompt Engineering", text: "Communication & Structured Output" },
      { title: "3. APIs & Tools", text: "Integration & Function Calling" },
      { title: "4. RAG", text: "Retrieval Augmented Generation" },
      { title: "5. Agents", text: "MCP & Agentic Loops" },
    ],
    icon: BookOpen,
    type: "list"
  },
  {
    id: 3,
    title: "The AI Moment",
    subtitle: "Why We Are Here",
    content: "AI is reshaping software development at an unprecedented pace.",
    items: [
      { title: "85%", text: "Developers regularly use AI tools for coding (JetBrains 2025)", icon: Code, color: "text-blue-400" },
      { title: "41%", text: "Code in 2025 is AI-generated or AI-assisted (Industry Reports)", icon: Code, color: "text-purple-400" },
      { title: "25%", text: "Of Google's code is now AI-assisted (Sundar Pichai)", icon: Activity, color: "text-orange-400" },
      { title: "23%", text: "Enterprises scaling agentic AI, 39% experimenting (McKinsey 2025)", icon: Rocket, color: "text-cyan-400" },
    ],
    icon: Activity,
    type: "cards"
  },

  // --- MODULE 1: FOUNDATIONS ---
  {
    id: 4,
    title: "Module 1: Foundations",
    subtitle: "Understanding LLMs",
    content: "Level-setting on how Large Language Models actually work.",
    image: foundationsImg,
    icon: Brain,
    type: "title"
  },
  {
    id: 5,
    title: "What are LLMs?",
    content: "At their core, they are pattern recognition engines trained on internet-scale text.",
    items: [
      { title: "Training", text: "Learns from massive datasets to understand language structure." },
      { title: "Prediction", text: "Predicts the next token based on context." },
      { title: "Stochastic", text: "The same prompt can yield different outputs." },
    ],
    icon: Brain,
    type: "list"
  },
  {
    id: 6,
    title: "Key Concepts",
    content: "The vocabulary you need to know.",
    items: [
      { title: "Tokens", text: "~4 chars. The atomic unit of text.", icon: Layers },
      { title: "Context Window", text: "The 'memory' limit (e.g., 128k tokens).", icon: Layers },
      { title: "Temperature", text: "Creativity setting (0 = precise, 1 = creative).", icon: Activity },
      { title: "Top-p", text: "Nucleus sampling. Another way to control diversity.", icon: Filter },
      { title: "Stochastic Nature", text: "Non-deterministic outputs.", icon: Activity },
    ],
    icon: Layers,
    type: "cards"
  },
  {
    id: 7,
    title: "Model Landscape",
    content: "Choosing the right tool for the job.",
    items: [
      { title: "Anthropic", text: "Claude 4.5 Opus. Best for coding & reasoning tasks.", icon: Brain, color: "text-orange-400" },
      { title: "OpenAI", text: "GPT-5. Multimodal powerhouse with state-of-the-art performance.", icon: Zap, color: "text-green-400" },
      { title: "Google", text: "Gemini 3.0 Pro. Top benchmark performer, 1M token context.", icon: Layers, color: "text-blue-400" },
      { title: "DeepSeek", text: "DeepSeek R1. Cost-efficient reasoning & math specialist.", icon: Cpu, color: "text-purple-400" },
      { title: "Qwen", text: "Qwen 3. Multilingual efficiency, 119 languages supported.", icon: Server, color: "text-cyan-400" },
    ],
    icon: Cpu,
    type: "cards"
  },
  {
    id: 8,
    title: "Model Selection",
    content: "Trade-offs to consider for your hackathon project.",
    items: [
      { title: "Speed vs Capability", text: "Do you need instant answers or deep reasoning?" },
      { title: "Cost", text: "Bigger models cost more per token." },
      { title: "Context Size", text: "Do you need to dump a whole book into the prompt?" },
    ],
    icon: Target,
    type: "list"
  },

  // --- MODULE 2: PROMPT ENGINEERING ---
  {
    id: 9,
    title: "Module 2: Prompt Engineering",
    subtitle: "Communication",
    content: "Clear structure and context matter more than clever wording.",
    image: promptImg,
    icon: MessageSquare,
    type: "title"
  },
  {
    id: 10,
    title: "Core Principles",
    content: "\"Most prompt failures come from ambiguity, not model limitations.\"",
    items: [
      { title: "Be Specific", text: "Vague instructions yield vague results." },
      { title: "Iterate", text: "Prompting is an iterative process." },
    ],
    icon: MessageSquare,
    type: "list"
  },
  {
    id: 11,
    title: "Technique 1: Context & Constraints",
    content: "Set the stage for the model.",
    code: `You are a senior software architect reviewing code.
The codebase uses TypeScript, Node.js, and PostgreSQL.
Focus on security vulnerabilities and performance issues.`,
    icon: Code,
    type: "code_split"
  },
  {
    id: 12,
    title: "Technique 2: Role/Persona",
    content: "Give the model a frame of reference.",
    items: [
      { title: "Expert", text: "You are a world-class copywriter..." },
      { title: "Teacher", text: "Explain this to a 5-year-old..." },
      { title: "Critic", text: "Critique this design for usability..." },
    ],
    icon: Users,
    type: "list"
  },
  {
    id: 13,
    title: "Technique 3: Few-Shot",
    content: "Provide examples of input -> output.",
    code: `Convert product to JSON:

Input: "Red Nike shoes, $90"
Output: {"brand": "Nike", "color": "red", "price": 90}

Input: "Blue Adidas cleats, $120"
Output:`,
    icon: Code,
    type: "code_split"
  },
  {
    id: 14,
    title: "Technique 4: Chain of Thought",
    content: "Ask it to 'Think step-by-step'.",
    items: [
      { title: "Reasoning", text: "Forces the model to plan before answering." },
      { title: "Accuracy", text: "Dramatically improves performance on complex tasks." },
    ],
    icon: Brain,
    type: "list"
  },
  {
    id: 15,
    title: "Technique 5: Output Format",
    content: "Specify exactly what you want back.",
    items: [
      { title: "JSON", text: "For programmatic use." },
      { title: "Markdown", text: "For readable documents." },
      { title: "CSV", text: "For data processing." },
    ],
    icon: Terminal,
    type: "list"
  },

  // --- MODULE 2B: STRUCTURED OUTPUT ---
  {
    id: 16,
    title: "Module 2B: Structured Output",
    subtitle: "Reliability",
    content: "Ensuring LLM outputs are parseable for your code.",
    image: structuredImg,
    icon: Code,
    type: "title"
  },
  {
    id: 17,
    title: "Why Structured Output?",
    content: "When building apps, you need predictability.",
    items: [
      { title: "Type Safety", text: "Ensure data matches your schema." },
      { title: "Integration", text: "Directly use output in your code." },
      { title: "No Regex", text: "Stop parsing text manually." },
    ],
    icon: Shield,
    type: "list"
  },
  {
    id: 18,
    title: "Approach 1: Prompt-Based",
    content: "The basic way. Just ask for JSON.",
    code: `Respond ONLY with valid JSON:
{
  "sentiment": "positive" | "negative",
  "confidence": <float>
}`,
    icon: MessageSquare,
    type: "code_split"
  },
  {
    id: 19,
    title: "Approach 2: Native JSON Mode",
    content: "Most APIs support this now.",
    code: `const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [...],
  response_format: { type: "json_object" }
});`,
    icon: Code,
    type: "code_split"
  },
  {
    id: 20,
    title: "Approach 3: Schema-Enforced",
    content: "The best way. Define a schema.",
    code: `interface Sentiment {
  sentiment: "positive" | "negative";
  confidence: number;
}

const response = await client.beta.chat.completions.parse({
  model: "gpt-4o",
  response_format: { type: "json_schema", schema: SentimentSchema }
});`,
    icon: Code,
    type: "code_split"
  },
  {
    id: 21,
    title: "Zod Validation",
    content: "Validate the data after you get it.",
    code: `import { z } from 'zod';

const ProductReviewSchema = z.object({
  summary: z.string().max(200),
  tags: z.array(z.string()).max(5).refine(
    (tags) => tags.length > 0,
    { message: "No tags provided" }
  )
});

type ProductReview = z.infer<typeof ProductReviewSchema>;`,
    icon: Code,
    type: "code_split"
  },
  {
    id: 22,
    title: "Best Practice: Validation",
    content: "Always validate LLM output before using it in your application.",
    code: `import { z } from 'zod';

const ResponseSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  score: z.number().min(0).max(1)
});

const response = await client.messages.create({
  model: "claude-3-5-sonnet-20240620",
  messages: [{ role: "user", content: prompt }],
  response_format: { type: "json_object" }
});

// Parse and validate
const json = JSON.parse(response.content[0].text);
const result = ResponseSchema.parse(json); // Throws if invalid

console.log(result.sentiment); // Type-safe access`,
    icon: CheckCircle,
    type: "code_split"
  },
  {
    id: 23,
    title: "Best Practice: Error Handling",
    content: "Handle API errors and invalid responses gracefully with fallbacks.",
    code: `async function callLLM(prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20240620",
        messages: [{ role: "user", content: prompt }]
      });

      return response.content[0].text;
    } catch (error) {
      if (error.status === 429) {
        // Rate limit - wait and retry
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      } else if (i === retries - 1) {
        // Last retry failed - return fallback
        return "Service temporarily unavailable";
      }
    }
  }
}`,
    icon: Shield,
    type: "code_split"
  },
  {
    id: 24,
    title: "Best Practice: Constraints",
    content: "Set explicit constraints on output length and structure.",
    code: `const ProductSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  tags: z.array(z.string()).max(5),
  price: z.number().positive().max(999999)
});

const prompt = \`Extract product info. Return JSON.
Constraints:
- Name: 1-100 chars
- Description: max 500 chars
- Tags: max 5 items
- Price: positive number under 1M

Product: "\${productText}"\`;

const response = await client.messages.create({
  model: "claude-3-5-sonnet-20240620",
  messages: [{ role: "user", content: prompt }]
});`,
    icon: Lock,
    type: "code_split"
  },
  {
    id: 25,
    title: "Advanced Pattern: Prompt Chaining",
    content: "Break complex tasks into sequential steps where each output feeds the next.",
    code: `// Step 1: Research
const research = await client.messages.create({
  model: "claude-3-5-sonnet-20240620",
  messages: [{ role: "user", content: "Research key features of EVs" }]
});
const researchText = research.content[0].text;

// Step 2: Outline (uses research output)
const outline = await client.messages.create({
  model: "claude-3-5-sonnet-20240620",
  messages: [{ role: "user", content:
    \`Create outline based on: \${researchText}\` }]
});
const outlineText = outline.content[0].text;

// Step 3: Draft (uses outline output)
const draft = await client.messages.create({
  model: "claude-3-5-sonnet-20240620",
  messages: [{ role: "user", content:
    \`Write blog post from: \${outlineText}\` }]
});`,
    icon: GitBranch,
    type: "code_split"
  },
  {
    id: 26,
    title: "Layered Prompting",
    content: "Combine multiple techniques in a single prompt for maximum effectiveness.",
    code: `const userFeedback = "The checkout is too slow...";

const response = await client.messages.create({
  model: "claude-3-5-sonnet-20240620",
  messages: [{
    role: "user",
    content: \`You are a senior product manager (ROLE).

Analyze feedback and return JSON (FORMAT):
{
  "sentiment": "positive" | "negative",
  "priority": "high" | "medium" | "low",
  "themes": ["theme1", "theme2"]
}

Think step-by-step (REASONING).

Constraints (CONSTRAINTS):
- Max 3 themes
- Priority = impact + urgency

Feedback: "\${userFeedback}"\`
  }],
  response_format: { type: "json_object" }
});`,
    icon: Layers,
    type: "code_split"
  },

  // --- MODULE 3: APIs ---
  {
    id: 27,
    title: "Module 3: Working with APIs",
    subtitle: "Integration",
    content: "Programmatic access to intelligence.",
    image: apisImg,
    icon: Terminal,
    type: "title"
  },
  {
    id: 28,
    title: "API Basics",
    content: "Simple, stateless HTTP requests.",
    code: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const message = await client.messages.create({
  model: "claude-3-5-sonnet-20240620",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "Hello!" }
  ]
});

console.log(message.content[0].text);`,
    icon: Code,
    type: "code_split"
  },
  {
    id: 29,
    title: "Key Parameters",
    content: "Tuning the response.",
    items: [
      { title: "model", text: "Which model to use (e.g. gpt-4o, claude-3.5-sonnet)." },
      { title: "messages", text: "Conversation history array." },
      { title: "System Prompt", text: "Instructions for behavior/persona." },
      { title: "Max Tokens", text: "Limit the response length." },
      { title: "Temperature", text: "Control randomness." },
    ],
    icon: Activity,
    type: "list"
  },
  {
    id: 30,
    title: "Streaming vs Non-Streaming",
    content: "Improving User Experience.",
    items: [
      { title: "Non-Streaming", text: "Wait for the full response. Good for backend jobs." },
      { title: "Streaming", text: "Receive tokens as they come. Essential for chat UIs." },
    ],
    icon: Zap,
    type: "list"
  },
  {
    id: 31,
    title: "Production Concerns",
    content: "Things to watch out for.",
    items: [
      { title: "Rate Limits", text: "Handle 429 errors with backoff." },
      { title: "Cost", text: "Monitor token usage." },
      { title: "Latency", text: "Cache responses where possible." },
    ],
    icon: AlertTriangle,
    type: "cards"
  },

  // --- MODULE 4: RAG ---
  {
    id: 32,
    title: "Module 4: RAG",
    subtitle: "Retrieval Augmented Generation",
    content: "Giving LLMs access to your custom data.",
    image: ragModuleImg,
    icon: Search,
    type: "title"
  },
  {
    id: 33,
    title: "Why RAG?",
    content: "Overcoming LLM limitations.",
    items: [
      { title: "Knowledge Cutoff", text: "LLMs don't know current events." },
      { title: "Private Data", text: "LLMs don't know your company data." },
      { title: "Hallucinations", text: "Grounding answers in facts reduces errors." },
    ],
    icon: Search,
    type: "list"
  },
  {
    id: 34,
    title: "RAG Architecture",
    content: "The flow of data from document to answer.",
    visualType: "mermaid",
    visualContent: `graph TD
    A[Document] -->|Chunk| B(Chunks)
    B -->|Embed| C{Vector DB}
    D[User Query] -->|Embed| E(Query Vector)
    E -->|Search| C
    C -->|Retrieve| F[Relevant Chunks]
    F -->|Context| G[LLM]
    D -->|Prompt| G
    G -->|Answer| H[Response]`,
    icon: Layers,
    type: "mermaid_split"
  },
  {
    id: 35,
    title: "Step 1: Chunking",
    content: "Breaking data down.",
    items: [
      { title: "Size", text: "500-1000 tokens is typical." },
      { title: "Overlap", text: "Keep context between chunks (10-20%)." },
      { title: "Strategy", text: "Split by paragraph, markdown header, etc." },
    ],
    icon: File,
    type: "list"
  },
  {
    id: 36,
    title: "Step 2: Embedding",
    content: "Text to Numbers.",
    items: [
      { title: "Vectors", text: "Semantic representation of text." },
      { title: "Models", text: "OpenAI text-embedding-3, Cohere, Voyage." },
      { title: "Similarity", text: "Cosine similarity finds related content." },
    ],
    icon: Code,
    type: "list"
  },
  {
    id: 37,
    title: "Step 3: Vector Databases",
    content: "Where to store your embeddings.",
    items: [
      { title: "Pinecone", text: "Managed, scalable.", icon: Database },
      { title: "Chroma", text: "Open source, local dev.", icon: Database },
      { title: "Weaviate", text: "Hybrid search, open source.", icon: Database },
      { title: "Qdrant", text: "High performance, Rust-based.", icon: Database },
      { title: "pgvector", text: "PostgreSQL extension.", icon: Database },
    ],
    icon: Database,
    type: "cards"
  },
  {
    id: 38,
    title: "Step 4 & 5: Retrieval & Generation",
    content: "The Query Loop.",
    items: [
      { title: "Query", text: "Embed user question." },
      { title: "Search", text: "Find top-k similar chunks." },
      { title: "Prompt", text: "Inject chunks into system prompt." },
      { title: "Answer", text: "LLM generates response based on chunks." },
    ],
    icon: Search,
    type: "list"
  },
  {
    id: 39,
    title: "RAG Best Practices (2025)",
    content: "Optimizing for quality.",
    items: [
      { title: "Hybrid Search", text: "Combine Semantic (Vector) + Keyword (BM25)." },
      { title: "Reranking", text: "Use a reranker model to re-sort results." },
      { title: "Metadata Filtering", text: "Filter by date/source before retrieval." },
      { title: "Query Augmentation", text: "Expand/rephrase queries." },
    ],
    icon: CheckCircle,
    type: "list"
  },
  {
    id: 40,
    title: "Advanced RAG Variants",
    content: "For complex use cases.",
    items: [
      { title: "GraphRAG", text: "Uses knowledge graphs for complex relationships." },
      { title: "Self-RAG", text: "Self-reflective retrieval for higher accuracy." },
      { title: "Corrective RAG", text: "Validates and corrects retrieved info." },
      { title: "Agentic RAG", text: "Multi-step retrieval strategies." },
    ],
    icon: TrendingUp,
    type: "cards"
  },

  // --- MODULE 5: TOOL USE ---
  {
    id: 41,
    title: "Module 5: Tool Use",
    subtitle: "Function Calling",
    content: "Connecting LLMs to the outside world.",
    image: toolUseImg,
    icon: Zap,
    type: "title"
  },
  {
    id: 42,
    title: "What is Tool Use?",
    content: "Giving LLMs hands.",
    items: [
      { title: "Search", text: "Browse the web." },
      { title: "Execute", text: "Run Python code." },
      { title: "Query", text: "Access databases." },
      { title: "Interact", text: "Call APIs, send emails, manage files." },
    ],
    icon: Zap,
    type: "list"
  },
  {
    id: 43,
    title: "How It Works",
    content: "The model decides when to call a function.",
    code: `{
  "name": "get_weather",
  "description": "Get current weather",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {"type": "string"}
    }
  }
}`,
    icon: Code,
    type: "code_split"
  },
  {
    id: 44,
    title: "Tool Call in Action",
    content: "Calling Claude with tools and executing them when requested.",
    code: `const response = await client.messages.create({
  model: "claude-3-5-sonnet-20240620",
  messages: [{ role: "user", content: "What's the weather in NYC?" }],
  tools: [getWeatherTool] // Tool definitions from previous slide
});

// Claude responds with tool_use
if (response.stop_reason === "tool_use") {
  const toolUse = response.content.find(c => c.type === "tool_use");
  const weather = await getWeather(toolUse.input.location);
  // Send result back to Claude...
}`,
    icon: Code,
    type: "code_split"
  },
  {
    id: 45,
    title: "Common Patterns",
    content: "What can you do with tools?",
    items: [
      { title: "Web Search", text: "Get real-time info.", icon: Search },
      { title: "Code Execution", text: "Solve math, process data.", icon: Terminal },
      { title: "Database", text: "Query your SQL DB.", icon: Database },
      { title: "Actions", text: "Send emails, create tickets, etc.", icon: Zap },
    ],
    icon: Zap,
    type: "list"
  },

  // --- MODULE 6: MCP ---
  {
    id: 46,
    title: "Module 6: MCP",
    subtitle: "Model Context Protocol",
    content: "The 'USB-C' for AI applications.",
    image: mcpImg,
    icon: Network,
    type: "title"
  },
  {
    id: 47,
    title: "Why MCP?",
    content: "Standardized connection between AI and data.",
    items: [
      { title: "Universal", text: "Write once, use with any client." },
      { title: "Ecosystem", text: "Thousands of pre-built servers." },
      { title: "N x M Problem", text: "Solves the integration explosion." },
    ],
    icon: Share2,
    type: "list"
  },
  {
    id: 48,
    title: "MCP Architecture",
    content: "Client-Server protocol connecting AI applications to data sources and tools.",
    visualType: "mermaid",
    visualContent: `graph LR
    Client[MCP Client<br/>Claude Desktop, Cursor, IDE]
    Protocol[JSON-RPC Protocol<br/>Standardized Messages]
    Server1[MCP Server<br/>GitHub]
    Server2[MCP Server<br/>Google Drive]
    Server3[MCP Server<br/>PostgreSQL]

    Client <-->|Tools Request| Protocol
    Client <-->|Resources Request| Protocol
    Client <-->|Prompts Request| Protocol

    Protocol <-->|Response| Server1
    Protocol <-->|Response| Server2
    Protocol <-->|Response| Server3

    style Client fill:#e0e7ff
    style Protocol fill:#fef3c7
    style Server1 fill:#d1fae5
    style Server2 fill:#d1fae5
    style Server3 fill:#d1fae5`,
    icon: Network,
    type: "mermaid_split"
  },
  {
    id: 49,
    title: "MCP Primitives",
    content: "What can MCP do?",
    items: [
      { title: "Tools", text: "Functions the model can call.", icon: Zap },
      { title: "Resources", text: "Data sources to read from.", icon: Database },
      { title: "Prompts", text: "Pre-built templates.", icon: MessageSquare },
    ],
    icon: Layers,
    type: "cards"
  },
  {
    id: 50,
    title: "Pre-built Servers",
    content: "Ready to use integrations.",
    items: [
      { title: "Filesystem", text: "Read/Write local files." },
      { title: "GitHub/Git", text: "Repository management." },
      { title: "PostgreSQL", text: "Database access." },
      { title: "Playwright", text: "Browser automation." },
      { title: "Jira", text: "Project management." },
    ],
    icon: Server,
    type: "list"
  },
  {
    id: 51,
    title: "Getting Started",
    content: "How to use MCP.",
    items: [
      { title: "Claude Desktop", text: "Enable MCP in settings." },
      { title: "Cursor", text: "Test and use MCP servers." },
      { title: "GitHub Copilot", text: "MCP support available." },
      { title: "SDKs", text: "Python & TypeScript SDKs available." },
    ],
    icon: Rocket,
    type: "list"
  },

  // --- MODULE 7: AGENTS ---
  {
    id: 52,
    title: "Module 7: Agents",
    subtitle: "Autonomous Systems",
    content: "Systems that Perceive, Reason, Act, and Learn.",
    image: agentsImg,
    icon: Rocket,
    type: "title"
  },
  {
    id: 53,
    title: "What are Agents?",
    content: "Beyond simple chatbots. Agents are autonomous systems that perceive their environment, reason about goals, take actions, and learn from results.",
    visualType: "mermaid",
    visualContent: `graph TB
    Start([User Goal]) --> Perceive[Perceive<br/>Context & Environment]
    Perceive --> Reason[Reason<br/>Plan & Strategy]
    Reason --> Act[Act<br/>Execute Tools]
    Act --> Observe[Observe<br/>Results & Feedback]
    Observe --> Learn{Goal<br/>Achieved?}
    Learn -->|No| Perceive
    Learn -->|Yes| End([Complete])

    style Start fill:#e0e7ff
    style End fill:#d1fae5
    style Perceive fill:#fef3c7
    style Reason fill:#ddd6fe
    style Act fill:#fecaca
    style Observe fill:#bfdbfe
    style Learn fill:#fed7aa`,
    icon: Brain,
    type: "mermaid_split"
  },
  {
    id: 54,
    title: "Agent Architecture",
    content: "The internal components that power an agent system.",
    visualType: "mermaid",
    visualContent: `graph TB
    User[User Input] --> Agent[Agent Core]

    Agent --> LLM[LLM Brain<br/>Reasoning & Planning]

    LLM --> Memory[(Memory<br/>Conversation History)]
    Memory --> LLM

    LLM --> RAG[RAG System<br/>External Knowledge]
    RAG --> VectorDB[(Vector DB<br/>Embeddings)]
    VectorDB --> RAG
    RAG --> LLM

    LLM --> Tools[Tool Execution<br/>MCP / Functions]
    Tools --> API[External APIs<br/>Databases, Web, etc.]
    API --> Tools
    Tools --> LLM

    LLM --> Response[Response to User]
    Response --> User

    style User fill:#e0e7ff
    style Agent fill:#fef3c7
    style LLM fill:#ddd6fe
    style Memory fill:#bfdbfe
    style RAG fill:#fecaca
    style VectorDB fill:#fed7aa
    style Tools fill:#d1fae5
    style API fill:#e9d5ff
    style Response fill:#e0e7ff`,
    icon: Layers,
    type: "mermaid_split"
  },

  // --- MODULE 7A: AGENTIC LOOPS ---
  {
    id: 55,
    title: "Module 7A: Agentic Loops",
    subtitle: "Reasoning",
    content: "How agents execute complex tasks.",
    image: agenticLoopImg,
    icon: Activity,
    type: "title"
  },
  {
    id: 56,
    title: "The Core Loop",
    content: "The fundamental cycle that powers all agentic systems: perceive the environment, reason about next steps, take action, and repeat.",
    visualType: "mermaid",
    visualContent: `graph TD
      Start([User Goal]) --> Perceive[Perceive<br/>Read context & history]
      Perceive --> Think[Think<br/>LLM decides next step]
      Think --> Decision{Tool<br/>Needed?}
      Decision -->|Yes| Act[Act<br/>Execute tool]
      Act --> Observe[Observe<br/>Capture result]
      Observe --> Perceive
      Decision -->|No| Answer[Return Answer]
      Answer --> End([Complete])

      style Start fill:#e0e7ff
      style End fill:#d1fae5
      style Perceive fill:#fef3c7
      style Think fill:#ddd6fe
      style Act fill:#fecaca
      style Observe fill:#bfdbfe
      style Decision fill:#fed7aa
      style Answer fill:#d1fae5`,
    icon: Code,
    type: "mermaid_split"
  },
  {
    id: 57,
    title: "ReAct Pattern",
    content: "Reasoning + Acting. The agent alternates between thinking (reasoning) and doing (acting with tools) until it reaches a solution.",
    code: `// "What's the weather in San Francisco?"

while (!done) {
  // Thought: Reason about next step
  const response = await callClaude(prompt, observation);

  // Action: Execute tool if needed
  if (response.needsTool) {
    observation = await executeTool(response.tool);
    continue; // Loop back to think
  }

  // Answer: Done reasoning
  return response.answer;
}`,
    icon: MessageSquare,
    type: "code_split"
  },
  {
    id: 58,
    title: "Planning Pattern: Plan-Execute",
    content: "Create a complete plan upfront, then execute each step sequentially.",
    code: `// Step 1: Create the plan
const plan = await callClaude(\`Create a step-by-step plan
to research and write a blog post about AI agents.\`);

// plan.steps = [
//   "1. Research AI agent architectures",
//   "2. Find real-world examples",
//   "3. Create outline",
//   "4. Write draft",
//   "5. Review and edit"
// ]

// Step 2: Execute each step
for (const step of plan.steps) {
  const result = await executeStep(step);
  results.push(result);
}`,
    icon: GitBranch,
    type: "code_split"
  },
  {
    id: 59,
    title: "Planning Pattern: Reflexion",
    content: "Try an approach, evaluate the result, learn from mistakes, and retry with improvements.",
    code: `let attempt = 0;
let maxAttempts = 3;

while (attempt < maxAttempts) {
  // Try: Execute the task
  const result = await executeTask(prompt);

  // Evaluate: Check quality
  const evaluation = await callClaude(\`Review this result
  and identify issues: \${result}\`);

  if (evaluation.isGood) {
    return result; // Success!
  }

  // Correct: Learn and improve
  prompt = \`Previous attempt failed because:
  \${evaluation.issues}. Try again with improvements.\`;
  attempt++;
}`,
    icon: GitBranch,
    type: "code_split"
  },
  {
    id: 60,
    title: "Planning Pattern: Tree of Thoughts",
    content: "Explore multiple solution paths in parallel, evaluate each, and choose the best one.",
    code: `// Generate multiple approaches
const approaches = await callClaude(\`Generate 3 different
approaches to solve: \${problem}\`);

// Explore each path
const results = await Promise.all(
  approaches.map(async (approach) => {
    const solution = await executePath(approach);
    const score = await evaluateSolution(solution);
    return { solution, score, approach };
  })
);

// Pick the best
const best = results.sort((a, b) =>
  b.score - a.score
)[0];

return best.solution;`,
    icon: GitBranch,
    type: "code_split"
  },
  {
    id: 61,
    title: "Controlling Behavior",
    content: "Keeping agents in check.",
    items: [
      { title: "Loops", text: "Set max iterations." },
      { title: "Budget", text: "Limit token usage." },
      { title: "Human-in-the-loop", text: "Ask for approval." },
    ],
    icon: Lock,
    type: "cards"
  },
  {
    id: 62,
    title: "Frameworks",
    content: "Don't build from scratch if you don't have to.",
    items: [
      { title: "LangChain", text: "General LLM apps. Modular." },
      { title: "LangGraph", text: "Complex, stateful workflows." },
      { title: "CrewAI", text: "Multi-agent teams." },
      { title: "AutoGen", text: "Multi-agent conversations." },
      { title: "OpenAI Agents SDK", text: "OpenAI-native." },
      { title: "Smolagents", text: "Lightweight." },
    ],
    icon: Layers,
    type: "cards"
  },

  // --- CLOSING ---
  {
    id: 63,
    title: "Resources",
    content: "Bookmark these.",
    items: [
      { title: "MCP Boilerplate", text: "https://mcpboilerplate.com - Quick start MCP servers" },
      { title: "RAGFlow", text: "https://github.com/infiniflow/ragflow - Open-source RAG engine" },
      { title: "LangGraph", text: "https://github.com/langchain-ai/langgraph - Build stateful agents" },
      { title: "Claude Agent SDK", text: "https://platform.claude.com/docs/en/agent-sdk - Official agent framework" },
      { title: "MCP Servers", text: "https://github.com/modelcontextprotocol - Official MCP server implementations" },
    ],
    icon: BookOpen,
    type: "list"
  },
  {
    id: 64,
    title: "Summary",
    content: "The Gen AI Stack.",
    items: [
      { title: "App", text: "Your UI/Logic" },
      { title: "Agent", text: "Reasoning Loop" },
      { title: "Tools", text: "MCP / RAG" },
      { title: "Model", text: "LLM" },
    ],
    icon: Layers,
    type: "list"
  },
  {
    id: 65,
    title: "Let's Build!",
    subtitle: "Good Luck",
    content: "Go build something amazing.",
    image: letBuildImg,
    icon: Rocket,
    type: "title"
  }
];
