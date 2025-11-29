# Intro to Gen AI — Curriculum

**Duration:** ~2.5 hours (with breaks)  
**Audience:** Mixed (65% software engineers, 35% non-technical)  
**Goal:** Equip participants with foundational knowledge and practical skills to succeed in a Gen AI hackathon

---

## Session Overview

| Module | Topic | Duration |
|--------|-------|----------|
| Opening | The AI Moment (Statistics) | 5 min |
| 1 | Foundations — Understanding LLMs | 15 min |
| 2 | Prompt Engineering | 15 min |
| 2B | **Structured Output** | 10 min |
| 3 | Working with APIs | 15 min |
| 4 | RAG — Retrieval-Augmented Generation | 25 min |
| 5 | Tool Use & Function Calling | 10 min |
| 6 | MCP — Model Context Protocol | 15 min |
| 7 | Agent Frameworks Overview | 10 min |
| 7A | **Multi-Step Agentic Loops** | 15 min |
| 8 | Hackathon Strategy & Tips | 10 min |
| | Q&A | 10 min |
| | **Total** | **~155 min** |

*Suggested: 5-10 min break after Module 4 (RAG)*

---

## Opening: The AI Moment (5 min)

### Key Statistics to Set the Stage

| Category | Statistic | Source |
|----------|-----------|--------|
| **Scale** | 800 million weekly active users on ChatGPT (10% of world population) | OpenAI, Oct 2025 |
| **Developer Adoption** | 85% of developers regularly use AI tools for coding | JetBrains 2025 |
| **Code Generation** | 41% of all code in 2025 is AI-generated or AI-assisted | Industry Reports |
| **Enterprise** | 25% of Google's code is now AI-assisted | Sundar Pichai |
| **Investment** | $320 billion planned AI spend by Meta, Amazon, Alphabet, Microsoft in 2025 | CNBC |
| **Agentic AI** | 23% of enterprises scaling agentic AI, 39% experimenting | McKinsey 2025 |
| **Productivity** | Developers save 30-60% time on coding, testing, documentation | GitHub Research |

---

## Module 1: Foundations — Understanding LLMs (15 min)

**Goal:** Level-set the audience on how LLMs actually work

### Topics

1. **What are Large Language Models?**
   - High-level intuition: pattern recognition at scale
   - Training on internet-scale text data
   - Next-token prediction as the core mechanism

2. **Key Concepts Everyone Needs to Know**
   - **Tokens & Tokenization:** How text is broken into pieces (~4 chars = 1 token)
   - **Context Windows:** The "memory" limit of a conversation (e.g., 128K, 200K tokens)
   - **Temperature:** Controls randomness (0 = deterministic, 1 = creative)
   - **Top-p (Nucleus Sampling):** Alternative way to control output diversity
   - **Stochastic Nature:** Same prompt can yield different outputs

3. **The Current Model Landscape**
   | Provider | Models | Strengths |
   |----------|--------|-----------|
   | Anthropic | Claude 4 (Opus, Sonnet, Haiku) | Reasoning, safety, long context |
   | OpenAI | GPT-4o, GPT-4.5, o1/o3 | Broad capabilities, ecosystem |
   | Google | Gemini 1.5/2.0 | Multimodal, long context |
   | Meta | Llama 3.x | Open source, self-hosting |
   | Mistral | Mistral Large, Codestral | Efficiency, European option |

4. **Model Selection for Hackathons**
   - Speed vs. capability trade-offs
   - Cost considerations
   - When to use smaller vs. larger models

---

## Module 2: Prompt Engineering (20 min)

**Goal:** Teach participants how to communicate effectively with LLMs

### Core Principles

> "Clear structure and context matter more than clever wording—most prompt failures come from ambiguity, not model limitations."

### Essential Techniques

1. **Providing Context and Constraints**
   ```
   You are a senior software architect reviewing code for a fintech startup.
   The codebase uses Python 3.11, FastAPI, and PostgreSQL.
   Focus on security vulnerabilities and performance issues.
   ```

2. **Role/Persona Assignment**
   - Gives the model a frame of reference
   - Improves relevance and depth of responses

3. **Few-Shot Examples**
   ```
   Convert these product descriptions to JSON:
   
   Input: "Red Nike running shoes, size 10, $89.99"
   Output: {"brand": "Nike", "type": "running shoes", "color": "red", "size": 10, "price": 89.99}
   
   Input: "Blue Adidas soccer cleats, size 9, $120"
   Output:
   ```

4. **Chain-of-Thought Prompting**
   - "Think step by step before answering"
   - "Show your reasoning"
   - Dramatically improves accuracy on complex tasks

5. **Output Format Specification**
   - Request JSON, markdown, specific structures
   - Reduces post-processing needs

---

## Module 2B: Structured Output (10 min)

**Goal:** Ensure LLM outputs are reliably parseable for application use

### Why Structured Output Matters

When building applications, you need:
- Predictable, parseable responses
- Type safety and validation
- Direct integration with your code
- No manual parsing or regex extraction

### Approaches to Structured Output

#### 1. Prompt-Based (Basic)

```
Respond ONLY with valid JSON in this exact format:
{
  "sentiment": "positive" | "negative" | "neutral",
  "confidence": <float 0-1>,
  "key_phrases": [<list of strings>]
}

Do not include any text outside the JSON object.
```

**Pros:** Works with any model  
**Cons:** Can still fail, requires validation

#### 2. Native JSON Mode (Better)

Most APIs now support forcing JSON output:

**Anthropic:**
```python
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}],
    response_format={"type": "json_object"}
)
```

**OpenAI:**
```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": prompt}],
    response_format={"type": "json_object"}
)
```

#### 3. Schema-Enforced Output (Best)

Define exact structure with JSON Schema:

**OpenAI Structured Outputs:**
```python
from pydantic import BaseModel

class SentimentAnalysis(BaseModel):
    sentiment: Literal["positive", "negative", "neutral"]
    confidence: float
    key_phrases: list[str]

response = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Analyze: 'Great product!'"}],
    response_format=SentimentAnalysis
)

result = response.choices[0].message.parsed
print(result.sentiment)  # "positive"
```

**Anthropic with Tool Use:**
```python
tools = [{
    "name": "record_sentiment",
    "description": "Record the sentiment analysis result",
    "input_schema": {
        "type": "object",
        "properties": {
            "sentiment": {"type": "string", "enum": ["positive", "negative", "neutral"]},
            "confidence": {"type": "number"},
            "key_phrases": {"type": "array", "items": {"type": "string"}}
        },
        "required": ["sentiment", "confidence", "key_phrases"]
    }
}]

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "tool", "name": "record_sentiment"},
    messages=[{"role": "user", "content": "Analyze: 'Great product!'"}]
)
```

### Using Pydantic for Validation

```python
from pydantic import BaseModel, Field, validator
from typing import Literal
import json

class ProductReview(BaseModel):
    sentiment: Literal["positive", "negative", "neutral"]
    confidence: float = Field(ge=0, le=1)
    summary: str = Field(max_length=200)
    key_phrases: list[str] = Field(max_items=5)
    
    @validator('key_phrases')
    def phrases_not_empty(cls, v):
        if not v:
            raise ValueError('Must have at least one key phrase')
        return v

# Parse and validate LLM response
try:
    review = ProductReview.parse_raw(llm_response)
except ValidationError as e:
    # Handle invalid response
    print(e.errors())
```

### Best Practices

| Practice | Why |
|----------|-----|
| Always validate | LLMs can still produce invalid output |
| Use enums for categories | Prevents unexpected values |
| Set reasonable constraints | `max_length`, `ge`, `le` |
| Have fallback handling | Gracefully handle failures |
| Include examples in prompt | Improves format compliance |

### When to Use What

| Approach | Use When |
|----------|----------|
| Prompt-based | Quick prototyping, simple formats |
| JSON mode | Need guaranteed JSON, flexible schema |
| Schema-enforced | Production apps, strict type requirements |

### Advanced Patterns

1. **Prompt Chaining**
   - Break complex tasks into sequential steps
   - Each step's output feeds the next
   - Example: Research → Outline → Draft → Review

2. **Layered Prompting**
   - Combine multiple techniques in one prompt
   - Role + Format + Reasoning + Constraints

### Common Mistakes to Avoid

- ❌ Being too vague ("make it better")
- ❌ Overloading a single prompt with too many tasks
- ❌ Not providing examples for complex formats
- ❌ Ignoring the model's context window limits

### Live Demo

Iterating on a prompt to improve output quality

---

## Module 3: Working with APIs (15 min)

**Goal:** Get everyone comfortable with programmatic LLM access

### API Basics

```python
import anthropic

client = anthropic.Anthropic(api_key="your-key")

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude!"}
    ]
)

print(message.content[0].text)
```

### Key Parameters

| Parameter | Description | Typical Values |
|-----------|-------------|----------------|
| `model` | Which model to use | `claude-sonnet-4-20250514`, `gpt-4o` |
| `messages` | Conversation history | Array of role/content objects |
| `max_tokens` | Maximum response length | 1024, 4096, etc. |
| `temperature` | Randomness control | 0.0 - 1.0 |
| `system` | System prompt | Instructions for behavior |

### Streaming vs. Non-Streaming

- **Non-streaming:** Wait for complete response
- **Streaming:** Get tokens as they're generated (better UX)

### Rate Limits and Error Handling

- Implement exponential backoff
- Handle rate limit errors gracefully
- Cache responses where appropriate

### Cost Awareness

- Input tokens vs. output tokens (often different prices)
- Monitor usage during development
- Set budget alerts

---

## Module 4: RAG — Retrieval-Augmented Generation (25 min)

**Goal:** Teach participants how to give LLMs access to custom knowledge

### Why RAG?

- LLMs have knowledge cutoff dates
- LLMs can hallucinate facts
- You need domain-specific or private data
- Real-time information requirements

### The RAG Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Documents  │ --> │  Chunking   │ --> │  Embedding  │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               v
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Answer    │ <-- │     LLM     │ <-- │   Retrieval │
└─────────────┘     └─────────────┘     └─────────────┘
                           ^                   │
                           │                   v
                    ┌─────────────┐     ┌─────────────┐
                    │   Prompt    │ <-- │   Vector DB │
                    │  + Context  │     └─────────────┘
                    └─────────────┘
```

### Step-by-Step Breakdown

1. **Chunking**
   - Split documents into manageable pieces
   - Typical sizes: 500-1000 tokens
   - Overlap between chunks (10-20%)
   - Preserve semantic boundaries

2. **Embedding**
   - Convert text to numerical vectors
   - Popular models: OpenAI `text-embedding-3-small`, Cohere, Voyage
   - Vectors capture semantic meaning

3. **Vector Storage**
   | Database | Best For | Notes |
   |----------|----------|-------|
   | Chroma | Local development | Easy to start |
   | Pinecone | Production, managed | Scalable, cloud-native |
   | Weaviate | Hybrid search | Open source option |
   | Qdrant | Performance | Rust-based, fast |
   | pgvector | Existing Postgres | Add to existing DB |

4. **Retrieval**
   - Convert query to embedding
   - Find most similar chunks (cosine similarity)
   - Return top-k results (typically 3-10)

5. **Generation**
   - Inject retrieved context into prompt
   - LLM generates answer grounded in context

### Best Practices 2025

- **Hybrid Search:** Combine semantic (vector) + keyword (BM25) search
- **Reranking:** Use a reranker model to improve relevance
- **Metadata Filtering:** Filter by date, source, category before retrieval
- **Query Augmentation:** Expand/rephrase queries for better retrieval

### Advanced RAG Variants (Brief Overview)

| Variant | Description | Use Case |
|---------|-------------|----------|
| **GraphRAG** | Uses knowledge graphs | Complex relationships |
| **Self-RAG** | Self-reflective retrieval | Higher accuracy |
| **Corrective RAG** | Validates and corrects | Reduces hallucinations |
| **Agentic RAG** | Multi-step retrieval | Complex queries |

### Demo

Simple RAG pipeline walkthrough with code

---

## Module 5: Tool Use & Function Calling (10 min)

**Goal:** Understand how LLMs can interact with external systems

### What is Tool Use?

Giving LLMs the ability to:
- Search the web
- Execute code
- Query databases
- Call external APIs
- Interact with files

### How Function Calling Works

1. **Define tool schemas**
   ```json
   {
     "name": "get_weather",
     "description": "Get current weather for a location",
     "parameters": {
       "type": "object",
       "properties": {
         "location": {"type": "string"},
         "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
       },
       "required": ["location"]
     }
   }
   ```

2. **LLM decides when to call tools**
   - Model analyzes user request
   - Determines if tools are needed
   - Generates structured tool calls

3. **Execute and return results**
   - Your code executes the actual function
   - Results sent back to LLM
   - LLM incorporates into response

### Common Tool Patterns

- 🔍 Web search
- 💻 Code execution
- 🗄️ Database queries
- 📧 Email/messaging
- 📁 File operations
- 🔗 API integrations

---

## Module 6: MCP — Model Context Protocol (15 min)

**Goal:** Introduce the emerging standard for LLM-tool integration

### What is MCP?

> "Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect devices, MCP provides a standardized way to connect AI applications to external systems."

- Open protocol launched by Anthropic (November 2024)
- Adopted by OpenAI, Google DeepMind, and major toolmakers
- Thousands of community-built MCP servers

### Why MCP Matters

**The N×M Problem:**
- N AI applications × M tools = N×M custom integrations
- MCP: N applications + M servers = N+M implementations

**Benefits:**
- Write integrations once, use everywhere
- Ecosystem of pre-built connectors
- Standardized security and permissions

### MCP Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   MCP Client    │ <-----> │   MCP Server    │
│  (AI App/Agent) │         │  (Tool Provider)│
└─────────────────┘         └─────────────────┘
        │                           │
        │    Standardized Protocol  │
        │    - Tools                │
        │    - Resources            │
        │    - Prompts              │
        └───────────────────────────┘
```

### MCP Primitives

| Primitive | Description | Controlled By |
|-----------|-------------|---------------|
| **Tools** | Functions the model can call | Model decides |
| **Resources** | Data sources to read from | Application decides |
| **Prompts** | Pre-built prompt templates | User decides |

### Pre-built MCP Servers

- Google Drive
- Slack
- GitHub
- Git
- PostgreSQL
- Puppeteer (browser automation)
- File system
- And thousands more...

### Getting Started with MCP

1. **For Claude Desktop users:** Enable MCP in settings
2. **For developers:** Use official SDKs (Python, TypeScript, etc.)
3. **Build your own:** Follow the MCP specification

### Resources

- Documentation: [modelcontextprotocol.io](https://modelcontextprotocol.io)
- GitHub: [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)
- Anthropic Course: [anthropic.skilljar.com](https://anthropic.skilljar.com)

---

## Module 7: Agent Frameworks (20 min)

**Goal:** Survey the landscape of tools for building AI agents

### What are AI Agents?

Autonomous systems that:
1. **Perceive** — Understand context and goals
2. **Reason** — Plan approach and steps
3. **Act** — Execute tools and actions
4. **Learn** — Adapt based on results

---

## Module 7A: Multi-Step Agentic Loops (15 min)

**Goal:** Understand how agents execute complex tasks through iterative reasoning

### The Core Agent Loop

Most agents follow a variation of this pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    ┌──────────┐    ┌──────────┐    ┌──────────┐           │
│    │ OBSERVE  │───>│  THINK   │───>│   ACT    │           │
│    │          │    │          │    │          │           │
│    │ Get input│    │ Reason & │    │ Execute  │           │
│    │ & context│    │ plan     │    │ tool/    │           │
│    │          │    │          │    │ respond  │           │
│    └──────────┘    └──────────┘    └────┬─────┘           │
│         ^                               │                  │
│         │                               │                  │
│         └───────────────────────────────┘                  │
│                   LOOP until done                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### ReAct Pattern (Reasoning + Acting)

The most common agent pattern:

```
User: What's the weather in Tokyo and should I pack an umbrella for tomorrow?

Agent Thought: I need to get the weather forecast for Tokyo to answer this.
Agent Action: get_weather(location="Tokyo", days=2)
Observation: {"today": {"temp": 22, "condition": "sunny"}, 
              "tomorrow": {"temp": 18, "condition": "rain", "precipitation": 80%}}

Agent Thought: Tomorrow shows 80% chance of rain. I should recommend an umbrella.
Agent Action: respond_to_user
Response: Tomorrow in Tokyo will be 18°C with an 80% chance of rain. 
          Yes, definitely pack an umbrella!
```

### Implementation Pattern

```python
def agent_loop(user_input: str, max_iterations: int = 10) -> str:
    messages = [{"role": "user", "content": user_input}]
    
    for i in range(max_iterations):
        # 1. THINK - Get LLM response
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system=AGENT_SYSTEM_PROMPT,
            tools=AVAILABLE_TOOLS,
            messages=messages
        )
        
        # 2. Check if we're done
        if response.stop_reason == "end_turn":
            # Agent wants to respond to user
            return extract_text_response(response)
        
        # 3. ACT - Execute tool calls
        if response.stop_reason == "tool_use":
            tool_results = []
            for tool_call in response.content:
                if tool_call.type == "tool_use":
                    # Execute the tool
                    result = execute_tool(
                        tool_call.name, 
                        tool_call.input
                    )
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": tool_call.id,
                        "content": json.dumps(result)
                    })
            
            # 4. OBSERVE - Add results to context
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})
    
    return "Max iterations reached"
```

### Multi-Step Example: Research Agent

```
User: "Compare the market cap of Apple, Microsoft, and Google"

── Iteration 1 ──
Thought: I need to get the market cap for each company. Let me start with Apple.
Action: get_stock_info(symbol="AAPL")
Observation: {"market_cap": "3.4T", "price": 213.25}

── Iteration 2 ──
Thought: Got Apple. Now Microsoft.
Action: get_stock_info(symbol="MSFT")  
Observation: {"market_cap": "3.1T", "price": 420.50}

── Iteration 3 ──
Thought: Got Microsoft. Now Google (Alphabet).
Action: get_stock_info(symbol="GOOGL")
Observation: {"market_cap": "2.1T", "price": 175.30}

── Iteration 4 ──
Thought: I have all the data. Let me compile the comparison.
Action: respond_to_user

Response: "Here's the market cap comparison:
1. Apple (AAPL): $3.4 trillion
2. Microsoft (MSFT): $3.1 trillion  
3. Alphabet/Google (GOOGL): $2.1 trillion

Apple currently leads, followed by Microsoft, with Google in third place."
```

### Planning Patterns

#### 1. **Plan-then-Execute**
```
User Request
    │
    v
┌─────────┐     ┌─────────┐     ┌─────────┐
│ Create  │────>│ Execute │────>│ Compile │
│  Plan   │     │  Steps  │     │ Results │
└─────────┘     └─────────┘     └─────────┘
```

```python
# Step 1: Create plan
plan = client.messages.create(
    model="claude-sonnet-4-20250514",
    messages=[{
        "role": "user", 
        "content": f"""Create a step-by-step plan to: {user_request}
        
        Return as JSON: {{"steps": ["step1", "step2", ...]}}"""
    }]
)

# Step 2: Execute each step
results = []
for step in plan.steps:
    result = execute_step(step)
    results.append(result)

# Step 3: Compile final response
final = compile_results(results)
```

#### 2. **Reflexion Pattern** (Self-Correction)
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Attempt │────>│ Evaluate │────>│  Refine  │──┐
└──────────┘     └──────────┘     └──────────┘  │
     ^                                          │
     └──────────────────────────────────────────┘
```

```python
def reflexion_loop(task: str, max_attempts: int = 3) -> str:
    attempt = None
    feedback = None
    
    for i in range(max_attempts):
        # Generate attempt (with feedback if available)
        attempt = generate_attempt(task, previous=attempt, feedback=feedback)
        
        # Evaluate the attempt
        evaluation = evaluate_attempt(attempt, task)
        
        if evaluation.is_successful:
            return attempt
        
        # Get feedback for improvement
        feedback = evaluation.feedback
    
    return attempt  # Return best effort
```

#### 3. **Tree of Thoughts** (Exploration)
```
                    ┌─────────┐
                    │  Root   │
                    │ Problem │
                    └────┬────┘
           ┌─────────────┼─────────────┐
           v             v             v
      ┌────────┐    ┌────────┐    ┌────────┐
      │ Path A │    │ Path B │    │ Path C │
      └───┬────┘    └───┬────┘    └────────┘
          │             │              ✗
     ┌────┴────┐        v          (pruned)
     v         v    ┌────────┐
┌────────┐ ┌──────┐ │Solution│
│        │ │      │ │   ✓    │
└────────┘ └──────┘ └────────┘
```

### Controlling Agent Behavior

#### Stop Conditions
```python
STOP_CONDITIONS = {
    "max_iterations": 10,          # Prevent infinite loops
    "max_tokens_used": 100000,     # Budget control
    "max_time_seconds": 60,        # Timeout
    "confidence_threshold": 0.9,   # Quality gate
}
```

#### Human-in-the-Loop
```python
def agent_with_approval(task: str) -> str:
    plan = create_plan(task)
    
    # Ask for human approval on sensitive actions
    for step in plan.steps:
        if step.requires_approval:
            approved = get_human_approval(step)
            if not approved:
                return "Task cancelled by user"
        
        execute_step(step)
```

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Infinite loops | Set max iterations |
| Token explosion | Track and limit token usage |
| Getting stuck | Implement retry with different approach |
| Tool errors | Graceful error handling, fallbacks |
| Context overflow | Summarize/compress history |
| Hallucinated tools | Validate tool names before execution |

### State Management

For complex agents, maintain state across iterations:

```python
@dataclass
class AgentState:
    messages: list[dict]           # Conversation history
    tool_calls_made: list[str]     # Audit trail
    tokens_used: int               # Budget tracking
    current_plan: list[str]        # Active plan
    completed_steps: list[str]     # Progress
    memory: dict                   # Persistent facts
    
    def add_observation(self, observation: str):
        self.messages.append({"role": "user", "content": observation})
        
    def should_stop(self) -> bool:
        return (
            self.tokens_used > MAX_TOKENS or
            len(self.tool_calls_made) > MAX_TOOL_CALLS
        )
```

---

### When to Use a Framework vs. Building from Scratch

**Use a framework when:**
- Building multi-step workflows
- Need state management
- Want pre-built integrations
- Team collaboration is important

**Build from scratch when:**
- Simple, single-purpose agent
- Unique requirements
- Maximum control needed
- Learning purposes

### Framework Comparison

| Framework | Best For | Key Feature | Complexity |
|-----------|----------|-------------|------------|
| **LangChain** | General LLM apps | Modular ecosystem | Medium |
| **LangGraph** | Complex workflows | Graph-based state | High |
| **CrewAI** | Multi-agent teams | Role-based collaboration | Medium |
| **AutoGen** | Research/experimentation | Multi-agent conversations | Medium |
| **OpenAI Agents SDK** | OpenAI-native projects | Integrated tooling | Low-Medium |
| **Smolagents** | Lightweight agents | Minimal code | Low |

### LangChain

- Most widely adopted framework
- Modular architecture: chains, agents, tools, memory
- Huge ecosystem of integrations
- Good for: Custom chat interfaces, RAG applications

### LangGraph

- Extension of LangChain for complex workflows
- Represents agent logic as directed graphs
- Enables cyclical flows (agents can revisit steps)
- Good for: Multi-step reasoning, complex state management

### CrewAI

- Focus on multi-agent collaboration
- Assign roles, goals, and backstories to agents
- Agents can delegate and cooperate
- Good for: Team-based problem solving, content creation pipelines

### Decision Framework for Your Hackathon

```
                    ┌─────────────────────┐
                    │  What are you       │
                    │  building?          │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            v                  v                  v
    ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
    │ Simple chatbot│  │ Multi-step    │  │ Multiple      │
    │ or RAG app    │  │ workflow      │  │ collaborating │
    └───────┬───────┘  └───────┬───────┘  │ agents        │
            │                  │          └───────┬───────┘
            v                  v                  v
    ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
    │  LangChain    │  │  LangGraph    │  │   CrewAI      │
    │  or vanilla   │  │               │  │               │
    └───────────────┘  └───────────────┘  └───────────────┘
```

### Quick Demo

Simple agent example with tool use

---

## Module 8: Hackathon Strategy & Practical Tips (10 min)

**Goal:** Set participants up for success

### Scoping Your Project

**The MVP Mindset:**
- What's the *one thing* your project must do well?
- Start with the simplest version that demonstrates value
- You can always add features if time permits

**Realistic 2-Day Timeline:**
```
Day 1 Morning:    Ideation, architecture, setup
Day 1 Afternoon:  Core functionality
Day 1 Evening:    Integration, basic testing

Day 2 Morning:    Polish, edge cases
Day 2 Afternoon:  Demo prep, documentation
Day 2 Evening:    Presentations!
```

### Common Pitfalls to Avoid

| Pitfall | Solution |
|---------|----------|
| Over-engineering | Start simple, iterate |
| Ignoring latency | Test with real API calls early |
| Ignoring cost | Set budget limits, use smaller models for dev |
| Not testing prompts | Iterate on prompts before building around them |
| Scope creep | Define MVP, park "nice to haves" |
| Poor demo | Practice! Have a backup plan |

### Evaluation: How Do You Know It Works?

- Define success criteria upfront
- Test with diverse inputs
- Have humans evaluate outputs
- Track basic metrics (latency, cost, accuracy)

### Resources to Bookmark

| Resource | URL |
|----------|-----|
| Anthropic Docs | docs.anthropic.com |
| OpenAI Docs | platform.openai.com/docs |
| LangChain | python.langchain.com |
| LangGraph | langchain-ai.github.io/langgraph |
| CrewAI | docs.crewai.com |
| MCP | modelcontextprotocol.io |
| Prompt Engineering Guide | promptingguide.ai |

### Quick Wins for Hackathons

1. **Use Claude or ChatGPT to help you build** — They're great coding assistants
2. **Start with a working example** — Modify, don't create from scratch
3. **Use managed services** — Don't self-host during a hackathon
4. **Prepare your demo environment** — Test it before presenting
5. **Have a compelling story** — Why does this matter?

---

## Summary: The Gen AI Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR APPLICATION                        │
├─────────────────────────────────────────────────────────────┤
│           Multi-Step Agentic Loops (ReAct, Planning)        │
├─────────────────────────────────────────────────────────────┤
│  Agent Framework (LangChain / LangGraph / CrewAI)          │
├─────────────────────────────────────────────────────────────┤
│  MCP Servers          │  RAG Pipeline      │  Custom Tools  │
│  (Pre-built tools)    │  (Your knowledge)  │  (Your APIs)   │
├─────────────────────────────────────────────────────────────┤
│  Structured Output (JSON Schema / Pydantic Validation)      │
├─────────────────────────────────────────────────────────────┤
│              LLM APIs (Claude / GPT / Gemini)               │
├─────────────────────────────────────────────────────────────┤
│              Prompt Engineering & Context Design            │
└─────────────────────────────────────────────────────────────┘
```

### Key Concepts Covered

| Concept | What It Does | When to Use |
|---------|--------------|-------------|
| **Prompt Engineering** | Get better outputs from LLMs | Always — it's foundational |
| **Structured Output** | Ensure parseable, typed responses | Building apps that process LLM output |
| **RAG** | Give LLMs access to your data | Custom knowledge, real-time info |
| **Tool Use** | Let LLMs take actions | External APIs, databases, code execution |
| **MCP** | Standardized tool integration | Reusable, ecosystem tools |
| **Agentic Loops** | Multi-step reasoning & execution | Complex tasks requiring iteration |
| **Agent Frameworks** | Pre-built agent infrastructure | Production apps, team collaboration |

---

## Q&A

**Time for questions!**

---

## Appendix: Quick Reference

### Model Pricing (Approximate, as of 2025)

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| Claude Sonnet | $3 | $15 |
| Claude Haiku | $0.25 | $1.25 |
| GPT-4o | $2.50 | $10 |
| GPT-4o-mini | $0.15 | $0.60 |

### Useful Code Snippets

**Basic Anthropic API Call (Python):**
```python
import anthropic

client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content[0].text)
```

**Basic OpenAI API Call (Python):**
```python
from openai import OpenAI

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

**Simple RAG with LangChain:**
```python
from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma

# Load and chunk
loader = TextLoader("document.txt")
docs = loader.load()
splitter = RecursiveCharacterTextSplitter(chunk_size=1000)
chunks = splitter.split_documents(docs)

# Embed and store
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(chunks, embeddings)

# Query
results = vectorstore.similarity_search("your question", k=3)
```

---

*Good luck with your hackathon! Build something amazing.* 🚀