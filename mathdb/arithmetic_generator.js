/**
 * MathVault - Dynamic Arithmetic Formula MCQ Generator Engine
 * 18 Comprehensive Chapters, Valid Mathematical Calculation, Distractor Generation & Step-by-Step LaTeX Solutions
 */

class ArithmeticGenerator {
  // Helper: Random integer in [min, max]
  static randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Helper: Random element from array
  static randChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Helper: Shuffle array
  static shuffle(arr) {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  }

  // Helper: Generate 4 MCQ options from correct value and distractor offsets
  static formatOptions(correctVal, distractorFunc) {
    const formatItem = (val) => {
      const str = String(val).trim();
      if (str.startsWith('$') && str.endsWith('$')) return str;
      return `$${str}$`;
    };

    const distractors = new Set();
    let attempts = 0;
    while (distractors.size < 3 && attempts < 25) {
      attempts++;
      const d = distractorFunc();
      if (d !== correctVal && d !== undefined && d !== null && !isNaN(d)) {
        distractors.add(d);
      }
    }
    // Fallback if needed
    let offset = 1;
    while (distractors.size < 3) {
      if (typeof correctVal === 'number') {
        const d1 = correctVal + offset;
        if (d1 !== correctVal) distractors.add(d1);
        const d2 = correctVal - offset;
        if (d2 !== correctVal && d2 >= 0) distractors.add(d2);
      } else {
        distractors.add(`${correctVal} + ${offset}`);
      }
      offset++;
    }

    const allOpts = [
      { text: formatItem(correctVal), isCorrect: true },
      ...Array.from(distractors).slice(0, 3).map((d) => ({ text: formatItem(d), isCorrect: false }))
    ];

    const shuffled = this.shuffle(allOpts);
    return shuffled.map((opt, idx) => ({
      id: String.fromCharCode(65 + idx),
      text: opt.text,
      isCorrect: opt.isCorrect
    }));
  }

  // =========================================================================
  // 1. Unit Digit Generator
  // =========================================================================
  static genUnitDigit(difficulty = 'Medium') {
    if (difficulty === 'Medium') {
      const base = this.randInt(12, 99);
      const exp = this.randInt(43, 987);
      const lastDigit = base % 10;
      const mod4 = exp % 4 === 0 ? 4 : exp % 4;
      const ans = Math.pow(lastDigit, mod4) % 10;

      const qText = `Find the unit digit in the expansion of $(${base})^{${exp}}$.`;
      const explanation = `
### Step-by-Step Derivation:
1. **Identify Base Last Digit:** The unit digit of $(${base})^{${exp}}$ depends only on the last digit of the base, which is **$${lastDigit}$**.
2. **Apply Cyclicity Rule:** The cyclicity of $${lastDigit}$ is $4$.
3. **Divide Exponent by 4:** $${exp} \\div 4 = ${Math.floor(exp / 4)}$ with remainder $r = ${exp % 4}$.
${exp % 4 === 0 ? `   - Since remainder is $0$, take the effective power as $4$.` : `   - Effective power is $r = ${exp % 4}$.`}
4. **Calculate Final Unit Digit:**
   $$${lastDigit}^{${mod4}} = ${Math.pow(lastDigit, mod4)} \\implies \\text{Unit Digit} = \\mathbf{${ans}}$$
`;
      const options = this.formatOptions(ans, () => this.randInt(0, 9));
      return {
        title: `Unit Digit of $(${base})^{${exp}}$`,
        chapter: 'Unit Digit',
        difficulty: 'Medium',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['\\text{Unit digit of } a^b = \\text{Unit digit of } (a \\pmod{10})^{b \\pmod 4}']
      };
    } else {
      // Hard: Multi-term expression
      const b1 = this.randInt(13, 87), e1 = this.randInt(51, 345);
      const b2 = this.randInt(22, 78), e2 = this.randInt(40, 290);
      const u1 = Math.pow(b1 % 10, (e1 % 4 === 0 ? 4 : e1 % 4)) % 10;
      const u2 = Math.pow(b2 % 10, (e2 % 4 === 0 ? 4 : e2 % 4)) % 10;
      const ans = (u1 * u2) % 10;

      const qText = `Find the unit digit in the product: $$(${b1})^{${e1}} \\times (${b2})^{${e2}}$$`;
      const explanation = `
### Step-by-Step Derivation:
1. **Unit digit of $(${b1})^{${e1}}$:**
   - Last digit = $${b1 % 10}$, $${e1} \\pmod 4 = ${e1 % 4 === 0 ? 4 : e1 % 4}$
   - Unit digit $u_1 = ${u1}$
2. **Unit digit of $(${b2})^{${e2}}$:**
   - Last digit = $${b2 % 10}$, $${e2} \\pmod 4 = ${e2 % 4 === 0 ? 4 : e2 % 4}$
   - Unit digit $u_2 = ${u2}$
3. **Combined Product:**
   $$u_1 \\times u_2 = ${u1} \\times ${u2} = ${u1 * u2} \\implies \\text{Unit Digit} = \\mathbf{${ans}}$$
`;
      const options = this.formatOptions(ans, () => this.randInt(0, 9));
      return {
        title: `Unit Digit of Product $(${b1})^{${e1}} \\times (${b2})^{${e2}}$`,
        chapter: 'Unit Digit',
        difficulty: 'Hard',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['\\text{Unit digit}(A \\times B) = (\\text{Unit}(A) \\times \\text{Unit}(B)) \\pmod{10}']
      };
    }
  }

  // =========================================================================
  // 2. Number of Factors
  // =========================================================================
  static genFactors(difficulty = 'Medium') {
    const a = this.randInt(2, 4); // 2^a
    const b = this.randInt(1, 3); // 3^b
    const c = this.randInt(1, 2); // 5^c
    const N = Math.pow(2, a) * Math.pow(3, b) * Math.pow(5, c);

    const totalFactors = (a + 1) * (b + 1) * (c + 1);
    const oddFactors = (b + 1) * (c + 1);
    const evenFactors = a * (b + 1) * (c + 1);

    if (difficulty === 'Medium') {
      const qText = `Find the **total number of factors** of the number $N = ${N}$.`;
      const explanation = `
### Step-by-Step Derivation:
1. **Prime Factorization of $${N}$:**
   $$${N} = 2^{${a}} \\times 3^{${b}} \\times 5^{${c}}$$
2. **Formula for Total Factors:**
   $$T(N) = (a + 1)(b + 1)(c + 1)$$
3. **Calculation:**
   $$T(${N}) = (${a} + 1) \\times (${b} + 1) \\times (${c} + 1) = ${a + 1} \\times ${b + 1} \\times ${c + 1} = \\mathbf{${totalFactors}}$$
`;
      const options = this.formatOptions(totalFactors, () => this.randInt(totalFactors - 10, totalFactors + 10));
      return {
        title: `Total Factors of ${N}`,
        chapter: 'Number of Factors',
        difficulty: 'Medium',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['T(N) = (a+1)(b+1)(c+1) \\text{ for } N = p_1^a p_2^b p_3^c']
      };
    } else {
      const qText = `For the number $N = ${N}$, find the **number of even factors**.`;
      const explanation = `
### Step-by-Step Derivation:
1. **Prime Factorization:**
   $$${N} = 2^{${a}} \\times 3^{${b}} \\times 5^{${c}}$$
2. **Formula for Even Factors:**
   - Any even factor must contain at least one factor of 2.
   $$T_{\\text{even}}(N) = a \\times (b + 1) \\times (c + 1)$$
3. **Calculation:**
   $$T_{\\text{even}}(${N}) = ${a} \\times (${b} + 1) \\times (${c} + 1) = ${a} \\times ${b + 1} \\times ${c + 1} = \\mathbf{${evenFactors}}$$
`;
      const options = this.formatOptions(evenFactors, () => this.randInt(evenFactors - 8, evenFactors + 8));
      return {
        title: `Even Factors of ${N}`,
        chapter: 'Number of Factors',
        difficulty: 'Hard',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['T_{\\text{even}}(N) = a(b+1)(c+1)']
      };
    }
  }

  // =========================================================================
  // 3. Number of Zeros
  // =========================================================================
  static genNumberOfZeros(difficulty = 'Medium') {
    const n = difficulty === 'Medium' ? this.randInt(50, 180) : this.randInt(220, 650);
    let count = 0;
    let p = 5;
    const steps = [];
    while (p <= n) {
      const added = Math.floor(n / p);
      steps.push(`\\left\\lfloor \\frac{${n}}{${p}} \\right\\rfloor = ${added}`);
      count += added;
      p *= 5;
    }

    const qText = `Find the number of trailing zeros in the value of $${n}!$.`;
    const explanation = `
### Step-by-Step Derivation:
1. **Concept:** Trailing zeros in $n!$ equal the highest power of 5 dividing $n!$ (Legendre's Formula):
   $$E_5(n!) = \\left\\lfloor \\frac{n}{5} \\right\\rfloor + \\left\\lfloor \\frac{n}{25} \\right\\rfloor + \\left\\lfloor \\frac{n}{125} \\right\\rfloor + \\cdots$$
2. **Successive Divisions:**
${steps.map((s) => `   - $${s}$`).join('\n')}
3. **Sum:**
   $$\\text{Total Trailing Zeros} = ${steps.map((s) => s.split('=')[1].trim()).join(' + ')} = \\mathbf{${count}}$$
`;
    const options = this.formatOptions(count, () => this.randInt(count - 6, count + 6));
    return {
      title: `Trailing Zeros in $${n}!$`,
      chapter: 'Number of Zeros',
      difficulty,
      question: qText,
      options,
      correctAnswer: options.find((o) => o.isCorrect).id,
      explanation,
      keyFormulas: ['E_5(n!) = \\sum_{k=1}^{\\infty} \\left\\lfloor \\frac{n}{5^k} \\right\\rfloor']
    };
  }

  // =========================================================================
  // 4. Remainder Theorem
  // =========================================================================
  static genRemainderTheorem(difficulty = 'Medium') {
    if (difficulty === 'Medium') {
      const divisor = this.randChoice([7, 9, 11, 13, 17]);
      const base = divisor - 1; // (d - 1)^odd mod d = d - 1, (d-1)^even mod d = 1
      const power = this.randInt(41, 199);
      const isEven = (power % 2 === 0);
      const rem = isEven ? 1 : divisor - 1;

      const qText = `Find the remainder when $(${base})^{${power}}$ is divided by $${divisor}$.`;
      const explanation = `
### Step-by-Step Derivation:
1. **Express Base in terms of Divisor:**
   $$${base} = (${divisor} - 1)$$
2. **Apply Binomial Expansion Modulo $${divisor}$:**
   $$(${divisor} - 1)^{${power}} \\equiv (-1)^{${power}} \\pmod{${divisor}}$$
3. **Evaluate Sign:**
   - Since $${power}$ is **${isEven ? 'EVEN' : 'ODD'}**, $(-1)^{${power}} = ${isEven ? '1' : '-1'}$.
4. **Final Remainder:**
   $$\\text{Remainder} = ${isEven ? '1' : `${divisor} - 1 = \\mathbf{${rem}}`}$$
`;
      const options = this.formatOptions(rem, () => this.randInt(0, divisor - 1));
      return {
        title: `Remainder of $(${base})^{${power}} \\div ${divisor}$`,
        chapter: 'Remainder Theorem',
        difficulty: 'Medium',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['(a - 1)^n \\equiv (-1)^n \\pmod a']
      };
    } else {
      // Fermat's Little Theorem: a^(p-1) = 1 mod p
      const prime = this.randChoice([13, 17, 19, 23]);
      const a = this.randInt(2, 7);
      const mult = this.randInt(4, 9);
      const extra = this.randInt(1, 3);
      const power = (prime - 1) * mult + extra;
      const ans = Math.pow(a, extra) % prime;

      const qText = `Find the remainder when $${a}^{${power}}$ is divided by $${prime}$.`;
      const explanation = `
### Step-by-Step Derivation:
1. **Fermat's Little Theorem:** If $p$ is prime and $\\gcd(a, p) = 1$, then $a^{p-1} \\equiv 1 \\pmod p$.
   - Here $p = ${prime}$, so $${a}^{${prime - 1}} \\equiv 1 \\pmod{${prime}}$.
2. **Break down the Exponent:**
   $$${power} = (${prime - 1} \\times ${mult}) + ${extra}$$
3. **Compute Remainder:**
   $$${a}^{${power}} = (${a}^{${prime - 1}})^{${mult}} \\times ${a}^{${extra}} \\equiv (1)^{${mult}} \\times ${Math.pow(a, extra)} \\pmod{${prime}}$$
   $$${Math.pow(a, extra)} \\pmod{${prime}} = \\mathbf{${ans}}$$
`;
      const options = this.formatOptions(ans, () => this.randInt(1, prime - 1));
      return {
        title: `Fermat's Remainder $${a}^{${power}} \\pmod{${prime}}$`,
        chapter: 'Remainder Theorem',
        difficulty: 'Hard',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ["a^{p-1} \\equiv 1 \\pmod p \\text{ (Fermat's Little Theorem)}"]
      };
    }
  }

  // =========================================================================
  // 5. HCF and LCM
  // =========================================================================
  static genHcfLcm(difficulty = 'Medium') {
    const hcf = this.randInt(6, 18);
    const r1 = this.randChoice([3, 4, 5, 7]);
    let r2 = this.randChoice([8, 9, 11, 13]);
    while (r1 === r2) r2 = this.randInt(8, 14);

    const n1 = hcf * r1;
    const n2 = hcf * r2;
    const lcm = hcf * r1 * r2;

    if (difficulty === 'Medium') {
      const qText = `The HCF and LCM of two numbers are $${hcf}$ and $${lcm}$ respectively. If one of the numbers is $${n1}$, find the other number.`;
      const explanation = `
### Step-by-Step Derivation:
1. **Fundamental Formula:**
   $$\\text{Product of Two Numbers} = \\text{HCF} \\times \\text{LCM}$$
   $$N_1 \\times N_2 = \\text{HCF} \\times \\text{LCM}$$
2. **Substitute Given Values:**
   $$${n1} \\times N_2 = ${hcf} \\times ${lcm}$$
3. **Solve for $N_2$:**
   $$N_2 = \\frac{${hcf} \\times ${lcm}}{${n1}} = \\frac{${hcf * lcm}}{${n1}} = \\mathbf{${n2}}$$
`;
      const options = this.formatOptions(n2, () => this.randInt(n2 - 25, n2 + 25));
      return {
        title: `HCF & LCM Product Rule`,
        chapter: 'HCF and LCM',
        difficulty: 'Medium',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['N_1 \\times N_2 = \\text{HCF} \\times \\text{LCM}']
      };
    } else {
      // Fraction LCM/HCF
      const qText = `Find the **HCF of fractions**: $\\frac{2}{3}, \\frac{4}{9}, \\frac{8}{15}$.`;
      const ans = `\\frac{2}{45}`;
      const explanation = `
### Step-by-Step Derivation:
1. **Formula for HCF of Fractions:**
   $$\\text{HCF of Fractions} = \\frac{\\text{HCF of Numerators}}{\\text{LCM of Denominators}}$$
2. **Numerators:** $\\text{HCF}(2, 4, 8) = 2$
3. **Denominators:** $\\text{LCM}(3, 9, 15) = 45$
4. **Result:**
   $$\\text{HCF} = \\mathbf{\\frac{2}{45}}$$
`;
      const options = [
        { id: 'A', text: '$\\frac{2}{45}$', isCorrect: true },
        { id: 'B', text: '$\\frac{8}{3}$', isCorrect: false },
        { id: 'C', text: '$\\frac{4}{15}$', isCorrect: false },
        { id: 'D', text: '$\\frac{2}{15}$', isCorrect: false }
      ];
      return {
        title: `HCF of Fractions`,
        chapter: 'HCF and LCM',
        difficulty: 'Hard',
        question: qText,
        options,
        correctAnswer: 'A',
        explanation,
        keyFormulas: ['\\text{HCF of Fractions} = \\frac{\\text{HCF of Numerators}}{\\text{LCM of Denominators}}']
      };
    }
  }

  // =========================================================================
  // 6. Coordinate Geometry
  // =========================================================================
  static genCoordinateGeometry(difficulty = 'Medium') {
    if (difficulty === 'Medium') {
      const x1 = this.randInt(-4, 4), y1 = this.randInt(-4, 4);
      const dx = this.randChoice([3, 4, 6, 8]);
      const dy = this.randChoice([4, 3, 8, 6]);
      const x2 = x1 + dx, y2 = y1 + dy;
      const dist = Math.round(Math.sqrt(dx * dx + dy * dy));

      const qText = `Find the distance between the points $P(${x1}, ${y1})$ and $Q(${x2}, ${y2})$.`;
      const explanation = `
### Step-by-Step Derivation:
1. **Distance Formula:**
   $$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$
2. **Substitute Coordinates:**
   $$d = \\sqrt{(${x2} - (${x1}))^2 + (${y2} - (${y1}))^2} = \\sqrt{(${dx})^2 + (${dy})^2}$$
3. **Calculate:**
   $$d = \\sqrt{${dx * dx} + ${dy * dy}} = \\sqrt{${dx * dx + dy * dy}} = \\mathbf{${dist}}$$
`;
      const options = this.formatOptions(dist, () => this.randInt(dist - 4, dist + 4));
      return {
        title: `Distance between Points`,
        chapter: 'Coordinate Geometry',
        difficulty: 'Medium',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}']
      };
    } else {
      // Area of triangle
      const x1 = 0, y1 = 0;
      const x2 = this.randInt(2, 6), y2 = 0;
      const x3 = this.randInt(1, 4), y3 = this.randInt(3, 7);
      const area = (0.5 * x2 * y3);

      const qText = `Find the area of the triangle formed by the vertices $A(${x1}, ${y1})$, $B(${x2}, ${y2})$, and $C(${x3}, ${y3})$.`;
      const explanation = `
### Step-by-Step Derivation:
1. **Area of Triangle Formula:**
   $$\\text{Area} = \\frac{1}{2} |x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)|$$
2. **Substitute:**
   $$\\text{Area} = \\frac{1}{2} |0 + ${x2}(${y3} - 0) + ${x3}(0 - 0)| = \\frac{1}{2} |${x2 * y3}| = \\mathbf{${area}} \\text{ sq. units}$$
`;
      const options = this.formatOptions(area, () => this.randInt(area - 5, area + 5));
      return {
        title: `Area of Triangle in Coordinate Plane`,
        chapter: 'Coordinate Geometry',
        difficulty: 'Hard',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['\\text{Area} = \\frac{1}{2}|x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)|']
      };
    }
  }

  // =========================================================================
  // 7. Standard Deviation & Variance
  // =========================================================================
  static genStandardDeviation(difficulty = 'Medium') {
    const variance = this.randChoice([16, 25, 36, 49, 64, 81, 100, 144]);
    const sd = Math.sqrt(variance);

    if (difficulty === 'Medium') {
      const qText = `If the variance of a data set is $${variance}$, what is the **standard deviation**?`;
      const explanation = `
### Step-by-Step Derivation:
1. **Relation between SD and Variance:**
   $$\\text{Standard Deviation } (\\sigma) = \\sqrt{\\text{Variance}}$$
2. **Calculate:**
   $$\\sigma = \\sqrt{${variance}} = \\mathbf{${sd}}$$
`;
      const options = this.formatOptions(sd, () => this.randInt(sd - 4, sd + 4));
      return {
        title: `Standard Deviation from Variance`,
        chapter: 'Standard Deviation',
        difficulty: 'Medium',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['\\sigma = \\sqrt{\\text{Variance}}']
      };
    } else {
      const mean = this.randChoice([40, 50, 60, 80]);
      const cv = Math.round((sd / mean) * 100);

      const qText = `A distribution has a **Mean** of $${mean}$ and **Standard Deviation** of $${sd}$. Find its **Coefficient of Variation (CV)**.`;
      const explanation = `
### Step-by-Step Derivation:
1. **Formula for Coefficient of Variation:**
   $$\\text{CV} = \\frac{\\sigma}{\\bar{x}} \\times 100\\%$$
2. **Substitute Values:**
   $$\\text{CV} = \\frac{${sd}}{${mean}} \\times 100 = \\mathbf{${cv}\\%}$$
`;
      const options = this.formatOptions(cv, () => this.randInt(cv - 10, cv + 10)).map(o => ({ ...o, text: `${o.text}%` }));
      return {
        title: `Coefficient of Variation`,
        chapter: 'Standard Deviation',
        difficulty: 'Hard',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['\\text{CV} = \\frac{\\sigma}{\\bar{x}} \\times 100\\%']
      };
    }
  }

  // =========================================================================
  // 8. Polygons
  // =========================================================================
  static genPolygons(difficulty = 'Medium') {
    const n = this.randInt(5, 12);
    const names = { 5: 'Pentagon', 6: 'Hexagon', 7: 'Heptagon', 8: 'Octagon', 9: 'Nonagon', 10: 'Decagon', 12: 'Dodecagon' };
    const polyName = names[n] || `${n}-sided polygon`;

    const diagonals = (n * (n - 3)) / 2;
    const sumInt = (n - 2) * 180;
    const eachInt = ((n - 2) * 180) / n;

    if (difficulty === 'Medium') {
      const qText = `Find the **number of diagonals** in a regular **${polyName}** ($n = ${n}$).`;
      const explanation = `
### Step-by-Step Derivation:
1. **Formula for Number of Diagonals:**
   $$D = \\frac{n(n - 3)}{2}$$
2. **Substitute $n = ${n}$:**
   $$D = \\frac{${n}(${n} - 3)}{2} = \\frac{${n} \\times ${n - 3}}{2} = \\frac{${n * (n - 3)}}{2} = \\mathbf{${diagonals}}$$
`;
      const options = this.formatOptions(diagonals, () => this.randInt(diagonals - 8, diagonals + 8));
      return {
        title: `Diagonals in ${polyName}`,
        chapter: 'Polygons',
        difficulty: 'Medium',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['D = \\frac{n(n - 3)}{2}']
      };
    } else {
      const qText = `Find the **sum of all interior angles** of a **${polyName}** ($n = ${n}$).`;
      const explanation = `
### Step-by-Step Derivation:
1. **Sum of Interior Angles Formula:**
   $$S_{\\text{int}} = (n - 2) \\times 180^\\circ$$
2. **Calculation for $n = ${n}$:**
   $$S_{\\text{int}} = (${n} - 2) \\times 180^\\circ = ${n - 2} \\times 180^\\circ = \\mathbf{${sumInt}^\\circ}$$
`;
      const options = this.formatOptions(sumInt, () => this.randInt(sumInt - 360, sumInt + 360)).map(o => ({ ...o, text: `${o.text}^\\circ` }));
      return {
        title: `Sum of Interior Angles of ${polyName}`,
        chapter: 'Polygons',
        difficulty: 'Hard',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['S_{\\text{int}} = (n - 2) \\times 180^\\circ']
      };
    }
  }

  // =========================================================================
  // 9. Bar System (Recurring Decimals)
  // =========================================================================
  static genBarSystem(difficulty = 'Medium') {
    if (difficulty === 'Medium') {
      const num = this.randInt(12, 89);
      const qText = `Express the recurring decimal $0.\\overline{${num}}$ as a simplified fraction.`;
      const explanation = `
### Step-by-Step Derivation:
1. **Pure Recurring Decimal Rule:**
   - Put the repeating digits in the numerator.
   - Put as many 9s in the denominator as there are repeating digits.
2. **Conversion:**
   $$0.\\overline{${num}} = \\mathbf{\\frac{${num}}{99}}$$
`;
      const options = [
        { id: 'A', text: `$\\frac{${num}}{99}$`, isCorrect: true },
        { id: 'B', text: `$\\frac{${num}}{100}$`, isCorrect: false },
        { id: 'C', text: `$\\frac{${num}}{90}$`, isCorrect: false },
        { id: 'D', text: `$\\frac{${num - 1}}{99}$`, isCorrect: false }
      ];
      return {
        title: `Pure Recurring Decimal to Fraction`,
        chapter: 'Bar System',
        difficulty: 'Medium',
        question: qText,
        options,
        correctAnswer: 'A',
        explanation,
        keyFormulas: ['0.\\overline{ab} = \\frac{ab}{99}']
      };
    } else {
      const a = this.randInt(2, 7);
      const b = this.randInt(1, 9);
      const num = a * 10 + b;
      const numerator = num - a;
      const qText = `Convert the mixed recurring decimal $0.${a}\\bar{${b}}$ into a fraction.`;
      const explanation = `
### Step-by-Step Derivation:
1. **Mixed Recurring Formula:**
   $$0.a\\bar{b} = \\frac{ab - a}{90}$$
2. **Substitute $a = ${a}, b = ${b}$ ($ab = ${num}$):**
   $$0.${a}\\bar{${b}} = \\frac{${num} - ${a}}{90} = \\mathbf{\\frac{${numerator}}{90}}$$
`;
      const options = [
        { id: 'A', text: `$\\frac{${numerator}}{90}$`, isCorrect: true },
        { id: 'B', text: `$\\frac{${num}}{90}$`, isCorrect: false },
        { id: 'C', text: `$\\frac{${numerator}}{99}$`, isCorrect: false },
        { id: 'D', text: `$\\frac{${num}}{99}$`, isCorrect: false }
      ];
      return {
        title: `Mixed Recurring Decimal Conversion`,
        chapter: 'Bar System',
        difficulty: 'Hard',
        question: qText,
        options,
        correctAnswer: 'A',
        explanation,
        keyFormulas: ['0.a\\bar{b} = \\frac{ab - a}{90}']
      };
    }
  }

  // =========================================================================
  // 10. Mean, Median & Mode
  // =========================================================================
  static genMeanMedianMode(difficulty = 'Medium') {
    const mean = this.randInt(20, 60);
    const median = this.randInt(22, 62);
    const mode = 3 * median - 2 * mean;

    const qText = `In a moderately skewed distribution, the **Mean** is $${mean}$ and the **Median** is $${median}$. Find the **Mode** using Karl Pearson's empirical formula.`;
    const explanation = `
### Step-by-Step Derivation:
1. **Empirical Relationship Formula:**
   $$\\text{Mode} = 3 \\times \\text{Median} - 2 \\times \\text{Mean}$$
2. **Substitute Given Values:**
   $$\\text{Mode} = 3(${median}) - 2(${mean})$$
   $$\\text{Mode} = ${3 * median} - ${2 * mean} = \\mathbf{${mode}}$$
`;
    const options = this.formatOptions(mode, () => this.randInt(mode - 8, mode + 8));
    return {
      title: `Empirical Mode Calculation`,
      chapter: 'Mode, Mean, Median',
      difficulty,
      question: qText,
      options,
      correctAnswer: options.find((o) => o.isCorrect).id,
      explanation,
      keyFormulas: ['\\text{Mode} = 3\\text{Median} - 2\\text{Mean}']
    };
  }

  // =========================================================================
  // 11. Quadratic Equations
  // =========================================================================
  static genQuadratic(difficulty = 'Medium') {
    const r1 = this.randInt(-5, 6);
    let r2 = this.randInt(1, 7);
    while (r1 === r2) r2 = this.randInt(1, 8);

    const b = -(r1 + r2);
    const c = r1 * r2;
    const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`;
    const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;

    const qText = `Find the sum and product of the roots for the quadratic equation: $$x^2 ${bStr} ${cStr} = 0$$`;
    const explanation = `
### Step-by-Step Derivation:
1. **General Form:** $ax^2 + bx + c = 0$ with $a = 1, b = ${b}, c = ${c}$.
2. **Sum of Roots:**
   $$\\alpha + \\beta = -\\frac{b}{a} = -(${b}) = \\mathbf{${r1 + r2}}$$
3. **Product of Roots:**
   $$\\alpha \\beta = \\frac{c}{a} = \\mathbf{${c}}$$
`;
    const ansText = `Sum = ${r1 + r2}, Product = ${c}`;
    const options = [
      { id: 'A', text: ansText, isCorrect: true },
      { id: 'B', text: `Sum = ${-(r1 + r2)}, Product = ${c}`, isCorrect: false },
      { id: 'C', text: `Sum = ${r1 + r2}, Product = ${-c}`, isCorrect: false },
      { id: 'D', text: `Sum = ${-(r1 + r2)}, Product = ${-c}`, isCorrect: false }
    ];
    return {
      title: `Sum and Product of Quadratic Roots`,
      chapter: 'Quadratic Equation',
      difficulty,
      question: qText,
      options,
      correctAnswer: 'A',
      explanation,
      keyFormulas: ['\\alpha + \\beta = -b/a, \\quad \\alpha \\beta = c/a']
    };
  }

  // =========================================================================
  // 12. AP, GP, HP, AGP & Means (Comprehensive Patterns)
  // =========================================================================
  static genApGp(difficulty = 'Medium') {
    const types = ['standard_ap', 'infinite_gp', 'agp', 'inserted_am', 'ratio_of_sums', 'ap_theorem'];
    const chosen = this.randChoice(types);

    if (chosen === 'standard_ap') {
      const a = this.randInt(2, 9);
      const d = this.randInt(3, 7);
      const n = this.randInt(15, 30);
      const Tn = a + (n - 1) * d;

      const qText = `Find the $${n}^{\\text{th}}$ term of the Arithmetic Progression (AP): $${a}, ${a + d}, ${a + 2 * d}, \\dots$`;
      const explanation = `
### Step-by-Step Derivation:
1. **Identify First Term and Common Difference:**
   $$a = ${a}, \\quad d = (${a + d}) - ${a} = ${d}$$
2. **Formula for $n^{\\text{th}}$ Term:**
   $$T_n = a + (n - 1)d$$
3. **Substitute $n = ${n}$:**
   $$T_{${n}} = ${a} + (${n} - 1) \\times ${d} = ${a} + ${ (n - 1) * d } = \\mathbf{${Tn}}$$
`;
      const options = this.formatOptions(Tn, () => this.randInt(Tn - 15, Tn + 15));
      return {
        title: `$n^{\\text{th}}$ Term of AP`,
        chapter: 'Arithmetic & Geometric Progression',
        difficulty: 'Medium',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['T_n = a + (n - 1)d']
      };
    } else if (chosen === 'infinite_gp') {
      const a = this.randInt(6, 24);
      const r_den = this.randChoice([2, 3, 4]);
      const sumInf = (a * r_den) / (r_den - 1);

      const qText = `Find the sum to infinity of the Geometric Progression (GP): $$${a} + ${a / r_den} + ${a / (r_den * r_den)} + \\dots \\infty$$`;
      const explanation = `
### Step-by-Step Derivation:
1. **Identify First Term ($a$) and Ratio ($r$):**
   $$a = ${a}, \\quad r = \\frac{1}{${r_den}} \\quad (|r| < 1)$$
2. **Formula for Sum to Infinity:**
   $$S_\\infty = \\frac{a}{1 - r}$$
3. **Calculation:**
   $$S_\\infty = \\frac{${a}}{1 - \\frac{1}{${r_den}}} = \\frac{${a}}{\\frac{${r_den - 1}}{${r_den}}} = \\frac{${a} \\times ${r_den}}{${r_den - 1}} = \\mathbf{${sumInf}}$$
`;
      const options = this.formatOptions(sumInf, () => this.randInt(sumInf - 8, sumInf + 8));
      return {
        title: `Sum to Infinity of GP`,
        chapter: 'Arithmetic & Geometric Progression',
        difficulty: 'Medium',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['S_\\infty = \\frac{a}{1 - r} \\quad (|r| < 1)']
      };
    } else if (chosen === 'agp') {
      // S_inf = a/(1-r) + dr/(1-r)^2 for series 1 + 2/3 + 3/9 + 4/27...
      const a = 1;
      const d = 1;
      const r_den = 2; // r = 1/2 -> S_inf = 1/(1/2) + (1/2)/(1/4) = 2 + 2 = 4
      const ans = 4;

      const qText = `Find the sum of the infinite Arithmetico-Geometric Progression (AGP): $$S = 1 + \\frac{2}{2} + \\frac{3}{4} + \\frac{4}{8} + \\frac{5}{16} + \\dots \\infty$$`;
      const explanation = `
### Step-by-Step Derivation:
1. **Identify AGP Parameters:**
   - AP terms: $1, 2, 3, 4, \\dots \\implies a = 1, d = 1$
   - GP common ratio: $r = \\frac{1}{2}$
2. **Formula for Infinite AGP Sum ($|r| < 1$):**
   $$S_\\infty = \\frac{a}{1 - r} + \\frac{d \\cdot r}{(1 - r)^2}$$
3. **Substitute Values:**
   $$S_\\infty = \\frac{1}{1 - \\frac{1}{2}} + \\frac{1 \\times \\frac{1}{2}}{\\left(1 - \\frac{1}{2}\\right)^2} = \\frac{1}{\\frac{1}{2}} + \\frac{\\frac{1}{2}}{\\frac{1}{4}} = 2 + 2 = \\mathbf{4}$$
`;
      const options = [
        { id: 'A', text: '$4$', isCorrect: true },
        { id: 'B', text: '$2$', isCorrect: false },
        { id: 'C', text: '$3$', isCorrect: false },
        { id: 'D', text: '$6$', isCorrect: false }
      ];
      return {
        title: `Sum of Infinite AGP`,
        chapter: 'Arithmetic & Geometric Progression',
        difficulty: 'Hard',
        question: qText,
        options,
        correctAnswer: 'A',
        explanation,
        keyFormulas: ['S_\\infty = \\frac{a}{1 - r} + \\frac{d \\cdot r}{(1 - r)^2}']
      };
    } else if (chosen === 'inserted_am') {
      const a = this.randInt(5, 15);
      const b = this.randInt(25, 45);
      const n = this.randInt(6, 12);
      const sumAMs = n * ((a + b) / 2);

      const qText = `If $${n}$ Arithmetic Means ($A_1, A_2, \\dots, A_{${n}}$) are inserted between $${a}$ and $${b}$, find the **sum of all inserted means** $\\sum_{k=1}^{${n}} A_k$.`;
      const explanation = `
### Step-by-Step Derivation:
1. **Theorem for Sum of $n$ Inserted AMs:**
   $$\\sum_{k=1}^n A_k = n \\times \\text{AM}(a, b) = n \\times \\left(\\frac{a + b}{2}\\right)$$
2. **Substitute $a = ${a}, b = ${b}, n = ${n}$:**
   $$\\text{Sum} = ${n} \\times \\left(\\frac{${a} + ${b}}{2}\\right) = ${n} \\times \\left(\\frac{${a + b}}{2}\\right) = \\mathbf{${sumAMs}}$$
`;
      const options = this.formatOptions(sumAMs, () => this.randInt(sumAMs - 20, sumAMs + 20));
      return {
        title: `Sum of Inserted Arithmetic Means`,
        chapter: 'Arithmetic & Geometric Progression',
        difficulty: 'Medium',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['\\sum_{k=1}^n A_k = n \\left(\\frac{a + b}{2}\\right)']
      };
    } else if (chosen === 'ratio_of_sums') {
      const n = this.randInt(5, 12);
      // S_n / S'_n = (7n + 1) / (4n + 27). Find T_n / T'_n
      // Substitute n -> 2n - 1
      const num = 7 * (2 * n - 1) + 1;
      const den = 4 * (2 * n - 1) + 27;

      const qText = `The ratio of the sums of $n$ terms of two Arithmetic Progressions is $\\frac{7n + 1}{4n + 27}$. Find the ratio of their $${n}^{\\text{th}}$ terms.`;
      const explanation = `
### Step-by-Step Derivation:
1. **Transformation Rule:**
   - If $\\frac{S_n}{S'_n} = \\frac{f(n)}{g(n)}$, then the ratio of their $n^{\\text{th}}$ terms is obtained by replacing $n$ with $(2n - 1)$:
   $$\\frac{T_n}{T'_n} = \\frac{f(2n - 1)}{g(2n - 1)}$$
2. **Substitute $n = ${n} \\implies (2n - 1) = ${2 * n - 1}$:**
   $$\\frac{T_{${n}}}{T'_{${n}}} = \\frac{7(${2 * n - 1}) + 1}{4(${2 * n - 1}) + 27} = \\frac{${7 * (2 * n - 1)} + 1}{${4 * (2 * n - 1)} + 27} = \\mathbf{\\frac{${num}}{${den}}}$$
`;
      const ansStr = `\\frac{${num}}{${den}}`;
      const options = [
        { id: 'A', text: `$${ansStr}$`, isCorrect: true },
        { id: 'B', text: `$\\frac{${num + 4}}{${den - 2}}$`, isCorrect: false },
        { id: 'C', text: `$\\frac{${7 * n + 1}}{${4 * n + 27}}$`, isCorrect: false },
        { id: 'D', text: `$\\frac{${num - 6}}{${den + 4}}$`, isCorrect: false }
      ];
      return {
        title: `Ratio of Sums to Ratio of Terms`,
        chapter: 'Arithmetic & Geometric Progression',
        difficulty: 'Hard',
        question: qText,
        options,
        correctAnswer: 'A',
        explanation,
        keyFormulas: ['\\frac{S_n}{S\'_n} = \\frac{f(n)}{g(n)} \\implies \\frac{T_n}{T\'_n} = \\frac{f(2n - 1)}{g(2n - 1)}']
      };
    } else {
      // AP Theorem
      const p = this.randInt(5, 12);
      const q = this.randInt(13, 22);

      const qText = `In an Arithmetic Progression, if the $${p}^{\\text{th}}$ term is $${q}$ and the $${q}^{\\text{th}}$ term is $${p}$, find the $(${p + q})^{\\text{th}}$ term.`;
      const explanation = `
### Step-by-Step Derivation:
1. **AP Theorem:**
   - If in an AP, $T_p = q$ and $T_q = p$, then:
   $$T_n = p + q - n$$
   $$T_{p+q} = p + q - (p + q) = \\mathbf{0}$$
2. **Proof:**
   - $a + (p-1)d = q$
   - $a + (q-1)d = p$
   - Subtracting: $(p - q)d = q - p = -(p - q) \\implies d = -1$
   - $a = p + q - 1$
   - $T_{p+q} = a + (p + q - 1)d = (p + q - 1) + (p + q - 1)(-1) = \\mathbf{0}$
`;
      const options = [
        { id: 'A', text: '$0$', isCorrect: true },
        { id: 'B', text: `$${p + q}$`, isCorrect: false },
        { id: 'C', text: '$1$', isCorrect: false },
        { id: 'D', text: `$${p * q}$`, isCorrect: false }
      ];
      return {
        title: `AP Reciprocal Term Theorem`,
        chapter: 'Arithmetic & Geometric Progression',
        difficulty: 'Medium',
        question: qText,
        options,
        correctAnswer: 'A',
        explanation,
        keyFormulas: ['T_p = q, T_q = p \\implies T_{p+q} = 0']
      };
    }
  }

  // =========================================================================
  // 13. Probability
  // =========================================================================
  static genProbability(difficulty = 'Medium') {
    const qText = `Two unbiased dice are rolled simultaneously. What is the probability of getting a **sum equal to 7**?`;
    const ans = `\\frac{1}{6}`;
    const explanation = `
### Step-by-Step Derivation:
1. **Total Possible Outcomes:**
   $$n(S) = 6 \\times 6 = 36$$
2. **Favourable Outcomes for Sum = 7:**
   $$E = \\{(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)\\} \\implies n(E) = 6$$
3. **Probability:**
   $$P(E) = \\frac{n(E)}{n(S)} = \\frac{6}{36} = \\mathbf{\\frac{1}{6}}$$
`;
    const options = [
      { id: 'A', text: '$\\frac{1}{6}$', isCorrect: true },
      { id: 'B', text: '$\\frac{7}{36}$', isCorrect: false },
      { id: 'C', text: '$\\frac{5}{36}$', isCorrect: false },
      { id: 'D', text: '$\\frac{1}{12}$', isCorrect: false }
    ];
    return {
      title: `Probability of Sum on Two Dice`,
      chapter: 'Probability',
      difficulty,
      question: qText,
      options,
      correctAnswer: 'A',
      explanation,
      keyFormulas: ['P(A) = \\frac{n(A)}{n(S)}']
    };
  }

  // =========================================================================
  // 14. Algebra (Comprehensive Exam Patterns)
  // =========================================================================
  static genAlgebra(difficulty = 'Medium') {
    const subTypes = ['power_chain', 'special_value', 'cubic_ap', 'sum_of_squares', 'quartic'];
    const chosenType = this.randChoice(subTypes);

    if (chosenType === 'power_chain') {
      const k = this.randInt(3, 6);
      const sq = k * k - 2;
      const cube = k * k * k - 3 * k;
      const power5 = sq * cube - k;

      if (difficulty === 'Medium') {
        const qText = `If $x + \\frac{1}{x} = ${k}$, find the value of $x^3 + \\frac{1}{x^3}$.`;
        const explanation = `
### Step-by-Step Derivation:
1. **Cubic Identity Formula:**
   $$x^3 + \\frac{1}{x^3} = \\left(x + \\frac{1}{x}\\right)^3 - 3\\left(x + \\frac{1}{x}\\right) = k^3 - 3k$$
2. **Substitute $k = ${k}$:**
   $$x^3 + \\frac{1}{x^3} = ${k}^3 - 3(${k}) = ${k * k * k} - ${3 * k} = \\mathbf{${cube}}$$
`;
        const options = this.formatOptions(cube, () => this.randInt(cube - 15, cube + 15));
        return {
          title: `Algebra: $x^3 + 1/x^3$ Value`,
          chapter: 'Algebra',
          difficulty: 'Medium',
          question: qText,
          options,
          correctAnswer: options.find((o) => o.isCorrect).id,
          explanation,
          keyFormulas: ['x^3 + \\frac{1}{x^3} = k^3 - 3k']
        };
      } else {
        const qText = `If $x + \\frac{1}{x} = ${k}$, find the value of $x^5 + \\frac{1}{x^5}$.`;
        const explanation = `
### Step-by-Step Derivation:
1. **Power 5 Formula:**
   $$x^5 + \\frac{1}{x^5} = \\left(x^2 + \\frac{1}{x^2}\\right)\\left(x^3 + \\frac{1}{x^3}\\right) - \\left(x + \\frac{1}{x}\\right)$$
2. **Step 1: Compute $x^2 + \\frac{1}{x^2}$:**
   $$x^2 + \\frac{1}{x^2} = k^2 - 2 = ${k}^2 - 2 = ${sq}$$
3. **Step 2: Compute $x^3 + \\frac{1}{x^3}$:**
   $$x^3 + \\frac{1}{x^3} = k^3 - 3k = ${k}^3 - 3(${k}) = ${cube}$$
4. **Step 3: Combine:**
   $$x^5 + \\frac{1}{x^5} = (${sq} \\times ${cube}) - ${k} = ${sq * cube} - ${k} = \\mathbf{${power5}}$$
`;
        const options = this.formatOptions(power5, () => this.randInt(power5 - 35, power5 + 35));
        return {
          title: `Algebra: $x^5 + 1/x^5$ Value`,
          chapter: 'Algebra',
          difficulty: 'Hard',
          question: qText,
          options,
          correctAnswer: options.find((o) => o.isCorrect).id,
          explanation,
          keyFormulas: ['x^5 + \\frac{1}{x^5} = \\left(x^2 + \\frac{1}{x^2}\\right)\\left(x^3 + \\frac{1}{x^3}\\right) - \\left(x + \\frac{1}{x}\\right)']
        };
      }
    } else if (chosenType === 'special_value') {
      const qText = `If $x + \\frac{1}{x} = \\sqrt{3}$, find the value of: $$x^{18} + x^{12} + x^6 + 1$$`;
      const explanation = `
### Step-by-Step Derivation:
1. **Special Property for $x + \\frac{1}{x} = \\sqrt{3}$:**
   $$\\left(x + \\frac{1}{x}\\right)^3 = x^3 + \\frac{1}{x^3} + 3\\left(x + \\frac{1}{x}\\right)$$
   $$(\\sqrt{3})^3 = x^3 + \\frac{1}{x^3} + 3\\sqrt{3} \\implies 3\\sqrt{3} = x^3 + \\frac{1}{x^3} + 3\\sqrt{3}$$
   $$x^3 + \\frac{1}{x^3} = 0 \\implies \\frac{x^6 + 1}{x^3} = 0 \\implies \\mathbf{x^6 = -1} \\quad (x^6 + 1 = 0)$$
2. **Substitute $x^6 = -1$ into Expression:**
   $$x^{18} + x^{12} + x^6 + 1 = (x^6)^3 + (x^6)^2 + (x^6)^1 + 1$$
   $$= (-1)^3 + (-1)^2 + (-1) + 1 = -1 + 1 - 1 + 1 = \\mathbf{0}$$
`;
      const options = [
        { id: 'A', text: '$0$', isCorrect: true },
        { id: 'B', text: '$1$', isCorrect: false },
        { id: 'C', text: '$\\sqrt{3}$', isCorrect: false },
        { id: 'D', text: '$-1$', isCorrect: false }
      ];
      return {
        title: `Special Value: $x + 1/x = \\sqrt{3}$`,
        chapter: 'Algebra',
        difficulty: 'Hard',
        question: qText,
        options,
        correctAnswer: 'A',
        explanation,
        keyFormulas: ['x + \\frac{1}{x} = \\sqrt{3} \\implies x^6 = -1 \\implies x^6 + 1 = 0']
      };
    } else if (chosenType === 'cubic_ap') {
      const b = this.randInt(95, 105);
      const d = this.randInt(1, 3);
      const a = b - d;
      const c = b + d;
      const ans = 9 * b * d * d;

      const qText = `If $a = ${a}, b = ${b}, c = ${c}$, find the value of: $$a^3 + b^3 + c^3 - 3abc$$`;
      const explanation = `
### Step-by-Step Derivation:
1. **Identify Arithmetic Progression:**
   - $a = ${a}, b = ${b}, c = ${c}$ form an AP with middle term $b = ${b}$ and common difference $d = ${d}$.
2. **AP Shortcut Formula for $a^3 + b^3 + c^3 - 3abc$:**
   $$a^3 + b^3 + c^3 - 3abc = 9 \\cdot b \\cdot d^2$$
3. **Calculation:**
   $$\\text{Value} = 9 \\times ${b} \\times (${d})^2 = 9 \\times ${b} \\times ${d * d} = \\mathbf{${ans}}$$
`;
      const options = this.formatOptions(ans, () => this.randInt(ans - 100, ans + 100));
      return {
        title: `Cubic Identity in AP ($a^3 + b^3 + c^3 - 3abc$)`,
        chapter: 'Algebra',
        difficulty: 'Hard',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['a^3 + b^3 + c^3 - 3abc = 9 b d^2 \\text{ (when } a, b, c \\text{ are in AP)}']
      };
    } else {
      // Sum of squares = 0
      const aVal = this.randInt(2, 5);
      const bVal = this.randInt(3, 7);
      const cVal = this.randInt(1, 6);
      const sumAns = aVal + bVal + cVal;

      const qText = `If $(x - ${aVal})^2 + (y - ${bVal})^2 + (z - ${cVal})^2 = 0$, find the value of $x + y + z$.`;
      const explanation = `
### Step-by-Step Derivation:
1. **Sum of Squares Property:**
   - The square of a real number is always non-negative: $(x - a)^2 \\ge 0$.
   - A sum of non-negative terms equals $0$ if and only if each individual term is $0$.
2. **Set each term to zero:**
   $$(x - ${aVal})^2 = 0 \\implies x = ${aVal}$$
   $$(y - ${bVal})^2 = 0 \\implies y = ${bVal}$$
   $$(z - ${cVal})^2 = 0 \\implies z = ${cVal}$$
3. **Sum:**
   $$x + y + z = ${aVal} + ${bVal} + ${cVal} = \\mathbf{${sumAns}}$$
`;
      const options = this.formatOptions(sumAns, () => this.randInt(sumAns - 5, sumAns + 5));
      return {
        title: `Sum of Squares Zero Property`,
        chapter: 'Algebra',
        difficulty: 'Medium',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['(x-a)^2 + (y-b)^2 + (z-c)^2 = 0 \\implies x=a, y=b, z=c']
      };
    }
  }

  // =========================================================================
  // 15. Series & Special Sums
  // =========================================================================
  static genSeriesSums(difficulty = 'Medium') {
    const n = this.randInt(10, 25);
    const sumN = (n * (n + 1)) / 2;
    const sumSq = (n * (n + 1) * (2 * n + 1)) / 6;

    if (difficulty === 'Medium') {
      const qText = `Find the sum of the first $${n}$ natural numbers: $$1 + 2 + 3 + \\dots + ${n}$$`;
      const explanation = `
### Step-by-Step Derivation:
1. **Sum Formula:**
   $$\\sum_{k=1}^n k = \\frac{n(n + 1)}{2}$$
2. **Calculation for $n = ${n}$:**
   $$\\text{Sum} = \\frac{${n}(${n} + 1)}{2} = \\frac{${n} \\times ${n + 1}}{2} = \\mathbf{${sumN}}$$
`;
      const options = this.formatOptions(sumN, () => this.randInt(sumN - 15, sumN + 15));
      return {
        title: `Sum of First ${n} Natural Numbers`,
        chapter: 'Series & Special Sums',
        difficulty: 'Medium',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['\\sum_{k=1}^n k = \\frac{n(n+1)}{2}']
      };
    } else {
      const qText = `Find the sum of squares of the first $${n}$ natural numbers: $$1^2 + 2^2 + 3^2 + \\dots + ${n}^2$$`;
      const explanation = `
### Step-by-Step Derivation:
1. **Sum of Squares Formula:**
   $$\\sum_{k=1}^n k^2 = \\frac{n(n + 1)(2n + 1)}{6}$$
2. **Calculation for $n = ${n}$:**
   $$\\text{Sum} = \\frac{${n}(${n + 1})(${2 * n + 1})}{6} = \\mathbf{${sumSq}}$$
`;
      const options = this.formatOptions(sumSq, () => this.randInt(sumSq - 40, sumSq + 40));
      return {
        title: `Sum of Squares of First ${n} Numbers`,
        chapter: 'Series & Special Sums',
        difficulty: 'Hard',
        question: qText,
        options,
        correctAnswer: options.find((o) => o.isCorrect).id,
        explanation,
        keyFormulas: ['\\sum k^2 = \\frac{n(n+1)(2n+1)}{6}']
      };
    }
  }

  // =========================================================================
  // 16. Surds & Indices
  // =========================================================================
  static genSurdsIndices(difficulty = 'Medium') {
    const k = this.randInt(3, 9);
    const prod = k * (k + 1);

    const qText = `Evaluate the infinite continuous surd: $$\\sqrt{${prod} + \\sqrt{${prod} + \\sqrt{${prod} + \\dots \\infty}}}$$`;
    const ans = k + 1;
    const explanation = `
### Step-by-Step Derivation:
1. **Let the Expression be $y$:**
   $$y = \\sqrt{${prod} + y}$$
2. **Square Both Sides:**
   $$y^2 = ${prod} + y \\implies y^2 - y - ${prod} = 0$$
3. **Factor the Quadratic:**
   $$(y - ${k + 1})(y + ${k}) = 0$$
4. **Since $y > 0$:**
   $$y = \\mathbf{${ans}}$$
`;
    const options = this.formatOptions(ans, () => this.randInt(ans - 3, ans + 3));
    return {
      title: `Continuous Infinite Surd`,
      chapter: 'Surds and Indices',
      difficulty,
      question: qText,
      options,
      correctAnswer: options.find((o) => o.isCorrect).id,
      explanation,
      keyFormulas: ['\\sqrt{k(k+1) + \\sqrt{k(k+1) + \\dots}} = k + 1']
    };
  }

  // =========================================================================
  // 17. Number System Properties
  // =========================================================================
  static genNumberSystemProperties(difficulty = 'Medium') {
    const questionsPool = [
      {
        q: 'Which of the following is the **smallest perfect number**?',
        ans: '6',
        expl: 'A perfect number equals the sum of its proper divisors. For $6$: $1 + 2 + 3 = 6$.',
        opts: ['6', '12', '28', '4']
      },
      {
        q: 'What is the $10^{\\text{th}}$ **triangular number**?',
        ans: '55',
        expl: 'Formula for $n^{\\text{th}}$ triangular number is $T_n = \\frac{n(n+1)}{2}$. For $n=10$: $T_{10} = \\frac{10 \\times 11}{2} = 55$.',
        opts: ['55', '50', '45', '60']
      },
      {
        q: 'Which of the following pairs is a **Twin Prime** pair?',
        ans: '(17, 19)',
        expl: 'Twin primes are pairs of prime numbers that have a difference of 2. $17$ and $19$ are both prime and $19 - 17 = 2$.',
        opts: ['(17, 19)', '(13, 17)', '(7, 11)', '(21, 23)']
      }
    ];

    const item = this.randChoice(questionsPool);
    const shuffled = this.shuffle(item.opts.map((opt) => ({ text: opt, isCorrect: opt === item.ans })));
    const options = shuffled.map((o, idx) => ({ id: String.fromCharCode(65 + idx), text: o.text, isCorrect: o.isCorrect }));

    return {
      title: `Number System Properties`,
      chapter: 'Number System',
      difficulty,
      question: item.q,
      options,
      correctAnswer: options.find((o) => o.isCorrect).id,
      explanation: `### Step-by-Step Explanation:\n${item.expl}`,
      keyFormulas: ['T_n = \\frac{n(n+1)}{2}', '\\text{Twin Primes: } |p_1 - p_2| = 2']
    };
  }

  // =========================================================================
  // 18. Binary & Base Conversions
  // =========================================================================
  static genBinaryBases(difficulty = 'Medium') {
    const decimal = this.randInt(18, 95);
    const binary = decimal.toString(2);

    const qText = `Convert the decimal number $(${decimal})_{10}$ into its **binary** equivalent.`;
    const explanation = `
### Step-by-Step Derivation:
1. **Successive Division by 2:**
   - Divide $${decimal}$ repeatedly by 2 and note the remainders from bottom to top:
   $$\\mathbf{(${decimal})_{10} = (${binary})_2}$$
`;
    const options = [
      { id: 'A', text: `$( ${binary} )_2$`, isCorrect: true },
      { id: 'B', text: `$( ${(decimal + 1).toString(2)} )_2$`, isCorrect: false },
      { id: 'C', text: `$( ${(decimal - 1).toString(2)} )_2$`, isCorrect: false },
      { id: 'D', text: `$( ${binary.split('').reverse().join('')} )_2$`, isCorrect: false }
    ];
    const shuffled = this.shuffle(options).map((o, idx) => ({ ...o, id: String.fromCharCode(65 + idx) }));
    return {
      title: `Decimal to Binary Conversion`,
      chapter: 'Binary & Bases',
      difficulty,
      question: qText,
      options: shuffled,
      correctAnswer: shuffled.find((o) => o.isCorrect).id,
      explanation,
      keyFormulas: ['(N)_{10} \\to (\\text{bits})_2 \\text{ by successive division by 2}']
    };
  }

  // =========================================================================
  // Master Dispatcher
  // =========================================================================
  static generateQuestion(topicKey = 'random', difficulty = 'Medium') {
    const topicsMap = {
      unit_digit: () => this.genUnitDigit(difficulty),
      number_of_factors: () => this.genFactors(difficulty),
      number_of_zeros: () => this.genNumberOfZeros(difficulty),
      remainder_theorem: () => this.genRemainderTheorem(difficulty),
      hcf_and_lcm: () => this.genHcfLcm(difficulty),
      coordinate_geometry: () => this.genCoordinateGeometry(difficulty),
      standard_deviation: () => this.genStandardDeviation(difficulty),
      polygons: () => this.genPolygons(difficulty),
      bar_system: () => this.genBarSystem(difficulty),
      mean_median_mode: () => this.genMeanMedianMode(difficulty),
      quadratic_equations: () => this.genQuadratic(difficulty),
      ap_and_gp: () => this.genApGp(difficulty),
      probability: () => this.genProbability(difficulty),
      algebra: () => this.genAlgebra(difficulty),
      series_sums: () => this.genSeriesSums(difficulty),
      surds_indices: () => this.genSurdsIndices(difficulty),
      number_system: () => this.genNumberSystemProperties(difficulty),
      binary_bases: () => this.genBinaryBases(difficulty)
    };

    let selectedKey = topicKey;
    if (selectedKey === 'random' || !topicsMap[selectedKey]) {
      const keys = Object.keys(topicsMap);
      selectedKey = this.randChoice(keys);
    }

    const genFn = topicsMap[selectedKey];
    const generated = genFn();

    return {
      id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: 'mcq_single',
      pyq: { isPYQ: false, exam: 'Quantitative Aptitude', year: new Date().getFullYear() },
      tags: ['Formula-Generated', generated.chapter],
      images: [],
      isBookmarked: false,
      status: 'unsolved',
      personalNotes: 'Generated dynamically from mathematical formula.',
      createdAt: new Date().toISOString(),
      ...generated
    };
  }
}

if (typeof window !== 'undefined') {
  window.ArithmeticGenerator = ArithmeticGenerator;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ArithmeticGenerator;
}

