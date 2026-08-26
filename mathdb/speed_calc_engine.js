/**
 * SpeedCalcEngine - Mental Math Speed & Calculation Mastery Engine
 * Provides comprehensive math drill generators, shortcut algorithms,
 * live telemetry, and AI problem-pattern weakness analysis.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SpeedCalcEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class SpeedCalcEngine {
    static randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randChoice(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    // =========================================================================
    // 1. OPERATION GENERATORS
    // =========================================================================

    /**
     * Addition Generator: Single, Double, Triple digit and Multi-Term Chains
     */
    static genAddition(difficulty = 'medium', termsCount = 2) {
      let nums = [];
      let trick = '';

      if (difficulty === 'easy') {
        nums = [this.randInt(5, 45), this.randInt(5, 45)];
        trick = `💡 **Mental Trick:** Round up to nearest 10: e.g., $${nums[0]} + ${nums[1]} = (${nums[0]} + ${Math.round(nums[1] / 10) * 10}) ${nums[1] % 10 >= 5 ? '-' : '+'} \\dots$`;
      } else if (difficulty === 'hard') {
        if (termsCount > 2) {
          nums = Array.from({ length: termsCount }, () => this.randInt(12, 98));
          trick = `💡 **Left-to-Right Addition:** Add tens digits first: $(${nums.map(n => Math.floor(n/10)*10).join(' + ')}) + (${nums.map(n => n%10).join(' + ')})$`;
        } else {
          nums = [this.randInt(112, 989), this.randInt(112, 989)];
          trick = `💡 **Split & Add:** $(${Math.floor(nums[0]/100)*100} + ${Math.floor(nums[1]/100)*100}) + (${nums[0]%100} + ${nums[1]%100})$`;
        }
      } else {
        // Medium
        if (termsCount > 2) {
          nums = Array.from({ length: termsCount }, () => this.randInt(11, 65));
          trick = `💡 **Combine into 10s & 20s:** Group numbers with unit digits that sum to 10.`;
        } else {
          nums = [this.randInt(23, 98), this.randInt(17, 95)];
          trick = `💡 **Left-to-Right Method:** $${nums[0]} + ${Math.floor(nums[1]/10)*10} = ${nums[0] + Math.floor(nums[1]/10)*10}$, then add $+ ${nums[1]%10} = ${nums[0] + nums[1]}$.`;
        }
      }

      const answer = nums.reduce((a, b) => a + b, 0);
      const expression = nums.join(' + ');

      return {
        category: 'addition',
        title: termsCount > 2 ? 'Multi-Term Addition Chain' : 'Speed Addition',
        expression: `$${expression}$`,
        answer: answer,
        answerType: 'number',
        hint: trick,
        meta: { difficulty, terms: nums.length, digits: Math.max(...nums).toString().length }
      };
    }

    /**
     * Subtraction Generator: 2-digit, 3-digit, and Borrowing focus
     */
    static genSubtraction(difficulty = 'medium') {
      let a, b, trick;

      if (difficulty === 'easy') {
        a = this.randInt(30, 99);
        b = this.randInt(11, a - 5);
        trick = `💡 **Jump to 10:** Take $${b}$ up to nearest 10, then jump to $${a}$.`;
      } else if (difficulty === 'hard') {
        a = this.randInt(350, 995);
        b = this.randInt(125, a - 50);
        trick = `💡 **Complement Method:** Subtract from left to right: $(${Math.floor(a/100)*100} - ${Math.floor(b/100)*100}) + (${a%100} - ${b%100})$.`;
      } else {
        // Medium: forces unit digit borrow
        a = this.randInt(42, 98);
        const unitB = this.randInt((a % 10) + 1, 9);
        const tensB = this.randInt(1, Math.floor(a / 10) - 1);
        b = tensB * 10 + unitB;
        trick = `💡 **Shift Method:** Add $${10 - (b % 10)}$ to both numbers: $(${a} + ${10 - (b % 10)}) - (${b} + ${10 - (b % 10)})$.`;
      }

      const answer = a - b;
      return {
        category: 'subtraction',
        title: 'Speed Subtraction',
        expression: `$${a} - ${b}$`,
        answer: answer,
        answerType: 'number',
        hint: trick,
        meta: { difficulty, a, b }
      };
    }

    /**
     * Addition & Subtraction Mix (Series Chain)
     */
    static genAddSubMix(length = 4) {
      let current = this.randInt(40, 90);
      let expr = `${current}`;
      let ops = [];

      for (let i = 0; i < length - 1; i++) {
        const isAdd = current < 50 ? true : (current > 150 ? false : Math.random() > 0.5);
        const val = this.randInt(15, 65);
        if (isAdd) {
          current += val;
          expr += ` + ${val}`;
          ops.push(`+${val}`);
        } else {
          current -= val;
          expr += ` - ${val}`;
          ops.push(`-${val}`);
        }
      }

      return {
        category: 'add_sub_mix',
        title: 'Mix Addition & Subtraction Chain',
        expression: `$${expr}$`,
        answer: current,
        answerType: 'number',
        hint: `💡 **Running Total:** Keep a single accumulator in mind from left to right.`,
        meta: { length, ops }
      };
    }

    /**
     * Multiplication: 1d x 1d, 2d x 1d, 2d x 2d, 3d x 2d, 3d x 3d
     */
    static genMultiplication(level = '2d_1d') {
      let a, b, trick;

      if (level === '1d_1d') {
        a = this.randInt(3, 9);
        b = this.randInt(3, 9);
        trick = `💡 Direct table fact: $${a} \\times ${b} = ${a * b}$.`;
      } else if (level === '2d_1d') {
        a = this.randInt(13, 98);
        b = this.randInt(3, 9);
        trick = `💡 **Distributive Split:** $(${Math.floor(a/10)*10} \\times ${b}) + (${a%10} \\times ${b}) = ${Math.floor(a/10)*10 * b} + ${ (a%10) * b } = ${a * b}$.`;
      } else if (level === '2d_2d') {
        a = this.randInt(14, 98);
        b = this.randInt(12, 45);
        trick = `💡 **Vedic / Split Trick:** Multiply $${a} \\times ${Math.floor(b/10)*10} = ${a * Math.floor(b/10)*10}$, then add $${a} \\times ${b%10} = ${a * (b%10)}$.`;
      } else if (level === '3d_2d') {
        a = this.randInt(105, 450);
        b = this.randInt(11, 25);
        trick = `💡 **Base Split:** $${a} \\times ${b} = (${a} \\times ${Math.floor(b/10)*10}) + (${a} \\times ${b%10})$.`;
      } else {
        // 3d_3d
        a = this.randInt(105, 350);
        b = this.randInt(102, 250);
        trick = `💡 **Vedic Vertical & Crosswise (Urdhva Tiryagbhyam)** or Base 100/200 method.`;
      }

      const answer = a * b;
      return {
        category: 'multiplication',
        title: `Multiplication (${level.replace('_', ' × ')})`,
        expression: `$${a} \\times ${b}$`,
        answer: answer,
        answerType: 'number',
        hint: trick,
        meta: { level, a, b }
      };
    }

    /**
     * Multiplication Tables (1 to 30)
     */
    static genTables(tableRange = [12, 29]) {
      const table = this.randInt(tableRange[0], tableRange[1]);
      const multiplier = this.randInt(2, 12);
      const answer = table * multiplier;

      return {
        category: 'tables',
        title: `Table of ${table}`,
        expression: `$${table} \\times ${multiplier}$`,
        answer: answer,
        answerType: 'number',
        hint: `💡 **Table Memory:** $${table} \\times ${multiplier} = ${answer}$. ($${table} \\times 10 = ${table * 10}$).`,
        meta: { table, multiplier }
      };
    }

    /**
     * Squares Mastery (1 to 40)
     */
    static genSquare(range = [1, 40]) {
      const n = this.randInt(range[0], range[1]);
      const answer = n * n;
      let trick = '';

      if (n % 10 === 5) {
        const d = Math.floor(n / 10);
        trick = `💡 **Ending in 5 Shortcut:** Multiply $${d} \\times ${d + 1} = ${d * (d + 1)}$, then attach $25 \\to \\mathbf{${answer}}$.`;
      } else if (n >= 25 && n <= 50) {
        const diff = 50 - n;
        trick = `💡 **Base 50 Shortcut:** $(25 - ${diff}) = ${25 - diff}$ and $(${diff})^2 = ${diff * diff} \\to \\mathbf{${answer}}$.`;
      } else if (n >= 11 && n <= 19) {
        const unit = n % 10;
        trick = `💡 **Teen Squares:** $(${n} + ${unit}) \\times 10 + ${unit}^2 = ${(n + unit) * 10} + ${unit * unit} = \\mathbf{${answer}}$.`;
      } else {
        trick = `💡 **$(a+b)^2$:** $${n}^2 = (${Math.floor(n/10)*10})^2 + 2(${Math.floor(n/10)*10})(${n%10}) + (${n%10})^2 = \\mathbf{${answer}}$.`;
      }

      return {
        category: 'squares',
        title: `Square of ${n}`,
        expression: `$${n}^2$`,
        answer: answer,
        answerType: 'number',
        hint: trick,
        meta: { n, range }
      };
    }

    /**
     * Square Roots (Perfect Squares 1 to 1600)
     */
    static genSquareRoot(range = [1, 40]) {
      const n = this.randInt(range[0], range[1]);
      const sq = n * n;

      return {
        category: 'square_root',
        title: `Square Root of ${sq}`,
        expression: `$\\sqrt{${sq}}$`,
        answer: n,
        answerType: 'number',
        hint: `💡 **Root Logic:** Look at unit digit of $${sq}$ (ends in $${sq % 10}$) $\\implies$ root ends in $${n % 10}$. $\\sqrt{${sq}} = ${n}$.`,
        meta: { n, sq }
      };
    }

    /**
     * Cubes Mastery (1 to 25)
     */
    static genCube(range = [1, 25]) {
      const n = this.randInt(range[0], range[1]);
      const answer = n * n * n;
      let trick = `💡 **Cube Fact:** $${n}^3 = ${n} \\times ${n} \\times ${n} = ${n * n} \\times ${n} = \\mathbf{${answer}}$.`;
      if (n <= 10) {
        trick = `💡 Direct standard single-digit cube fact: $${n}^3 = \\mathbf{${answer}}$.`;
      }

      return {
        category: 'cubes',
        title: `Cube of ${n}`,
        expression: `$${n}^3$`,
        answer: answer,
        answerType: 'number',
        hint: trick,
        meta: { n, range }
      };
    }

    /**
     * Cube Roots (Perfect Cubes 1 to 15,625)
     */
    static genCubeRoot(range = [1, 25]) {
      const n = this.randInt(range[0], range[1]);
      const cube = n * n * n;

      // Unique ending digits for cubes
      const lastDigit = cube % 10;
      const rootLast = n % 10;

      return {
        category: 'cube_root',
        title: `Cube Root of ${cube}`,
        expression: `$\\sqrt[3]{${cube}}$`,
        answer: n,
        answerType: 'number',
        hint: `💡 **Unit Digit Rule:** Cubes have unique 1-to-1 unit digit mapping ($${lastDigit} \\leftrightarrow ${rootLast}$). $\\sqrt[3]{${cube}} = ${n}$.`,
        meta: { n, cube }
      };
    }

    /**
     * Percentage Fractions (1/2 to 1/20)
     */
    static genFractionPercentage() {
      const fracs = [
        { num: 1, den: 2, pct: 50 },
        { num: 1, den: 3, pct: 33.33 },
        { num: 1, den: 4, pct: 25 },
        { num: 1, den: 5, pct: 20 },
        { num: 1, den: 6, pct: 16.66 },
        { num: 1, den: 7, pct: 14.28 },
        { num: 1, den: 8, pct: 12.5 },
        { num: 1, den: 9, pct: 11.11 },
        { num: 1, den: 10, pct: 10 },
        { num: 1, den: 11, pct: 9.09 },
        { num: 1, den: 12, pct: 8.33 },
        { num: 1, den: 13, pct: 7.69 },
        { num: 1, den: 14, pct: 7.14 },
        { num: 1, den: 15, pct: 6.66 },
        { num: 1, den: 16, pct: 6.25 },
        { num: 1, den: 17, pct: 5.88 },
        { num: 1, den: 18, pct: 5.55 },
        { num: 1, den: 19, pct: 5.26 },
        { num: 1, den: 20, pct: 5 }
      ];

      const item = this.randChoice(fracs);
      return {
        category: 'fraction_percentage',
        title: `Fraction to Percentage (${item.num}/${item.den})`,
        expression: `$\\frac{${item.num}}{${item.den}} = \\text{? } \\%$`,
        answer: item.pct,
        answerType: 'decimal',
        hint: `💡 **Standard Fraction:** $\\frac{${item.num}}{${item.den}} = ${item.pct}\\%$.`,
        meta: item
      };
    }

    /**
     * Universal Question Generator based on active filters
     */
    static generateQuestion(config = {}) {
      const activeOps = config.operations && config.operations.length > 0
        ? config.operations
        : ['addition', 'subtraction', 'multiplication', 'tables', 'squares', 'cubes'];

      const chosenOp = this.randChoice(activeOps);
      const difficulty = config.difficulty || 'medium';

      switch (chosenOp) {
        case 'addition':
          return this.genAddition(difficulty, config.addTerms || 2);
        case 'subtraction':
          return this.genSubtraction(difficulty);
        case 'add_sub_mix':
          return this.genAddSubMix(config.chainLength || 4);
        case 'multiplication':
          return this.genMultiplication(config.multLevel || '2d_1d');
        case 'tables':
          return this.genTables(config.tableRange || [12, 29]);
        case 'squares':
          return this.genSquare(config.squareRange || [1, 40]);
        case 'square_root':
          return this.genSquareRoot(config.squareRange || [1, 40]);
        case 'cubes':
          return this.genCube(config.cubeRange || [1, 25]);
        case 'cube_root':
          return this.genCubeRoot(config.cubeRange || [1, 25]);
        case 'fraction_percentage':
          return this.genFractionPercentage();
        default:
          return this.genAddition('medium', 2);
      }
    }

    // =========================================================================
    // 2. TELEMETRY & PROBLEM PATTERN DIAGNOSIS ALGORITHM
    // =========================================================================

    /**
     * Analyzes drill session history to calculate CPM, accuracy,
     * detect cognitive bottlenecks, and generate actionable improvement plans.
     */
    static analyzeSession(history = []) {
      if (!history || history.length === 0) {
        return {
          totalQuestions: 0,
          correctCount: 0,
          accuracy: 0,
          avgTimeMs: 0,
          cpm: 0,
          weaknesses: [],
          recommendations: [],
          categoryStats: {}
        };
      }

      const total = history.length;
      const correct = history.filter(h => h.isCorrect).length;
      const accuracy = Math.round((correct / total) * 100);

      const totalTimeMs = history.reduce((acc, h) => acc + (h.timeMs || 2000), 0);
      const avgTimeMs = Math.round(totalTimeMs / total);
      const totalMinutes = Math.max(0.1, totalTimeMs / 60000);
      const cpm = Math.round(correct / totalMinutes); // Calculations Per Minute

      // Group statistics by category
      const categoryStats = {};
      history.forEach(item => {
        const cat = item.category || 'general';
        if (!categoryStats[cat]) {
          categoryStats[cat] = { total: 0, correct: 0, totalTime: 0, mistakes: [] };
        }
        categoryStats[cat].total++;
        categoryStats[cat].totalTime += (item.timeMs || 2000);
        if (item.isCorrect) {
          categoryStats[cat].correct++;
        } else {
          categoryStats[cat].mistakes.push(item);
        }
      });

      // Calculate averages per category
      for (const cat in categoryStats) {
        const cs = categoryStats[cat];
        cs.accuracy = Math.round((cs.correct / cs.total) * 100);
        cs.avgTimeMs = Math.round(cs.totalTime / cs.total);
      }

      // Detect Problem Patterns / Cognitive Bottlenecks
      const weaknesses = [];
      const recommendations = [];

      for (const cat in categoryStats) {
        const cs = categoryStats[cat];
        
        // Low accuracy threshold (< 75%)
        if (cs.accuracy < 75 && cs.total >= 2) {
          weaknesses.push({
            category: cat,
            severity: 'high',
            title: `Accuracy Issue in ${this.formatCategoryName(cat)}`,
            detail: `${cs.total - cs.correct} mistakes out of ${cs.total} questions (${cs.accuracy}% accuracy).`,
            avgTimeMs: cs.avgTimeMs
          });
          recommendations.push(`🎯 Focus 10 minutes on **${this.formatCategoryName(cat)}** drill using mental shortcut formulas.`);
        }
        // Slow calculation speed threshold (> 5000ms per question)
        else if (cs.avgTimeMs > 5000 && cs.total >= 2) {
          weaknesses.push({
            category: cat,
            severity: 'medium',
            title: `Speed Latency in ${this.formatCategoryName(cat)}`,
            detail: `Average response time is ${(cs.avgTimeMs / 1000).toFixed(1)}s (target is < 3.0s).`,
            avgTimeMs: cs.avgTimeMs
          });
          recommendations.push(`⚡ Use **Split & Add** and **Vedic base methods** to reduce thinking time in ${this.formatCategoryName(cat)}.`);
        }
      }

      // Check specific number-range patterns
      const squareMistakes = history.filter(h => h.category === 'squares' && !h.isCorrect);
      if (squareMistakes.length > 0) {
        const highSquares = squareMistakes.filter(h => h.meta?.n >= 25);
        if (highSquares.length >= 2) {
          weaknesses.push({
            category: 'squares',
            severity: 'medium',
            title: 'Squares 25–40 Base 50 Rule',
            detail: 'Mistakes on squares between 25 and 40.',
            avgTimeMs: 4000
          });
          recommendations.push('📐 Revise Base 50 rule: $n^2 = (25 - d) \\times 100 + d^2$ where $d = 50 - n$.');
        }
      }

      const tableMistakes = history.filter(h => h.category === 'tables' && !h.isCorrect);
      if (tableMistakes.length >= 2) {
        const tablesList = Array.from(new Set(tableMistakes.map(h => h.meta?.table))).filter(Boolean);
        recommendations.push(`🔢 Specifically drill tables of: **${tablesList.join(', ')}**.`);
      }

      if (weaknesses.length === 0) {
        recommendations.push('🏆 Excellent speed and accuracy! Try **Time Attack 60s** or **3-Digit Multiplication Master** to level up.');
      }

      return {
        totalQuestions: total,
        correctCount: correct,
        accuracy,
        avgTimeMs,
        cpm,
        weaknesses,
        recommendations,
        categoryStats
      };
    }

    static formatCategoryName(cat) {
      const names = {
        addition: 'Addition',
        subtraction: 'Subtraction',
        add_sub_mix: 'Mixed Addition/Subtraction',
        multiplication: 'Multiplication',
        tables: 'Multiplication Tables',
        squares: 'Squares (1–40)',
        square_root: 'Square Roots',
        cubes: 'Cubes (1–25)',
        cube_root: 'Cube Roots',
        fraction_percentage: 'Fractions & Percentages'
      };
      return names[cat] || cat;
    }

    // =========================================================================
    // 3. PERSISTENCE & DAILY GOAL STORAGE
    // =========================================================================

    static getStorageKey() {
      return 'mathvault_speed_calc_history_v1';
    }

    static getGoalKey() {
      return 'mathvault_speed_calc_goal_v1';
    }

    static saveSession(sessionSummary) {
      try {
        const key = this.getStorageKey();
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        stored.unshift({
          timestamp: new Date().toISOString(),
          dateStr: new Date().toLocaleDateString(),
          ...sessionSummary
        });
        // Keep last 100 sessions
        localStorage.setItem(key, JSON.stringify(stored.slice(0, 100)));

        // Update daily target count
        this.incrementDailyCount(sessionSummary.totalQuestions || 0);
      } catch (e) {}
    }

    static getHistory() {
      try {
        return JSON.parse(localStorage.getItem(this.getStorageKey()) || '[]');
      } catch (e) {
        return [];
      }
    }

    static getDailyProgress() {
      try {
        const todayStr = new Date().toLocaleDateString();
        const raw = JSON.parse(localStorage.getItem(this.getGoalKey()) || '{}');
        if (raw.date === todayStr) {
          return raw;
        }
        return { date: todayStr, target: 50, completed: 0 };
      } catch (e) {
        return { date: new Date().toLocaleDateString(), target: 50, completed: 0 };
      }
    }

    static incrementDailyCount(count) {
      try {
        const progress = this.getDailyProgress();
        progress.completed = (progress.completed || 0) + count;
        localStorage.setItem(this.getGoalKey(), JSON.stringify(progress));
      } catch (e) {}
    }

    static setDailyTarget(target) {
      try {
        const progress = this.getDailyProgress();
        progress.target = target;
        localStorage.setItem(this.getGoalKey(), JSON.stringify(progress));
      } catch (e) {}
    }
  }

  return SpeedCalcEngine;
}));
