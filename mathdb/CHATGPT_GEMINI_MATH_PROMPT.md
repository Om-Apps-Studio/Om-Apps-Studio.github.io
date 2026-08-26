# ChatGPT & Gemini Math Question Generator Prompt Guide

Use this prompt with **ChatGPT (GPT-4 / GPT-4o / o1 / o3)**, **Google Gemini (Gemini 1.5 Pro / 2.0 Flash)**, or **Claude** to generate properly formatted math questions that can be **directly imported into your Math Notes & Question Bank web application**.

---

## 🚀 Master Prompt for ChatGPT & Gemini (Copy & Paste)

Copy the prompt block below and paste it into ChatGPT or Gemini, along with the topics, chapters, or textbook images you want questions for:

```markdown
You are an expert Mathematics Professor and Exam Question Creator.
Generate comprehensive, high-quality math questions with detailed step-by-step explanations in the specified JSON format.

### Requirements:
1. Format all mathematical expressions using standard LaTeX syntax:
   - Inline math: `$formula$` (e.g. `$f(x) = \sin(x^2)$`)
   - Display/Block math: `$$\int_0^\pi \frac{x \sin x}{1 + \cos^2 x} dx$$`
   - Use proper LaTeX commands: `\frac{a}{b}`, `\sqrt{x}`, `\int`, `\sum`, `\lim_{x \to 0}`, `\begin{pmatrix} ... \end{pmatrix}`, `\vec{a} \cdot \vec{b}`, `\alpha, \beta, \theta`, etc.
2. Provide a rigorous, step-by-step explanation for the solution, explicitly listing:
   - Key concept / Formula used
   - Step 1, Step 2, Step 3...
   - Common traps / Alternate shortcuts (if any)
3. Return the output as a valid JSON array of question objects adhering to this schema:

[
  {
    "title": "Short title or concept name",
    "question": "Full question statement with LaTeX math ($...$ or $$...$$).",
    "type": "mcq_single", // Options: "mcq_single" | "mcq_multi" | "numerical" | "subjective"
    "options": [
      { "id": "A", "text": "Option A text or math", "isCorrect": false },
      { "id": "B", "text": "Option B text or math", "isCorrect": true },
      { "id": "C", "text": "Option C text or math", "isCorrect": false },
      { "id": "D", "text": "Option D text or math", "isCorrect": false }
    ],
    "correctAnswer": "B", // For numerical type, provide number e.g. "4.5" or "12"
    "chapter": "Calculus", // e.g. Calculus, Algebra, Coordinate Geometry, Vectors & 3D, Trigonometry, Probability, Statistics, etc.
    "subtopic": "Definite Integrals - King's Property",
    "difficulty": "Hard", // Options: "Easy" | "Medium" | "Hard" | "Challenger"
    "pyq": {
      "isPYQ": true,
      "exam": "JEE Main", // Options: JEE Main, JEE Advanced, NDA, CBSE 12th, WBJEE, BITSAT, Olympiad, etc.
      "year": 2024,
      "shift": "31 Jan Shift 1"
    },
    "explanation": "### Key Formulas:\n- King's Property: $\\int_a^b f(x) dx = \\int_a^b f(a+b-x) dx$\n\n### Step-by-Step Solution:\n1. Let $I = \\int_0^\\pi \\frac{x \\sin x}{1 + \\cos^2 x} dx$ ...(i)\n2. Applying property: $I = \\int_0^\\pi \\frac{(\\pi - x) \\sin(\\pi - x)}{1 + \\cos^2(\\pi - x)} dx$\n   Since $\\sin(\\pi - x) = \\sin x$ and $\\cos(\\pi - x) = -\\cos x$, we get:\n   $I = \\int_0^\\pi \\frac{(\\pi - x) \\sin x}{1 + \\cos^2 x} dx$ ...(ii)\n3. Adding (i) and (ii):\n   $$2I = \\pi \\int_0^\\pi \\frac{\\sin x}{1 + \\cos^2 x} dx$$\n4. Substitute $u = \\cos x \\implies du = -\\sin x dx$. When $x=0, u=1$; $x=\\pi, u=-1$:\n   $$2I = \\pi \\int_{-1}^1 \\frac{du}{1 + u^2} = \\pi [\\tan^{-1}(u)]_{-1}^1 = \\pi \\left(\\frac{\\pi}{4} - \\left(-\\frac{\\pi}{4}\\right)\\right) = \\frac{\\pi^2}{2}$$\n   $$\\implies I = \\frac{\\pi^2}{4}$$\n\n### Final Answer:\nOption B is correct.",
    "keyFormulas": [
      "\\int_a^b f(x)dx = \\int_a^b f(a+b-x)dx",
      "\\int \\frac{1}{1+u^2}du = \\tan^{-1}(u) + C"
    ],
    "tags": ["Definite Integration", "Properties", "King Rule", "Calculus"],
    "personalNotes": "Remember to change limits when applying substitution."
  }
]

Now, please generate [NUMBER OF QUESTIONS] questions on [TOPIC/CHAPTER OR PASTE EXAM PAPER/IMAGE HERE].
```

---

## 📋 Markdown Format Alternative (Smart AI Paste)

If ChatGPT or Gemini outputs in standard Markdown text instead of JSON, your Web App's **Smart AI Importer** also parses Markdown format directly:

```markdown
### Question:
Evaluate the limit:
$$\lim_{x \to 0} \frac{e^{x^2} - \cos x}{x^2}$$

- Chapter: Calculus
- Subtopic: Limits & Continuity
- Difficulty: Medium
- Exam: JEE Main 2023 Shift 2
- Type: MCQ

#### Options:
- (A) $\frac{1}{2}$
- (B) $1$
- (C) $\frac{3}{2}$ [Correct]
- (D) $2$

#### Explanation:
Using Taylor Series expansions for $e^{x^2}$ and $\cos x$ near $x=0$:
1. $e^{x^2} = 1 + x^2 + \frac{x^4}{2} + \dots$
2. $\cos x = 1 - \frac{x^2}{2} + \frac{x^4}{24} - \dots$

Subtracting:
$$e^{x^2} - \cos x = \left(1 + x^2\right) - \left(1 - \frac{x^2}{2}\right) + \mathcal{O}(x^4) = \frac{3}{2}x^2 + \mathcal{O}(x^4)$$

Dividing by $x^2$:
$$\lim_{x \to 0} \frac{\frac{3}{2}x^2}{x^2} = \frac{3}{2}$$

**Correct Answer:** Option (C)
```

---

## 💡 Pro-Tips for Generating Questions with AI:
1. **From Image/Screenshot**: You can upload a photo of a math textbook or question paper to ChatGPT Plus or Gemini Advanced and write:
   > *"Convert the questions in this image into the JSON format specified in my prompt instructions with step-by-step LaTeX explanations."*
2. **From PDF/Syllabus**: Mention specific target exams like *JEE Main, JEE Advanced, NDA, CBSE Class 12 Boards, WBJEE, BITSAT, KCET, etc.*
3. **Importing into App**: In your Math Question Bank app, click **"✨ AI Import"**, paste the JSON or Markdown text, and click **"Process & Add to Bank"**.
