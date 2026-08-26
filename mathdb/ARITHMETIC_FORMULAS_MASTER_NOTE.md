# Master Arithmetic & Quantitative Formula Handbook
*A Complete Reference with Formulas, Proofs, Short Tricks & Derivations for Competitive Exams*

---

## 1. Unit Digit (इकाई अंक)

### Key Rules & Cyclicity:
- **Cyclicity of 4**: The unit digits of $2, 3, 7, 8$ repeat in cycles of 4:
  - $2^1=2, 2^2=4, 2^3=8, 2^4=6 \implies \text{Cycle}: [2, 4, 8, 6]$
  - $3^1=3, 3^2=9, 3^3=7, 3^4=1 \implies \text{Cycle}: [3, 9, 7, 1]$
  - $7^1=7, 7^2=9, 7^3=3, 7^4=1 \implies \text{Cycle}: [7, 9, 3, 1]$
  - $8^1=8, 8^2=4, 8^3=2, 8^4=6 \implies \text{Cycle}: [8, 4, 2, 6]$
- **Cyclicity of 2**:
  - $4^{\text{odd}} = 4, \quad 4^{\text{even}} = 6$
  - $9^{\text{odd}} = 9, \quad 9^{\text{even}} = 1$
- **Invariable Digits**: $0^n=0, 1^n=1, 5^n=5, 6^n=6$ for all positive integers $n$.
- **Method for $a^b$**:
  1. Take the last digit of $a$.
  2. Compute $r = b \pmod 4$. If $r = 0$, take $r = 4$.
  3. Unit digit is the last digit of $a^r$.
- **Factorials**: For any $n \ge 5$, unit digit of $n! = 0$.

---

## 2. Number of Factors (गुणनखंडों की संख्या)

Let prime factorization of $N = p_1^{a} \cdot p_2^{b} \cdot p_3^{c} \cdots$:
1. **Total Number of Factors**:
   $$T(N) = (a+1)(b+1)(c+1)\cdots$$
2. **Number of Odd Factors**: Exclude power of 2 ($2^a$):
   $$T_{\text{odd}}(N) = (b+1)(c+1)\cdots$$
3. **Number of Even Factors**:
   $$T_{\text{even}}(N) = T(N) - T_{\text{odd}}(N) = a(b+1)(c+1)\cdots$$
4. **Sum of All Factors**:
   $$S(N) = \left(\frac{p_1^{a+1}-1}{p_1-1}\right) \left(\frac{p_2^{b+1}-1}{p_2-1}\right) \left(\frac{p_3^{c+1}-1}{p_3-1}\right)$$
5. **Product of Factors**:
   $$P(N) = N^{\frac{T(N)}{2}}$$
6. **Number of Prime Factors**:
   $$N_{\text{prime}} = a + b + c + \cdots$$

---

## 3. Number of Zeros (शून्यों की संख्या)

- Trailing zeros are produced by pairs of $(2 \times 5 = 10)$. Since 2s are usually abundant, number of zeros is determined by the highest power of 5.
- **Formula for $n!$ (Legendre's Formula)**:
  $$E_5(n!) = \left\lfloor\frac{n}{5}\right\rfloor + \left\lfloor\frac{n}{25}\right\rfloor + \left\lfloor\frac{n}{125}\right\rfloor + \cdots$$
- **Product of Multiples**: In $5 \times 10 \times 15 \times \dots \times 5k = 5^k \cdot k!$, count both $5^k$ and powers of 2.

---

## 4. Remainder Theorem (शेषफल प्रमेय)

1. **Basic Division Algorithm**:
   $$\text{Dividend} = \text{Divisor} \times \text{Quotient} + \text{Remainder} \quad (0 \le R < \text{Divisor})$$
2. **Euler's Totient Theorem**:
   If $\gcd(a, m) = 1$, then $a^{\phi(m)} \equiv 1 \pmod m$.
   Where $\phi(m) = m \prod_{p|m}\left(1 - \frac{1}{p}\right)$.
3. **Fermat's Little Theorem**:
   If $p$ is prime and $\gcd(a, p) = 1$:
   $$a^{p-1} \equiv 1 \pmod p$$
4. **Wilson's Theorem**:
   For any prime $p$:
   $$(p-1)! \equiv -1 \pmod p \quad \iff \quad (p-1)! + 1 \text{ is divisible by } p$$
5. **Binomial Remainder**:
   $$\frac{(ax + 1)^n}{a} \implies \text{Remainder} = 1$$
   $$\frac{(ax - 1)^n}{a} \implies \text{Remainder} = \begin{cases} 1 & \text{if } n \text{ is even} \\ a-1 & \text{if } n \text{ is odd} \end{cases}$$

---

## 5. HCF and LCM (म.स.प. एवं ल.स.प.)

1. **Fundamental Relation**:
   $$\text{First Number} \times \text{Second Number} = \text{HCF} \times \text{LCM}$$
2. **Fractions**:
   $$\text{HCF of Fractions} = \frac{\text{HCF of Numerators}}{\text{LCM of Denominators}}$$
   $$\text{LCM of Fractions} = \frac{\text{LCM of Numerators}}{\text{HCF of Denominators}}$$
3. **Remainder Cases for LCM**:
   - Smallest number which when divided by $x, y, z$ leaves remainder $r$ in each case:
     $$N = \text{LCM}(x, y, z) \cdot k + r$$
   - Leaves remainders $r_1, r_2, r_3$ where $(x - r_1) = (y - r_2) = (z - r_3) = d$:
     $$N = \text{LCM}(x, y, z) \cdot k - d$$

---

## 6. Coordinate Geometry (निर्देशांक ज्यामिति)

1. **Distance Formula**:
   $$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$
2. **Section Formula**:
   $$P(x, y) = \left(\frac{m x_2 + n x_1}{m + n}, \, \frac{m y_2 + n y_1}{m + n}\right)$$
3. **Area of Triangle with Vertices $(x_1, y_1), (x_2, y_2), (x_3, y_3)$**:
   $$\text{Area} = \frac{1}{2} |x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)|$$
4. **Slope of Line ($m$)**:
   $$m = \frac{y_2 - y_1}{x_2 - x_1} = \tan \theta = -\frac{A}{B} \quad (\text{for } Ax + By + C = 0)$$
5. **Perpendicular Distance from Point $(x_0, y_0)$ to Line $Ax + By + C = 0$**:
   $$d = \frac{|A x_0 + B y_0 + C|}{\sqrt{A^2 + B^2}}$$

---

## 7. Standard Deviation & Variance (मानक विचलन एवं प्रसरण)

1. **Mean ($\bar{x}$)**: $\bar{x} = \frac{\sum x_i}{N}$
2. **Variance ($\sigma^2$)**:
   $$\sigma^2 = \frac{\sum (x_i - \bar{x})^2}{N} = \frac{\sum x_i^2}{N} - (\bar{x})^2$$
3. **Standard Deviation ($\sigma$)**:
   $$\sigma = \sqrt{\text{Variance}} = \sqrt{\frac{\sum (x_i - \bar{x})^2}{N}}$$
4. **Coefficient of Variation (CV)**:
   $$\text{CV} = \frac{\sigma}{\bar{x}} \times 100\%$$
5. **Property**:
   - If each observation is multiplied by $k$, $\sigma_{\text{new}} = |k| \sigma$.
   - If a constant $k$ is added/subtracted, $\sigma$ remains unchanged.

---

## 8. Polygons (बहुभुज)

For any regular polygon with $n$ sides ($n \ge 3$):
1. **Sum of Interior Angles**:
   $$S_{\text{int}} = (n - 2) \times 180^\circ = (2n - 4) \times 90^\circ$$
2. **Each Interior Angle (Regular Polygon)**:
   $$\theta_{\text{int}} = \frac{(n - 2) \times 180^\circ}{n} = 180^\circ - \frac{360^\circ}{n}$$
3. **Sum of Exterior Angles**:
   $$S_{\text{ext}} = 360^\circ \quad (\text{for ANY convex polygon})$$
4. **Each Exterior Angle (Regular Polygon)**:
   $$\theta_{\text{ext}} = \frac{360^\circ}{n}$$
5. **Number of Diagonals**:
   $$D = \frac{n(n - 3)}{2}$$
6. **Number of Vertices = Number of Sides** $= n$.

---

## 9. Bar System & Recurring Decimals (बार प्रणाली)

1. **Pure Recurring Decimal**:
   $$0.\bar{a} = \frac{a}{9}, \quad 0.\overline{ab} = \frac{ab}{99}, \quad 0.\overline{abc} = \frac{abc}{999}$$
2. **Mixed Recurring Decimal**:
   $$0.a\bar{b} = \frac{ab - a}{90}$$
   $$0.ab\bar{c} = \frac{abc - ab}{900}$$
   $$0.a\overline{bc} = \frac{abc - a}{990}$$
3. **General Formula**:
   $$\text{Fraction} = \frac{\text{Complete Number} - \text{Non-repeating Part}}{9 \text{ for each repeating digit followed by } 0 \text{ for each non-repeating decimal digit}}$$

---

## 10. Mean, Median & Mode (माध्य, माध्यिका एवं बहुलक)

1. **Empirical Relationship**:
   $$\text{Mode} = 3 \times \text{Median} - 2 \times \text{Mean}$$
2. **Mean**: $\bar{x} = \frac{\sum f_i x_i}{\sum f_i}$
3. **Median for Ungrouped Data**:
   - If $n$ is odd: $\text{Median} = \left(\frac{n+1}{2}\right)^{\text{th}}\text{ term}$
   - If $n$ is even: $\text{Median} = \frac{\left(\frac{n}{2}\right)^{\text{th}} + \left(\frac{n}{2} + 1\right)^{\text{th}}}{2}$
4. **Range**: $\text{Range} = \text{Maximum Value} - \text{Minimum Value}$

---

## 11. Quadratic Equations (द्विघात समीकरण)

For $ax^2 + bx + c = 0$ ($a \ne 0$):
1. **Roots**:
   $$\alpha, \beta = \frac{-b \pm \sqrt{D}}{2a} \quad \text{where } D = b^2 - 4ac$$
2. **Sum & Product of Roots**:
   $$\alpha + \beta = -\frac{b}{a}, \quad \alpha \beta = \frac{c}{a}$$
3. **Nature of Roots**:
   - $D > 0$: Real and Distinct
   - $D = 0$: Real and Equal ($\alpha = \beta = -b/2a$)
   - $D < 0$: Complex conjugates
4. **Extreme Value of $f(x) = ax^2 + bx + c$**:
   $$\text{Extremum at } x = -\frac{b}{2a}, \quad f_{\text{ext}} = \frac{4ac - b^2}{4a} = -\frac{D}{4a}$$

---

## 12. Arithmetic, Geometric, Harmonic & AGP Progressions (समान्तर, गुणोत्तर, हरात्मक एवं AGP श्रेणी)

### A. Arithmetic Progression (AP):
1. **General Term ($n^{\text{th}}$ Term from Start):**
   $$T_n = a + (n - 1)d$$
2. **$n^{\text{th}}$ Term from End ($l$ is last term):**
   $$T'_n = l - (n - 1)d$$
3. **Equidistant Terms Property:**
   $$T_k + T'_{k} = a + l = \text{Constant for all } k$$
4. **Sum of First $n$ Terms ($S_n$):**
   $$S_n = \frac{n}{2}\left[2a + (n - 1)d\right] = \frac{n}{2}(a + l) = n \times T_{\text{middle}}$$
5. **Common Difference Formula from Sums:**
   $$d = S_2 - 2S_1 = T_n - T_{n-1}$$
6. **Finding $T_n$ from $S_n$:**
   $$T_n = S_n - S_{n-1}$$
7. **Ratio of Sums to Ratio of $n^{\text{th}}$ Terms Transformation:**
   - If $\frac{S_n}{S'_n} = \frac{f(n)}{g(n)} \implies \frac{T_n}{T'_n} = \frac{f(2n - 1)}{g(2n - 1)}$
   - If $\frac{T_n}{T'_n} = \frac{f(n)}{g(n)} \implies \frac{S_n}{S'_n} = \frac{f\left(\frac{n+1}{2}\right)}{g\left(\frac{n+1}{2}\right)}$
8. **Selection of Symmetrical Terms in AP:**
   - $3 \text{ terms}: a - d, \, a, \, a + d \quad (\text{Sum} = 3a, \, \text{diff} = d)$
   - $4 \text{ terms}: a - 3d, \, a - d, \, a + d, \, a + 3d \quad (\text{Sum} = 4a, \, \text{diff} = 2d)$
   - $5 \text{ terms}: a - 2d, \, a - d, \, a, \, a + d, \, a + 2d \quad (\text{Sum} = 5a, \, \text{diff} = d)$
9. **Crucial Exam AP Theorems:**
   - If $T_p = q$ and $T_q = p \implies T_{p+q} = 0 \quad \text{and} \quad T_n = p + q - n$.
   - If $p \cdot T_p = q \cdot T_q \implies T_{p+q} = 0$.
   - If $S_p = q$ and $S_q = p \implies S_{p+q} = -(p + q)$.
   - If $S_p = S_q \implies S_{p+q} = 0$.

---

### B. Geometric Progression (GP):
1. **General Term ($n^{\text{th}}$ Term from Start):**
   $$T_n = a \cdot r^{n-1}$$
2. **$n^{\text{th}}$ Term from End:**
   $$T'_n = \frac{l}{r^{n-1}}$$
3. **Equidistant Terms Property:**
   $$T_k \times T'_k = a \times l = \text{Constant for all } k$$
4. **Sum of First $n$ Terms ($S_n$):**
   $$S_n = \frac{a(r^n - 1)}{r - 1} = \frac{l r - a}{r - 1} \quad (r \ne 1)$$
5. **Sum of Infinite GP ($S_\infty$ for $|r| < 1$):**
   $$S_\infty = \frac{a}{1 - r}$$
6. **Product of First $n$ Terms ($P_n$):**
   $$P_n = (a \cdot l)^{n/2} = a^n \cdot r^{\frac{n(n-1)}{2}}$$
7. **Selection of Symmetrical Terms in GP:**
   - $3 \text{ terms}: \frac{a}{r}, \, a, \, ar \quad (\text{Product} = a^3, \, \text{ratio} = r)$
   - $4 \text{ terms}: \frac{a}{r^3}, \, \frac{a}{r}, \, ar, \, ar^3 \quad (\text{Product} = a^4, \, \text{ratio} = r^2)$
8. **Logarithm Property:**
   - If $a_1, a_2, a_3, \dots$ is in GP $\implies \log a_1, \log a_2, \log a_3, \dots$ is in AP.

---

### C. Harmonic Progression (HP):
1. A sequence $a_1, a_2, a_3, \dots$ is in HP if its reciprocals $\frac{1}{a_1}, \frac{1}{a_2}, \frac{1}{a_3}, \dots$ form an AP.
2. **$n^{\text{th}}$ Term of HP:**
   $$T_n = \frac{1}{\frac{1}{a} + (n - 1)d}$$
3. **Condition for 3 terms $a, b, c$ in HP:**
   $$b = \frac{2ac}{a + c}$$

---

### D. Arithmetico-Geometric Progression (AGP):
Series format: $a, (a+d)r, (a+2d)r^2, (a+3d)r^3, \dots$
1. **Sum of Infinite AGP ($S_\infty$ for $|r| < 1$):**
   $$S_\infty = \frac{a}{1 - r} + \frac{d \cdot r}{(1 - r)^2}$$
2. **Sum of $n$ Terms of AGP ($S_n$):**
   $$S_n = \frac{a}{1 - r} + \frac{d \cdot r(1 - r^{n-1})}{(1 - r)^2} - \frac{[a + (n-1)d]r^n}{1 - r}$$

---

### E. Mathematical Means (AM, GM, HM) & Insertion of $n$ Means:
1. **Definitions for Two Numbers $a$ and $b$:**
   $$\text{AM} = \frac{a + b}{2}, \quad \text{GM} = \sqrt{ab}, \quad \text{HM} = \frac{2ab}{a + b}$$
2. **Fundamental Mean Relation:**
   $$\text{GM}^2 = \text{AM} \times \text{HM} \quad \text{and} \quad \text{AM} \ge \text{GM} \ge \text{HM}$$
3. **Insertion of $n$ Arithmetic Means ($A_1, A_2, \dots, A_n$) between $a$ and $b$:**
   $$d = \frac{b - a}{n + 1}, \quad A_k = a + k\left(\frac{b - a}{n + 1}\right)$$
   $$\mathbf{\sum_{k=1}^n A_k = n \times \text{AM}(a, b) = n \left(\frac{a + b}{2}\right)}$$
4. **Insertion of $n$ Geometric Means ($G_1, G_2, \dots, G_n$) between $a$ and $b$:**
   $$r = \left(\frac{b}{a}\right)^{\frac{1}{n+1}}, \quad G_k = a \cdot r^k$$
   $$\mathbf{\prod_{k=1}^n G_k = (\sqrt{ab})^n = [\text{GM}(a, b)]^n}$$
5. **Sum of Reciprocals of $n$ Harmonic Means between $a$ and $b$:**
   $$\sum_{k=1}^n \frac{1}{H_k} = n \left(\frac{\frac{1}{a} + \frac{1}{b}}{2}\right)$$

---

## 13. Probability (प्रायिकता)

1. **Classical Probability**:
   $$P(A) = \frac{n(A)}{n(S)} = \frac{\text{Favourable Outcomes}}{\text{Total Possible Outcomes}}$$
2. **Addition Theorem**:
   $$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$
3. **Conditional Probability & Independent Events**:
   $$P(A | B) = \frac{P(A \cap B)}{P(B)}$$
   $$\text{For Independent Events: } P(A \cap B) = P(A) \times P(B)$$
4. **Complement Rule**: $P(A') = 1 - P(A)$

---

## 14. Comprehensive Algebraic Identities & Exam Theorems (सम्पूर्ण बीजगणित सूत्र)

### A. Basic Quadratic Identities:
1. $(a + b)^2 = a^2 + 2ab + b^2$
2. $(a - b)^2 = a^2 - 2ab + b^2$
3. $(a + b)^2 + (a - b)^2 = 2(a^2 + b^2)$
4. $(a + b)^2 - (a - b)^2 = 4ab$
5. $a^2 - b^2 = (a - b)(a + b)$
6. $(a + b + c)^2 = a^2 + b^2 + c^2 + 2(ab + bc + ca)$
7. $(a + b - c)^2 = a^2 + b^2 + c^2 + 2ab - 2bc - 2ca$
8. $(a - b - c)^2 = a^2 + b^2 + c^2 - 2ab + 2bc - 2ca$
9. **Critical Sum of Squares Identity**:
   $$a^2 + b^2 + c^2 - ab - bc - ca = \frac{1}{2}\left[(a - b)^2 + (b - c)^2 + (c - a)^2\right]$$
   - Note: $a^2 + b^2 + c^2 - ab - bc - ca \ge 0$ for all real $a, b, c$.
   - It equals $0$ if and only if $a = b = c$.

---

### B. Cubic Identities & Factoring:
1. $(a + b)^3 = a^3 + b^3 + 3ab(a + b) = a^3 + 3a^2b + 3ab^2 + b^3$
2. $(a - b)^3 = a^3 - b^3 - 3ab(a - b) = a^3 - 3a^2b + 3ab^2 - b^3$
3. $a^3 + b^3 = (a + b)(a^2 - ab + b^2) = (a + b)^3 - 3ab(a + b)$
4. $a^3 - b^3 = (a - b)(a^2 + ab + b^2) = (a - b)^3 + 3ab(a - b)$
5. $(a + b)^3 + (a - b)^3 = 2a(a^2 + 3b^2) = 2a^3 + 6ab^2$
6. $(a + b)^3 - (a - b)^3 = 2b(3a^2 + b^2) = 6a^2b + 2b^3$

---

### C. The Famous $a^3 + b^3 + c^3 - 3abc$ Family (All 4 Equivalent Forms):
$$\begin{aligned}
\text{Form 1: } a^3 + b^3 + c^3 - 3abc &= (a + b + c)(a^2 + b^2 + c^2 - ab - bc - ca) \\
\text{Form 2: } &= \frac{1}{2}(a + b + c)\left[(a - b)^2 + (b - c)^2 + (c - a)^2\right] \\
\text{Form 3: } &= (a + b + c)\left[(a + b + c)^2 - 3(ab + bc + ca)\right] \\
\text{Form 4: } &= \frac{1}{2}(a + b + c)\left[3(a^2 + b^2 + c^2) - (a + b + c)^2\right]
\end{aligned}$$

#### Vital Exam Deductions:
1. **Zero Sum Condition:** If $a + b + c = 0$, then:
   $$a^3 + b^3 + c^3 = 3abc$$
2. **Distinct Real Numbers:** If $a^3 + b^3 + c^3 = 3abc$ and $a \ne b \ne c$, then $a + b + c = 0$.
3. **Positive Reals:** If $a, b, c > 0$ and $a^3 + b^3 + c^3 = 3abc$, then $a = b = c$.
4. **Arithmetic Progression Shortcut:** When $a, b, c$ form an AP with common difference $d$:
   $$a^3 + b^3 + c^3 - 3abc = 9 \cdot b \cdot d^2 = 3(a + b + c)d^2$$

---

### D. The Reciprocal Power Chain ($x \pm \frac{1}{x} = k$):
For $x + \frac{1}{x} = k$:
1. $x^2 + \frac{1}{x^2} = k^2 - 2$
2. $x^3 + \frac{1}{x^3} = k^3 - 3k$
3. $x^4 + \frac{1}{x^4} = (k^2 - 2)^2 - 2$
4. $x^5 + \frac{1}{x^5} = \left(x^2 + \frac{1}{x^2}\right)\left(x^3 + \frac{1}{x^3}\right) - \left(x + \frac{1}{x}\right) = (k^2 - 2)(k^3 - 3k) - k$
5. $x^6 + \frac{1}{x^6} = \left(x^3 + \frac{1}{x^3}\right)^2 - 2$
6. $x^7 + \frac{1}{x^7} = \left(x^3 + \frac{1}{x^3}\right)\left(x^4 + \frac{1}{x^4}\right) - \left(x + \frac{1}{x}\right)$

For $x - \frac{1}{x} = k$:
1. $x^2 + \frac{1}{x^2} = k^2 + 2$
2. $x^3 - \frac{1}{x^3} = k^3 + 3k$
3. $x^5 - \frac{1}{x^5} = \left(x^2 + \frac{1}{x^2}\right)\left(x^3 - \frac{1}{x^3}\right) + \left(x - \frac{1}{x}\right)$

Conversion Formulas:
$$\left(x - \frac{1}{x}\right) = \pm \sqrt{\left(x + \frac{1}{x}\right)^2 - 4} = \pm \sqrt{k^2 - 4}$$
$$\left(x + \frac{1}{x}\right) = \pm \sqrt{\left(x - \frac{1}{x}\right)^2 + 4} = \pm \sqrt{k^2 + 4}$$

---

### E. Special Constant Value Theorems:
- If $x + \frac{1}{x} = 2 \implies x = 1$
- If $x + \frac{1}{x} = -2 \implies x = -1$
- If $x + \frac{1}{x} = 1 \implies x^2 - x + 1 = 0 \implies x^3 = -1 \implies x^3 + 1 = 0$
- If $x + \frac{1}{x} = -1 \implies x^2 + x + 1 = 0 \implies x^3 = 1 \implies x^3 - 1 = 0$
- If $x + \frac{1}{x} = \sqrt{3} \implies x^6 = -1 \implies x^6 + 1 = 0 \implies x^{n+6} + x^n = 0$
- If $x + \frac{1}{x} = \sqrt{2} \implies x^4 = -1 \implies x^4 + 1 = 0$

---

### F. Sophie Germain & Quartic Identities:
1. $a^4 + 4b^4 = (a^2 + 2b^2 + 2ab)(a^2 + 2b^2 - 2ab)$
2. $x^4 + x^2 + 1 = (x^2 + x + 1)(x^2 - x + 1)$
3. $x^4 + x^2 y^2 + y^4 = (x^2 + xy + y^2)(x^2 - xy + y^2)$
   $$\implies x^2 + y^2 = \frac{(x^2 + xy + y^2) + (x^2 - xy + y^2)}{2}, \quad xy = \frac{(x^2 + xy + y^2) - (x^2 - xy + y^2)}{2}$$

---

### G. Sum of Squares Zero Property:
- If $(x - a)^2 + (y - b)^2 + (z - c)^2 = 0 \implies x = a, \, y = b, \, z = c$.
- If $a^2 + b^2 + c^2 = 2(a + b + c) - 3 \implies (a - 1)^2 + (b - 1)^2 + (c - 1)^2 = 0 \implies a = b = c = 1$.

---

## 15. Series & Special Sums (श्रेणी एवं विशेष योग)

1. **Sum of First $n$ Natural Numbers**:
   $$\sum_{k=1}^n k = \frac{n(n + 1)}{2}$$
2. **Sum of Squares of First $n$ Natural Numbers**:
   $$\sum_{k=1}^n k^2 = \frac{n(n + 1)(2n + 1)}{6}$$
3. **Sum of Cubes of First $n$ Natural Numbers**:
   $$\sum_{k=1}^n k^3 = \left[\frac{n(n + 1)}{2}\right]^2 = \left(\sum k\right)^2$$
4. **Sum of First $n$ Odd Numbers**: $\sum_{k=1}^n (2k - 1) = n^2$
5. **Sum of First $n$ Even Numbers**: $\sum_{k=1}^n 2k = n(n + 1)$

---

## 16. Surds and Indices (घातांक एवं करणी)

1. **Laws of Indices**:
   $$a^m \cdot a^n = a^{m+n}, \quad \frac{a^m}{a^n} = a^{m-n}, \quad (a^m)^n = a^{mn}, \quad a^{-n} = \frac{1}{a^n}$$
2. **Continuous Surd Shortcuts**:
   - $\sqrt{x \sqrt{x \sqrt{x \cdots \infty}}} = x$
   - $\sqrt{x \sqrt{x \cdots n \text{ times}}} = x^{\frac{2^n - 1}{2^n}}$
   - $\sqrt{k(k+1) + \sqrt{k(k+1) + \cdots \infty}} = k + 1$
   - $\sqrt{k(k+1) - \sqrt{k(k+1) - \cdots \infty}} = k$
3. **Square Root of Binomial Surd $\sqrt{a \pm 2\sqrt{b}}$**:
   $$\text{Find } x, y \text{ such that } x+y=a \text{ and } xy=b \implies \sqrt{a \pm 2\sqrt{b}} = \sqrt{x} \pm \sqrt{y}$$

---

## 17. Number System Properties (संख्या पद्धति के विशेष गुण)

1. **Prime Numbers**:
   - Check if $N$ is prime: test divisibility by primes $p \le \sqrt{N}$.
   - Every prime $> 3$ is of the form $6k \pm 1$.
2. **Twin Primes**: Primes differing by 2, e.g. $(3, 5), (5, 7), (11, 13), (17, 19)$.
3. **Co-prime Numbers**: Numbers $a, b$ where $\gcd(a, b) = 1$.
4. **Perfect Number**: Sum of proper divisors equals the number itself:
   - Euclid-Euler Formula for even perfect numbers: $N = 2^{p-1}(2^p - 1)$ where $2^p - 1$ is a Mersenne prime.
   - First 4 perfect numbers: $6, 28, 496, 8128$.
5. **Triangular Number**:
   $$T_n = \frac{n(n + 1)}{2} \quad \implies 1, 3, 6, 10, 15, 21, 28, \dots$$

---

## 18. Binary & Base Conversions (द्विआधारी एवं आधार रूपांतरण)

1. **Decimal to Binary**: Repeated division by 2 recording remainders in reverse order.
   $$\text{Example: } (25)_{10} = (11001)_2$$
2. **Binary to Decimal**:
   $$(b_k b_{k-1} \dots b_0)_2 = \sum_{i=0}^k b_i \cdot 2^i$$
3. **Binary Arithmetic**:
   $$0+0=0, \quad 0+1=1, \quad 1+1=10_2 \text{ (0 with carry 1)}$$
4. **Bases Relationship**:
   - Octal (Base 8): Group binary bits into groups of 3 ($2^3 = 8$).
   - Hexadecimal (Base 16): Group binary bits into groups of 4 ($2^4 = 16$).
