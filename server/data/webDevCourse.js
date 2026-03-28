/**
 * Full-stack web development curriculum for Course seeding.
 * Each page includes theory (body) and at least one hands-on practice.
 */

module.exports = {
  title: 'Complete Web Development — Zero to Production',
  summary:
    'HTML, CSS, JavaScript, DOM, APIs, accessibility, and deployment. Hands-on code in every module.',
  description: `This course is a structured path through modern web development. You will learn how browsers and servers work together, write semantic HTML, style pages with CSS (including layout with Flexbox and responsive design), and add behavior with JavaScript.

You will manipulate the DOM, handle events, and call APIs with fetch. Each lesson includes short reading material and at least one code practice with a starter file, optional live preview (HTML/CSS/JS), and a sample solution you can reveal when you are ready.

Prerequisites: curiosity and a text editor. A modern browser (Chrome, Firefox, Edge, or Safari) is enough to complete the exercises.

Suggested pace: one module per day for two weeks, or faster if you already have some experience.`,

  category: 'technology',
  order: 0,
  isPublished: true,

  pages: [
    {
      title: '1. How the web works',
      body: `Clients and servers
When you open a website, your browser (the client) sends an HTTP request to a computer on the internet (the server). The server responds with HTML, CSS, JavaScript, images, and other assets. The browser parses HTML into the DOM (Document Object Model), applies CSS for appearance, and runs JavaScript for interactivity.

URLs and DNS
A URL identifies a resource. DNS translates human-readable hostnames (like example.com) into IP addresses so your browser knows where to connect.

HTTPS
TLS encrypts traffic between you and the server so passwords and personal data are not sent in plain text.

Developer tools
Use your browser DevTools (F12 or right-click → Inspect) to view Elements, Network, and Console. You will use these constantly as a web developer.`,
      practices: [
        {
          title: 'Your first HTML document',
          instructions:
            'Complete the HTML below so the page has a proper title in the tab and a visible heading. Fill in the missing tags.',
          language: 'html',
          starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <!-- Add a title element: "My first page" -->
  
</head>
<body>
  <!-- Add an h1: Hello, Web -->
  
</body>
</html>`,
          solution: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My first page</title>
</head>
<body>
  <h1>Hello, Web</h1>
</body>
</html>`
        }
      ]
    },
    {
      title: '2. HTML document structure',
      body: `Doctype and html element
<!DOCTYPE html> tells the browser to use standards mode. The root <html> element wraps everything and should include lang="..." for accessibility and SEO.

Head vs body
<head> holds metadata: charset, title, viewport, linked stylesheets, and scripts you load early. <body> holds visible content.

Semantic structure
Use <header>, <main>, <nav>, <footer>, and <section> where they match the meaning of your content—not only for styling, but so assistive technologies can navigate your page.`,
      practices: [
        {
          title: 'Semantic layout skeleton',
          instructions:
            'Add <header>, <main>, and <footer>. Put a <nav> with one link inside the header.',
          language: 'html',
          starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Layout practice</title>
</head>
<body>

</body>
</html>`,
          solution: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Layout practice</title>
</head>
<body>
  <header>
    <nav><a href="/">Home</a></nav>
  </header>
  <main>
    <p>Main content goes here.</p>
  </main>
  <footer>
    <p>© DafiTech</p>
  </footer>
</body>
</html>`
        }
      ]
    },
    {
      title: '3. Text, lists, and emphasis',
      body: `Headings h1–h6 create an outline; use one logical h1 per page when possible.

Paragraphs and line breaks
<p> for paragraphs. Use <br> sparingly—prefer block elements for layout.

Lists
<ul> unordered, <ol> ordered, <li> items. Great for navigation, steps, and FAQs.

Emphasis
<strong> importance, <em> stress/voice. Avoid <b> and <i> unless there is no semantic alternative.`,
      practices: [
        {
          title: 'Recipe markup',
          instructions:
            'Inside <main>, add an h1, a short intro paragraph, an h2 "Ingredients", a ul with 3 items, an h2 "Steps", and an ol with 2 steps.',
          language: 'html',
          starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Recipe</title>
</head>
<body>
  <main>
    
  </main>
</body>
</html>`,
          solution: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Recipe</title>
</head>
<body>
  <main>
    <h1>Injera bread</h1>
    <p>A quick practice recipe.</p>
    <h2>Ingredients</h2>
    <ul>
      <li>Flour</li>
      <li>Water</li>
      <li>Salt</li>
    </ul>
    <h2>Steps</h2>
    <ol>
      <li>Mix ingredients.</li>
      <li>Cook on a griddle.</li>
    </ol>
  </main>
</body>
</html>`
        }
      ]
    },
    {
      title: '4. Links and navigation',
      body: `The <a> element
href points to a URL or path. Use descriptive link text ("Read the syllabus") instead of "click here".

Internal vs external
Same-site links can be relative (/courses). External links should often open in a new tab with rel="noopener noreferrer" for security when using target="_blank".

Accessibility
Ensure links are keyboard-focusable and visible when focused (browsers and CSS handle much of this if you do not remove outlines carelessly).`,
      practices: [
        {
          title: 'Navigation bar',
          instructions:
            'Inside <nav>, add three <a> links: Home (#), Courses (#courses), Contact (#contact).',
          language: 'html',
          starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nav practice</title>
</head>
<body>
  <header>
    <nav>
      
    </nav>
  </header>
</body>
</html>`,
          solution: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nav practice</title>
</head>
<body>
  <header>
    <nav>
      <a href="#">Home</a>
      <a href="#courses">Courses</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>
</body>
</html>`
        }
      ]
    },
    {
      title: '5. Images and media',
      body: `img element
src (URL), alt (description for screen readers and when image fails to load). alt="" is valid only for decorative images.

Responsive images
Use width and max-width in CSS, or srcset and sizes for multiple resolutions.

Video and audio
<video> and <audio> with controls and fallback text inside the element for older browsers.`,
      practices: [
        {
          title: 'Image with alt text',
          instructions:
            'Add an img pointing to https://picsum.photos/400/200 with meaningful alt text about a placeholder landscape.',
          language: 'html',
          starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Image practice</title>
</head>
<body>
  
</body>
</html>`,
          solution: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Image practice</title>
</head>
<body>
  <img src="https://picsum.photos/400/200" width="400" height="200" alt="Random landscape placeholder photo">
</body>
</html>`
        }
      ]
    },
    {
      title: '6. Forms and user input',
      body: `Form basics
<form> groups inputs. action and method control where data is sent (GET vs POST). For APIs you often intercept submit with JavaScript.

Input types
text, email, password, number, date, checkbox, radio, etc. Always associate <label for="id"> with input id.

Validation
HTML5 attributes like required, min, max, pattern give quick feedback. Server-side validation is still mandatory for security.`,
      practices: [
        {
          title: 'Contact form',
          instructions:
            'Add a form with: label+text input (name="email", type="email"), label+textarea (name="message"), and a submit button.',
          language: 'html',
          starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Form practice</title>
</head>
<body>
  
</body>
</html>`,
          solution: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Form practice</title>
</head>
<body>
  <form action="#" method="post">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required>
    <label for="message">Message</label>
    <textarea id="message" name="message" rows="4"></textarea>
    <button type="submit">Send</button>
  </form>
</body>
</html>`
        }
      ]
    },
    {
      title: '7. CSS fundamentals',
      body: `Including CSS
<link rel="stylesheet" href="styles.css"> in the head, or <style> for small examples.

Selectors
Element (p), class (.card), id (#hero)—use ids sparingly. Combinators: descendant, child (>), adjacent (+).

The cascade
Origin, importance (!important), specificity, and source order decide which rule wins.

Custom properties
CSS variables (--color: #333; color: var(--color);) help themes and consistency.`,
      practices: [
        {
          title: 'Style a card',
          instructions:
            'In the style block: give .card a max-width 320px, padding 1rem, border-radius 12px, background #f8fafc, and box-shadow 0 4px 12px rgba(0,0,0,0.08). Style .card h2 color #1e293b.',
          language: 'css',
          starterCode: `.card {

}

.card h2 {

}`,
          solution: `.card {
  max-width: 320px;
  padding: 1rem;
  border-radius: 12px;
  background: #f8fafc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card h2 {
  color: #1e293b;
}`
        }
      ]
    },
    {
      title: '8. Box model and layout flow',
      body: `Content, padding, border, margin
Every box has these areas. width and height usually refer to the content box unless you set box-sizing: border-box (recommended globally).

Display
block, inline, inline-block, none. Block elements stack vertically; inline flows with text.

Overflow
hidden, auto, scroll control clipping and scrollbars when content exceeds the box.`,
      practices: [
        {
          title: 'Box model fix',
          instructions:
            'Set box-sizing border-box on all elements using the universal selector. Give .box width 200px, padding 20px, border 4px solid #6366f1, and margin 16px auto.',
          language: 'css',
          starterCode: `

.box {

}`,
          solution: `* {
  box-sizing: border-box;
}

.box {
  width: 200px;
  padding: 20px;
  border: 4px solid #6366f1;
  margin: 16px auto;
}`
        }
      ]
    },
    {
      title: '9. Flexbox',
      body: `Flex container
display: flex on a parent creates a flex formatting context. Main axis (flex-direction) and cross axis define alignment.

Common properties
justify-content (main axis), align-items (cross axis), gap for spacing, flex-wrap for wrapping.

Flex items
flex-grow, flex-shrink, flex-basis—or the shorthand flex.`,
      practices: [
        {
          title: 'Center a bar',
          instructions:
            'Make .toolbar a flex container with items centered on both axes, gap 1rem, min-height 56px, and background #312e81.',
          language: 'css',
          starterCode: `.toolbar {

}`,
          solution: `.toolbar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  min-height: 56px;
  background: #312e81;
}`
        }
      ]
    },
    {
      title: '10. Responsive design',
      body: `Viewport meta tag
<meta name="viewport" content="width=device-width, initial-scale=1"> so mobile browsers do not emulate a desktop width.

Media queries
@media (max-width: 600px) { ... } to adjust layout, font sizes, and navigation for small screens.

Relative units
rem (from root font size), em (from element), %, vw/vh for fluid layouts.`,
      practices: [
        {
          title: 'Mobile-friendly grid',
          instructions:
            'By default .grid { display:grid; gap:1rem; }. Inside @media (min-width: 640px), set grid-template-columns to repeat(2, 1fr). Inside @media (min-width: 1024px), use repeat(3, 1fr).',
          language: 'css',
          starterCode: `.grid {
  display: grid;
  gap: 1rem;
}


`,
          solution: `.grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}`
        }
      ]
    },
    {
      title: '11. JavaScript basics',
      body: `Variables
let and const (prefer const unless you reassign). var has function scope—avoid in new code.

Types and operators
Primitives: string, number, boolean, null, undefined, bigint, symbol. === avoids type coercion.

Control flow
if/else, switch, for, while, for...of for iterables.

Functions
function declarations, expressions, arrow functions (lexical this).`,
      practices: [
        {
          title: 'Greet function',
          instructions:
            'Write a function greet(name) that returns "Hello, " plus the name in uppercase (use .toUpperCase()). Then call console.log(greet("ada")).',
          language: 'javascript',
          starterCode: `function greet(name) {

}

console.log(greet("ada"));`,
          solution: `function greet(name) {
  return "Hello, " + name.toUpperCase();
}

console.log(greet("ada"));`
        }
      ]
    },
    {
      title: '12. The DOM and events',
      body: `Selecting elements
document.querySelector, querySelectorAll, getElementById return nodes you can read or update.

Changing the page
element.textContent, innerHTML (careful with untrusted strings), classList.add/remove/toggle, style for inline styles.

Events
element.addEventListener("click", handler). Use event.preventDefault() on forms when handling submit in JS.`,
      practices: [
        {
          title: 'Button click counter',
          instructions:
            'Complete the <script> at the bottom: select the button and #count, keep a count variable, and on each click update the span text.',
          language: 'mixed',
          starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Counter</title>
</head>
<body>
  <button type="button">Click me</button>
  <p>Clicks: <span id="count">0</span></p>
  <script>
    const btn = document.querySelector("button");
    const out = document.querySelector("#count");
    let count = 0;

  </script>
</body>
</html>`,
          solution: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Counter</title>
</head>
<body>
  <button type="button">Click me</button>
  <p>Clicks: <span id="count">0</span></p>
  <script>
    const btn = document.querySelector("button");
    const out = document.querySelector("#count");
    let count = 0;
    btn.addEventListener("click", function () {
      count += 1;
      out.textContent = String(count);
    });
  </script>
</body>
</html>`
        }
      ]
    },
    {
      title: '13. Fetch and JSON APIs',
      body: `fetch(url)
Returns a Promise. Chain .then(res => res.json()) or use async/await.

async/await
async function load() { const res = await fetch("/api/data"); const data = await res.json(); }

Errors
Check res.ok; network failures throw. Wrap in try/catch for robust UIs.

CORS
Browsers block cross-origin responses unless the server sends proper CORS headers—important when calling third-party APIs.`,
      practices: [
        {
          title: 'Parse JSON',
          instructions:
            'Complete the async function: await fetch the URL, check res.ok, return await res.json(). If not ok, throw an Error with status text.',
          language: 'javascript',
          starterCode: `async function loadUser(id) {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/" + id);
  
}

loadUser(1).then(console.log).catch(console.error);`,
          solution: `async function loadUser(id) {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/" + id);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

loadUser(1).then(console.log).catch(console.error);`
        }
      ]
    },
    {
      title: '14. Accessibility, performance, and next steps',
      body: `Accessibility (a11y)
Keyboard navigation, focus styles, labels, contrast, and ARIA only when HTML semantics are insufficient.

Performance
Optimize images, lazy-load below the fold, minimize blocking scripts, measure with Lighthouse.

Next steps
Learn a component framework (React, Vue, Svelte), a CSS approach (Tailwind, CSS modules), version control with Git, and deploy to Netlify, Vercel, or a VPS.

Capstone idea
Build a one-page portfolio: semantic HTML, responsive Flexbox/Grid layout, a contact form with client-side validation, and a small section that loads public data with fetch.`,
      practices: [
        {
          title: 'Mini portfolio shell',
          instructions:
            'Combine skills: semantic header/main/footer, a nav, one section with an h2, and a link styled as a button (you may add a <style> block with basic colors).',
          language: 'mixed',
          starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Portfolio</title>
  <style>
    /* Add styles: body font-family system-ui; .btn as inline-block padding */
  </style>
</head>
<body>

</body>
</html>`,
          solution: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Portfolio</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; line-height: 1.5; }
    .btn { display: inline-block; padding: 0.5rem 1rem; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px; }
  </style>
</head>
<body>
  <header>
    <nav>
      <a href="#about">About</a>
      <a href="#projects">Projects</a>
    </nav>
  </header>
  <main>
    <section id="about">
      <h2>About me</h2>
      <p>Web developer in training.</p>
      <a class="btn" href="mailto:hello@example.com">Email me</a>
    </section>
  </main>
  <footer><p>© Portfolio</p></footer>
</body>
</html>`
        }
      ]
    }
  ]
};
