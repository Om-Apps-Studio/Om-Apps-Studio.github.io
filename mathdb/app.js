/**
 * MathVault - Main Application Controller
 * Dual-Layer Permanent Storage, 18-Chapter Dynamic Formula MCQ Generator & Formula Notes
 */

// ==========================================
// 1. Dual-Layer Storage Engine (MathBankDB)
// ==========================================
class MathBankDB {
  constructor() {
    this.dbName = 'MathVaultDB_v2';
    this.version = 1;
    this.db = null;
    this.localStorageKey = 'mathvault_questions_v2';
    this.seededFlagKey = 'mathvault_has_seeded_v2';
  }

  async init() {
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(this.dbName, this.version);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('questions')) {
            const store = db.createObjectStore('questions', { keyPath: 'id' });
            store.createIndex('chapter', 'chapter', { unique: false });
            store.createIndex('difficulty', 'difficulty', { unique: false });
            store.createIndex('isBookmarked', 'isBookmarked', { unique: false });
            store.createIndex('createdAt', 'createdAt', { unique: false });
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(this.db);
        };

        request.onerror = () => {
          console.warn('IndexedDB unavailable, using LocalStorage fallback.');
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB exception, using LocalStorage fallback.', err);
        resolve(null);
      }
    });
  }

  /**
   * Automatically scans for questions saved in previous storage versions (v1 MathVaultDB, mathvault_questions)
   * and migrates them safely to prevent any accidental data loss across app updates.
   */
  async recoverOldVersionData() {
    const recovered = [];

    // 1. Scan previous LocalStorage keys
    const oldKeys = ['mathvault_questions', 'mathvault_questions_v1', 'mathvault_saved_questions', 'math_questions'];
    for (const key of oldKeys) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            recovered.push(...parsed);
          }
        }
      } catch (e) {}
    }

    // 2. Scan previous IndexedDB 'MathVaultDB' (v1)
    try {
      const oldDbReq = indexedDB.open('MathVaultDB', 1);
      const oldQuestions = await new Promise((resolve) => {
        oldDbReq.onsuccess = (e) => {
          try {
            const db = e.target.result;
            if (db.objectStoreNames.contains('questions')) {
              const tx = db.transaction('questions', 'readonly');
              const store = tx.objectStore('questions');
              const getAllReq = store.getAll();
              getAllReq.onsuccess = () => resolve(getAllReq.result || []);
              getAllReq.onerror = () => resolve([]);
            } else {
              resolve([]);
            }
          } catch (err) {
            resolve([]);
          }
        };
        oldDbReq.onerror = () => resolve([]);
      });
      if (oldQuestions && oldQuestions.length > 0) {
        recovered.push(...oldQuestions);
      }
    } catch (e) {}

    return recovered;
  }

  async getAllQuestions() {
    if (this.db) {
      try {
        const fromIDB = await new Promise((resolve, reject) => {
          const tx = this.db.transaction('questions', 'readonly');
          const store = tx.objectStore('questions');
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        });

        if (fromIDB && fromIDB.length > 0) {
          this.syncToLocalStorage(fromIDB);
          return fromIDB;
        }
      } catch (e) {
        console.warn('IndexedDB read error, falling back to LocalStorage', e);
      }
    }

    const rawLS = localStorage.getItem(this.localStorageKey);
    if (rawLS) {
      try {
        const parsed = JSON.parse(rawLS);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }

    return [];
  }

  async saveQuestion(question) {
    if (this.db) {
      try {
        await new Promise((resolve, reject) => {
          const tx = this.db.transaction('questions', 'readwrite');
          const store = tx.objectStore('questions');
          const request = store.put(question);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (e) {}
    }

    const all = await this.getAllQuestions();
    const idx = all.findIndex((q) => q.id === question.id);
    if (idx >= 0) all[idx] = question;
    else all.unshift(question);
    this.syncToLocalStorage(all);
  }

  async deleteQuestion(id) {
    if (this.db) {
      try {
        await new Promise((resolve, reject) => {
          const tx = this.db.transaction('questions', 'readwrite');
          const store = tx.objectStore('questions');
          const request = store.delete(id);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (e) {}
    }

    const all = await this.getAllQuestions();
    const filtered = all.filter((q) => q.id !== id);
    this.syncToLocalStorage(filtered);
  }

  async bulkAdd(questionsList) {
    if (this.db) {
      try {
        await new Promise((resolve, reject) => {
          const tx = this.db.transaction('questions', 'readwrite');
          const store = tx.objectStore('questions');
          questionsList.forEach((q) => store.put(q));
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
      } catch (e) {}
    }

    const all = await this.getAllQuestions();
    const map = new Map();
    all.forEach((q) => map.set(q.id, q));
    questionsList.forEach((q) => map.set(q.id, q));
    const combined = Array.from(map.values());
    this.syncToLocalStorage(combined);
  }

  async clearAll() {
    if (this.db) {
      try {
        await new Promise((resolve, reject) => {
          const tx = this.db.transaction('questions', 'readwrite');
          const store = tx.objectStore('questions');
          const req = store.clear();
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      } catch (e) {}
    }
    localStorage.removeItem(this.localStorageKey);
    localStorage.setItem(this.seededFlagKey, 'true');
  }

  syncToLocalStorage(questionsList) {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(questionsList));
      localStorage.setItem(this.seededFlagKey, 'true');
    } catch (e) {}
  }

  hasSeeded() {
    return localStorage.getItem(this.seededFlagKey) === 'true';
  }

  markSeeded() {
    localStorage.setItem(this.seededFlagKey, 'true');
  }
}

// ==========================================
// 2. Universal Math Formula & Markdown Rendering Engine
// ==========================================
class MathRenderer {
  /**
   * Universal Math Syntax Normalizer
   * Intelligently translates all AI formats, Unicode math, bare environments, and TeX shorthand into valid KaTeX markup
   */
  static normalizeMathSyntax(input) {
    if (!input || typeof input !== 'string') return '';

    let text = input.trim();

    // 1. Normalize AI / MathML Tags (ChatGPT, Gemini, etc.)
    text = text.replace(/\[math\]([\s\S]*?)\[\/math\]/gi, '$$$1$$');
    text = text.replace(/<math[^>]*>([\s\S]*?)<\/math>/gi, '$$$1$$');
    text = text.replace(/\\begin\{math\}([\s\S]*?)\\end\{math\}/gi, '$$$1$$');
    text = text.replace(/\\begin\{displaymath\}([\s\S]*?)\\end\{displaymath\}/gi, '$$$$$1$$$$');

    // 2. Standardize TeX brackets \[ ... \] and \( ... \)
    text = text.replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$');
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');

    // 3. Auto-wrap bare LaTeX environments if not already inside math delimiters
    const bareEnvs = ['matrix', 'pmatrix', 'bmatrix', 'vmatrix', 'Vmatrix', 'cases', 'aligned', 'gathered', 'split', 'array'];
    bareEnvs.forEach((env) => {
      const regex = new RegExp(`(?<!\\$)\\s*(\\\\begin\\{${env}\\}[\\s\\S]*?\\\\end\\{${env}\\})\\s*(?!\\$)`, 'g');
      text = text.replace(regex, (match) => `$$${match}$$`);
    });

    // 4. Protect all existing valid math blocks ($$...$$ and $...$)
    const mathBlocks = [];
    const placeholder = (idx) => `@@MATH_PROTECTED_${idx}@@`;

    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match) => {
      mathBlocks.push(match);
      return placeholder(mathBlocks.length - 1);
    });

    text = text.replace(/\$([^\$\n]+?)\$/g, (match) => {
      mathBlocks.push(match);
      return placeholder(mathBlocks.length - 1);
    });

    // 5. In UNPROTECTED text, handle bare LaTeX commands and formulas (e.g. 2\sqrt{2}, \frac{1}{2}, x^2 + 4)
    if (/^[-+]?\d*\.?\d*\s*\\(?:frac|sqrt|cfrac|dfrac|pm|mp|times|div|alpha|beta|gamma|theta|pi|sigma|Delta|sum|int|lim|binom|log|ln|sin|cos|tan|vec|bar|hat|cdot|le|ge|ne|infty|pmod|bmod|overline)/.test(text) ||
        /^[-+a-zA-Z0-9\s\.\,\(\)\/\*\^\_]*[\^_{}][-+a-zA-Z0-9\s\.\,\(\)\/\*\^\_]*$/.test(text)) {
      text = `$${text}$`;
    } else {
      // In multi-word text, find bare LaTeX commands like 2\sqrt{2} or \frac{a}{b}
      text = text.replace(/([-+]?\d*\.?\d*\s*\\(?:frac|sqrt|cfrac|dfrac|pm|mp|times|div|alpha|beta|gamma|theta|pi|sigma|Delta|sum|int|lim|binom|log|ln|sin|cos|tan|vec|bar|hat|cdot|le|ge|ne|infty|pmod|bmod|overline)(?:\{[^{}]*\}|\[[^\[\]]*\]|\s+[a-zA-Z0-9]+|\b)(?:\{[^{}]*\})*)/g, (match) => {
        return `$${match.trim()}$`;
      });
    }

    // 6. Translate Unicode Superscripts to LaTeX powers
    const supMap = {
      '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
      '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
      '⁺': '+', '⁻': '-', 'ⁿ': 'n', 'ˣ': 'x', 'ʸ': 'y'
    };
    for (const [sup, normal] of Object.entries(supMap)) {
      text = text.replace(new RegExp(`([a-zA-Z0-9\\)])${sup}`, 'g'), `$1^{${normal}}`);
    }

    // 7. Translate Unicode Subscripts to LaTeX subscripts
    const subMap = {
      '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
      '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
      '₊': '+', '₋': '-', 'ₐ': 'a', 'ₑ': 'e', 'ᵢ': 'i', 'ₒ': 'o', 'ᵤ': 'u', 'ₖ': 'k', 'ₙ': 'n'
    };
    for (const [sub, normal] of Object.entries(subMap)) {
      text = text.replace(new RegExp(`([a-zA-Z])${sub}`, 'g'), `$1_{${normal}}`);
    }

    // Wrap any bare powers/subscripts outside math blocks
    text = text.replace(/([a-zA-Z0-9]\^\{[^\}]+\}|[a-zA-Z0-9]\_\{[^\}]+\})/g, (m) => `$${m}$`);

    // 8. Translate Common Unicode Math Symbols
    const unicodeSymbols = [
      { sym: /√\s*(\d+|[a-zA-Z])/g, rep: '$\\sqrt{$1}$' },
      { sym: /∛\s*(\d+|[a-zA-Z])/g, rep: '$\\sqrt[3]{$1}$' },
      { sym: /±\s*(\d+|[a-zA-Z])/g, rep: '$\\pm $1$' },
      { sym: /±/g, rep: '$\\pm$' },
      { sym: /∓/g, rep: '$\\mp$' },
      { sym: /×/g, rep: '$\\times$' },
      { sym: /÷/g, rep: '$\\div$' },
      { sym: /≠/g, rep: '$\\ne$' },
      { sym: /≤/g, rep: '$\\le$' },
      { sym: /≥/g, rep: '$\\ge$' },
      { sym: /≈/g, rep: '$\\approx$' },
      { sym: /≡/g, rep: '$\\equiv$' },
      { sym: /∞/g, rep: '$\\infty$' },
      { sym: /π/g, rep: '$\\pi$' },
      { sym: /θ/g, rep: '$\\theta$' },
      { sym: /α/g, rep: '$\\alpha$' },
      { sym: /β/g, rep: '$\\beta$' },
      { sym: /γ/g, rep: '$\\gamma$' },
      { sym: /λ/g, rep: '$\\lambda$' },
      { sym: /σ/g, rep: '$\\sigma$' },
      { sym: /Δ/g, rep: '$\\Delta$' },
      { sym: /Σ/g, rep: '$\\sum$' },
      { sym: /∫/g, rep: '$\\int$' },
      { sym: /∈/g, rep: '$\\in$' },
      { sym: /∉/g, rep: '$\\notin$' },
      { sym: /⊂/g, rep: '$\\subset$' },
      { sym: /∪/g, rep: '$\\cup$' },
      { sym: /∩/g, rep: '$\\cap$' },
      { sym: /⇒/g, rep: '$\\implies$' },
      { sym: /⇔/g, rep: '$\\iff$' },
      { sym: /°/g, rep: '^{\\circ}' }
    ];

    unicodeSymbols.forEach(({ sym, rep }) => {
      text = text.replace(sym, rep);
    });

    // 9. Restore protected math blocks
    text = text.replace(/@@MATH_PROTECTED_(\d+)@@/g, (match, idx) => {
      return mathBlocks[parseInt(idx, 10)] || match;
    });

    // 10. Fix Double Wrapped Dollar Signs ($$$ ... $$$ -> $ ... $)
    text = text.replace(/\${3,}([^\$]+?)\${3,}/g, '$$$$$1$$$$');

    return text;
  }

  static renderMathInElement(element) {
    if (!element || typeof renderMathInElement !== 'function') return;
    try {
      renderMathInElement(element, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        macros: {
          "\\nth": "n^{\\text{th}}",
          "\\th": "^{\\text{th}}",
          "\\st": "^{\\text{st}}",
          "\\nd": "^{\\text{nd}}",
          "\\rd": "^{\\text{rd}}",
          "\\nCr": "{}^{#1}\\mathrm{C}_{#2}",
          "\\nPr": "{}^{#1}\\mathrm{P}_{#2}",
          "\\degree": "^{\\circ}",
          "\\deg": "^{\\circ}",
          "\\abs": "\\left|#1\\right|",
          "\\norm": "\\left\\|#1\\right\\|",
          "\\floor": "\\left\\lfloor#1\\right\\rfloor",
          "\\ceil": "\\left\\lceil#1\\right\\rceil",
          "\\d": "\\mathrm{d}",
          "\\e": "\\mathrm{e}",
          "\\i": "\\mathrm{i}",
          "\\C": "\\mathbb{C}",
          "\\R": "\\mathbb{R}",
          "\\Q": "\\mathbb{Q}",
          "\\Z": "\\mathbb{Z}",
          "\\N": "\\mathbb{N}"
        },
        throwOnError: false,
        errorColor: '#e11d48',
        trust: true,
        strict: false
      });
    } catch (err) {}
  }

  static markdownToHtml(markdownText) {
    if (!markdownText) return '';

    // Step 1: Universally normalize math syntax
    const normalized = this.normalizeMathSyntax(markdownText);

    // Step 2: Protect math blocks from markdown processing
    const mathBlocks = [];
    const placeholder = (idx) => `@@MATH_BLOCK_${idx}@@`;

    // Extract Display Math $$...$$
    let protectedText = normalized.replace(/\$\$([\s\S]*?)\$\$/g, (match) => {
      mathBlocks.push(match);
      return placeholder(mathBlocks.length - 1);
    });

    // Extract Inline Math $...$
    protectedText = protectedText.replace(/\$([^\$\n]+?)\$/g, (match) => {
      mathBlocks.push(match);
      return placeholder(mathBlocks.length - 1);
    });

    // Step 3: Run Marked.js
    let html = '';
    if (typeof marked !== 'undefined' && marked.parse) {
      html = marked.parse(protectedText);
    } else {
      html = protectedText.replace(/\n/g, '<br>');
    }

    // Step 4: Restore Math Blocks
    html = html.replace(/@@MATH_BLOCK_(\d+)@@/g, (match, idx) => {
      return mathBlocks[parseInt(idx, 10)] || match;
    });

    return html;
  }

  static renderFormatted(targetElement, markdownAndMathText) {
    if (!targetElement) return;
    const html = this.markdownToHtml(markdownAndMathText);
    targetElement.innerHTML = html;
    this.renderMathInElement(targetElement);
  }
}

// ==========================================
// 3. Virtual Math Palette Symbols
// ==========================================
const MATH_PALETTE_SYMBOLS = {
  calculus: [
    { label: '\\int', latex: '\\int_{a}^{b} f(x) \\, dx' },
    { label: '\\iint', latex: '\\iint_D f(x,y) \\, dA' },
    { label: '\\frac{d}{dx}', latex: '\\frac{d}{dx}\\left[ f(x) \\right]' },
    { label: '\\lim', latex: '\\lim_{x \\to 0}' },
    { label: '\\sum', latex: '\\sum_{n=1}^{\\infty}' },
    { label: '\\infty', latex: '\\infty' },
    { label: 'dx', latex: '\\, dx' }
  ],
  algebra: [
    { label: '\\frac{a}{b}', latex: '\\frac{a}{b}' },
    { label: '\\sqrt{x}', latex: '\\sqrt{x}' },
    { label: 'x^n', latex: 'x^{n}' },
    { label: '\\pm', latex: '\\pm' },
    { label: '\\le', latex: '\\le' },
    { label: '\\ge', latex: '\\ge' },
    { label: '\\log', latex: '\\log_b(x)' },
    { label: '\\ln', latex: '\\ln(x)' }
  ],
  trig: [
    { label: '\\sin', latex: '\\sin(x)' },
    { label: '\\cos', latex: '\\cos(x)' },
    { label: '\\tan', latex: '\\tan(x)' },
    { label: '\\sin^{-1}', latex: '\\sin^{-1}(x)' },
    { label: '\\tan^{-1}', latex: '\\tan^{-1}(x)' },
    { label: '^\\circ', latex: '^{\\circ}' }
  ],
  matrices: [
    { label: '2x2 Matrix', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    { label: '3x3 Matrix', latex: '\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}' },
    { label: 'Determinant', latex: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}' },
    { label: '\\vec{a}', latex: '\\vec{a}' },
    { label: '\\vec{a} \\cdot \\vec{b}', latex: '\\vec{a} \\cdot \\vec{b}' }
  ],
  greek: [
    { label: '\\alpha', latex: '\\alpha' },
    { label: '\\beta', latex: '\\beta' },
    { label: '\\theta', latex: '\\theta' },
    { label: '\\pi', latex: '\\pi' },
    { label: '\\sigma', latex: '\\sigma' },
    { label: '\\Delta', latex: '\\Delta' }
  ],
  sets: [
    { label: '\\in', latex: '\\in' },
    { label: '\\cup', latex: '\\cup' },
    { label: '\\cap', latex: '\\cap' },
    { label: '\\implies', latex: '\\implies' },
    { label: '\\mathbb{R}', latex: '\\mathbb{R}' }
  ]
};

// ==========================================
// 4. 18-Chapter Arithmetic Formula Notes Data
// ==========================================
const ARITHMETIC_18_CHAPTERS_DATA = [
  {
    key: 'unit_digit',
    title: '1. Unit Digit (इकाई अंक)',
    icon: 'fa-solid fa-fingerprint',
    content: `
- **Cyclicity of 4:** $2, 3, 7, 8$ cycle every 4 powers.
  $$2^{[1..4]} \\to [2, 4, 8, 6], \\quad 3^{[1..4]} \\to [3, 9, 7, 1], \\quad 7^{[1..4]} \\to [7, 9, 3, 1], \\quad 8^{[1..4]} \\to [8, 4, 2, 6]$$
- **Cyclicity of 2:** $4^{\\text{odd}} = 4, 4^{\\text{even}} = 6$; $9^{\\text{odd}} = 9, 9^{\\text{even}} = 1$.
- **Invariable Digits:** $0, 1, 5, 6$ stay identical for all powers.
- **Factorials:** Unit digit of $n! = 0$ for all $n \\ge 5$.
    `
  },
  {
    key: 'number_of_factors',
    title: '2. Number of Factors (गुणनखंडों की संख्या)',
    icon: 'fa-solid fa-calculator',
    content: `
For $N = p_1^a \\cdot p_2^b \\cdot p_3^c$:
- **Total Factors:** $T(N) = (a + 1)(b + 1)(c + 1)$
- **Odd Factors:** $(b + 1)(c + 1)$ (ignoring power of 2)
- **Even Factors:** $a(b + 1)(c + 1)$
- **Sum of Factors:** $S(N) = \\left(\\frac{p_1^{a+1}-1}{p_1-1}\\right)\\left(\\frac{p_2^{b+1}-1}{p_2-1}\\right)\\cdots$
- **Product of Factors:** $P(N) = N^{T(N)/2}$
    `
  },
  {
    key: 'number_of_zeros',
    title: '3. Number of Zeros (शून्यों की संख्या)',
    icon: 'fa-solid fa-circle-notch',
    content: `
- Trailing zeros are created by pairs of $(2 \\times 5 = 10)$.
- **Legendre's Formula in $n!$:**
  $$E_5(n!) = \\left\\lfloor \\frac{n}{5} \\right\\rfloor + \\left\\lfloor \\frac{n}{25} \\right\\rfloor + \\left\\lfloor \\frac{n}{125} \\right\\rfloor + \\cdots$$
- Example: In $100!$, zeros $= \\lfloor 100/5 \\rfloor + \\lfloor 100/25 \\rfloor = 20 + 4 = 24$.
    `
  },
  {
    key: 'remainder_theorem',
    title: '4. Remainder Theorem (शेषफल प्रमेय)',
    icon: 'fa-solid fa-divide',
    content: `
- **Euler's Theorem:** $a^{\\phi(m)} \\equiv 1 \\pmod m$ when $\\gcd(a, m) = 1$.
- **Fermat's Little Theorem:** $a^{p-1} \\equiv 1 \\pmod p$ for prime $p$.
- **Wilson's Theorem:** $(p - 1)! \\equiv -1 \\pmod p$.
- **Binomial Remainder:** $\\frac{(ax + 1)^n}{a} \\implies R = 1$; $\\frac{(ax - 1)^n}{a} \\implies R = 1 \\text{ (even } n) \\text{ or } a-1 \\text{ (odd } n)$.
    `
  },
  {
    key: 'hcf_and_lcm',
    title: '5. HCF and LCM (म.स.प. एवं ल.स.प.)',
    icon: 'fa-solid fa-arrows-split-up-and-left',
    content: `
- **Product Rule:** $N_1 \\times N_2 = \\text{HCF} \\times \\text{LCM}$
- **Fractions:**
  $$\\text{HCF} = \\frac{\\text{HCF(Numerators)}}{\\text{LCM(Denominators)}}, \\quad \\text{LCM} = \\frac{\\text{LCM(Numerators)}}{\\text{HCF(Denominators)}}$$
- Remainder $r$ in each case: $N = \\text{LCM}(x, y, z) \\cdot k + r$.
    `
  },
  {
    key: 'coordinate_geometry',
    title: '6. Coordinate Geometry (निर्देशांक ज्यामिति)',
    icon: 'fa-solid fa-crosshairs',
    content: `
- **Distance:** $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$
- **Section Formula:** $P(x, y) = \\left(\\frac{mx_2 + nx_1}{m+n}, \\frac{my_2 + ny_1}{m+n}\\right)$
- **Area of Triangle:** $\\text{Area} = \\frac{1}{2}|x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)|$
- **Slope of Line:** $m = \\frac{y_2 - y_1}{x_2 - x_1} = -\\frac{A}{B}$ for $Ax + By + C = 0$.
    `
  },
  {
    key: 'standard_deviation',
    title: '7. Standard Deviation & Variance (मानक विचलन)',
    icon: 'fa-solid fa-chart-line',
    content: `
- **Variance:** $\\sigma^2 = \\frac{\\sum (x_i - \\bar{x})^2}{N} = \\frac{\\sum x_i^2}{N} - (\\bar{x})^2$
- **Standard Deviation:** $\\sigma = \\sqrt{\\text{Variance}}$
- **Coefficient of Variation:** $\\text{CV} = \\frac{\\sigma}{\\bar{x}} \\times 100\\%$
- Adding a constant doesn't change $\\sigma$; multiplying by $k$ scales $\\sigma$ by $|k|$.
    `
  },
  {
    key: 'polygons',
    title: '8. Polygons (बहुभुज)',
    icon: 'fa-solid fa-shapes',
    content: `
For any $n$-sided polygon:
- **Sum of Interior Angles:** $S_{\\text{int}} = (n - 2) \\times 180^\\circ$
- **Each Interior Angle:** $\\theta_{\\text{int}} = \\frac{(n - 2) \\times 180^\\circ}{n} = 180^\\circ - \\frac{360^\\circ}{n}$
- **Sum of Exterior Angles:** $360^\\circ$ (always)
- **Number of Diagonals:** $D = \\frac{n(n - 3)}{2}$
    `
  },
  {
    key: 'bar_system',
    title: '9. Bar System (आवर्ती दशमलव)',
    icon: 'fa-solid fa-bars',
    content: `
- **Pure Recurring:** $0.\\overline{ab} = \\frac{ab}{99}, \\quad 0.\\overline{abc} = \\frac{abc}{999}$
- **Mixed Recurring:** $0.a\\bar{b} = \\frac{ab - a}{90}, \\quad 0.ab\\bar{c} = \\frac{abc - ab}{900}$
- Put 9s for repeating digits and 0s for non-repeating decimal digits.
    `
  },
  {
    key: 'mean_median_mode',
    title: '10. Mode, Mean & Median (बहुलक, माध्य, माध्यिका)',
    icon: 'fa-solid fa-chart-simple',
    content: `
- **Empirical Relationship:** $\\text{Mode} = 3\\text{Median} - 2\\text{Mean}$
- **Mean:** $\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i}$
- **Median:** Middle term of ordered data.
- **Range:** $\\text{Max} - \\text{Min}$.
    `
  },
  {
    key: 'quadratic_equations',
    title: '11. Quadratic Equations (द्विघात समीकरण)',
    icon: 'fa-solid fa-superscript',
    content: `
For $ax^2 + bx + c = 0$:
- **Roots:** $x = \\frac{-b \\pm \\sqrt{D}}{2a}$ where $D = b^2 - 4ac$
- **Sum:** $\\alpha + \\beta = -b/a$, **Product:** $\\alpha \\beta = c/a$
- **Extremum:** Minimum ($a > 0$) or Maximum ($a < 0$) occurs at $x = -b/2a$, with value $-D/4a$.
    `
  },
  {
    key: 'ap_and_gp',
    title: '12. AP, GP, HP & AGP Progressions (समान्तर, गुणोत्तर, हरात्मक व AGP)',
    icon: 'fa-solid fa-stairs',
    content: `
- **Arithmetic Progression (AP):**
  $$T_n = a + (n-1)d, \\quad S_n = \\frac{n}{2}[2a + (n-1)d] = n \\times T_{\\text{mid}}$$
  - Ratio Transformation: $\\frac{S_n}{S'_n} = \\frac{f(n)}{g(n)} \\implies \\frac{T_n}{T'_n} = \\frac{f(2n-1)}{g(2n-1)}$
  - AP Shortcut: If $T_p = q, T_q = p \\implies T_{p+q} = 0, \\, T_n = p + q - n$.
- **Geometric Progression (GP):**
  $$T_n = ar^{n-1}, \\quad S_n = \\frac{a(r^n - 1)}{r - 1}, \\quad S_\\infty = \\frac{a}{1 - r} \\; (|r| < 1)$$
  - Product of $n$ terms: $P_n = (a \\cdot l)^{n/2}$
- **Harmonic Progression (HP):**
  $$T_n = \\frac{1}{\\frac{1}{a} + (n-1)d}, \\quad \\text{Mean: } b = \\frac{2ac}{a+c}$$
- **Infinite AGP Sum:**
  $$S_\\infty = \\frac{a}{1-r} + \\frac{dr}{(1-r)^2} \\quad (|r| < 1)$$
- **Means & Insertion of $n$ Means:**
  $$\\text{GM}^2 = \\text{AM} \\times \\text{HM}, \\quad \\text{AM} \\ge \\text{GM} \\ge \\text{HM}$$
  $$\\sum_{k=1}^n A_k = n \\left(\\frac{a+b}{2}\\right), \\quad \\prod_{k=1}^n G_k = (\\sqrt{ab})^n$$
    `
  },
  {
    key: 'probability',
    title: '13. Probability (प्रायिकता)',
    icon: 'fa-solid fa-dice',
    content: `
- **Classical Definition:** $P(A) = \\frac{n(A)}{n(S)}$
- **Addition Rule:** $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$
- **Independent Events:** $P(A \\cap B) = P(A) \\times P(B)$
- **Conditional:** $P(A|B) = \\frac{P(A \\cap B)}{P(B)}$
    `
  },
  {
    key: 'algebra',
    title: '14. Algebra (सम्पूर्ण बीजगणित सूत्र व सर्वसमिकाएँ)',
    icon: 'fa-solid fa-square-root-variable',
    content: `
- **Quadratic Identities:**
  $$(a \\pm b)^2 = a^2 \\pm 2ab + b^2, \\quad (a+b)^2 - (a-b)^2 = 4ab, \\quad (a+b)^2 + (a-b)^2 = 2(a^2+b^2)$$
  $$(a+b+c)^2 = a^2+b^2+c^2 + 2(ab+bc+ca)$$
- **Sum of Squares Zero Theorem:**
  $$a^2 + b^2 + c^2 - ab - bc - ca = \\frac{1}{2}[(a-b)^2 + (b-c)^2 + (c-a)^2] \\ge 0$$
- **Cubic Identities:**
  $$(a \\pm b)^3 = a^3 \\pm b^3 \\pm 3ab(a \\pm b)$$
  $$a^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)$$
- **$a^3 + b^3 + c^3 - 3abc$ (All 4 Forms):**
  $$= (a+b+c)(a^2+b^2+c^2-ab-bc-ca) = \\frac{1}{2}(a+b+c)[(a-b)^2+(b-c)^2+(c-a)^2]$$
  $$= (a+b+c)[(a+b+c)^2 - 3(ab+bc+ca)] = \\frac{1}{2}(a+b+c)[3(a^2+b^2+c^2)-(a+b+c)^2]$$
  - **AP Rule:** When $a, b, c$ are in AP with diff $d \\implies a^3+b^3+c^3-3abc = 9bd^2$.
  - **Zero Sum:** If $a + b + c = 0 \\implies a^3 + b^3 + c^3 = 3abc$.
- **Reciprocal Powers ($x + 1/x = k$):**
  $$x^2 + \\frac{1}{x^2} = k^2 - 2, \\quad x^3 + \\frac{1}{x^3} = k^3 - 3k$$
  $$x^5 + \\frac{1}{x^5} = \\left(x^2 + \\frac{1}{x^2}\\right)\\left(x^3 + \\frac{1}{x^3}\\right) - \\left(x + \\frac{1}{x}\\right)$$
- **Special Values:**
  - $x + 1/x = 1 \\implies x^3 = -1$
  - $x + 1/x = \\sqrt{3} \\implies x^6 = -1 \\implies x^6 + 1 = 0$
- **Quartic Factoring:** $x^4 + x^2 y^2 + y^4 = (x^2+xy+y^2)(x^2-xy+y^2)$
    `
  },
  {
    key: 'series_sums',
    title: '15. Series & Special Sums (श्रेणी योग)',
    icon: 'fa-solid fa-sigma',
    content: `
- **Natural Sum:** $\\sum_{k=1}^n k = \\frac{n(n+1)}{2}$
- **Squares Sum:** $\\sum_{k=1}^n k^2 = \\frac{n(n+1)(2n+1)}{6}$
- **Cubes Sum:** $\\sum_{k=1}^n k^3 = \\left[\\frac{n(n+1)}{2}\\right]^2$
- **Odd Sum:** $\\sum (2k-1) = n^2$
    `
  },
  {
    key: 'surds_indices',
    title: '16. Surds and Indices (घातांक एवं करणी)',
    icon: 'fa-solid fa-bolt-lightning',
    content: `
- $\\sqrt{x\\sqrt{x\\sqrt{x\\dots\\infty}}} = x$
- $\\sqrt{k(k+1) + \\sqrt{k(k+1) + \\dots\\infty}} = k + 1$
- $\\sqrt{k(k+1) - \\sqrt{k(k+1) - \\dots\\infty}} = k$
- $a^m \\cdot a^n = a^{m+n}, \\quad (a^m)^n = a^{mn}$
    `
  },
  {
    key: 'number_system',
    title: '17. Number System Properties (संख्या पद्धति)',
    icon: 'fa-solid fa-list-ol',
    content: `
- **Primes:** Prime test divisibility up to $\\sqrt{N}$; Form $6k \\pm 1$ ($>3$).
- **Twin Primes:** Difference of 2, e.g. $(17, 19), (29, 31)$.
- **Perfect Number:** Sum of proper divisors equals $N$. ($6, 28, 496, 8128$).
- **Triangular Number:** $T_n = \\frac{n(n+1)}{2} \\implies 1, 3, 6, 10, 15, 21, 28, 36, 45, 55$.
    `
  },
  {
    key: 'binary_bases',
    title: '18. Binary & Base Conversions (द्विआधारी रूपांतरण)',
    icon: 'fa-solid fa-microchip',
    content: `
- **Decimal to Binary:** Successive division by 2 recording remainders.
- $(25)_{10} = (11001)_2$
- **Binary Addition:** $1 + 1 = 10_2$ (0 carry 1).
- **Octal:** 3 bits per digit ($2^3=8$); **Hex:** 4 bits per digit ($2^4=16$).
    `
  }
];

// ==========================================
// 5. Main Application Controller
// ==========================================
class MathVaultApp {
  constructor() {
    this.db = new MathBankDB();
    this.questions = [];
    this.filteredQuestions = [];
    this.activeStatusFilter = 'all';
    this.currentEditImages = [];
    this.activeTab = 'bank';
    this.activeChapter = 'All';
    this.isGridLayout = true;

    // Dynamic Formula Generator State
    this.currentGenQuestion = null;
    this.genCurrentIndex = 1;
    this.genTotalQuestions = 10;
    this.genScore = 0;
    this.genAnsweredCount = 0;

    // Practice Quiz State
    this.quizDeck = [];
    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizTimerSeconds = 0;
    this.quizTimerInterval = null;

    // Flashcard State
    this.flashcardDeck = [];
    this.flashcardIndex = 0;

    // Speed Calculation Lab State
    this.speedSessionActive = false;
    this.speedCurrentQuestion = null;
    this.speedQuestionIndex = 0;
    this.speedTotalTarget = 20;
    this.speedTimerSeconds = 0;
    this.speedTimerInterval = null;
    this.speedSessionHistory = [];
    this.speedQuestionStartTime = 0;
    this.speedStreak = 0;
    this.speedConfig = {
      track: 'daily_mix',
      mode: 'sprint_20',
      difficulty: 'medium',
      multLevel: '2d_2d',
      operations: ['addition', 'subtraction', 'squares', 'tables']
    };
  }

  async init() {
    await this.db.init();
    let stored = await this.db.getAllQuestions();

    // 🔄 Automatic Recovery: Check if there are questions saved in previous app storage/database versions
    try {
      const recovered = await this.db.recoverOldVersionData();
      if (recovered && recovered.length > 0) {
        const existingIds = new Set((stored || []).map((q) => q.id));
        const newRecovered = recovered.filter((q) => !existingIds.has(q.id));
        if (newRecovered.length > 0) {
          await this.db.bulkAdd(newRecovered);
          stored = await this.db.getAllQuestions();
          console.info(`[MathVault] Successfully recovered ${newRecovered.length} questions from previous storage.`);
        }
      }
    } catch (e) {
      console.warn('[MathVault] Legacy recovery check skipped:', e);
    }

    if ((!stored || stored.length === 0) && !this.db.hasSeeded()) {
      if (typeof INITIAL_SAMPLE_QUESTIONS !== 'undefined' && INITIAL_SAMPLE_QUESTIONS.length > 0) {
        await this.db.bulkAdd(INITIAL_SAMPLE_QUESTIONS);
        this.db.markSeeded();
        stored = await this.db.getAllQuestions();
      }
    }

    this.questions = stored || [];
    this.initTheme();
    this.initGlobalEventDelegation();
    this.initEventListeners();
    this.initPalette();
    this.populateChapterDropdowns();
    this.applyFiltersAndRender();
    this.updateStats();

    // Initial Generator Question
    this.startNewGenQuiz();
  }

  // ---------------- Theme Management ----------------
  initTheme() {
    const savedTheme = localStorage.getItem('mathvault_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);

    const savedGrid = localStorage.getItem('mathvault_grid');
    if (savedGrid !== null) {
      this.isGridLayout = (savedGrid === 'true');
    }
    this.updateGridLayout();
  }

  toggleTheme() {
    const current = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('mathvault_theme', next);
    this.updateThemeIcon(next);
    this.showToast(`Switched to ${next === 'light' ? 'Bright ☀️' : 'Dark 🌙'} theme`, 'info');
  }

  updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
  }

  toggleGridLayout() {
    this.isGridLayout = !this.isGridLayout;
    localStorage.setItem('mathvault_grid', String(this.isGridLayout));
    this.updateGridLayout();
    this.showToast(this.isGridLayout ? '2-Column Compact Grid enabled' : '1-Column List enabled', 'info');
  }

  updateGridLayout() {
    const containers = [
      document.getElementById('questionsContainer'),
      document.getElementById('chapterQuestionsContainer')
    ];
    const icon = document.getElementById('gridIcon');
    containers.forEach((container) => {
      if (container) container.classList.toggle('grid-layout', this.isGridLayout);
    });
    if (icon) {
      icon.className = this.isGridLayout ? 'fa-solid fa-table-cells' : 'fa-solid fa-list';
    }
  }

  // ---------------- Global Event Delegation ----------------
  initGlobalEventDelegation() {
    document.addEventListener('click', async (e) => {
      // 1. Delete Question
      const deleteBtn = e.target.closest('[data-action="delete"]');
      if (deleteBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = deleteBtn.getAttribute('data-id');
        if (id) await this.deleteQuestionPermanently(id);
        return;
      }

      // 2. Edit Question
      const editBtn = e.target.closest('[data-action="edit"]');
      if (editBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = editBtn.getAttribute('data-id');
        if (id) this.openQuestionModal(id);
        return;
      }

      // 3. Bookmark Toggle
      const bookmarkBtn = e.target.closest('[data-action="bookmark"]');
      if (bookmarkBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = bookmarkBtn.getAttribute('data-id');
        if (id) await this.toggleBookmark(id);
        return;
      }

      // 4. Solution Drawer Toggle
      const solutionBtn = e.target.closest('[data-action="toggle-solution"]');
      if (solutionBtn) {
        e.preventDefault();
        const card = solutionBtn.closest('.question-card');
        const drawer = card?.querySelector('.card-solution-drawer');
        const arrow = solutionBtn.querySelector('.toggle-arrow');
        if (drawer) {
          drawer.classList.toggle('open');
          if (arrow) {
            arrow.className = drawer.classList.contains('open')
              ? 'fa-solid fa-chevron-up toggle-arrow'
              : 'fa-solid fa-chevron-down toggle-arrow';
          }
        }
        return;
      }

      // 5. Copy LaTeX
      const copyBtn = e.target.closest('[data-action="copy-latex"]');
      if (copyBtn) {
        e.preventDefault();
        const id = copyBtn.getAttribute('data-id');
        const q = this.questions.find((item) => item.id === id);
        if (q) {
          navigator.clipboard.writeText(q.question || '');
          this.showToast('LaTeX formula copied!', 'success');
        }
        return;
      }

      // 6. Mastered Toggle
      const statusBtn = e.target.closest('[data-action="toggle-status"]');
      if (statusBtn) {
        e.preventDefault();
        const id = statusBtn.getAttribute('data-id');
        const q = this.questions.find((item) => item.id === id);
        if (q) {
          q.status = q.status === 'mastered' ? 'revision' : 'mastered';
          await this.db.saveQuestion(q);
          this.applyFiltersAndRender();
          if (this.activeTab === 'chapters') this.renderChapterHorizontalView();
          this.showToast(q.status === 'mastered' ? 'Marked as Mastered! 🎉' : 'Marked for Revision', 'success');
        }
        return;
      }
    });
  }

  async deleteQuestionPermanently(id) {
    this.questions = this.questions.filter((q) => q.id !== id);
    this.filteredQuestions = this.filteredQuestions.filter((q) => q.id !== id);
    await this.db.deleteQuestion(id);
    this.populateChapterDropdowns();
    this.applyFiltersAndRender();
    if (this.activeTab === 'chapters') this.renderChapterHorizontalView();
    this.updateStats();
    this.showToast('Question permanently deleted 🗑️', 'info');
  }

  async toggleBookmark(id) {
    const q = this.questions.find((item) => item.id === id);
    if (q) {
      q.isBookmarked = !q.isBookmarked;
      await this.db.saveQuestion(q);
      this.applyFiltersAndRender();
      if (this.activeTab === 'chapters') this.renderChapterHorizontalView();
      this.showToast(q.isBookmarked ? 'Bookmarked ⭐' : 'Removed from Bookmarks', 'info');
    }
  }

  // ---------------- UI Event Listeners ----------------
  initEventListeners() {
    document.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const tabKey = tab.getAttribute('data-tab');
        this.switchTab(tabKey);
      });
    });

    const navTabsContainer = document.getElementById('navTabsContainer');
    document.getElementById('navScrollLeft')?.addEventListener('click', () => {
      navTabsContainer?.scrollBy({ left: -180, behavior: 'smooth' });
    });
    document.getElementById('navScrollRight')?.addEventListener('click', () => {
      navTabsContainer?.scrollBy({ left: 180, behavior: 'smooth' });
    });

    // Mouse drag scrolling on desktop
    if (navTabsContainer) {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      navTabsContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - navTabsContainer.offsetLeft;
        scrollLeft = navTabsContainer.scrollLeft;
      });
      navTabsContainer.addEventListener('mouseleave', () => { isDown = false; });
      navTabsContainer.addEventListener('mouseup', () => { isDown = false; });
      navTabsContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - navTabsContainer.offsetLeft;
        const walk = (x - startX) * 1.5;
        navTabsContainer.scrollLeft = scrollLeft - walk;
      });
    }

    document.getElementById('btnToggleTheme')?.addEventListener('click', () => this.toggleTheme());
    document.getElementById('btnToggleGridLayout')?.addEventListener('click', () => this.toggleGridLayout());

    const searchInput = document.getElementById('searchInput');
    const btnClearSearch = document.getElementById('btnClearSearch');

    searchInput?.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (btnClearSearch) btnClearSearch.style.display = val ? 'block' : 'none';
      this.applyFiltersAndRender();
    });

    btnClearSearch?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (btnClearSearch) btnClearSearch.style.display = 'none';
      this.applyFiltersAndRender();
    });

    document.getElementById('btnToggleAdvancedFilters')?.addEventListener('click', () => {
      document.getElementById('advancedFiltersPanel')?.classList.toggle('open');
    });

    ['filterChapter', 'filterDifficulty', 'filterExam', 'filterYear', 'filterType', 'sortBy'].forEach((id) => {
      document.getElementById(id)?.addEventListener('change', () => this.applyFiltersAndRender());
    });

    document.querySelectorAll('.status-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.status-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeStatusFilter = pill.getAttribute('data-status');
        this.applyFiltersAndRender();
      });
    });

    document.getElementById('btnResetFilters')?.addEventListener('click', () => this.resetFilters());
    document.getElementById('btnExportMarkdown')?.addEventListener('click', () => this.exportMarkdownNotes());
    document.getElementById('btnExportMarkdownModal')?.addEventListener('click', () => this.exportMarkdownNotes());
    document.getElementById('btnPrintQuestionSet')?.addEventListener('click', () => window.print());

    document.getElementById('btnOpenAddQuestion')?.addEventListener('click', () => this.openQuestionModal());
    document.getElementById('btnCloseQuestionModal')?.addEventListener('click', () => this.closeQuestionModal());
    document.getElementById('btnCancelQuestionModal')?.addEventListener('click', () => this.closeQuestionModal());
    document.getElementById('btnSaveQuestion')?.addEventListener('click', () => this.saveQuestionFromForm());

    document.getElementById('formQuestion')?.addEventListener('input', (e) => {
      MathRenderer.renderFormatted(document.getElementById('questionLivePreview'), e.target.value);
    });

    document.getElementById('formExplanation')?.addEventListener('input', (e) => {
      MathRenderer.renderFormatted(document.getElementById('explanationLivePreview'), e.target.value);
    });

    document.getElementById('formType')?.addEventListener('change', (e) => this.handleQuestionTypeChange(e.target.value));
    document.getElementById('btnAddOption')?.addEventListener('click', () => this.addFormOptionRow('', false));

    document.querySelectorAll('.btn-math-insert').forEach((btn) => {
      btn.addEventListener('click', () => {
        const latex = btn.getAttribute('data-latex');
        this.insertLatexAtCursor(latex);
      });
    });

    const fileInput = document.getElementById('imageFileInput');
    fileInput?.addEventListener('change', (e) => this.handleImageFiles(e.target.files));

    window.addEventListener('paste', (e) => {
      const modal = document.getElementById('questionModal');
      if (modal && modal.style.display !== 'none') {
        const items = e.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              const blob = items[i].getAsFile();
              this.processImageFile(blob);
              this.showToast('Diagram pasted!', 'success');
              break;
            }
          }
        }
      }
    });

    document.getElementById('btnOpenAIImport')?.addEventListener('click', () => this.openAIImportModal());
    document.getElementById('btnCloseAIModal')?.addEventListener('click', () => this.closeAIImportModal());
    document.getElementById('btnCancelAIModal')?.addEventListener('click', () => this.closeAIImportModal());
    document.getElementById('btnProcessAIImport')?.addEventListener('click', () => this.processAIImport());
    document.getElementById('btnCopyMasterPrompt')?.addEventListener('click', () => this.copyMasterAIPrompt());

    document.getElementById('btnOpenDataModal')?.addEventListener('click', () => this.openDataModal());
    document.getElementById('btnCloseDataModal')?.addEventListener('click', () => this.closeDataModal());
    document.getElementById('btnCloseDataModalBottom')?.addEventListener('click', () => this.closeDataModal());
    document.getElementById('btnExportJSON')?.addEventListener('click', () => this.exportJSONBackup());
    document.getElementById('jsonFileInput')?.addEventListener('change', (e) => this.importJSONBackup(e));
    document.getElementById('btnLoadSampleData')?.addEventListener('click', () => this.loadSampleData());
    document.getElementById('btnClearAllData')?.addEventListener('click', () => this.clearAllData());

    // Generator Tab Listeners
    document.getElementById('btnGenerateNewQuestion')?.addEventListener('click', () => this.startNewGenQuiz());
    document.getElementById('btnNextGenQuestion')?.addEventListener('click', () => this.nextGenQuizQuestion());
    document.getElementById('btnToggleGenSolution')?.addEventListener('click', () => this.toggleGenSolution());
    document.getElementById('btnSaveGenToBank')?.addEventListener('click', () => this.saveGenQuestionToBank());
    document.getElementById('btnRestartGenQuiz')?.addEventListener('click', () => this.startNewGenQuiz());
    document.getElementById('btnContinueEndlessQuiz')?.addEventListener('click', () => this.continueEndlessGenQuiz());
    document.getElementById('genTotalQuestionsSelect')?.addEventListener('change', () => this.startNewGenQuiz());
    document.getElementById('genTopicSelect')?.addEventListener('change', () => this.startNewGenQuiz());
    document.getElementById('genDifficultySelect')?.addEventListener('change', () => this.startNewGenQuiz());

    // Chapter view solution expanders
    document.getElementById('btnExpandAllChapterSol')?.addEventListener('click', () => {
      document.querySelectorAll('#chapterQuestionsContainer .card-solution-drawer').forEach((d) => d.classList.add('open'));
    });
    document.getElementById('btnCollapseAllChapterSol')?.addEventListener('click', () => {
      document.querySelectorAll('#chapterQuestionsContainer .card-solution-drawer').forEach((d) => d.classList.remove('open'));
    });

    document.getElementById('practiceChapterSelect')?.addEventListener('change', () => this.startPracticeQuiz());
    document.getElementById('practiceDifficultySelect')?.addEventListener('change', () => this.startPracticeQuiz());
    document.getElementById('btnRestartQuiz')?.addEventListener('click', () => this.startPracticeQuiz());
    document.getElementById('btnQuizNext')?.addEventListener('click', () => this.nextQuizQuestion());
    document.getElementById('btnQuizPrev')?.addEventListener('click', () => this.prevQuizQuestion());
    document.getElementById('btnSubmitNumerical')?.addEventListener('click', () => this.checkNumericalAnswer());
    document.getElementById('btnQuizBookmark')?.addEventListener('click', () => this.toggleQuizBookmark());

    document.getElementById('flashcardChapterSelect')?.addEventListener('change', () => this.startFlashcards());
    document.getElementById('btnShuffleFlashcards')?.addEventListener('click', () => this.startFlashcards());
    document.getElementById('flashcardInner')?.addEventListener('click', () => this.flipFlashcard());
    document.getElementById('btnNextFlashcard')?.addEventListener('click', () => this.nextFlashcard());
    document.getElementById('btnPrevFlashcard')?.addEventListener('click', () => this.prevFlashcard());
    document.getElementById('btnMarkNeedsRevision')?.addEventListener('click', () => this.markFlashcardStatus('revision'));
    document.getElementById('btnMarkMastered')?.addEventListener('click', () => this.markFlashcardStatus('mastered'));

    const sandboxInput = document.getElementById('sandboxInput');
    sandboxInput?.addEventListener('input', (e) => this.renderSandboxLatex(e.target.value));
    document.getElementById('btnClearSandbox')?.addEventListener('click', () => {
      if (sandboxInput) sandboxInput.value = '';
      this.renderSandboxLatex('');
    });
    document.getElementById('btnCopySandboxLatex')?.addEventListener('click', () => {
      if (sandboxInput) {
        navigator.clipboard.writeText(sandboxInput.value);
        this.showToast('LaTeX copied!', 'success');
      }
    });
    document.getElementById('btnSendSandboxToNewQ')?.addEventListener('click', () => {
      const code = sandboxInput?.value || '';
      this.openQuestionModal();
      const qInput = document.getElementById('formQuestion');
      if (qInput) {
        qInput.value = `$$${code}$$`;
        MathRenderer.renderFormatted(document.getElementById('questionLivePreview'), qInput.value);
      }
    });

    document.getElementById('formulaSearchInput')?.addEventListener('input', (e) => {
      this.filter18ChapterFormulas(e.target.value.toLowerCase());
    });

    // Speed Calculation Lab Listeners
    document.querySelectorAll('.speed-track-card').forEach((card) => {
      card.addEventListener('click', () => {
        const track = card.getAttribute('data-track');
        this.selectSpeedTrack(track);
      });
    });

    document.getElementById('btnStartSpeedDrill')?.addEventListener('click', () => this.startSpeedDrill());
    document.getElementById('btnSpeedSubmit')?.addEventListener('click', () => this.checkSpeedAnswer());
    
    const speedInput = document.getElementById('speedCalcInput');
    speedInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.checkSpeedAnswer();
      } else if (e.key === ' ') {
        e.preventDefault();
        this.skipSpeedQuestion();
      }
    });

    // Touch Numpad buttons delegation
    document.querySelectorAll('.numpad-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        this.handleSpeedNumpad(key);
      });
    });

    document.getElementById('btnToggleDrillHint')?.addEventListener('click', () => this.toggleSpeedHint());
    document.getElementById('btnSkipDrillQuestion')?.addEventListener('click', () => this.skipSpeedQuestion());
    document.getElementById('btnEndDrillEarly')?.addEventListener('click', () => this.endSpeedDrill());
    document.getElementById('btnRestartSameDrill')?.addEventListener('click', () => this.startSpeedDrill());
    document.getElementById('btnChooseAnotherTrack')?.addEventListener('click', () => this.exitSpeedDrillToSetup());
    document.getElementById('btnOpenSpeedHistory')?.addEventListener('click', () => this.showSpeedHistoryModal());
  }

  switchTab(tabKey) {
    this.activeTab = tabKey;
    let activeTabEl = null;
    document.querySelectorAll('.nav-tab').forEach((t) => {
      const isMatch = t.getAttribute('data-tab') === tabKey;
      t.classList.toggle('active', isMatch);
      t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      if (isMatch) activeTabEl = t;
    });

    if (activeTabEl) {
      activeTabEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    document.querySelectorAll('.tab-pane').forEach((p) => {
      p.style.display = p.id === `pane-${tabKey}` ? 'block' : 'none';
    });

    if (tabKey === 'chapters') {
      this.renderChapterHorizontalView();
    } else if (tabKey === 'generator') {
      if (!this.currentGenQuestion) this.generateNewQuizQuestion();
    } else if (tabKey === 'speed_calc') {
      this.initSpeedLabUI();
    } else if (tabKey === 'practice') {
      this.startPracticeQuiz();
    } else if (tabKey === 'flashcards') {
      this.startFlashcards();
    } else if (tabKey === 'sandbox') {
      this.renderSandboxLatex(document.getElementById('sandboxInput')?.value || '\\int_0^\\pi \\frac{x\\sin x}{1+\\cos^2 x} dx');
    } else if (tabKey === 'formulas') {
      this.render18ChapterFormulaNotes();
    } else if (tabKey === 'stats') {
      this.updateStats();
    }
  }

  populateChapterDropdowns() {
    const chapters = Array.from(new Set(this.questions.map((q) => q.chapter).filter(Boolean))).sort();
    ['filterChapter', 'practiceChapterSelect', 'flashcardChapterSelect'].forEach((id) => {
      const select = document.getElementById(id);
      if (select) {
        const curr = select.value;
        select.innerHTML = '<option value="all">All Chapters</option>' + 
          chapters.map((ch) => `<option value="${this.escapeHtml(ch)}">${this.escapeHtml(ch)}</option>`).join('');
        select.value = curr || 'all';
      }
    });
  }

  applyFiltersAndRender() {
    const searchQuery = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
    const chapterFilter = document.getElementById('filterChapter')?.value || 'all';
    const diffFilter = document.getElementById('filterDifficulty')?.value || 'all';
    const examFilter = document.getElementById('filterExam')?.value || 'all';
    const yearFilter = document.getElementById('filterYear')?.value || 'all';
    const typeFilter = document.getElementById('filterType')?.value || 'all';
    const sortBy = document.getElementById('sortBy')?.value || 'newest';

    let countActiveFilters = 0;
    if (chapterFilter !== 'all') countActiveFilters++;
    if (diffFilter !== 'all') countActiveFilters++;
    if (examFilter !== 'all') countActiveFilters++;
    if (yearFilter !== 'all') countActiveFilters++;
    if (typeFilter !== 'all') countActiveFilters++;
    if (this.activeStatusFilter !== 'all') countActiveFilters++;

    const badge = document.getElementById('activeFilterCount');
    if (badge) {
      badge.style.display = countActiveFilters > 0 ? 'flex' : 'none';
      badge.textContent = countActiveFilters;
    }

    this.filteredQuestions = this.questions.filter((q) => {
      if (this.activeStatusFilter === 'bookmarked' && !q.isBookmarked) return false;
      if (this.activeStatusFilter === 'pyq' && (!q.pyq || !q.pyq.isPYQ)) return false;
      if (this.activeStatusFilter === 'revision' && q.status !== 'revision') return false;
      if (this.activeStatusFilter === 'mastered' && q.status !== 'mastered') return false;
      if (this.activeStatusFilter === 'with_images' && (!q.images || q.images.length === 0)) return false;

      if (chapterFilter !== 'all' && q.chapter !== chapterFilter) return false;
      if (diffFilter !== 'all' && q.difficulty !== diffFilter) return false;
      if (examFilter !== 'all' && (!q.pyq || q.pyq.exam !== examFilter)) return false;
      
      if (yearFilter !== 'all') {
        if (!q.pyq || !q.pyq.year) return false;
        if (yearFilter === 'earlier') {
          if (parseInt(q.pyq.year, 10) > 2021) return false;
        } else if (String(q.pyq.year) !== yearFilter) {
          return false;
        }
      }

      if (typeFilter !== 'all' && q.type !== typeFilter) return false;

      if (searchQuery) {
        const textToSearch = [
          q.title,
          q.question,
          q.explanation,
          q.chapter,
          q.subtopic,
          q.pyq?.exam,
          q.pyq?.year,
          q.tags?.join(' '),
          q.keyFormulas?.join(' '),
          q.personalNotes
        ].filter(Boolean).join(' ').toLowerCase();

        if (!textToSearch.includes(searchQuery)) return false;
      }

      return true;
    });

    this.filteredQuestions.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === 'year_desc') return (b.pyq?.year || 0) - (a.pyq?.year || 0);
      if (sortBy === 'diff_desc') {
        const order = { Challenger: 4, Hard: 3, Medium: 2, Easy: 1 };
        return (order[b.difficulty] || 0) - (order[a.difficulty] || 0);
      }
      if (sortBy === 'diff_asc') {
        const order = { Challenger: 4, Hard: 3, Medium: 2, Easy: 1 };
        return (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
      }
      if (sortBy === 'title_asc') return (a.title || '').localeCompare(b.title || '');
      return 0;
    });

    this.renderQuestionList();
    this.updateSummaryText();
  }

  resetFilters() {
    if (document.getElementById('searchInput')) document.getElementById('searchInput').value = '';
    if (document.getElementById('btnClearSearch')) document.getElementById('btnClearSearch').style.display = 'none';
    if (document.getElementById('filterChapter')) document.getElementById('filterChapter').value = 'all';
    if (document.getElementById('filterDifficulty')) document.getElementById('filterDifficulty').value = 'all';
    if (document.getElementById('filterExam')) document.getElementById('filterExam').value = 'all';
    if (document.getElementById('filterYear')) document.getElementById('filterYear').value = 'all';
    if (document.getElementById('filterType')) document.getElementById('filterType').value = 'all';
    if (document.getElementById('sortBy')) document.getElementById('sortBy').value = 'newest';

    document.querySelectorAll('.status-pill').forEach((p) => p.classList.remove('active'));
    document.querySelector('.status-pill[data-status="all"]')?.classList.add('active');
    this.activeStatusFilter = 'all';

    this.applyFiltersAndRender();
    this.showToast('All filters reset', 'info');
  }

  updateSummaryText() {
    const summary = document.getElementById('filterSummaryText');
    const badge = document.getElementById('totalCountBadge');
    if (badge) badge.textContent = this.questions.length;
    if (summary) {
      summary.textContent = `Showing ${this.filteredQuestions.length} of ${this.questions.length} questions`;
    }
  }

  renderQuestionList() {
    const container = document.getElementById('questionsContainer');
    const emptyState = document.getElementById('emptyState');
    if (!container) return;

    if (this.filteredQuestions.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.innerHTML = this.filteredQuestions.map((q) => this.buildQuestionCardHtml(q)).join('');
    MathRenderer.renderMathInElement(container);
  }

  buildQuestionCardHtml(q) {
    const isBookmarked = q.isBookmarked;
    const diffClass = `difficulty-${(q.difficulty || 'medium').toLowerCase()}`;
    const pyqText = q.pyq?.isPYQ && q.pyq?.exam ? `${q.pyq.exam} ${q.pyq.year || ''}`.trim() : null;

    let optionsHtml = '';
    if (q.options && q.options.length > 0) {
      optionsHtml = `
        <div class="card-options-grid">
          ${q.options.map((opt) => `
            <div class="card-option-item ${opt.isCorrect ? 'correct-option' : ''}">
              <span class="option-prefix">${opt.id || '•'}</span>
              <span class="option-text">${MathRenderer.markdownToHtml(opt.text)}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    let imagesHtml = '';
    if (q.images && q.images.length > 0) {
      imagesHtml = `
        <div style="display:flex; gap:0.4rem; margin:0.4rem 0;">
          ${q.images.map((imgSrc) => `<img src="${imgSrc}" style="height:60px; border-radius:4px; border:1px solid #e2e8f0; cursor:pointer;" alt="Diagram" onclick="app.previewImage('${imgSrc}')">`).join('')}
        </div>
      `;
    }

    let keyFormulasHtml = '';
    if (q.keyFormulas && q.keyFormulas.length > 0) {
      keyFormulasHtml = `
        <div class="key-formulas-box">
          <div class="key-formulas-label"><i class="fa-solid fa-key"></i> Key Formula:</div>
          <div>${q.keyFormulas.map((f) => `$${f}$`).join(' &nbsp;•&nbsp; ')}</div>
        </div>
      `;
    }

    return `
      <div class="question-card" id="card-${q.id}">
        <div class="question-card-header">
          <div class="question-meta-pills">
            <span class="meta-pill chapter">${this.escapeHtml(q.chapter || 'General')}</span>
            <span class="meta-pill ${diffClass}">${q.difficulty || 'Medium'}</span>
            ${pyqText ? `<span class="meta-pill pyq-badge">${this.escapeHtml(pyqText)}</span>` : ''}
          </div>

          <div class="card-actions-quick">
            <button class="btn-icon btn-star ${isBookmarked ? 'bookmarked' : ''}" data-action="bookmark" data-id="${q.id}" title="${isBookmarked ? 'Remove' : 'Bookmark'}">
              <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-star"></i>
            </button>
            <button class="btn-icon" data-action="edit" data-id="${q.id}" title="Edit">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-icon" data-action="delete" data-id="${q.id}" title="Delete">
              <i class="fa-solid fa-trash-can" style="color:var(--accent-rose);"></i>
            </button>
          </div>
        </div>

        <h4 class="question-title">${MathRenderer.markdownToHtml(q.title || 'Math Problem')}</h4>
        <div class="question-statement">${MathRenderer.markdownToHtml(q.question || '')}</div>
        
        ${imagesHtml}
        ${optionsHtml}
        ${keyFormulasHtml}

        <button class="card-solution-toggle-btn" data-action="toggle-solution" data-id="${q.id}">
          <span><i class="fa-solid fa-lightbulb"></i> Step-by-Step Explanation</span>
          <i class="fa-solid fa-chevron-down toggle-arrow"></i>
        </button>
        
        <div class="card-solution-drawer">
          <div class="solution-body">
            ${MathRenderer.markdownToHtml(q.explanation || 'No step-by-step explanation provided.')}
          </div>
          ${q.personalNotes ? `
            <div style="margin-top:0.4rem; padding:0.35rem 0.5rem; background:rgba(217,119,6,0.08); border-radius:4px; font-size:0.75rem; color:#b45309;">
              <strong>Note:</strong> ${this.escapeHtml(q.personalNotes)}
            </div>
          ` : ''}
        </div>

        <div class="card-footer">
          <div class="card-tags">
            ${(q.tags || []).map((t) => `<span class="tag-badge">#${this.escapeHtml(t)}</span>`).join('')}
          </div>
          <div class="card-footer-buttons">
            <button class="btn btn-secondary btn-sm" data-action="copy-latex" data-id="${q.id}" title="Copy LaTeX">
              <i class="fa-regular fa-copy"></i> Copy
            </button>
            <button class="btn btn-secondary btn-sm" data-action="toggle-status" data-id="${q.id}">
              <i class="fa-solid ${q.status === 'mastered' ? 'fa-circle-check' : 'fa-rotate-right'}"></i> 
              ${q.status === 'mastered' ? 'Mastered' : 'Mark Mastered'}
            </button>
          </div>
        </div>

      </div>
    `;
  }

  // ---------------- TAB 2: Horizontal Tabbed Chapter Explorer ----------------
  renderChapterHorizontalView() {
    const tabsContainer = document.getElementById('chapterHorizontalTabs');
    const questionsContainer = document.getElementById('chapterQuestionsContainer');
    const titleEl = document.getElementById('chapterActiveTitle');
    const countBadge = document.getElementById('chapterQuestionCountBadge');
    const subtitleEl = document.getElementById('chapterActiveSubtitle');

    if (!tabsContainer || !questionsContainer) return;

    const chapterCounts = {};
    this.questions.forEach((q) => {
      const ch = q.chapter || 'Uncategorized';
      chapterCounts[ch] = (chapterCounts[ch] || 0) + 1;
    });

    const uniqueChapters = Object.keys(chapterCounts).sort();

    if (this.activeChapter === 'All' && uniqueChapters.length > 0) {
      this.activeChapter = uniqueChapters[0];
    } else if (!uniqueChapters.includes(this.activeChapter) && uniqueChapters.length > 0) {
      this.activeChapter = uniqueChapters[0];
    }

    let tabsHtml = `
      <button class="chapter-h-tab ${this.activeChapter === 'All' ? 'active' : ''}" onclick="app.selectChapterTab('All')">
        <i class="fa-solid fa-layer-group"></i> All Chapters
        <span class="tab-badge">${this.questions.length}</span>
      </button>
    `;

    uniqueChapters.forEach((ch) => {
      const isActive = (this.activeChapter === ch);
      tabsHtml += `
        <button class="chapter-h-tab ${isActive ? 'active' : ''}" onclick="app.selectChapterTab('${this.escapeHtml(ch)}')">
          <i class="fa-solid fa-folder-open"></i> ${this.escapeHtml(ch)}
          <span class="tab-badge">${chapterCounts[ch]}</span>
        </button>
      `;
    });

    tabsContainer.innerHTML = tabsHtml;

    const chapterQuestions = (this.activeChapter === 'All')
      ? this.questions
      : this.questions.filter((q) => q.chapter === this.activeChapter);

    if (titleEl) titleEl.textContent = this.activeChapter === 'All' ? 'All Mathematical Chapters' : this.activeChapter;
    if (countBadge) countBadge.textContent = `${chapterQuestions.length} Questions`;
    if (subtitleEl) {
      subtitleEl.textContent = `Mastering ${this.activeChapter}: formulas, step-by-step derivations, and previous year exam questions.`;
    }

    if (chapterQuestions.length === 0) {
      questionsContainer.innerHTML = '<div style="padding:2rem; text-align:center; color:var(--text-secondary); width:100%;">No questions found in this chapter yet.</div>';
      return;
    }

    questionsContainer.innerHTML = chapterQuestions.map((q) => this.buildQuestionCardHtml(q)).join('');
    MathRenderer.renderMathInElement(questionsContainer);
  }

  selectChapterTab(chapterName) {
    this.activeChapter = chapterName;
    this.renderChapterHorizontalView();
  }

  // ---------------- TAB 3: Dynamic Formula MCQ Quiz Generator ----------------
  startNewGenQuiz(selectedTopic = null) {
    const totalSelectVal = document.getElementById('genTotalQuestionsSelect')?.value || '10';
    this.genTotalQuestions = totalSelectVal === 'unlimited' ? 'unlimited' : parseInt(totalSelectVal, 10);
    this.genCurrentIndex = 1;
    this.genScore = 0;
    this.genAnsweredCount = 0;

    const completionCard = document.getElementById('genCompletionCard');
    const quizCard = document.getElementById('genQuizCard');
    const progressBarWrap = document.getElementById('genProgressBarWrap');

    if (completionCard) completionCard.style.display = 'none';
    if (quizCard) quizCard.style.display = 'block';
    if (progressBarWrap) progressBarWrap.style.display = 'block';

    this.generateNewQuizQuestion(selectedTopic);
  }

  continueEndlessGenQuiz() {
    const totalSelect = document.getElementById('genTotalQuestionsSelect');
    if (totalSelect) totalSelect.value = 'unlimited';
    this.genTotalQuestions = 'unlimited';
    this.genCurrentIndex++;

    const completionCard = document.getElementById('genCompletionCard');
    const quizCard = document.getElementById('genQuizCard');
    if (completionCard) completionCard.style.display = 'none';
    if (quizCard) quizCard.style.display = 'block';

    this.generateNewQuizQuestion();
  }

  nextGenQuizQuestion() {
    if (this.genTotalQuestions !== 'unlimited' && this.genCurrentIndex >= this.genTotalQuestions) {
      this.showGenQuizCompletion();
      return;
    }

    this.genCurrentIndex++;
    this.generateNewQuizQuestion();
  }

  generateNewQuizQuestion(selectedTopic = null) {
    const topicKey = selectedTopic || document.getElementById('genTopicSelect')?.value || 'random';
    let difficulty = document.getElementById('genDifficultySelect')?.value || 'Medium';
    if (difficulty === 'random') difficulty = Math.random() > 0.5 ? 'Hard' : 'Medium';

    this.currentGenQuestion = ArithmeticGenerator.generateQuestion(topicKey, difficulty);
    this.renderGeneratedQuizCard();
  }

  renderGeneratedQuizCard() {
    const q = this.currentGenQuestion;
    if (!q) return;

    // Update Question Number Badge
    const qBadge = document.getElementById('genQuestionNumberBadge');
    if (qBadge) {
      if (this.genTotalQuestions === 'unlimited') {
        qBadge.innerHTML = `<i class="fa-solid fa-infinity"></i> Question ${this.genCurrentIndex}`;
      } else {
        qBadge.innerHTML = `<i class="fa-solid fa-list-ol"></i> Question ${this.genCurrentIndex} of ${this.genTotalQuestions}`;
      }
    }

    // Update Progress Bar
    const progressBar = document.getElementById('genProgressBar');
    if (progressBar) {
      if (this.genTotalQuestions === 'unlimited') {
        progressBar.style.width = '100%';
      } else {
        const pct = Math.min(100, Math.round((this.genCurrentIndex / this.genTotalQuestions) * 100));
        progressBar.style.width = `${pct}%`;
      }
    }

    // Update Scores
    const scoreCountEl = document.getElementById('genScoreCount');
    const answeredCountEl = document.getElementById('genAnsweredCount');
    if (scoreCountEl) scoreCountEl.textContent = this.genScore;
    if (answeredCountEl) answeredCountEl.textContent = this.genAnsweredCount;

    // Update Chapter and Difficulty Pills
    document.getElementById('genCardChapter').textContent = q.chapter;
    const diffPill = document.getElementById('genCardDifficulty');
    if (diffPill) {
      diffPill.className = `meta-pill difficulty-${(q.difficulty || 'medium').toLowerCase()}`;
      diffPill.textContent = q.difficulty;
    }

    // Update Next Button Text
    const nextBtnText = document.getElementById('btnNextGenQuestionText');
    if (nextBtnText) {
      if (this.genTotalQuestions !== 'unlimited' && this.genCurrentIndex === this.genTotalQuestions) {
        nextBtnText.textContent = 'Finish Quiz';
      } else {
        nextBtnText.textContent = 'Next Question';
      }
    }

    MathRenderer.renderFormatted(document.getElementById('genCardTitle'), q.title || 'Math Problem');
    MathRenderer.renderFormatted(document.getElementById('genCardStatement'), q.question);

    const solDrawer = document.getElementById('genSolutionDrawer');
    if (solDrawer) solDrawer.style.display = 'none';
    document.getElementById('btnToggleGenSolutionText').textContent = 'Show Step-by-Step Solution';

    const optionsContainer = document.getElementById('genCardOptions');
    if (optionsContainer) {
      optionsContainer.innerHTML = (q.options || []).map((opt, idx) => `
        <div class="gen-option-choice" data-index="${idx}" onclick="app.selectGenOption(${idx})">
          <span class="option-prefix">${opt.id}</span>
          <span class="option-text">${MathRenderer.markdownToHtml(opt.text)}</span>
        </div>
      `).join('');
      MathRenderer.renderMathInElement(optionsContainer);
    }
  }

  selectGenOption(selectedIndex) {
    const q = this.currentGenQuestion;
    if (!q || !q.options) return;

    const optionsEls = document.querySelectorAll('.gen-option-choice');
    const isCorrect = q.options[selectedIndex]?.isCorrect;

    optionsEls.forEach((el, idx) => {
      el.classList.add('disabled');
      if (q.options[idx]?.isCorrect) {
        el.classList.add('correct');
      } else if (idx === selectedIndex && !isCorrect) {
        el.classList.add('wrong');
      }
    });

    this.genAnsweredCount++;
    if (isCorrect) {
      this.genScore++;
      this.triggerConfetti();
      this.showToast('Correct! Great job! 🎉', 'success');
    } else {
      this.showToast('Incorrect. Review the solution below.', 'error');
    }

    const scoreCountEl = document.getElementById('genScoreCount');
    const answeredCountEl = document.getElementById('genAnsweredCount');
    if (scoreCountEl) scoreCountEl.textContent = this.genScore;
    if (answeredCountEl) answeredCountEl.textContent = this.genAnsweredCount;

    this.showGenSolution(isCorrect);
  }

  showGenQuizCompletion() {
    const quizCard = document.getElementById('genQuizCard');
    const completionCard = document.getElementById('genCompletionCard');
    const progressBarWrap = document.getElementById('genProgressBarWrap');

    if (quizCard) quizCard.style.display = 'none';
    if (progressBarWrap) progressBarWrap.style.display = 'none';
    if (completionCard) {
      completionCard.style.display = 'block';
      const scoreStr = `${this.genScore} / ${this.genAnsweredCount || this.genTotalQuestions}`;
      const accuracy = Math.round((this.genScore / Math.max(1, this.genAnsweredCount)) * 100);

      document.getElementById('compFinalScore').textContent = scoreStr;
      document.getElementById('compAccuracy').textContent = `${accuracy}%`;
      document.getElementById('compTotalQuestions').textContent = this.genAnsweredCount || this.genTotalQuestions;

      this.triggerConfetti();
      this.showToast(`Quiz Completed! Final Score: ${scoreStr} 🏆`, 'success');
    }
  }

  toggleGenSolution() {
    const drawer = document.getElementById('genSolutionDrawer');
    const btnText = document.getElementById('btnToggleGenSolutionText');
    if (drawer) {
      const isVisible = drawer.style.display !== 'none';
      drawer.style.display = isVisible ? 'none' : 'block';
      if (btnText) btnText.textContent = isVisible ? 'Show Step-by-Step Solution' : 'Hide Solution';
      if (!isVisible) {
        this.showGenSolution(true, false);
      }
    }
  }

  showGenSolution(isCorrect, showBadge = true) {
    const q = this.currentGenQuestion;
    const drawer = document.getElementById('genSolutionDrawer');
    const badge = document.getElementById('genSolutionResultBadge');
    const body = document.getElementById('genCardExplanation');

    if (drawer && body) {
      drawer.style.display = 'block';
      if (badge) {
        badge.style.display = showBadge ? 'block' : 'none';
        badge.style.color = isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)';
        badge.innerHTML = isCorrect ? '<i class="fa-solid fa-circle-check"></i> Correct Answer!' : '<i class="fa-solid fa-circle-xmark"></i> Incorrect Answer!';
      }
      MathRenderer.renderFormatted(body, q.explanation);
    }
  }

  async saveGenQuestionToBank() {
    if (!this.currentGenQuestion) return;
    const q = { ...this.currentGenQuestion };
    await this.db.saveQuestion(q);
    this.questions.unshift(q);
    this.populateChapterDropdowns();
    this.applyFiltersAndRender();
    this.updateStats();
    this.showToast('Saved to Question Bank permanently! 💾', 'success');
  }

  // ---------------- TAB 7: 18-Chapter Formula Notes ----------------
  render18ChapterFormulaNotes() {
    const container = document.getElementById('formulaChaptersGrid');
    if (!container) return;

    container.innerHTML = ARITHMETIC_18_CHAPTERS_DATA.map((ch) => `
      <div class="formula-note-card" data-key="${ch.key}">
        <div>
          <div class="formula-note-header">
            <div class="formula-note-title">
              <i class="${ch.icon}"></i>
              <h3>${ch.title}</h3>
            </div>
          </div>
          <div class="formula-note-content">
            ${MathRenderer.markdownToHtml(ch.content)}
          </div>
        </div>
        <div class="formula-note-footer">
          <button class="btn btn-primary btn-sm" onclick="app.launchPracticeFromNote('${ch.key}')">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Practice This Chapter
          </button>
        </div>
      </div>
    `).join('');

    MathRenderer.renderMathInElement(container);
  }

  launchPracticeFromNote(chapterKey) {
    const genSelect = document.getElementById('genTopicSelect');
    if (genSelect) genSelect.value = chapterKey;
    this.switchTab('generator');
    this.generateNewQuizQuestion(chapterKey);
    this.showToast(`Loaded dynamic formula quiz for ${chapterKey}!`, 'info');
  }

  filter18ChapterFormulas(query) {
    document.querySelectorAll('.formula-note-card').forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? 'flex' : 'none';
    });
  }

  // ---------------- Flashcard 3D Mode ----------------
  startFlashcards() {
    const ch = document.getElementById('flashcardChapterSelect')?.value || 'all';
    this.flashcardDeck = this.questions.filter((q) => (ch === 'all' || q.chapter === ch)).sort(() => Math.random() - 0.5);
    this.flashcardIndex = 0;
    this.renderCurrentFlashcard();
  }

  renderCurrentFlashcard() {
    const q = this.flashcardDeck[this.flashcardIndex];
    const total = this.flashcardDeck.length;

    const badge = document.getElementById('flashcardCountBadge');
    const inner = document.getElementById('flashcardInner');
    if (inner) inner.classList.remove('is-flipped');

    if (!q || total === 0) {
      document.getElementById('fcFrontTitle').textContent = 'No Flashcards';
      document.getElementById('fcFrontBody').innerHTML = '<p>No questions found for this chapter.</p>';
      document.getElementById('fcBackBody').innerHTML = '';
      if (badge) badge.textContent = 'Card 0 of 0';
      return;
    }

    if (badge) badge.textContent = `Card ${this.flashcardIndex + 1} of ${total}`;
    document.getElementById('fcFrontChapter').textContent = q.chapter || 'Math';
    document.getElementById('fcFrontDiff').textContent = q.difficulty || 'Medium';
    document.getElementById('fcFrontTitle').textContent = q.title || 'Math Problem';

    MathRenderer.renderFormatted(document.getElementById('fcFrontBody'), q.question || '');
    
    let backContent = q.explanation || 'No step-by-step solution provided.';
    if (q.keyFormulas && q.keyFormulas.length > 0) {
      backContent = `### Key Formula:\n${q.keyFormulas.map((f) => `$$${f}$$`).join('\n')}\n\n` + backContent;
    }
    MathRenderer.renderFormatted(document.getElementById('fcBackBody'), backContent);
  }

  flipFlashcard() {
    document.getElementById('flashcardInner')?.classList.toggle('is-flipped');
  }

  nextFlashcard() {
    if (this.flashcardIndex < this.flashcardDeck.length - 1) {
      this.flashcardIndex++;
      this.renderCurrentFlashcard();
    } else {
      this.showToast('You reached the end of this deck! 🎉', 'success');
    }
  }

  prevFlashcard() {
    if (this.flashcardIndex > 0) {
      this.flashcardIndex--;
      this.renderCurrentFlashcard();
    }
  }

  async markFlashcardStatus(status) {
    const q = this.flashcardDeck[this.flashcardIndex];
    if (q) {
      q.status = status;
      await this.db.saveQuestion(q);
      this.showToast(status === 'mastered' ? 'Marked as Mastered! 🎉' : 'Added to Revision Queue', 'info');
      this.nextFlashcard();
    }
  }

  // ---------------- LaTeX Sandbox ----------------
  initPalette() {
    this.renderPaletteCategory('calculus');
    document.querySelectorAll('.palette-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.palette-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.getAttribute('data-cat');
        this.renderPaletteCategory(cat);
      });
    });
  }

  renderPaletteCategory(cat) {
    const container = document.getElementById('sandboxPaletteButtons');
    if (!container) return;
    const symbols = MATH_PALETTE_SYMBOLS[cat] || [];
    container.innerHTML = symbols.map((s) => `
      <button type="button" class="palette-symbol-btn" data-latex="${this.escapeHtml(s.latex)}">${s.label}</button>
    `).join('');

    container.querySelectorAll('.palette-symbol-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const latex = btn.getAttribute('data-latex');
        const input = document.getElementById('sandboxInput');
        if (input) {
          input.value += (input.value ? ' ' : '') + latex;
          this.renderSandboxLatex(input.value);
        }
      });
    });
  }

  renderSandboxLatex(latexCode) {
    const output = document.getElementById('sandboxRenderOutput');
    if (!output) return;
    if (!latexCode.trim()) {
      output.innerHTML = '<span style="color:var(--text-muted); font-size:0.85rem;">Rendered preview will appear here...</span>';
      return;
    }
    output.innerHTML = `$$${latexCode}$$`;
    MathRenderer.renderMathInElement(output);
  }

  // ---------------- Add / Edit Modal ----------------
  openQuestionModal(editId = null) {
    const modal = document.getElementById('questionModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('questionForm');
    this.currentEditImages = [];

    if (editId) {
      const q = this.questions.find((item) => item.id === editId);
      if (!q) return;
      if (title) title.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Math Question';
      document.getElementById('editQuestionId').value = q.id;
      document.getElementById('formTitle').value = q.title || '';
      document.getElementById('formChapter').value = q.chapter || '';
      document.getElementById('formSubtopic').value = q.subtopic || '';
      document.getElementById('formDifficulty').value = q.difficulty || 'Medium';
      document.getElementById('formType').value = q.type || 'mcq_single';
      document.getElementById('formExam').value = q.pyq?.exam || '';
      document.getElementById('formYear').value = q.pyq?.year ? `${q.pyq.year} ${q.pyq.shift || ''}`.trim() : '';
      document.getElementById('formQuestion').value = q.question || '';
      document.getElementById('formExplanation').value = q.explanation || '';
      document.getElementById('formKeyFormulas').value = (q.keyFormulas || []).join(', ');
      document.getElementById('formTags').value = (q.tags || []).join(', ');
      document.getElementById('formNotes').value = q.personalNotes || '';
      document.getElementById('formCorrectAnswer').value = q.correctAnswer || '';

      this.currentEditImages = q.images ? [...q.images] : [];
      this.renderFormOptions(q.options || []);
      this.handleQuestionTypeChange(q.type || 'mcq_single');
    } else {
      if (title) title.innerHTML = '<i class="fa-solid fa-plus"></i> Add Math Question';
      form?.reset();
      document.getElementById('editQuestionId').value = '';
      this.renderFormOptions([
        { id: 'A', text: '', isCorrect: true },
        { id: 'B', text: '', isCorrect: false },
        { id: 'C', text: '', isCorrect: false },
        { id: 'D', text: '', isCorrect: false }
      ]);
      this.handleQuestionTypeChange('mcq_single');
    }

    this.renderAttachedImagesPreview();
    MathRenderer.renderFormatted(document.getElementById('questionLivePreview'), document.getElementById('formQuestion')?.value || '');
    MathRenderer.renderFormatted(document.getElementById('explanationLivePreview'), document.getElementById('formExplanation')?.value || '');

    if (modal) modal.style.display = 'flex';
  }

  closeQuestionModal() {
    const modal = document.getElementById('questionModal');
    if (modal) modal.style.display = 'none';
  }

  handleQuestionTypeChange(type) {
    const optionsSection = document.getElementById('optionsBuilderSection');
    const numericalSection = document.getElementById('formNumericalSection');

    if (type === 'mcq_single' || type === 'mcq_multi') {
      if (optionsSection) optionsSection.style.display = 'block';
      if (numericalSection) numericalSection.style.display = 'none';
    } else if (type === 'numerical') {
      if (optionsSection) optionsSection.style.display = 'none';
      if (numericalSection) numericalSection.style.display = 'block';
    } else {
      if (optionsSection) optionsSection.style.display = 'none';
      if (numericalSection) numericalSection.style.display = 'none';
    }
  }

  renderFormOptions(optionsList) {
    const container = document.getElementById('formOptionsList');
    if (!container) return;

    container.innerHTML = optionsList.map((opt, index) => {
      const optLetter = String.fromCharCode(65 + index);
      return `
        <div class="option-edit-row" data-index="${index}">
          <button type="button" class="option-check-btn ${opt.isCorrect ? 'correct' : ''}" onclick="app.toggleOptionCorrect(${index})">
            ${optLetter}
          </button>
          <input type="text" class="option-edit-input" placeholder="Option ${optLetter} text / LaTeX (e.g. $\\frac{1}{2}$)" value="${this.escapeHtml(opt.text || '')}">
          <button type="button" class="btn-icon" onclick="app.removeOptionRow(${index})" title="Remove">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `;
    }).join('');
  }

  addFormOptionRow(text = '', isCorrect = false) {
    const options = this.getCurrentFormOptions();
    const nextLetter = String.fromCharCode(65 + options.length);
    options.push({ id: nextLetter, text, isCorrect });
    this.renderFormOptions(options);
  }

  removeOptionRow(index) {
    const options = this.getCurrentFormOptions();
    if (options.length <= 2) {
      this.showToast('At least 2 options required for MCQs', 'info');
      return;
    }
    options.splice(index, 1);
    options.forEach((opt, idx) => opt.id = String.fromCharCode(65 + idx));
    this.renderFormOptions(options);
  }

  toggleOptionCorrect(index) {
    const type = document.getElementById('formType')?.value || 'mcq_single';
    const options = this.getCurrentFormOptions();
    if (type === 'mcq_single') {
      options.forEach((opt, i) => opt.isCorrect = (i === index));
    } else {
      options[index].isCorrect = !options[index].isCorrect;
    }
    this.renderFormOptions(options);
  }

  getCurrentFormOptions() {
    const rows = document.querySelectorAll('.option-edit-row');
    const options = [];
    rows.forEach((row, idx) => {
      const isCorrect = row.querySelector('.option-check-btn')?.classList.contains('correct') || false;
      const text = row.querySelector('.option-edit-input')?.value || '';
      options.push({ id: String.fromCharCode(65 + idx), text, isCorrect });
    });
    return options;
  }

  handleImageFiles(files) {
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) this.processImageFile(files[i]);
  }

  processImageFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentEditImages.push(e.target.result);
      this.renderAttachedImagesPreview();
    };
    reader.readAsDataURL(file);
  }

  renderAttachedImagesPreview() {
    const container = document.getElementById('attachedImagesContainer');
    if (!container) return;
    container.innerHTML = this.currentEditImages.map((imgSrc, idx) => `
      <div class="attached-img-wrap">
        <img src="${imgSrc}" alt="Attachment">
        <button type="button" class="btn-remove-img" onclick="app.removeAttachedImage(${idx})"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `).join('');
  }

  removeAttachedImage(index) {
    this.currentEditImages.splice(index, 1);
    this.renderAttachedImagesPreview();
  }

  previewImage(imgSrc) {
    const w = window.open('');
    w.document.write(`<img src="${imgSrc}" style="max-width:100%; height:auto; display:block; margin:20px auto;">`);
  }

  insertLatexAtCursor(latex) {
    const activeTextarea = document.activeElement && document.activeElement.tagName === 'TEXTAREA'
      ? document.activeElement
      : document.getElementById('formQuestion');
    if (!activeTextarea) return;

    const startPos = activeTextarea.selectionStart;
    const endPos = activeTextarea.selectionEnd;
    const currentVal = activeTextarea.value;

    activeTextarea.value = currentVal.substring(0, startPos) + latex + currentVal.substring(endPos);
    activeTextarea.focus();
    activeTextarea.selectionStart = activeTextarea.selectionEnd = startPos + latex.length;

    if (activeTextarea.id === 'formQuestion') {
      MathRenderer.renderFormatted(document.getElementById('questionLivePreview'), activeTextarea.value);
    } else if (activeTextarea.id === 'formExplanation') {
      MathRenderer.renderFormatted(document.getElementById('explanationLivePreview'), activeTextarea.value);
    }
  }

  async saveQuestionFromForm() {
    const editId = document.getElementById('editQuestionId')?.value;
    const title = document.getElementById('formTitle')?.value.trim();
    const chapter = document.getElementById('formChapter')?.value.trim();
    const subtopic = document.getElementById('formSubtopic')?.value.trim();
    const difficulty = document.getElementById('formDifficulty')?.value;
    const type = document.getElementById('formType')?.value;
    const exam = document.getElementById('formExam')?.value.trim();
    const yearRaw = document.getElementById('formYear')?.value.trim();
    const questionText = document.getElementById('formQuestion')?.value.trim();
    const explanationText = document.getElementById('formExplanation')?.value.trim();
    const keyFormulasRaw = document.getElementById('formKeyFormulas')?.value.trim();
    const tagsRaw = document.getElementById('formTags')?.value.trim();
    const notes = document.getElementById('formNotes')?.value.trim();
    const numericalAnswer = document.getElementById('formCorrectAnswer')?.value.trim();

    if (!title || !chapter || !questionText) {
      this.showToast('Please fill Title, Chapter, and Question', 'error');
      return;
    }

    const options = (type === 'mcq_single' || type === 'mcq_multi') ? this.getCurrentFormOptions() : [];
    const keyFormulas = keyFormulasRaw ? keyFormulasRaw.split(/,|\n/).map((f) => f.trim()).filter(Boolean) : [];
    const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

    let yearNum = null;
    let shiftStr = '';
    if (yearRaw) {
      const match = yearRaw.match(/\d{4}/);
      if (match) {
        yearNum = parseInt(match[0], 10);
        shiftStr = yearRaw.replace(match[0], '').trim();
      }
    }

    const questionObj = {
      id: editId || `q_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title,
      chapter,
      subtopic,
      difficulty,
      type,
      question: questionText,
      options,
      correctAnswer: type === 'numerical' ? numericalAnswer : (options.find((o) => o.isCorrect)?.id || ''),
      pyq: { isPYQ: Boolean(exam), exam: exam || 'Other', year: yearNum, shift: shiftStr },
      explanation: explanationText,
      keyFormulas,
      tags,
      images: this.currentEditImages,
      isBookmarked: false,
      status: 'unsolved',
      personalNotes: notes,
      createdAt: editId ? (this.questions.find((q) => q.id === editId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };

    await this.db.saveQuestion(questionObj);

    const existingIndex = this.questions.findIndex((q) => q.id === questionObj.id);
    if (existingIndex >= 0) {
      this.questions[existingIndex] = questionObj;
    } else {
      this.questions.unshift(questionObj);
    }

    this.closeQuestionModal();
    this.populateChapterDropdowns();
    this.applyFiltersAndRender();
    if (this.activeTab === 'chapters') this.renderChapterHorizontalView();
    this.updateStats();
    this.showToast(editId ? 'Question updated!' : 'Question permanently saved!', 'success');
  }

  // ---------------- AI Smart Import ----------------
  openAIImportModal() {
    const modal = document.getElementById('aiImportModal');
    const feedback = document.getElementById('aiParseFeedback');
    if (feedback) feedback.style.display = 'none';
    if (modal) modal.style.display = 'flex';
  }

  closeAIImportModal() {
    const modal = document.getElementById('aiImportModal');
    if (modal) modal.style.display = 'none';
  }

  copyMasterAIPrompt() {
    const prompt = `Generate math questions with LaTeX in JSON format with fields: title, question, chapter, subtopic, difficulty (Easy/Medium/Hard), pyq { exam, year, shift }, options [{ id, text, isCorrect }], correctAnswer, explanation, keyFormulas []`;
    navigator.clipboard.writeText(prompt);
    this.showToast('AI prompt copied!', 'success');
  }

  async processAIImport() {
    const rawInput = document.getElementById('aiRawInput')?.value.trim();
    const feedback = document.getElementById('aiParseFeedback');
    if (!rawInput) {
      this.showToast('Please paste ChatGPT or Gemini output first', 'error');
      return;
    }

    let parsedQuestions = [];
    try {
      let jsonStr = rawInput;
      const jsonMatch = rawInput.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) jsonStr = jsonMatch[1];

      const json = JSON.parse(jsonStr);
      if (Array.isArray(json)) parsedQuestions = json;
      else if (typeof json === 'object') parsedQuestions = [json];
    } catch (e) {
      parsedQuestions = this.parseMarkdownAIQuestions(rawInput);
    }

    if (!parsedQuestions || parsedQuestions.length === 0) {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.className = 'ai-parse-feedback error';
        feedback.textContent = 'Could not parse questions. Please check format.';
      }
      return;
    }

    const sanitized = parsedQuestions.map((item, idx) => ({
      id: `q_ai_${Date.now()}_${idx}`,
      title: item.title || `Math Question ${idx + 1}`,
      question: item.question || '',
      chapter: item.chapter || 'Calculus',
      subtopic: item.subtopic || '',
      difficulty: item.difficulty || 'Medium',
      type: item.type || 'mcq_single',
      options: item.options || [],
      correctAnswer: item.correctAnswer || '',
      pyq: item.pyq || { isPYQ: false, exam: 'Other', year: null },
      explanation: item.explanation || '',
      keyFormulas: item.keyFormulas || [],
      tags: item.tags || ['AI-Imported'],
      images: item.images || [],
      isBookmarked: false,
      status: 'unsolved',
      personalNotes: item.personalNotes || '',
      createdAt: new Date().toISOString()
    }));

    await this.db.bulkAdd(sanitized);
    this.questions.unshift(...sanitized);

    this.closeAIImportModal();
    document.getElementById('aiRawInput').value = '';
    this.populateChapterDropdowns();
    this.applyFiltersAndRender();
    if (this.activeTab === 'chapters') this.renderChapterHorizontalView();
    this.updateStats();
    this.showToast(`Imported ${sanitized.length} questions from AI! 🎉`, 'success');
  }

  parseMarkdownAIQuestions(mdText) {
    const questions = [];
    const blocks = mdText.split(/###\s+Question|\n---+\n/i).filter((b) => b.trim().length > 20);

    blocks.forEach((block, idx) => {
      const qObj = {
        title: `Question ${idx + 1}`,
        question: '',
        chapter: 'Calculus',
        difficulty: 'Medium',
        type: 'mcq_single',
        options: [],
        explanation: '',
        keyFormulas: []
      };

      const chMatch = block.match(/Chapter:\s*([^\n]+)/i);
      if (chMatch) qObj.chapter = chMatch[1].trim();

      const diffMatch = block.match(/Difficulty:\s*([^\n]+)/i);
      if (diffMatch) qObj.difficulty = diffMatch[1].trim();

      const optionMatches = [...block.matchAll(/[-*]\s*\(([A-D])\)\s*([^\n]+)/gi)];
      if (optionMatches.length > 0) {
        qObj.options = optionMatches.map((m) => ({
          id: m[1].toUpperCase(),
          text: m[2].replace(/\[Correct\]|\(Correct\)|✓/gi, '').trim(),
          isCorrect: m[2].includes('[Correct]') || m[2].includes('(Correct)') || m[2].includes('✓')
        }));
      }

      const explMatch = block.match(/Explanation:?\s*([\s\S]*?)(?:$|\n###)/i);
      if (explMatch) qObj.explanation = explMatch[1].trim();

      qObj.question = block.split(/####\s+Options|Options:|Explanation:/i)[0].replace(/Chapter:.*|Difficulty:.*|Exam:.*/gi, '').trim();

      if (qObj.question) questions.push(qObj);
    });

    return questions;
  }

  // ---------------- Practice / Quiz Mode ----------------
  startPracticeQuiz() {
    const chapter = document.getElementById('practiceChapterSelect')?.value || 'all';
    const difficulty = document.getElementById('practiceDifficultySelect')?.value || 'all';

    let pool = this.questions.filter((q) => {
      if (chapter !== 'all' && q.chapter !== chapter) return false;
      if (difficulty !== 'all' && q.difficulty !== difficulty) return false;
      return true;
    });

    this.quizDeck = pool.sort(() => Math.random() - 0.5);
    this.quizIndex = 0;
    this.quizScore = 0;

    clearInterval(this.quizTimerInterval);
    this.quizTimerSeconds = 0;
    this.quizTimerInterval = setInterval(() => {
      this.quizTimerSeconds++;
      const mins = String(Math.floor(this.quizTimerSeconds / 60)).padStart(2, '0');
      const secs = String(this.quizTimerSeconds % 60).padStart(2, '0');
      const display = document.getElementById('quizTimerDisplay');
      if (display) display.textContent = `${mins}:${secs}`;
    }, 1000);

    this.renderCurrentQuizCard();
  }

  renderCurrentQuizCard() {
    const q = this.quizDeck[this.quizIndex];
    const total = this.quizDeck.length;

    const progress = document.getElementById('quizProgressBar');
    const indexBadge = document.getElementById('quizQuestionIndex');
    const scoreBadge = document.getElementById('quizScoreDisplay');
    const prevBtn = document.getElementById('btnQuizPrev');
    const nextBtn = document.getElementById('btnQuizNext');

    if (!q || total === 0) {
      document.getElementById('quizQuestionBody').innerHTML = '<h4>No questions available for this practice filter.</h4>';
      document.getElementById('quizOptionsContainer').innerHTML = '';
      if (progress) progress.style.width = '0%';
      return;
    }

    if (progress) progress.style.width = `${((this.quizIndex + 1) / total) * 100}%`;
    if (indexBadge) indexBadge.textContent = `Question ${this.quizIndex + 1} of ${total}`;
    if (scoreBadge) scoreBadge.textContent = `${this.quizScore} / ${this.quizIndex}`;
    if (prevBtn) prevBtn.disabled = this.quizIndex === 0;
    if (nextBtn) nextBtn.textContent = this.quizIndex === total - 1 ? 'Finish Quiz' : 'Next Question';

    const tagsContainer = document.getElementById('quizTags');
    if (tagsContainer) {
      tagsContainer.innerHTML = `
        <span class="meta-pill chapter">${this.escapeHtml(q.chapter || 'Math')}</span>
        <span class="meta-pill difficulty-${(q.difficulty || 'medium').toLowerCase()}">${q.difficulty || 'Medium'}</span>
      `;
    }

    const starBtn = document.getElementById('btnQuizBookmark');
    if (starBtn) {
      starBtn.innerHTML = `<i class="${q.isBookmarked ? 'fa-solid' : 'fa-regular'} fa-star" style="color:${q.isBookmarked ? '#d97706' : 'inherit'}"></i>`;
    }

    MathRenderer.renderFormatted(document.getElementById('quizQuestionBody'), q.question || '');

    const solBox = document.getElementById('quizSolutionBox');
    if (solBox) solBox.style.display = 'none';

    const optionsContainer = document.getElementById('quizOptionsContainer');
    const numericalContainer = document.getElementById('quizNumericalContainer');

    if (q.type === 'numerical') {
      if (optionsContainer) optionsContainer.style.display = 'none';
      if (numericalContainer) {
        numericalContainer.style.display = 'block';
        document.getElementById('quizNumericalInput').value = '';
      }
    } else {
      if (numericalContainer) numericalContainer.style.display = 'none';
      if (optionsContainer) {
        optionsContainer.style.display = 'flex';
        optionsContainer.innerHTML = (q.options || []).map((opt, idx) => `
          <div class="quiz-option-choice" data-index="${idx}" onclick="app.selectQuizOption(${idx})">
            <span class="option-prefix">${opt.id || '•'}</span>
            <span class="option-text">${MathRenderer.markdownToHtml(opt.text)}</span>
          </div>
        `).join('');
        MathRenderer.renderMathInElement(optionsContainer);
      }
    }
  }

  selectQuizOption(selectedIndex) {
    const q = this.quizDeck[this.quizIndex];
    if (!q || !q.options) return;

    const optionsEls = document.querySelectorAll('.quiz-option-choice');
    const isCorrect = q.options[selectedIndex]?.isCorrect;

    optionsEls.forEach((el, idx) => {
      el.classList.add('disabled');
      if (q.options[idx]?.isCorrect) {
        el.classList.add('correct');
      } else if (idx === selectedIndex && !isCorrect) {
        el.classList.add('wrong');
      }
    });

    if (isCorrect) {
      this.quizScore++;
      this.triggerConfetti();
    }

    document.getElementById('quizScoreDisplay').textContent = `${this.quizScore} / ${this.quizIndex + 1}`;
    this.revealQuizSolution(isCorrect);
  }

  checkNumericalAnswer() {
    const q = this.quizDeck[this.quizIndex];
    const userVal = document.getElementById('quizNumericalInput')?.value.trim();
    const correctVal = String(q.correctAnswer || '').trim();

    const isCorrect = (userVal === correctVal);
    if (isCorrect) {
      this.quizScore++;
      this.triggerConfetti();
    }

    document.getElementById('quizScoreDisplay').textContent = `${this.quizScore} / ${this.quizIndex + 1}`;
    this.revealQuizSolution(isCorrect);
  }

  revealQuizSolution(isCorrect) {
    const q = this.quizDeck[this.quizIndex];
    const solBox = document.getElementById('quizSolutionBox');
    const heading = document.getElementById('quizResultHeading');
    const content = document.getElementById('quizSolutionContent');

    if (solBox && heading && content) {
      solBox.style.display = 'block';
      heading.className = isCorrect ? 'correct' : 'wrong';
      heading.innerHTML = isCorrect ? '<i class="fa-solid fa-circle-check"></i> Correct Answer!' : '<i class="fa-solid fa-circle-xmark"></i> Incorrect!';
      MathRenderer.renderFormatted(content, q.explanation || 'No step-by-step explanation available.');
    }
  }

  nextQuizQuestion() {
    if (this.quizIndex < this.quizDeck.length - 1) {
      this.quizIndex++;
      this.renderCurrentQuizCard();
    } else {
      clearInterval(this.quizTimerInterval);
      this.triggerConfetti();
      this.showToast(`Quiz Completed! Final Score: ${this.quizScore} / ${this.quizDeck.length} 🏆`, 'success');
    }
  }

  prevQuizQuestion() {
    if (this.quizIndex > 0) {
      this.quizIndex--;
      this.renderCurrentQuizCard();
    }
  }

  async toggleQuizBookmark() {
    const q = this.quizDeck[this.quizIndex];
    if (q) {
      await this.toggleBookmark(q.id);
      this.renderCurrentQuizCard();
    }
  }

  triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
  }

  // ---------------- Analytics Tab ----------------
  updateStats() {
    const totalEl = document.getElementById('statTotalQuestions');
    const bookmarkedEl = document.getElementById('statBookmarked');
    const pyqEl = document.getElementById('statPYQCount');
    const revisionEl = document.getElementById('statNeedsRevision');

    if (totalEl) totalEl.textContent = this.questions.length;
    if (bookmarkedEl) bookmarkedEl.textContent = this.questions.filter((q) => q.isBookmarked).length;
    if (pyqEl) pyqEl.textContent = this.questions.filter((q) => q.pyq?.isPYQ).length;
    if (revisionEl) revisionEl.textContent = this.questions.filter((q) => q.status === 'revision').length;

    const chapterDist = {};
    const diffDist = {};
    const examDist = {};

    this.questions.forEach((q) => {
      chapterDist[q.chapter || 'Uncategorized'] = (chapterDist[q.chapter || 'Uncategorized'] || 0) + 1;
      diffDist[q.difficulty || 'Medium'] = (diffDist[q.difficulty || 'Medium'] || 0) + 1;
      if (q.pyq?.exam) examDist[q.pyq.exam] = (examDist[q.pyq.exam] || 0) + 1;
    });

    const chList = document.getElementById('chapterDistributionList');
    if (chList) {
      chList.innerHTML = Object.entries(chapterDist).map(([ch, count]) => `
        <div style="display:flex; justify-content:space-between; padding:0.35rem 0; border-bottom:1px solid var(--border-subtle); font-size:0.8rem;">
          <span>${this.escapeHtml(ch)}</span><strong>${count}</strong>
        </div>
      `).join('') || '<p style="color:var(--text-secondary); font-size:0.8rem;">No data</p>';
    }

    const diffList = document.getElementById('difficultyDistributionList');
    if (diffList) {
      diffList.innerHTML = Object.entries(diffDist).map(([d, count]) => `
        <div style="display:flex; justify-content:space-between; padding:0.35rem 0; border-bottom:1px solid var(--border-subtle); font-size:0.8rem;">
          <span>${this.escapeHtml(d)}</span><strong>${count}</strong>
        </div>
      `).join('') || '<p style="color:var(--text-secondary); font-size:0.8rem;">No data</p>';
    }

    const examList = document.getElementById('examDistributionList');
    if (examList) {
      examList.innerHTML = Object.entries(examDist).map(([e, count]) => `
        <div style="display:flex; justify-content:space-between; padding:0.35rem 0; border-bottom:1px solid var(--border-subtle); font-size:0.8rem;">
          <span>${this.escapeHtml(e)}</span><strong>${count}</strong>
        </div>
      `).join('') || '<p style="color:var(--text-secondary); font-size:0.8rem;">No data</p>';
    }
  }

  // ---------------- Backup & Markdown Export ----------------
  openDataModal() {
    const modal = document.getElementById('dataModal');
    if (modal) modal.style.display = 'flex';
  }

  closeDataModal() {
    const modal = document.getElementById('dataModal');
    if (modal) modal.style.display = 'none';
  }

  exportJSONBackup() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.questions, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `mathvault_backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
    this.showToast('JSON backup downloaded!', 'success');
  }

  exportMarkdownNotes() {
    let md = `# MathVault Notes & Question Bank Export\n\n*Generated: ${new Date().toLocaleDateString()}*\n\n---\n\n`;
    const grouped = {};
    this.questions.forEach((q) => {
      const ch = q.chapter || 'General';
      if (!grouped[ch]) grouped[ch] = [];
      grouped[ch].push(q);
    });

    Object.entries(grouped).forEach(([ch, list]) => {
      md += `## 📚 Chapter: ${ch}\n\n`;
      list.forEach((q, idx) => {
        md += `### ${idx + 1}. ${q.title || 'Question'}\n`;
        md += `**Difficulty:** ${q.difficulty || 'Medium'} | **Exam:** ${q.pyq?.exam || 'N/A'} ${q.pyq?.year || ''}\n\n`;
        md += `#### Problem:\n${q.question}\n\n`;
        if (q.options && q.options.length > 0) {
          md += `#### Options:\n`;
          q.options.forEach((o) => md += `- (${o.id}) ${o.text} ${o.isCorrect ? '*(Correct)*' : ''}\n`);
          md += `\n`;
        }
        md += `#### Step-by-Step Solution:\n${q.explanation || 'N/A'}\n\n`;
        if (q.keyFormulas && q.keyFormulas.length > 0) {
          md += `**Key Formulas:**\n`;
          q.keyFormulas.forEach((f) => md += `- $${f}$\n`);
          md += `\n`;
        }
        md += `---\n\n`;
      });
    });

    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `mathvault_notes_${new Date().toISOString().slice(0, 10)}.md`);
    dlAnchorElem.click();
    this.showToast('Markdown exported!', 'success');
  }

  importJSONBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          await this.db.bulkAdd(imported);
          this.questions = await this.db.getAllQuestions();
          this.populateChapterDropdowns();
          this.applyFiltersAndRender();
          if (this.activeTab === 'chapters') this.renderChapterHorizontalView();
          this.updateStats();
          this.closeDataModal();
          this.showToast(`Imported ${imported.length} questions!`, 'success');
        } else {
          this.showToast('Invalid backup file format', 'error');
        }
      } catch (err) {
        this.showToast('Failed to parse JSON file', 'error');
      }
    };
    reader.readAsText(file);
  }

  async loadSampleData() {
    if (typeof INITIAL_SAMPLE_QUESTIONS !== 'undefined' && INITIAL_SAMPLE_QUESTIONS.length > 0) {
      await this.db.bulkAdd(INITIAL_SAMPLE_QUESTIONS);
      this.questions = await this.db.getAllQuestions();
      this.populateChapterDropdowns();
      this.applyFiltersAndRender();
      if (this.activeTab === 'chapters') this.renderChapterHorizontalView();
      this.updateStats();
      this.closeDataModal();
      this.showToast('Sample questions loaded!', 'success');
    }
  }

  async clearAllData() {
    await this.db.clearAll();
    this.questions = [];
    this.filteredQuestions = [];
    this.populateChapterDropdowns();
    this.applyFiltersAndRender();
    if (this.activeTab === 'chapters') this.renderChapterHorizontalView();
    this.updateStats();
    this.closeDataModal();
    this.showToast('All stored questions cleared permanently 🗑️', 'info');
  }

  // ==========================================
  // TAB 4: SPEED CALCULATION LAB CONTROLLER
  // ==========================================
  initSpeedLabUI() {
    this.updateSpeedDailyUI();

    // Check all-time stats
    if (typeof SpeedCalcEngine !== 'undefined') {
      const history = SpeedCalcEngine.getHistory();
      let bestCpm = 0;
      let totalCalcs = 0;
      history.forEach((h) => {
        if (h.cpm && h.cpm > bestCpm) bestCpm = h.cpm;
        totalCalcs += (h.totalQuestions || 0);
      });

      const bestCpmEl = document.getElementById('speedBestCpm');
      const bestStreakEl = document.getElementById('speedBestStreak');
      const totalCalcsEl = document.getElementById('speedTotalCalcs');

      if (bestCpmEl) bestCpmEl.textContent = `${bestCpm} CPM`;
      if (bestStreakEl) bestStreakEl.textContent = `${this.speedStreak} 🔥`;
      if (totalCalcsEl) totalCalcsEl.textContent = `${totalCalcs}`;
    }
  }

  updateSpeedDailyUI() {
    if (typeof SpeedCalcEngine === 'undefined') return;
    const progress = SpeedCalcEngine.getDailyProgress();
    const countEl = document.getElementById('speedDailyCountText');
    const barEl = document.getElementById('speedDailyProgressBar');

    if (countEl) countEl.textContent = `${progress.completed || 0} / ${progress.target || 50} calcs`;
    if (barEl) {
      const pct = Math.min(100, Math.round(((progress.completed || 0) / (progress.target || 50)) * 100));
      barEl.style.width = `${pct}%`;
    }
  }

  selectSpeedTrack(trackName) {
    this.speedConfig.track = trackName;
    document.querySelectorAll('.speed-track-card').forEach((card) => {
      const isSelected = card.getAttribute('data-track') === trackName;
      card.classList.toggle('active', isSelected);
    });

    const customPanel = document.getElementById('speedCustomPanel');
    if (customPanel) {
      customPanel.style.display = (trackName === 'custom') ? 'block' : 'none';
    }

    // Configure presets
    if (trackName === 'daily_mix') {
      this.speedConfig.operations = ['addition', 'subtraction', 'squares', 'tables'];
      this.speedConfig.mode = 'timed_300'; // 5 Mins
      this.speedConfig.difficulty = 'medium';
    } else if (trackName === 'squares_cubes') {
      this.speedConfig.operations = ['squares', 'cubes', 'square_root', 'cube_root'];
      this.speedConfig.mode = 'sprint_25';
      this.speedConfig.difficulty = 'medium';
    } else if (trackName === 'multiplication_tables') {
      this.speedConfig.operations = ['tables'];
      this.speedConfig.mode = 'sprint_20';
      this.speedConfig.difficulty = 'medium';
    } else if (trackName === 'mult_3digit') {
      this.speedConfig.operations = ['multiplication'];
      this.speedConfig.multLevel = '3d_2d';
      this.speedConfig.mode = 'sprint_20';
      this.speedConfig.difficulty = 'hard';
    } else if (trackName === 'add_sub_chains') {
      this.speedConfig.operations = ['add_sub_mix'];
      this.speedConfig.mode = 'sprint_20';
      this.speedConfig.difficulty = 'medium';
    }
  }

  startSpeedDrill() {
    if (typeof SpeedCalcEngine === 'undefined') return;

    // Read custom values if on custom track
    if (this.speedConfig.track === 'custom') {
      const selectedOps = [];
      document.querySelectorAll('.speed-op-check:checked').forEach((cb) => selectedOps.push(cb.value));
      this.speedConfig.operations = selectedOps.length > 0 ? selectedOps : ['addition', 'subtraction', 'squares'];
      this.speedConfig.mode = document.getElementById('speedModeSelect')?.value || 'sprint_20';
      this.speedConfig.difficulty = document.getElementById('speedDifficultySelect')?.value || 'medium';
      this.speedConfig.multLevel = document.getElementById('speedMultLevelSelect')?.value || '2d_2d';
    }

    // Determine target count or timer seconds
    const mode = this.speedConfig.mode || 'sprint_20';
    if (mode.startsWith('sprint_')) {
      this.speedTotalTarget = parseInt(mode.replace('sprint_', ''), 10) || 20;
      this.speedTimerSeconds = 0;
    } else if (mode.startsWith('timed_')) {
      this.speedTimerSeconds = parseInt(mode.replace('timed_', ''), 10) || 60;
      this.speedTotalTarget = 999;
    } else {
      // Endless
      this.speedTotalTarget = 9999;
      this.speedTimerSeconds = 0;
    }

    this.speedSessionActive = true;
    this.speedQuestionIndex = 0;
    this.speedSessionHistory = [];
    this.speedStreak = 0;

    // UI View Transitions
    document.getElementById('speedSetupSection').style.display = 'none';
    document.getElementById('speedResultsCard').style.display = 'none';
    document.getElementById('speedArenaCard').style.display = 'flex';

    // Start Timer
    clearInterval(this.speedTimerInterval);
    if (mode.startsWith('timed_')) {
      this.speedTimerInterval = setInterval(() => {
        if (!this.speedSessionActive) return;
        this.speedTimerSeconds--;
        const mins = String(Math.floor(this.speedTimerSeconds / 60)).padStart(2, '0');
        const secs = String(this.speedTimerSeconds % 60).padStart(2, '0');
        const timerDisplay = document.getElementById('arenaTimerDisplay');
        if (timerDisplay) timerDisplay.textContent = `${mins}:${secs}`;

        if (this.speedTimerSeconds <= 0) {
          clearInterval(this.speedTimerInterval);
          this.endSpeedDrill();
        }
      }, 1000);
    } else {
      // Stopwatch
      this.speedTimerSeconds = 0;
      this.speedTimerInterval = setInterval(() => {
        if (!this.speedSessionActive) return;
        this.speedTimerSeconds++;
        const mins = String(Math.floor(this.speedTimerSeconds / 60)).padStart(2, '0');
        const secs = String(this.speedTimerSeconds % 60).padStart(2, '0');
        const timerDisplay = document.getElementById('arenaTimerDisplay');
        if (timerDisplay) timerDisplay.textContent = `${mins}:${secs}`;
      }, 1000);
    }

    this.generateNextSpeedQuestion();
  }

  generateNextSpeedQuestion() {
    this.speedQuestionIndex++;
    
    // Check if sprint target reached
    if (this.speedConfig.mode.startsWith('sprint_') && this.speedQuestionIndex > this.speedTotalTarget) {
      this.endSpeedDrill();
      return;
    }

    this.speedCurrentQuestion = SpeedCalcEngine.generateQuestion(this.speedConfig);
    this.speedQuestionStartTime = Date.now();

    this.renderSpeedProblem();
  }

  renderSpeedProblem() {
    const q = this.speedCurrentQuestion;
    if (!q) return;

    // Update Counter & Progress
    const counterEl = document.getElementById('arenaQuestionCounter');
    const modeEl = document.getElementById('arenaModeBadge');
    const progressEl = document.getElementById('arenaProgressBar');

    if (counterEl) {
      if (this.speedConfig.mode === 'endless') {
        counterEl.textContent = `Question ${this.speedQuestionIndex} (Zen)`;
      } else if (this.speedConfig.mode.startsWith('timed_')) {
        counterEl.textContent = `Question ${this.speedQuestionIndex}`;
      } else {
        counterEl.textContent = `Question ${this.speedQuestionIndex} of ${this.speedTotalTarget}`;
      }
    }

    if (modeEl) {
      modeEl.textContent = this.speedConfig.track.replace('_', ' ').toUpperCase();
    }

    if (progressEl && this.speedTotalTarget < 500) {
      const pct = Math.min(100, Math.round((this.speedQuestionIndex / this.speedTotalTarget) * 100));
      progressEl.style.width = `${pct}%`;
    }

    // Category Badge & Expression
    const catBadge = document.getElementById('arenaCategoryBadge');
    const exprEl = document.getElementById('arenaExpression');
    if (catBadge) catBadge.textContent = SpeedCalcEngine.formatCategoryName(q.category);
    if (exprEl) {
      MathRenderer.renderFormatted(exprEl, q.expression);
    }

    // Tip Box
    const tipBox = document.getElementById('arenaTipBox');
    const tipContent = document.getElementById('arenaTipContent');
    if (tipBox) tipBox.style.display = 'none';
    if (tipContent) MathRenderer.renderFormatted(tipContent, q.hint);
    document.getElementById('btnToggleDrillHintText').textContent = 'Show Shortcut Tip';

    // Clear Input
    const input = document.getElementById('speedCalcInput');
    const feedback = document.getElementById('arenaFeedbackMsg');
    if (input) {
      input.value = '';
      input.className = 'speed-calc-input';
      input.focus();
    }
    if (feedback) {
      feedback.textContent = '';
      feedback.className = 'input-feedback-msg';
    }

    this.updateSpeedLiveTelemetry();
  }

  updateSpeedLiveTelemetry() {
    const totalAnswered = this.speedSessionHistory.length;
    const correctCount = this.speedSessionHistory.filter((h) => h.isCorrect).length;
    const elapsedSeconds = Math.max(1, this.speedSessionHistory.reduce((acc, h) => acc + (h.timeMs / 1000), 0));
    const cpm = Math.round((correctCount / elapsedSeconds) * 60);

    const cpmEl = document.getElementById('arenaLiveCpm');
    const streakEl = document.getElementById('arenaLiveStreak');

    if (cpmEl) cpmEl.textContent = `${cpm} CPM`;
    if (streakEl) streakEl.textContent = `${this.speedStreak} 🔥`;
  }

  checkSpeedAnswer() {
    const input = document.getElementById('speedCalcInput');
    const feedback = document.getElementById('arenaFeedbackMsg');
    if (!input || !this.speedCurrentQuestion) return;

    const userRaw = input.value.trim();
    if (!userRaw) return;

    const expected = this.speedCurrentQuestion.answer;
    const timeTakenMs = Date.now() - this.speedQuestionStartTime;
    let isCorrect = false;

    if (this.speedCurrentQuestion.answerType === 'decimal') {
      const userNum = parseFloat(userRaw);
      isCorrect = Math.abs(userNum - expected) <= 0.1;
    } else {
      isCorrect = parseInt(userRaw, 10) === expected;
    }

    // Record telemetry
    this.speedSessionHistory.push({
      category: this.speedCurrentQuestion.category,
      expression: this.speedCurrentQuestion.expression,
      expected: expected,
      userAnswer: userRaw,
      isCorrect: isCorrect,
      timeMs: timeTakenMs,
      meta: this.speedCurrentQuestion.meta
    });

    if (isCorrect) {
      this.speedStreak++;
      input.classList.add('correct');
      if (feedback) {
        feedback.textContent = '⚡ Correct! Instant Reflex!';
        feedback.className = 'input-feedback-msg correct';
      }
      setTimeout(() => this.generateNextSpeedQuestion(), 160);
    } else {
      this.speedStreak = 0;
      input.classList.add('wrong');
      if (feedback) {
        feedback.textContent = `❌ Incorrect. Correct was ${expected}`;
        feedback.className = 'input-feedback-msg wrong';
      }
      // Give a moment to see the error then advance
      setTimeout(() => this.generateNextSpeedQuestion(), 700);
    }

    this.updateSpeedLiveTelemetry();
  }

  handleSpeedNumpad(key) {
    const input = document.getElementById('speedCalcInput');
    if (!input) return;

    if (key === 'enter') {
      this.checkSpeedAnswer();
    } else if (key === 'backspace') {
      input.value = input.value.slice(0, -1);
    } else if (key === 'clear') {
      input.value = '';
    } else {
      input.value += key;
    }
    input.focus();
  }

  toggleSpeedHint() {
    const tipBox = document.getElementById('arenaTipBox');
    const btnText = document.getElementById('btnToggleDrillHintText');
    if (tipBox) {
      const isVisible = tipBox.style.display !== 'none';
      tipBox.style.display = isVisible ? 'none' : 'block';
      if (btnText) btnText.textContent = isVisible ? 'Show Shortcut Tip' : 'Hide Tip';
    }
  }

  skipSpeedQuestion() {
    if (!this.speedCurrentQuestion) return;
    this.speedSessionHistory.push({
      category: this.speedCurrentQuestion.category,
      expression: this.speedCurrentQuestion.expression,
      expected: this.speedCurrentQuestion.answer,
      userAnswer: 'skipped',
      isCorrect: false,
      timeMs: Date.now() - this.speedQuestionStartTime,
      meta: this.speedCurrentQuestion.meta
    });
    this.speedStreak = 0;
    this.generateNextSpeedQuestion();
  }

  endSpeedDrill() {
    this.speedSessionActive = false;
    clearInterval(this.speedTimerInterval);

    // Analyze session with SpeedCalcEngine
    const report = SpeedCalcEngine.analyzeSession(this.speedSessionHistory);
    SpeedCalcEngine.saveSession(report);

    // Switch Views
    document.getElementById('speedArenaCard').style.display = 'none';
    document.getElementById('speedResultsCard').style.display = 'block';

    this.renderSpeedDiagnosis(report);
    this.updateSpeedDailyUI();
    this.initSpeedLabUI();
  }

  renderSpeedDiagnosis(report) {
    document.getElementById('resScore').textContent = `${report.correctCount} / ${report.totalQuestions}`;
    document.getElementById('resAccuracy').textContent = `${report.accuracy}%`;
    document.getElementById('resCpm').textContent = `${report.cpm} CPM`;
    document.getElementById('resAvgTime').textContent = `${(report.avgTimeMs / 1000).toFixed(1)}s`;

    // Grade Title
    const titleEl = document.getElementById('resultsGradeTitle');
    if (titleEl) {
      if (report.accuracy >= 90 && report.cpm >= 35) {
        titleEl.innerHTML = '🏆 Grandmaster Speed & Precision!';
      } else if (report.accuracy >= 80) {
        titleEl.innerHTML = '⚡ Solid Reflexes & Calculation Flow!';
      } else {
        titleEl.innerHTML = '💪 Good Practice! Targeted Diagnosis Below.';
      }
    }

    // Problem Patterns List
    const itemsList = document.getElementById('diagnosisItemsList');
    if (itemsList) {
      if (report.weaknesses.length === 0) {
        itemsList.innerHTML = `
          <div class="diagnosis-item-card" style="border-left-color:var(--accent-emerald);">
            <div class="diagnosis-item-info">
              <h5>🌟 No Significant Bottlenecks Detected!</h5>
              <p>Your speed and accuracy are well balanced across all tested operations.</p>
            </div>
          </div>
        `;
      } else {
        itemsList.innerHTML = report.weaknesses.map((w) => `
          <div class="diagnosis-item-card ${w.severity}">
            <div class="diagnosis-item-info">
              <h5>${this.escapeHtml(w.title)}</h5>
              <p>${this.escapeHtml(w.detail)}</p>
            </div>
            <span class="arena-badge ${w.severity === 'high' ? 'badge-amber' : ''}">${(w.avgTimeMs / 1000).toFixed(1)}s avg</span>
          </div>
        `).join('');
      }
    }

    // Actionable Recommendations
    const recList = document.getElementById('recommendationsList');
    if (recList) {
      recList.innerHTML = report.recommendations.map((r) => `
        <li>${MathRenderer.markdownToHtml(r)}</li>
      `).join('');
      MathRenderer.renderMathInElement(recList);
    }

    this.triggerConfetti();
  }

  exitSpeedDrillToSetup() {
    document.getElementById('speedResultsCard').style.display = 'none';
    document.getElementById('speedArenaCard').style.display = 'none';
    document.getElementById('speedSetupSection').style.display = 'block';
    this.initSpeedLabUI();
  }

  showSpeedHistoryModal() {
    const history = SpeedCalcEngine.getHistory();
    if (!history || history.length === 0) {
      this.showToast('No calculation sessions recorded yet. Complete a drill first!', 'info');
      return;
    }

    const report = SpeedCalcEngine.analyzeSession(history.flatMap(h => h.categoryStats ? Object.values(h.categoryStats).flatMap(c => c.mistakes || []) : []));
    this.showToast(`Analyzed ${history.length} past sessions. Lifetime Best: ${document.getElementById('speedBestCpm')?.textContent || '0 CPM'}`, 'info');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info'}"></i>
      <span>${this.escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Global Application Instance
const app = new MathVaultApp();
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
