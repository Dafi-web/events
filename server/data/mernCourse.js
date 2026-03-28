/**
 * MERN stack (MongoDB, Express, React, Node) — step-by-step with video + practice.
 * Video IDs reference popular free tutorials (YouTube embeds). Replace URLs anytime in Admin.
 */

module.exports = {
  title: 'MERN Stack — Step by Step with Videos & Examples',
  summary:
    'Build full-stack apps with Node, Express, MongoDB, and React. One lesson per step: video, notes, and code practice.',
  description: `This course walks you through the MERN stack in clear steps. Each lesson opens on its own page — use **Next lesson** to move forward.

**What you will learn**
- Run JavaScript on the server with Node.js and npm
- Build REST APIs with Express (routes, middleware, JSON)
- Store data with MongoDB and Mongoose
- Secure APIs with JWT and protect routes
- Build UIs with React (components, hooks, router)
- Connect React to your API with fetch or axios
- See how everything fits together in a MERN workflow

**How to use this course**
1. Open **Lessons** in the course menu.
2. Watch the embedded video for that step.
3. Read the notes and try the **Hands-on practice** when provided.
4. Click **Next lesson** — content is not dumped on one long page.

Prerequisites: basic HTML/CSS/JS (our Web Development course is a good prep).`,

  category: 'technology',
  order: 1,
  isPublished: true,

  pages: [
    {
      title: '1. What is MERN? Roadmap & setup',
      videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj_A',
      videoCaption:
        'Big-picture overview of MongoDB, Express, React, and Node — how they work together in a typical app.',
      body: `Step 1 — orientation

**MERN** stands for:
- **M**ongoDB — document database
- **E**xpress — web framework for Node.js
- **R**eact — UI library
- **N**ode.js — JavaScript runtime on the server

**Typical flow**
1. User interacts with a **React** app in the browser.
2. React calls your **Express** API (HTTP/JSON).
3. Express talks to **MongoDB** through **Mongoose**.
4. **Node.js** runs Express and your server code.

**Install before next lessons**
- **Node.js LTS** from nodejs.org (includes npm)
- A code editor (VS Code recommended)
- **MongoDB Atlas** free cluster (or local MongoDB) for later modules
- **Git** for version control

**Checklist**
- [ ] node -v and npm -v work in a terminal
- [ ] You can create a folder and open it in your editor`,
      practices: []
    },
    {
      title: '2. Node.js & npm — modules & scripts',
      videoUrl: 'https://www.youtube.com/embed/fBNz5xF-Kx4',
      videoCaption:
        'Traversy Media — Node.js crash course: modules, filesystem, basics of running JS on the server.',
      body: `Step 2 — Node fundamentals

**npm** is the package manager: \`npm init\`, \`npm install <package>\`, \`npm run <script>\`.

**Common patterns**
- \`require()\` / \`import\` to load modules
- \`package.json\` lists dependencies and scripts
- \`node file.js\` runs a file

**Try in a terminal**
\`\`\`
mkdir demo && cd demo
npm init -y
npm install express
\`\`\`

Your \`node_modules\` folder holds installed packages; \`package-lock.json\` locks versions.`,
      practices: [
        {
          title: 'Create a tiny script',
          instructions:
            'Write a script that prints "Hello MERN" using console.log. (In the box, write only the JavaScript lines you would put in index.js.)',
          language: 'javascript',
          starterCode: `// index.js — print a welcome line for your MERN journey

`,
          solution: `console.log("Hello MERN");`
        }
      ]
    },
    {
      title: '3. Express — server, routes & JSON',
      videoUrl: 'https://www.youtube.com/embed/SccSCAaYOCw',
      videoCaption:
        'Express.js crash course: creating a server, defining routes, and sending JSON responses.',
      body: `Step 3 — your first API

**Express** maps URLs to handler functions.

**Core ideas**
- \`app.get('/path', (req, res) => ...)\`
- \`res.json({ ok: true })\` sends JSON
- \`req.params\` and \`req.query\` for URL data

**Middleware** runs before your route (parsing JSON body, logging, auth).

**Minimal server sketch**
\`\`\`js
const express = require('express');
const app = express();
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.listen(5000, () => console.log('Listening on 5000'));
\`\`\`

Use **Postman**, **Thunder Client**, or **fetch** in the browser to hit your routes.`,
      practices: [
        {
          title: 'API path helper',
          instructions:
            'Complete the function so it returns "/api/users/" plus the id (Express routes use strings like this). Run preview to test.',
          language: 'javascript',
          starterCode: `function userPath(id) {

}

console.log(userPath("42"));
`,
          solution: `function userPath(id) {
  return "/api/users/" + id;
}

console.log(userPath("42"));`
        }
      ]
    },
    {
      title: '4. REST, status codes & error handling',
      videoUrl: 'https://www.youtube.com/embed/SccSCAaYOCw',
      videoCaption:
        'Same Express course — focus this watch on REST verbs, status codes (200, 201, 400, 404), and consistent JSON errors.',
      body: `Step 4 — design your API

**REST-ish conventions**
- GET /items — list
- GET /items/:id — one item
- POST /items — create
- PUT/PATCH /items/:id — update
- DELETE /items/:id — remove

**HTTP status codes**
- 200 OK, 201 Created
- 400 Bad Request (validation)
- 401 Unauthorized, 403 Forbidden
- 404 Not Found
- 500 Internal Server Error

**Good habits**
- Always send JSON with a clear shape for errors: \`{ "msg": "..." }\`
- Validate input before touching the database
- Use async/await with try/catch in route handlers`,
      practices: []
    },
    {
      title: '5. MongoDB & Mongoose — models & CRUD',
      videoUrl: 'https://www.youtube.com/embed/WDrU305J1H0',
      videoCaption:
        'Mongoose tutorial: schemas, models, create/read/update/delete against MongoDB.',
      body: `Step 5 — persistence

**MongoDB** stores BSON documents in collections.

**Mongoose** gives you schemas and a nice API:
- \`mongoose.connect(uri)\`
- Define a \`Schema\` and \`model\`
- Use \`Model.create()\`, \`find()\`, \`findById()\`, \`findByIdAndUpdate()\`, \`findByIdAndDelete()\`

**Example shape**
\`\`\`js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});
const User = mongoose.model('User', userSchema);
\`\`\`

**Atlas tip** — whitelist your IP (or 0.0.0.0/0 for dev only) and use the SRV connection string in \`.env\`.`,
      practices: [
        {
          title: 'Document shape (like MongoDB)',
          instructions:
            'Build a post object with title, body, and createdAt as an ISO date string. Log JSON.stringify of the object.',
          language: 'javascript',
          starterCode: `const post = {
  title: "MERN lesson",
  body: "Hello",
  
};

console.log(JSON.stringify(post));
`,
          solution: `const post = {
  title: "MERN lesson",
  body: "Hello",
  createdAt: new Date().toISOString()
};

console.log(JSON.stringify(post));`
        }
      ]
    },
    {
      title: '6. Authentication — JWT & protected routes',
      videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4',
      videoCaption:
        'JWT authentication with Node — tokens, signing, middleware to protect Express routes.',
      body: `Step 6 — auth basics

**JWT** (JSON Web Token) — signed payload the client sends on each request (often in \`Authorization: Bearer <token>\`).

**Flow**
1. User logs in with email/password
2. Server verifies password (hashed with bcrypt)
3. Server returns a JWT
4. Client stores token (memory, httpOnly cookie, or localStorage — tradeoffs apply)
5. Middleware validates JWT before private routes

**Never** store plain-text passwords. **Always** hash with bcrypt.

**Middleware pattern**
\`\`\`js
function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
}
\`\`\``,
      practices: []
    },
    {
      title: '7. React — components, JSX & props',
      videoUrl: 'https://www.youtube.com/embed/pKd0Rpw7O48',
      videoCaption:
        'React JS crash course — components, JSX, props, and modern function components.',
      body: `Step 7 — UI layer

**React** builds interfaces from components.

**JSX** looks like HTML in JavaScript; use \`className\` not \`class\`.

**Props** pass data down: \`<Card title="Hi" />\`

**Create React App** or **Vite** (\`npm create vite@latest\`) scaffolds a frontend project that talks to your API.

**One-way data flow** — state lifts up when siblings need to share data.`,
      practices: [
        {
          title: 'Small helper for your API',
          instructions:
            'Complete the function so it returns the sum of two numbers (you will use similar pure functions in route handlers).',
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
      videoUrl: 'https://www.youtube.com/embed/pKd0Rpw7O48',
      videoCaption:
        'Same React course — focus on useState for local state and useEffect for side effects (e.g. fetching data).',
      body: `Step 8 — interactivity

**useState** — component state that triggers re-render when updated.

**useEffect** — run code after render; dependency array controls when it re-runs:
- \`[]\` — once on mount
- \`[id]\` — when \`id\` changes
- no array — every render (usually avoid)

**Fetching in React**
\`\`\`js
useEffect(() => {
  fetch('/api/items')
    .then((r) => r.json())
    .then(setItems);
}, []);
\`\`\``,
      practices: []
    },
    {
      title: '9. React Router — pages & navigation',
      videoUrl: 'https://www.youtube.com/embed/pKd0Rpw7O48',
      videoCaption:
        'Use the React crash course above; add React Router (npm i react-router-dom) and follow v6 docs for Routes, Route, Link, and useParams.',
      body: `Step 9 — SPA navigation

**React Router** maps URLs to components so the app feels like multiple pages without full reloads.

**Basics**
- \`<BrowserRouter>\` wraps the app
- \`<Routes>\` / \`<Route path="..." element={...} />\`
- \`<Link to="...">\` for navigation

**Params** — \`/user/:id\` with \`useParams()\`.

Keep API base URL in an env variable (e.g. Vite: \`import.meta.env.VITE_API_URL\`).`,
      practices: []
    },
    {
      title: '10. Calling your API from React',
      videoUrl: 'https://www.youtube.com/embed/pKd0Rpw7O48',
      videoCaption:
        'Tie it together — forms, fetch/axios, loading and error UI patterns.',
      body: `Step 10 — full-stack wiring

**From React**
- \`fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })\`
- Attach JWT: \`headers: { Authorization: \`Bearer \${token}\` }\`

**CORS** — your Express app must allow your frontend origin (\`cors\` package: \`app.use(cors({ origin: 'http://localhost:5173' }))\`).

**UX**
- Show loading spinners while awaiting network
- Surface error messages from \`res.json()\`

**Env split**
- Server: \`PORT\`, \`MONGODB_URI\`, \`JWT_SECRET\`
- Client: public API URL only — never put secrets in React code`,
      practices: [
        {
          title: 'JSON body for POST',
          instructions:
            'Complete the options object: method POST, headers with Content-Type application/json, body JSON.stringify of { name: "Ada" }. (Network calls may fail in this preview — check the console structure.)',
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
      title: '11. MERN end-to-end — putting it together',
      videoUrl: 'https://www.youtube.com/embed/SccSCAaYOCw',
      videoCaption:
        'Review Express + API design as you plan how your React app will call your routes end-to-end.',
      body: `Step 11 — project shape

**Typical monorepo or two folders**
- \`/server\` — Express + Mongoose, \`npm run dev\` with nodemon
- \`/client\` — React (Vite), \`npm run dev\`

**One flow**
1. Model data in Mongoose
2. Expose REST routes
3. Build React screens that call those routes
4. Add auth and protect routes on both sides

**Quality**
- Centralize API helpers (\`api.get/post\`)
- Validate inputs on server always
- Use environment variables for secrets`,
      practices: []
    },
    {
      title: '12. Deploy & keep learning',
      videoUrl: 'https://www.youtube.com/embed/fBNz5xF-Kx4',
      videoCaption:
        'Revisit Node deployment topics — process managers, PORT, and hosting options (Render, Railway, etc.).',
      body: `Step 12 — ship it

**Deploy ideas**
- **API** — Render, Railway, Fly.io, Heroku-style hosts: set \`PORT\`, env vars, build command
- **Database** — MongoDB Atlas (production cluster)
- **Frontend** — Netlify, Vercel, Cloudflare Pages (static build of React)

**Production checklist**
- [ ] \`NODE_ENV=production\`
- [ ] Strong \`JWT_SECRET\`
- [ ] HTTPS only
- [ ] Rate limiting & security headers (helmet)
- [ ] Backups for database

**Next skills**
- TypeScript
- Testing (Jest, React Testing Library)
- State libraries (Redux, Zustand) if apps grow
- Docker for repeatable environments

You now have a MERN map — build a small project (e.g. task app with auth) end to end!`,
      practices: []
    }
  ]
};
