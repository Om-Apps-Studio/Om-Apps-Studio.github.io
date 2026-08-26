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
     * Multiplication Tables (Custom Range)
     */
    static genTables(tableRange = [12, 30]) {
      const min = Math.max(1, parseInt(tableRange[0], 10) || 12);
      const max = Math.max(min, parseInt(tableRange[1], 10) || 30);
      const table = this.randInt(min, max);
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
     * Squares Mastery (Custom Range e.g. 1 to 40, 25 to 75, 1 to 100)
     */
    static genSquare(range = [1, 40]) {
      const min = Math.max(1, parseInt(range[0], 10) || 1);
      const max = Math.max(min, parseInt(range[1], 10) || 40);
      const n = this.randInt(min, max);
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
        meta: { n, range: [min, max] }
      };
    }

    /**
     * Square Roots (Perfect Squares from custom range)
     */
    static genSquareRoot(range = [1, 40]) {
      const min = Math.max(1, parseInt(range[0], 10) || 1);
      const max = Math.max(min, parseInt(range[1], 10) || 40);
      const n = this.randInt(min, max);
      const sq = n * n;

      return {
        category: 'square_root',
        title: `Square Root of ${sq}`,
        expression: `$\\sqrt{${sq}}$`,
        answer: n,
        answerType: 'number',
        hint: `💡 **Root Logic:** Look at unit digit of $${sq}$ (ends in $${sq % 10}$) $\\implies$ root ends in $${n % 10}$. $\\sqrt{${sq}} = ${n}$.`,
        meta: { n, sq, range: [min, max] }
      };
    }

    /**
     * Cubes Mastery (Custom Range e.g. 1 to 25, 11 to 30, 1 to 50)
     */
    static genCube(range = [1, 25]) {
      const min = Math.max(1, parseInt(range[0], 10) || 1);
      const max = Math.max(min, parseInt(range[1], 10) || 25);
      const n = this.randInt(min, max);
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
        meta: { n, range: [min, max] }
      };
    }

    /**
     * Cube Roots (Perfect Cubes from custom range)
     */
    static genCubeRoot(range = [1, 25]) {
      const min = Math.max(1, parseInt(range[0], 10) || 1);
      const max = Math.max(min, parseInt(range[1], 10) || 25);
      const n = this.randInt(min, max);
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
        meta: { n, cube, range: [min, max] }
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
     * SSC & Banking Simplification Generator (Moderate to Hard)
     * Real exam patterns: VBODMAS chains, percentage splits, powers & roots combos,
     * fractional multipliers, and missing variable '?' equations.
     */
    static genSimplification(difficulty = 'medium') {
      const subTypes = ['bodmas_chain', 'percentage_split', 'roots_powers_combo', 'fraction_chain', 'missing_variable'];
      const chosenType = this.randChoice(subTypes);

      if (chosenType === 'percentage_split') {
        // SSC / Banking standard percentage splits
        const pctPool = [
          { pct: 12.5, fracText: '\\frac{1}{8}', fracVal: 1/8, baseMulti: 8 },
          { pct: 25, fracText: '\\frac{1}{4}', fracVal: 1/4, baseMulti: 4 },
          { pct: 37.5, fracText: '\\frac{3}{8}', fracVal: 3/8, baseMulti: 8 },
          { pct: 50, fracText: '\\frac{1}{2}', fracVal: 1/2, baseMulti: 2 },
          { pct: 62.5, fracText: '\\frac{5}{8}', fracVal: 5/8, baseMulti: 8 },
          { pct: 75, fracText: '\\frac{3}{4}', fracVal: 3/4, baseMulti: 4 },
          { pct: 16.66, fracText: '\\frac{1}{6}', fracVal: 1/6, baseMulti: 6, displayPct: '16\\frac{2}{3}\\%' },
          { pct: 14.28, fracText: '\\frac{1}{7}', fracVal: 1/7, baseMulti: 7, displayPct: '14\\frac{2}{7}\\%' },
          { pct: 20, fracText: '\\frac{1}{5}', fracVal: 1/5, baseMulti: 5 },
          { pct: 40, fracText: '\\frac{2}{5}', fracVal: 2/5, baseMulti: 5 },
          { pct: 60, fracText: '\\frac{3}{5}', fracVal: 3/5, baseMulti: 5 },
          { pct: 80, fracText: '\\frac{4}{5}', fracVal: 4/5, baseMulti: 5 },
          { pct: 33.33, fracText: '\\frac{1}{3}', fracVal: 1/3, baseMulti: 3, displayPct: '33\\frac{1}{3}\\%' },
          { pct: 66.66, fracText: '\\frac{2}{3}', fracVal: 2/3, baseMulti: 3, displayPct: '66\\frac{2}{3}\\%' }
        ];

        const p1 = this.randChoice(pctPool);
        let p2 = this.randChoice(pctPool);
        while (p2 === p1) p2 = this.randChoice(pctPool);

        const multi1 = this.randInt(difficulty === 'hard' ? 12 : 6, difficulty === 'hard' ? 35 : 20);
        const num1 = multi1 * p1.baseMulti * (difficulty === 'hard' ? 10 : 10);
        const val1 = Math.round(num1 * p1.fracVal);

        const multi2 = this.randInt(difficulty === 'hard' ? 8 : 4, difficulty === 'hard' ? 25 : 15);
        const num2 = multi2 * p2.baseMulti * (difficulty === 'hard' ? 10 : 10);
        const val2 = Math.round(num2 * p2.fracVal);

        const isAdd = Math.random() > 0.35;
        const answer = isAdd ? (val1 + val2) : (val1 - val2);
        const opSign = isAdd ? '+' : '-';

        const disp1 = p1.displayPct || `${p1.pct}\\%`;
        const disp2 = p2.displayPct || `${p2.pct}\\%`;

        const expr = `${disp1} \\text{ of } ${num1} ${opSign} ${disp2} \\text{ of } ${num2}`;
        const hint = `💡 **Banking Fraction Split:** Convert to standard fractions:\n- $${disp1} \\to ${p1.fracText} \\times ${num1} = ${val1}$\n- $${disp2} \\to ${p2.fracText} \\times ${num2} = ${val2}$\n- **Result:** $${val1} ${opSign} ${val2} = \\mathbf{${answer}}$.`;

        return {
          category: 'simplification',
          title: 'Banking Percentage Simplification',
          expression: `$${expr}$`,
          answer: answer,
          answerType: 'number',
          hint: hint,
          meta: { subtype: 'percentage_split', difficulty }
        };
      }

      if (chosenType === 'roots_powers_combo') {
        // SSC CGL / Banking combo of Squares, Cubes, and Roots
        const sqRoots = [
          { root: 16, sq: 256 }, { root: 18, sq: 324 }, { root: 22, sq: 484 },
          { root: 24, sq: 576 }, { root: 26, sq: 676 }, { root: 28, sq: 784 },
          { root: 32, sq: 1024 }, { root: 34, sq: 1156 }, { root: 36, sq: 1296 },
          { root: 38, sq: 1444 }, { root: 42, sq: 1764 }, { root: 44, sq: 1936 }
        ];
        const cbRoots = [
          { root: 6, cb: 216 }, { root: 7, cb: 343 }, { root: 8, cb: 512 },
          { root: 9, cb: 729 }, { root: 11, cb: 1331 }, { root: 12, cb: 1728 },
          { root: 13, cb: 2197 }, { root: 14, cb: 2744 }, { root: 15, cb: 3375 }
        ];

        const s1 = this.randChoice(sqRoots);
        const c1 = this.randChoice(cbRoots);
        const mult = this.randInt(3, difficulty === 'hard' ? 15 : 8);
        const subSquareVal = this.randInt(11, difficulty === 'hard' ? 22 : 16);
        const subSquare = subSquareVal * subSquareVal;

        // Expression: sqrt(sq) * mult + cbrt(cb) - subSquareVal^2
        const p1 = s1.root * mult;
        const p2 = c1.root;
        const p3 = subSquare;
        const answer = p1 + p2 - p3;

        const expr = `\\sqrt{${s1.sq}} \\times ${mult} + \\sqrt[3]{${c1.cb}} - ${subSquareVal}^2`;
        const hint = `💡 **Roots & Powers Breakdown:**\n- $\\sqrt{${s1.sq}} = ${s1.root} \\implies ${s1.root} \\times ${mult} = ${p1}$\n- $\\sqrt[3]{${c1.cb}} = ${c1.root}$\n- $${subSquareVal}^2 = ${subSquare}$\n- **Total:** $${p1} + ${p2} - ${p3} = \\mathbf{${answer}}$.`;

        return {
          category: 'simplification',
          title: 'SSC Roots & Powers Combo',
          expression: `$${expr}$`,
          answer: answer,
          answerType: 'number',
          hint: hint,
          meta: { subtype: 'roots_powers_combo', difficulty }
        };
      }

      if (chosenType === 'fraction_chain') {
        // Multi-fraction reduction & multiplication chains
        const fracs = [
          { num: 3, den: 8 }, { num: 5, den: 8 }, { num: 7, den: 8 },
          { num: 5, den: 12 }, { num: 7, den: 12 }, { num: 11, den: 12 },
          { num: 3, den: 7 }, { num: 4, den: 7 }, { num: 5, den: 7 },
          { num: 2, den: 9 }, { num: 4, den: 9 }, { num: 5, den: 9 }, { num: 7, den: 9 }
        ];

        const f1 = this.randChoice(fracs);
        let f2 = this.randChoice(fracs);
        while (f2.den === f1.den) f2 = this.randChoice(fracs);

        const k1 = this.randInt(12, difficulty === 'hard' ? 45 : 25);
        const N1 = k1 * f1.den;
        const val1 = k1 * f1.num;

        const k2 = this.randInt(8, difficulty === 'hard' ? 35 : 20);
        const N2 = k2 * f2.den;
        const val2 = k2 * f2.num;

        const extraAdd = this.randInt(25, difficulty === 'hard' ? 250 : 90);
        const isAdd = Math.random() > 0.4;
        const answer = isAdd ? (val1 + val2 - extraAdd) : (val1 - val2 + extraAdd);
        const op1 = isAdd ? '+' : '-';
        const op2 = isAdd ? '-' : '+';

        const expr = `\\frac{${f1.num}}{${f1.den}} \\times ${N1} ${op1} \\frac{${f2.num}}{${f2.den}} \\times ${N2} ${op2} ${extraAdd}`;
        const hint = `💡 **Fraction Cancellation:**\n- $\\frac{${f1.num}}{${f1.den}} \\times ${N1} = ${f1.num} \\times ${k1} = ${val1}$\n- $\\frac{${f2.num}}{${f2.den}} \\times ${N2} = ${f2.num} \\times ${k2} = ${val2}$\n- **Total:** $${val1} ${op1} ${val2} ${op2} ${extraAdd} = \\mathbf{${answer}}$.`;

        return {
          category: 'simplification',
          title: 'Fraction Multiplication Chain',
          expression: `$${expr}$`,
          answer: answer,
          answerType: 'number',
          hint: hint,
          meta: { subtype: 'fraction_chain', difficulty }
        };
      }

      if (chosenType === 'missing_variable') {
        // Find missing '?' value (Exam Classic)
        const variants = ['linear_mult', 'root_eq', 'sq_eq'];
        const v = this.randChoice(variants);

        if (v === 'root_eq') {
          // sqrt(?) + p% of N = Total
          const pcts = [20, 25, 40, 50, 75];
          const pct = this.randChoice(pcts);
          const mult = this.randInt(4, 15);
          const N = mult * (100 / (pct === 20 ? 20 : (pct === 25 ? 25 : (pct === 40 ? 20 : (pct === 50 ? 50 : 25)))));
          const pctVal = Math.round((pct / 100) * N);
          const rootTarget = this.randInt(12, difficulty === 'hard' ? 40 : 25);
          const missingAns = rootTarget * rootTarget;
          const total = rootTarget + pctVal;

          const expr = `\\sqrt{?} + ${pct}\\% \\text{ of } ${N} = ${total}`;
          const hint = `💡 **Solving for Missing Variable (?):**\n1. Calculate ${pct}% of $${N} = ${pctVal}$\n2. $\\sqrt{?} = ${total} - ${pctVal} = ${rootTarget}$\n3. $? = ${rootTarget}^2 = \\mathbf{${missingAns}}$.`;

          return {
            category: 'simplification',
            title: 'Missing Term Simplification (?)',
            expression: `$${expr} \\implies ? = \\text{?}$`,
            answer: missingAns,
            answerType: 'number',
            hint: hint,
            meta: { subtype: 'missing_variable_root', difficulty }
          };
        } else if (v === 'sq_eq') {
          // ?^2 + a^2 = Total
          const target = this.randInt(12, difficulty === 'hard' ? 35 : 22);
          const a = this.randInt(9, 18);
          const total = target * target + a * a;
          const missingAns = target;

          const expr = `?^2 + ${a}^2 = ${total}`;
          const hint = `💡 **Square Equation:**\n1. $${a}^2 = ${a * a}$\n2. $?^2 = ${total} - ${a * a} = ${target * target}$\n3. $? = \\sqrt{${target * target}} = \\mathbf{${missingAns}}$.`;

          return {
            category: 'simplification',
            title: 'Missing Square Simplification (?)',
            expression: `$${expr} \\implies ? = \\text{?}$`,
            answer: missingAns,
            answerType: 'number',
            hint: hint,
            meta: { subtype: 'missing_variable_sq', difficulty }
          };
        } else {
          // ? * a - b = c
          const a = this.randInt(12, difficulty === 'hard' ? 28 : 18);
          const missingAns = this.randInt(14, difficulty === 'hard' ? 45 : 30);
          const b = this.randInt(50, 350);
          const c = (missingAns * a) - b;

          const expr = `? \\times ${a} - ${b} = ${c}`;
          const hint = `💡 **Linear Missing Term:**\n1. $? \\times ${a} = ${c} + ${b} = ${c + b}$\n2. $? = \\frac{${c + b}}{${a}} = \\mathbf{${missingAns}}$.`;

          return {
            category: 'simplification',
            title: 'Linear Missing Term Simplification (?)',
            expression: `$${expr} \\implies ? = \\text{?}$`,
            answer: missingAns,
            answerType: 'number',
            hint: hint,
            meta: { subtype: 'missing_variable_linear', difficulty }
          };
        }
      }

      // Default / bodmas_chain
      // Multi-term BODMAS with squares, products, divisions
      const a = this.randInt(12, difficulty === 'hard' ? 28 : 18);
      const b = this.randInt(11, difficulty === 'hard' ? 25 : 16);
      const prod = a * b;

      const div = this.randChoice([6, 7, 8, 9, 12, 14, 15, 16, 18]);
      const divQuot = this.randInt(12, difficulty === 'hard' ? 45 : 25);
      const divDividend = div * divQuot;

      const sqBase = this.randInt(8, difficulty === 'hard' ? 20 : 15);
      const sqVal = sqBase * sqBase;

      const answer = prod - divQuot + sqVal;
      const expr = `${a} \\times ${b} - ${divDividend} \\div ${div} + ${sqBase}^2`;
      const hint = `💡 **VBODMAS Rule (Brackets $\\to$ Of $\\to$ Div $\\to$ Mult $\\to$ Add $\\to$ Sub):**\n1. Power: $${sqBase}^2 = ${sqVal}$\n2. Division: $${divDividend} \\div ${div} = ${divQuot}$\n3. Multiplication: $${a} \\times ${b} = ${prod}$\n4. Combine: $${prod} - ${divQuot} + ${sqVal} = \\mathbf{${answer}}$.`;

      return {
        category: 'simplification',
        title: 'BODMAS Exam Simplification',
        expression: `$${expr}$`,
        answer: answer,
        answerType: 'number',
        hint: hint,
        meta: { subtype: 'bodmas_chain', difficulty }
      };
    }

    /**
     * Universal Question Generator based on active filters
     */
    static generateQuestion(config = {}) {
      const activeOps = config.operations && config.operations.length > 0
        ? config.operations
        : ['addition', 'subtraction', 'multiplication', 'tables', 'squares', 'cubes', 'simplification'];

      const chosenOp = this.randChoice(activeOps);
      const difficulty = config.difficulty || 'medium';

      switch (chosenOp) {
        case 'simplification':
        case 'ssc_banking':
          return this.genSimplification(difficulty);
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
          return this.genSimplification(difficulty);
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
        simplification: 'SSC & Banking Simplification',
        ssc_banking: 'SSC & Banking Simplification',
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
