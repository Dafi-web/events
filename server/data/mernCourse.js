/**
 * MERN stack — built-in slide presentations (no external video required).
 * Each lesson: slides[] = step-by-step “video-like” story + body notes + practices.
 */

function S(title, body, variant = 'content', theme = 'indigo') {
  return { title, body, variant, theme };
}

module.exports = {
  title: 'MERN Stack — Step by Step with Presentations & Practice',
  summary:
    'Node, Express, MongoDB, React — lesson-by-lesson animated-style slides, notes, and hands-on code in your browser.',
  description: `Learn the MERN stack without relying on YouTube. Each lesson opens with a **full-screen slide presentation** you step through (like a narrated deck): concepts first, then detailed notes below, then optional code exercises.

**MERN** = MongoDB, Express, React, Node.js — a common pattern for full-stack JavaScript apps.

Use **Next lesson** between topics. Use **Next slide** inside the presentation. Arrow keys ← → work on slides.

Prerequisites: comfort with HTML/CSS/JS. Pair with our *Web Development* course if needed.`,

  category: 'technology',
  order: 1,
  isPublished: true,

  pages: [
    {
      title: '1. What is MERN? Roadmap & setup',
      slides: [
        S(
          'Welcome to the MERN path',
          'You will move in small steps: one lesson per screen, several slides per lesson. No external video — the slides are your guided walkthrough.',
          'intro',
          'violet'
        ),
        S(
          'The four letters',
          'M = MongoDB (database)\nE = Express (HTTP API on Node)\nR = React (user interface)\nN = Node.js (runs JavaScript on the server)',
          'content',
          'indigo'
        ),
        S(
          'How a request travels',
          '1) User uses your React app in the browser.\n2) React calls your API over HTTP (JSON).\n3) Express handles routes and talks to MongoDB via Mongoose.\n4) Node runs the server process.',
          'content',
          'emerald'
        ),
        S(
          'Before lesson 2',
          'Install Node.js LTS (nodejs.org). Verify: node -v and npm -v in a terminal. Install VS Code (or your editor) and Git. Optional: create a free MongoDB Atlas account for later.',
          'summary',
          'amber'
        )
      ],
      body: `Reference notes — MERN orientation

**Tools**: Node includes npm. **Atlas** gives a hosted MongoDB URL. **.env** files store secrets locally (never commit real secrets).

**Next**: Node modules and npm scripts.`,
      practices: []
    },
    {
      title: '2. Node.js & npm — modules & scripts',
      slides: [
        S(
          'JavaScript off the browser',
          'Node runs JS on servers and laptops. npm installs libraries (express, mongoose, …) into node_modules/.',
          'intro',
          'emerald'
        ),
        S(
          'package.json',
          'Lists project name, scripts ("start", "dev"), and dependencies. package-lock.json pins exact versions for reproducible installs.',
          'content',
          'slate'
        ),
        S(
          'Try this flow',
          'mkdir demo && cd demo\nnpm init -y\nnpm install express\n→ You now have node_modules and a lockfile.',
          'practice',
          'amber'
        ),
        S(
          'You are ready',
          'When npm install finishes without errors, you can require() packages and run scripts with npm run …',
          'summary',
          'indigo'
        )
      ],
      body: `Notes — Node & npm

Use \`require\` or ES modules. One entry file (e.g. index.js) often boots the server.`,
      practices: [
        {
          title: 'Console warm-up',
          instructions: 'Print a line so you know Node runs: log "Hello MERN".',
          language: 'javascript',
          starterCode: `// Simulate what you put in index.js

`,
          solution: `console.log("Hello MERN");`
        }
      ]
    },
    {
      title: '3. Express — server, routes & JSON',
      slides: [
        S(
          'Express in one sentence',
          'Express maps URLs to functions: when a GET hits /api/items, your handler runs and sends JSON back.',
          'intro',
          'indigo'
        ),
        S(
          'Minimal pattern',
          'const app = express();\napp.use(express.json());\napp.get("/api/health", (req,res) => res.json({ok:true}));\napp.listen(5000);',
          'content',
          'violet'
        ),
        S(
          'Middleware',
          'Functions that run before your route: parse JSON bodies, attach auth user, log requests. Order matters.',
          'content',
          'emerald'
        ),
        S(
          'Test with a client',
          'Use Thunder Client, Postman, or fetch() from a tiny HTML file to hit your routes while you learn.',
          'summary',
          'rose'
        )
      ],
      body: `Notes — Express

**req** has query, params, body; **res** has .json(), .status(), .send().`,
      practices: [
        {
          title: 'Path helper',
          instructions: 'Return "/api/users/" + id as a string.',
          language: 'javascript',
          starterCode: `function userPath(id) {

}
console.log(userPath("7"));
`,
          solution: `function userPath(id) {
  return "/api/users/" + id;
}
console.log(userPath("7"));`
        }
      ]
    },
    {
      title: '4. REST, status codes & errors',
      slides: [
        S(
          'Design predictable APIs',
          'Use nouns for resources (/users, /posts). Map HTTP verbs to actions. Return consistent JSON for both success and errors.',
          'intro',
          'slate'
        ),
        S(
          'Status codes you will use daily',
          '200 OK · 201 Created · 400 Bad input · 401 Not authenticated · 403 Forbidden · 404 Missing · 500 Server bug',
          'content',
          'amber'
        ),
        S(
          'Error JSON',
          'Example: { "msg": "Email already taken" } with status 400 — helps the React app show a clear message.',
          'content',
          'indigo'
        ),
        S(
          'Async routes',
          'Use async/await with try/catch. On failure, call next(err) or send 500 with a safe message (hide stack traces in production).',
          'summary',
          'violet'
        )
      ],
      body: `Notes — REST & errors

Validate early; never trust the client alone.`,
      practices: []
    },
    {
      title: '5. MongoDB & Mongoose — models & CRUD',
      slides: [
        S(
          'Documents, not rows',
          'MongoDB stores JSON-like documents. Mongoose adds schemas, validation, and a friendly API.',
          'intro',
          'emerald'
        ),
        S(
          'Connect once',
          'await mongoose.connect(MONGODB_URI) on startup. Reuse one connection for the whole app.',
          'content',
          'indigo'
        ),
        S(
          'Model = collection',
          'const User = mongoose.model("User", userSchema)\n→ users collection. Use create, find, findById, findOneAndUpdate, etc.',
          'content',
          'violet'
        ),
        S(
          'Indexes & uniqueness',
          'Mark email unique in the schema for data integrity. Add indexes for fields you query often.',
          'summary',
          'rose'
        )
      ],
      body: `Notes — Mongoose

Atlas: whitelist IP, use SRV string in .env.`,
      practices: [
        {
          title: 'Document shape',
          instructions: 'Add createdAt ISO string to the object and log JSON.stringify.',
          language: 'javascript',
          starterCode: `const doc = { title: "Post", body: "Hi" };

console.log(JSON.stringify(doc));
`,
          solution: `const doc = {
  title: "Post",
  body: "Hi",
  createdAt: new Date().toISOString()
};

console.log(JSON.stringify(doc));`
        }
      ]
    },
    {
      title: '6. Authentication — JWT & protected routes',
      slides: [
        S(
          'Who is calling?',
          'After login, the client sends a token. The server verifies it and attaches req.user for private routes.',
          'intro',
          'violet'
        ),
        S(
          'Passwords',
          'Store bcrypt hashes only. Compare on login. Never log passwords.',
          'content',
          'rose'
        ),
        S(
          'JWT payload',
          'Keep payloads small (user id, role). Sign with a strong JWT_SECRET. Short expiry + refresh strategy for production apps.',
          'content',
          'slate'
        ),
        S(
          'Authorization header',
          'Browser sends: Authorization: Bearer <token>. Middleware strips "Bearer " and verifies.',
          'summary',
          'indigo'
        )
      ],
      body: `Notes — JWT

Use https in production. Consider httpOnly cookies vs localStorage tradeoffs.`,
      practices: []
    },
    {
      title: '7. React — components & JSX',
      slides: [
        S(
          'UI as components',
          'Split screens into reusable pieces. Props go in; events and state update what people see.',
          'intro',
          'indigo'
        ),
        S(
          'JSX rules',
          'className not class. One parent wrapper (or Fragment). {expression} for JavaScript inside markup.',
          'content',
          'violet'
        ),
        S(
          'Tooling',
          'Vite or CRA bundles JSX to plain JS. Fast refresh updates the page as you save files.',
          'content',
          'emerald'
        ),
        S(
          'Compose',
          'Build <Header />, <Main />, <Footer /> and nest data with props — same idea as MERN apps in production.',
          'summary',
          'amber'
        )
      ],
      body: `Notes — React

Think in one-way data flow: top-level state flows down; callbacks flow up.`,
      practices: [
        {
          title: 'Pure helper',
          instructions: 'Implement sum(a,b) and log sum(2,3).',
          language: 'javascript',
          starterCode: `function sum(a, b) {

}
console.log(sum(2, 3));
`,
          solution: `function sum(a, b) {
  return a + b;
}
console.log(sum(2, 3));`
        }
      ]
    },
    {
      title: '8. Hooks — useState & useEffect',
      slides: [
        S(
          'State that re-renders',
          'useState returns [value, setValue]. Calling setValue updates the UI.',
          'intro',
          'emerald'
        ),
        S(
          'Side effects',
          'useEffect runs after paint. Dependency array [] = run once on mount; [id] = when id changes.',
          'content',
          'indigo'
        ),
        S(
          'Data loading',
          'fetch in useEffect, then setState with results. Show loading and error UI — networks fail!',
          'content',
          'violet'
        ),
        S(
          'Cleanup',
          'Return a function from useEffect to unsubscribe timers or abort fetch when the component unmounts.',
          'summary',
          'rose'
        )
      ],
      body: `Notes — Hooks

Avoid infinite loops: include all referenced values in the dependency array or use a stable callback pattern.`,
      practices: []
    },
    {
      title: '9. React Router — SPA navigation',
      slides: [
        S(
          'URLs without full reloads',
          'React Router maps paths to components: /login, /dashboard/:id — feels like many pages, one bundle.',
          'intro',
          'violet'
        ),
        S(
          'Core pieces',
          'BrowserRouter → Routes → Route path element. Link navigates; useNavigate for code navigation.',
          'content',
          'indigo'
        ),
        S(
          'Params & loaders',
          'useParams() reads :id from the URL. Keep API base URL in env for different dev/prod hosts.',
          'content',
          'emerald'
        ),
        S(
          'Protect routes',
          'Wrap routes that need auth: if no token, redirect to /login.',
          'summary',
          'amber'
        )
      ],
      body: `Notes — Router v6

Match route order from most specific to general.`,
      practices: []
    },
    {
      title: '10. Calling your API from React',
      slides: [
        S(
          'Same stack, two ports',
          'Dev: React on 5173, API on 5000. Configure CORS on Express for your dev origin.',
          'intro',
          'indigo'
        ),
        S(
          'fetch POST',
          'method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)',
          'content',
          'emerald'
        ),
        S(
          'Attach JWT',
          'headers: { Authorization: `Bearer ${token}` } for private endpoints.',
          'content',
          'violet'
        ),
        S(
          'Handle responses',
          'Check res.ok. Parse JSON errors and show them in the UI — users need feedback.',
          'summary',
          'rose'
        )
      ],
      body: `Notes — client ↔ API

Never put API secrets in React source — they are visible to anyone.`,
      practices: [
        {
          title: 'Stringify body',
          instructions: 'Set body to JSON.stringify({ name: "Ada" }) in the options object.',
          language: 'javascript',
          starterCode: `const options = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: 
};
console.log(options.body);
`,
          solution: `const options = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Ada" })
};
console.log(options.body);`
        }
      ]
    },
    {
      title: '11. MERN end-to-end wiring',
      slides: [
        S(
          'One mental model',
          'Database schema → Express routes → React screens. Errors should map cleanly across layers.',
          'intro',
          'violet'
        ),
        S(
          'Folders',
          'server/: routes, models, middleware, config. client/: components, pages, api helpers.',
          'content',
          'slate'
        ),
        S(
          'Environment',
          'Server: PORT, MONGODB_URI, JWT_SECRET. Client: VITE_* public URLs only.',
          'content',
          'indigo'
        ),
        S(
          'Ship a vertical slice',
          'Pick one feature (e.g. “create post”) and take it from form → API → DB → list view.',
          'summary',
          'emerald'
        )
      ],
      body: `Notes — wiring

Start small; add auth and roles after CRUD works.`,
      practices: []
    },
    {
      title: '12. Deploy & keep shipping',
      slides: [
        S(
          'From laptop to internet',
          'Host the API on a Node-friendly platform. Host the React build as static files. Point DNS and env vars.',
          'intro',
          'amber'
        ),
        S(
          'Database in prod',
          'Use Atlas M10+ or dedicated cluster for production; enable backups.',
          'content',
          'rose'
        ),
        S(
          'HTTPS & secrets',
          'TLS everywhere. Rotate JWT secrets if leaked. Monitor logs for 5xx spikes.',
          'content',
          'indigo'
        ),
        S(
          'You are not done learning',
          'Add tests, TypeScript, CI/CD, and observability — but you now have a MERN map. Build something real!',
          'summary',
          'violet'
        )
      ],
      body: `Notes — deploy

**Next steps**: portfolio project, open source contributions, deeper React patterns (performance, suspense), and backend hardening (rate limits, helmet).`,
      practices: []
    }
  ]
};
