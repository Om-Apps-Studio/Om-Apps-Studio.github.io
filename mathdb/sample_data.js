// Extended Default Seed Questions for MathVault - Math Notes & Question Bank
const INITIAL_SAMPLE_QUESTIONS = [
  {
    id: "q_sample_01",
    title: "Definite Integral - King's Property with Trigonometry",
    question: "Evaluate the definite integral:\n$$I = \\int_0^{\\pi} \\frac{x \\sin x}{1 + \\cos^2 x} \\, dx$$",
    type: "mcq_single",
    chapter: "Calculus",
    subtopic: "Definite Integrals",
    difficulty: "Hard",
    pyq: {
      isPYQ: true,
      exam: "JEE Main",
      year: 2024,
      shift: "Session 1"
    },
    options: [
      { id: "A", text: "$\\frac{\\pi^2}{2}$", isCorrect: false },
      { id: "B", text: "$\\frac{\\pi^2}{4}$", isCorrect: true },
      { id: "C", text: "$\\pi^2$", isCorrect: false },
      { id: "D", text: "$\\frac{\\pi^2}{8}$", isCorrect: false }
    ],
    correctAnswer: "B",
    explanation: "### Key Formula Used:\n- **King's Property**: $\\int_a^b f(x) \\, dx = \\int_a^b f(a+b-x) \\, dx$\n\n### Step-by-Step Solution:\n1. Let $I = \\int_0^{\\pi} \\frac{x \\sin x}{1 + \\cos^2 x} \\, dx$ --- (1)\n2. By King's property: $I = \\int_0^{\\pi} \\frac{(\\pi - x) \\sin(\\pi - x)}{1 + \\cos^2(\\pi - x)} \\, dx = \\int_0^{\\pi} \\frac{(\\pi - x) \\sin x}{1 + \\cos^2 x} \\, dx$ --- (2)\n3. Adding (1) and (2):\n   $$2I = \\pi \\int_0^{\\pi} \\frac{\\sin x}{1 + \\cos^2 x} \\, dx$$\n4. Let $u = \\cos x \\implies du = -\\sin x \\, dx$:\n   $$2I = \\pi \\int_{-1}^{1} \\frac{du}{1 + u^2} = \\pi [\\tan^{-1}(u)]_{-1}^1 = \\pi \\left(\\frac{\\pi}{4} - \\left(-\\frac{\\pi}{4}\\right)\\right) = \\frac{\\pi^2}{2}$$\n   $$\\implies I = \\frac{\\pi^2}{4}$$\n\n### Conclusion:\nOption **(B)** is correct.",
    keyFormulas: [
      "\\int_a^b f(x)dx = \\int_a^b f(a+b-x)dx",
      "\\int \\frac{1}{1+u^2}du = \\tan^{-1}(u) + C"
    ],
    tags: ["Calculus", "Definite Integration", "King Rule"],
    images: [],
    isBookmarked: true,
    status: "mastered",
    createdAt: new Date("2025-01-10T10:00:00Z").toISOString(),
    personalNotes: "Frequently asked in JEE Main and Advanced. Always check symmetry first."
  },
  {
    id: "q_sample_02",
    title: "Shortest Distance Between Two Skew Lines in 3D",
    question: "Find the shortest distance between the two skew lines:\n$$L_1: \\frac{x-1}{2} = \\frac{y-2}{3} = \\frac{z-3}{4}$$\n$$L_2: \\frac{x-2}{3} = \\frac{y-4}{4} = \\frac{z-5}{5}$$",
    type: "mcq_single",
    chapter: "Vectors & 3D Geometry",
    subtopic: "3D Lines - Shortest Distance",
    difficulty: "Medium",
    pyq: {
      isPYQ: true,
      exam: "JEE Main",
      year: 2023,
      shift: "April Shift 2"
    },
    options: [
      { id: "A", text: "$\\frac{1}{\\sqrt{6}}$", isCorrect: true },
      { id: "B", text: "$\\frac{2}{\\sqrt{3}}$", isCorrect: false },
      { id: "C", text: "$\\frac{1}{\\sqrt{3}}$", isCorrect: false },
      { id: "D", text: "$0$", isCorrect: false }
    ],
    correctAnswer: "A",
    explanation: "### Key Formula:\n$$d = \\left| \\frac{(\\vec{a}_2 - \\vec{a}_1) \\cdot (\\vec{b}_1 \\times \\vec{b}_2)}{|\\vec{b}_1 \\times \\vec{b}_2|} \\right|$$\n\n### Calculation:\n1. $\\vec{a}_1 = (1, 2, 3)$, $\\vec{b}_1 = (2, 3, 4)$\n2. $\\vec{a}_2 = (2, 4, 5)$, $\\vec{b}_2 = (3, 4, 5)$\n3. $\\vec{a}_2 - \\vec{a}_1 = (1, 2, 2)$\n4. $\\vec{b}_1 \\times \\vec{b}_2 = -\\hat{i} + 2\\hat{j} - \\hat{k} \\implies |\\vec{b}_1 \\times \\vec{b}_2| = \\sqrt{1+4+1} = \\sqrt{6}$\n5. Dot product: $(1)(-1) + 2(2) + 2(-1) = 1$\n6. $d = \\frac{1}{\\sqrt{6}}$",
    keyFormulas: [
      "d = \\left| \\frac{(\\vec{a}_2 - \\vec{a}_1) \\cdot (\\vec{b}_1 \\times \\vec{b}_2)}{|\\vec{b}_1 \\times \\vec{b}_2|} \\right|"
    ],
    tags: ["3D Geometry", "Vectors", "Shortest Distance"],
    images: [],
    isBookmarked: false,
    status: "unsolved",
    createdAt: new Date("2025-01-11T12:30:00Z").toISOString(),
    personalNotes: "Direct formula application. Watch for sign errors."
  },
  {
    id: "q_sample_03",
    title: "Matrices & Characteristic Equation (Cayley-Hamilton)",
    question: "Let $A = \\begin{pmatrix} 2 & 3 \\\\ 1 & 2 \\end{pmatrix}$. If $A^2 - 4A + kI = O$, find the integer value of $k$.",
    type: "numerical",
    chapter: "Matrices & Determinants",
    subtopic: "Cayley-Hamilton Theorem",
    difficulty: "Medium",
    pyq: {
      isPYQ: true,
      exam: "JEE Advanced",
      year: 2022,
      shift: "Paper 1"
    },
    options: [],
    correctAnswer: "1",
    explanation: "### Characteristic Equation:\nFor a $2 \\times 2$ matrix $A$:\n$$\\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) = 0$$\n1. $\\text{tr}(A) = 2 + 2 = 4$\n2. $\\det(A) = (2)(2) - (3)(1) = 1$\n3. Equation: $\\lambda^2 - 4\\lambda + 1 = 0 \\implies A^2 - 4A + I = O$\n4. Comparing with $A^2 - 4A + kI = O \\implies k = 1$",
    keyFormulas: [
      "A^2 - \\text{tr}(A)A + \\det(A)I = O"
    ],
    tags: ["Matrices", "Cayley Hamilton", "Trace"],
    images: [],
    isBookmarked: true,
    status: "mastered",
    createdAt: new Date("2025-01-14T09:15:00Z").toISOString(),
    personalNotes: "Never multiply out $A^2$ manually when Cayley-Hamilton is available."
  },
  {
    id: "q_sample_04",
    title: "Trigonometric Series & Telescoping Identity",
    question: "Evaluate the finite sum:\n$$S = \\sum_{n=1}^{89} \\tan^{-1}\\left( \\frac{1}{1 + n + n^2} \\right)$$",
    type: "mcq_single",
    chapter: "Trigonometry",
    subtopic: "Inverse Trigonometric Series",
    difficulty: "Hard",
    pyq: {
      isPYQ: true,
      exam: "JEE Advanced",
      year: 2021,
      shift: "Paper 2"
    },
    options: [
      { id: "A", text: "$\\tan^{-1}(90) - \\frac{\\pi}{4}$", isCorrect: true },
      { id: "B", text: "$\\tan^{-1}(89)$", isCorrect: false },
      { id: "C", text: "$\\frac{\\pi}{2}$", isCorrect: false },
      { id: "D", text: "$\\tan^{-1}(90) + \\frac{\\pi}{4}$", isCorrect: false }
    ],
    correctAnswer: "A",
    explanation: "### Telescoping Formula:\nRecall the identity:\n$$\\tan^{-1}(a) - \\tan^{-1}(b) = \\tan^{-1}\\left( \\frac{a - b}{1 + ab} \\right)$$\n\n### Step-by-Step Derivation:\n1. Rewrite the general term $T_n$:\n   $$T_n = \\tan^{-1}\\left( \\frac{1}{1 + n(n+1)} \\right) = \\tan^{-1}\\left( \\frac{(n+1) - n}{1 + (n+1)n} \\right) = \\tan^{-1}(n+1) - \\tan^{-1}(n)$$\n2. Summing from $n=1$ to $89$:\n   $$S = [\\tan^{-1}(2) - \\tan^{-1}(1)] + [\\tan^{-1}(3) - \\tan^{-1}(2)] + \\dots + [\\tan^{-1}(90) - \\tan^{-1}(89)]$$\n3. Intermediate terms telescope and cancel:\n   $$S = \\tan^{-1}(90) - \\tan^{-1}(1) = \\tan^{-1}(90) - \\frac{\\pi}{4}$$\n\n### Conclusion:\nOption **(A)** is correct.",
    keyFormulas: [
      "\\tan^{-1}(a) - \\tan^{-1}(b) = \\tan^{-1}\\left(\\frac{a-b}{1+ab}\\right)"
    ],
    tags: ["Trigonometry", "Inverse Trigonometry", "Telescoping Series"],
    images: [],
    isBookmarked: true,
    status: "revision",
    createdAt: new Date("2025-01-16T11:20:00Z").toISOString(),
    personalNotes: "Classic telescoping pattern: write $1$ as $(n+1) - n$."
  },
  {
    id: "q_sample_05",
    title: "First Order Linear Differential Equation with Integrating Factor",
    question: "Find the general solution of the differential equation:\n$$\\frac{dy}{dx} + y \\tan x = \\sec x$$ given that $y(0) = 1$.",
    type: "subjective",
    chapter: "Differential Equations",
    subtopic: "Linear Differential Equations (LDE)",
    difficulty: "Medium",
    pyq: {
      isPYQ: true,
      exam: "CBSE 12th",
      year: 2024,
      shift: "Board Paper"
    },
    options: [],
    correctAnswer: "y = sin(x) + cos(x)",
    explanation: "### Standard Form:\n$$\\frac{dy}{dx} + P(x)y = Q(x)$$\nHere $P(x) = \\tan x$, $Q(x) = \\sec x$.\n\n### Step-by-Step Solution:\n1. Integrating Factor (I.F.):\n   $$\\text{I.F.} = e^{\\int P(x) dx} = e^{\\int \\tan x dx} = e^{\\ln |\\sec x|} = \\sec x$$\n2. Multiply equation by I.F. and integrate:\n   $$y \\cdot (\\text{I.F.}) = \\int Q(x) \\cdot (\\text{I.F.}) \\, dx + C$$\n   $$y \\sec x = \\int \\sec^2 x \\, dx + C = \\tan x + C$$\n3. Apply initial condition $y(0) = 1$:\n   $$1 \\cdot \\sec(0) = \\tan(0) + C \\implies 1 \\cdot 1 = 0 + C \\implies C = 1$$\n4. Hence:\n   $$y \\sec x = \\tan x + 1 \\implies y = \\frac{\\tan x + 1}{\\sec x} = \\sin x + \\cos x$$\n\n### Final Solution:\n$$y(x) = \\sin x + \\cos x$$",
    keyFormulas: [
      "\\text{I.F.} = e^{\\int P(x) dx}",
      "y \\cdot \\text{I.F.} = \\int Q(x) \\cdot \\text{I.F.} dx + C"
    ],
    tags: ["Differential Equations", "Integrating Factor", "LDE"],
    images: [],
    isBookmarked: false,
    status: "unsolved",
    createdAt: new Date("2025-01-18T14:10:00Z").toISOString(),
    personalNotes: "Remember $\\int \\tan x dx = \\ln |\\sec x|$."
  },
  {
    id: "q_sample_06",
    title: "Probability - Baye's Theorem on Coin Tosses",
    question: "An urn contains two coins: one fair coin ($P(\\text{Heads}) = 0.5$) and one two-headed biased coin ($P(\\text{Heads}) = 1$). A coin is chosen at random and flipped $3$ times, yielding Heads all $3$ times. What is the probability that the chosen coin was the two-headed biased coin?",
    type: "mcq_single",
    chapter: "Probability & Statistics",
    subtopic: "Bayes Theorem",
    difficulty: "Hard",
    pyq: {
      isPYQ: true,
      exam: "NDA",
      year: 2024,
      shift: "Paper I"
    },
    options: [
      { id: "A", text: "$\\frac{8}{9}$", isCorrect: true },
      { id: "B", text: "$\\frac{1}{2}$", isCorrect: false },
      { id: "C", text: "$\\frac{7}{8}$", isCorrect: false },
      { id: "D", text: "$\\frac{4}{5}$", isCorrect: false }
    ],
    correctAnswer: "A",
    explanation: "### Bayes' Theorem:\n$$P(E_2 | A) = \\frac{P(E_2)P(A|E_2)}{P(E_1)P(A|E_1) + P(E_2)P(A|E_2)} = \\frac{\\frac{1}{2} \\cdot 1}{\\frac{1}{2} \\cdot \\frac{1}{8} + \\frac{1}{2} \\cdot 1} = \\frac{1/2}{9/16} = \\frac{8}{9}$$",
    keyFormulas: [
      "P(E_i|A) = \\frac{P(E_i)P(A|E_i)}{\\sum P(E_k)P(A|E_k)}"
    ],
    tags: ["Probability", "Bayes Theorem"],
    images: [],
    isBookmarked: false,
    status: "unsolved",
    createdAt: new Date("2025-01-20T16:00:00Z").toISOString(),
    personalNotes: "Direct Bayes application."
  }
];
