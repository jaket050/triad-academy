# Triad Academy

Triad Academy is a React, Vite, and Tailwind learning app that connects math, physics, computer science, and AI through lessons, interactive labs, build challenges, daily planning, and review.

## Feature Overview

- 140 lesson curriculum: 40 Math, 40 Physics, 40 Computer Science, and 20 Language & Thinking lessons.
- Curriculum architecture map with 5 subjects, 40 stages, 200 modules, and 600 sequenced metadata lesson nodes.
- Prerequisite locking, dependency chains, progression order, path progress tracking, and recommended next path lesson logic.
- Skill Graph with dependency visualization, weak-area highlighting, performance-based skill levels, and adaptive Daily Coach recommendations.
- Layered explanations for each lesson: Explain Like I'm 5, Standard Explanation, and Deep Dive.
- Rigorous lesson format with intuition, formal ideas, reasoning, worked examples, practice problems, common mistakes, connections, and build links.
- Solve-before-reveal workflow for worked examples, practice problems, and Daily Coach problems.
- Lesson quizzes with right/wrong feedback and visible correct answers after answering.
- Prediction system for lessons and labs, with saved predictions, reflections, and self-grading.
- Interactive labs:
  - Function Visualizer
  - Projectile Motion Simulator
  - Algorithm Complexity Visualizer
- Data & Model Playground with small datasets, linear model training, parameter tuning, loss tracking, and result visualization.
- Build Mode challenges for pseudocode, implementation thinking, hints, model answers, basic keyword feedback, and self-grading.
- In-app JavaScript coding environment for Build Mode with a code editor, run button, output console, reset code button, and basic test cases.
- Debug Mode with broken-code challenges, editable code, test results, staged hints, root-cause explanations, and completion tracking.
- Code Reading Mode with annotated snippets, prediction-before-reveal, control-flow explanations, own-words explanations, and completion tracking.
- Karpathy Path: a six-phase Neural Networks From Scratch pathway with linked lessons, labs, builds, debug/code-reading practice, and 12 executable first-principles milestone projects.
- Pilot Test Mode with a 30-minute guided onboarding path, pre/post questions, confidence ratings, friction feedback, outcome tracking, and JSON export.
- AI Tutor feedback for Explain-It responses, Build Mode pseudocode, and prediction reflections through a server-side OpenAI API endpoint.
- Interactive AI Tutor chat for lessons and Build Mode, with follow-up questions, hint-first guidance, and saved conversation history.
- Review Queue that brings back weak or unfinished work automatically.
- Daily Coach that recommends one lesson, one review item, one build challenge, a lab, and a practice problem.
- Thinking Lab with logic puzzles, pattern recognition, what-if scenarios, open-ended prompts, and mini reasoning games.
- Project Tracks with staged tasks, code checkpoints, final builds, and progress tracking.
- Progress, answers, predictions, explanations, build work, review history, and session history are saved in `localStorage`.
- Debug Mode progress is saved locally in `triad-academy-debug-mode-v1`.
- Code Reading progress is saved locally in `triad-academy-code-reading-v1`.
- Karpathy Path milestone progress is saved locally in `triad-academy-karpathy-path-v1`.
- Pilot test sessions are saved locally in `triad-academy-pilot-test-v1`.
- AI Tutor conversations are saved locally in `triad-academy-ai-tutor-chat-v1`.

## Project Structure

```text
triad-academy/
  index.html
  package.json
  package-lock.json
  postcss.config.js
  tailwind.config.js
  src/
    main.js
    curriculum.js
    curriculumArchitecture.js
    buildChallenges.js
    debugChallenges.js
    codeReadingChallenges.js
    karpathyPath.js
    skillGraph.js
    thinkingChallenges.js
    projectTracks.js
    styles.css
  api/
    ai-feedback.js
  netlify/
    functions/
      ai-feedback.js
  dist/
    Production build output
```

Key files:

- `src/main.js`: Main React app, lesson engine, labs, dashboard, review queue, Daily Coach, and localStorage logic.
- `src/curriculum.js`: Generated 140-lesson curriculum.
- `src/curriculumArchitecture.js`: Hierarchical subject -> stage -> module -> lesson architecture metadata, dependencies, path progress, and recommendation helpers.
- `src/skillGraph.js`: Skill nodes, dependencies, performance scoring, weak-area detection, and adaptive lesson helpers.
- `src/buildChallenges.js`: Build Mode challenge data and answer keys.
- `src/debugChallenges.js`: Debug Mode broken-code challenges, tests, hints, and model explanations.
- `src/codeReadingChallenges.js`: Code Reading snippets, line annotations, expected output, control-flow explanations, and skill links.
- `src/karpathyPath.js`: Six-phase neural networks pathway, linked resources, executable milestone scaffolds, datasets, tests, visualizations, and debug scenarios.
- `src/thinkingChallenges.js`: Thinking Lab challenge data.
- `src/projectTracks.js`: Project Track data with goals, stages, tasks, code checkpoints, and final builds.
- `src/styles.css`: Tailwind entry file and app styles.
- `api/ai-feedback.js`: Vercel serverless endpoint for AI Tutor feedback and interactive chat.
- `netlify/functions/ai-feedback.js`: Netlify serverless endpoint for AI Tutor feedback and interactive chat.

## AI Tutor Setup

The OpenAI API key must stay server-side. Do not put it in a `VITE_*` variable because Vite exposes those values to the browser.

Create a local environment file when using a serverless dev runner:

```bash
cp .env.example .env.local
```

Set:

```text
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
```

If the AI endpoint is unavailable, the app keeps working and shows basic keyword feedback or local hint guidance instead.

## Local Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://127.0.0.1:5173/
```

If another Vite server is already running, Vite may choose a higher port such as `5174` or `5175`.

## Local Development Steps

Use these commands while working locally:

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run preview
```

`npm run build` creates the production files in `dist/`. `npm run preview` serves the built app locally so you can check the deployment version before publishing.

## Vercel Deployment

1. Push this project to a Git repository.
2. In Vercel, choose **Add New Project**.
3. Import the repository.
4. Use these settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Add environment variables:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` optional, defaults to `gpt-4.1-mini`
6. Deploy.

The AI Tutor uses the Vercel function at `/api/ai-feedback`.

## Netlify Deployment

1. Push this project to a Git repository.
2. In Netlify, choose **Add new site** from Git.
3. Import the repository.
4. Use these settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Dependency install command: `npm install`
5. Add environment variables:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` optional, defaults to `gpt-4.1-mini`
6. Deploy.

The AI Tutor uses the Netlify function at `/.netlify/functions/ai-feedback` if the Vercel-style API route is unavailable.

For manual deployment, run:

```bash
npm run build
```

Then upload the `dist/` folder to Netlify.

## Known Limitations

- All user data is stored in the browser with `localStorage`; it does not sync across devices.
- Clearing browser storage resets progress, explanations, predictions, review history, and Build Mode work.
- AI Tutor feedback and chat require serverless environment variables. Without them, the app falls back to basic keyword feedback and local hint guidance.
- Build Mode still includes basic keyword detection as a fallback, not as perfect grading.
- Lessons and challenges are static content; there is no account system, teacher dashboard, or cloud database yet.
- The production bundle is large because the full 140-lesson curriculum ships with the app.

## Future Roadmap

- Add user accounts and cloud sync.
- Add real AI feedback for explanations, Build Mode pseudocode, and reflection quality.
- Add richer spaced repetition scheduling with due dates and difficulty ratings.
- Expand the Skill Graph with finer-grained mastery models and more direct links to every exercise.
- Add downloadable progress reports.
- Add more labs for vectors, circuits, probability, optimization, and AI training.
- Add teacher/admin tools for assigning lessons and reviewing student progress.
- Split curriculum content into lazy-loaded modules to reduce the initial bundle size.

## Scripts

The app currently provides:

```json
{
  "dev": "vite",
  "build": "vite build --minify false --target esnext --emptyOutDir false",
  "preview": "vite preview"
}
```
