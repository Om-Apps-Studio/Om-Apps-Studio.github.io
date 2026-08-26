# MathVault - Math Notes & Question Bank Web App

An ultra-modern, client-side, mobile-friendly **Math Notes and Question Bank** web application built with HTML5, CSS3, JavaScript, KaTeX, and Marked.js. Fully compatible with **GitHub Pages (`github.io`)**, local files, and offline storage.

---

## 🌟 Key Features

1. **LaTeX & Math Formula Engine**:
   - High-speed formula rendering using **KaTeX 0.16.x** + **Marked.js**.
   - Supports inline math (`$formula$`), block equations (`$$...$$` and `\[...\]`), calculus, matrices, vectors, roots, limits, and greek symbols.
   - Built-in **Formula Helper Toolbar** for 1-click symbol insertions.

2. **Advanced Multi-Dimensional Filtering & Search**:
   - **Real-time Keyword Search** across titles, problem statements, LaTeX equations, explanations, and tags.
   - **Filter by**:
     - *Chapter / Subject* (Calculus, Vectors & 3D, Matrices, Algebra, Probability, Trigonometry, etc.)
     - *Difficulty* (Easy, Medium, Hard, Challenger / Olympiad)
     - *PYQ Exam* (JEE Main, JEE Advanced, NDA, CBSE 12th, WBJEE, BITSAT, NEET/Foundation, etc.)
     - *PYQ Year* (2025, 2024, 2023, 2022, 2021, 2020, Earlier)
     - *Question Type* (Single Choice MCQ, Multiple Choice MCQ, Numerical / Integer, Subjective / Proof)
     - *Study Status* (All, Bookmarked ⭐, Needs Revision 🔄, Mastered ✅, With Diagrams 🖼️)

3. **ChatGPT & Google Gemini AI Integration**:
   - Direct prompt guide included in [`CHATGPT_GEMINI_MATH_PROMPT.md`](./CHATGPT_GEMINI_MATH_PROMPT.md).
   - **Smart AI Importer**: Paste ChatGPT or Gemini JSON/Markdown output to instantly parse and populate questions into your bank.

4. **Diagram & Image Attachments**:
   - Paste screenshots directly using **`Ctrl+V`** inside the question form.
   - Drag & drop or file upload supported, stored in offline **IndexedDB**.

5. **Interactive Practice / Quiz Mode**:
   - Custom quiz sessions by chapter and difficulty.
   - Interactive options, instant correctness validation, score tracking, timer, and celebratory confetti.

6. **Formula Notes & Theory Sheet**:
   - Automatic extraction of key formulas and theorems grouped by chapter for quick revision.

7. **Zero-Loss Data Management**:
   - 1-Click JSON Backup Export & Import.
   - Print / Save as PDF stylesheet for offline test papers.

---

## 🚀 How to Deploy on GitHub Pages (`github.io`)

This project is 100% static and zero-configuration. To host it for free on GitHub Pages:

1. **Create a GitHub Repository**:
   - Create a new repository on GitHub (e.g. `math-question-bank` or `<your-username>.github.io`).
2. **Push the Files**:
   - Upload or push all files from this directory (`index.html`, `style.css`, `app.js`, `sample_data.js`, `CHATGPT_GEMINI_MATH_PROMPT.md`, `README.md`) to the repository's `main` branch.
3. **Enable GitHub Pages**:
   - On GitHub, go to **Settings** > **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select branch: `main` and folder: `/ (root)`.
   - Click **Save**.
4. **Access Your Live App**:
   - Your web app will be live in ~1 minute at:
     ```
     https://<your-username>.github.io/<repo-name>/
     ```

---

## 💻 Running Locally

Simply double-click `index.html` or open it with any browser!
Alternatively, use VS Code Live Server or python:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

---

## 🤖 Generating Questions with AI

1. Open [`CHATGPT_GEMINI_MATH_PROMPT.md`](./CHATGPT_GEMINI_MATH_PROMPT.md) and copy the Master Prompt.
2. Paste into **ChatGPT (GPT-4o)** or **Google Gemini (2.0 Flash / 1.5 Pro)**.
3. Request questions for your chapter/topic or upload photos of textbook questions.
4. Click **✨ AI Import** in the web app, paste the generated text, and click **Parse & Add Questions to Bank**.

---

## 🛠️ Tech Stack
- **HTML5 & CSS3** (Mobile-first, responsive, Dark/Light theme, Glassmorphism)
- **Vanilla JavaScript (ES6)**
- **KaTeX** for ultra-fast LaTeX math rendering
- **Marked.js** for Markdown support
- **IndexedDB** for client-side persistence and image storage
- **FontAwesome 6** for icons
- **Canvas-Confetti** for quiz celebrations
