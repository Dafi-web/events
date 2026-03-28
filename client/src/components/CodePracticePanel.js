import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Eye, EyeOff, Code2 } from 'lucide-react';

function escapeForScriptEnd(userCode) {
  return String(userCode).replace(/<\/script>/gi, '<\\/script>');
}

function buildPreviewSrc(code, language) {
  const raw = String(code);
  if (language === 'html' || language === 'mixed') {
    return raw;
  }
  if (language === 'css') {
    const safe = raw.replace(/<\/style>/gi, '<\\/style>');
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${safe}</style></head><body><div class="demo"><h1>Demo heading</h1><p>Sample paragraph for your styles.</p><button type="button">Button</button></div></body></html>`;
  }
  if (language === 'javascript') {
    const safe = escapeForScriptEnd(raw);
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;padding:1rem;margin:0;}pre{white-space:pre-wrap;background:#f1f5f9;padding:1rem;border-radius:8px;font-size:13px;}</style></head><body><pre id="out"></pre><script>(function(){try{var el=document.getElementById("out");function log(){for(var i=0;i<arguments.length;i++){el.textContent+=String(arguments[i])+" ";}el.textContent+="\\n";}console.log=log;${safe}}catch(e){document.getElementById("out").textContent="Error: "+e.message;}})();<\/script></body></html>`;
  }
  return raw;
}

const CodePracticePanel = ({ practice, pageIndex, practiceIndex }) => {
  const [code, setCode] = useState(practice.starterCode || '');
  const [showSolution, setShowSolution] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    setCode(practice.starterCode || '');
    setShowSolution(false);
    setPreviewKey((k) => k + 1);
  }, [practice.starterCode, practice.title, pageIndex, practiceIndex]);

  const canPreview = ['html', 'css', 'javascript', 'mixed'].includes(practice.language);

  const iframeSrc = buildPreviewSrc(code, practice.language);

  const runPreview = () => setPreviewKey((k) => k + 1);

  return (
    <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50/40 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100/80 border-b border-indigo-200">
        <Code2 className="w-4 h-4 text-indigo-700 shrink-0" />
        <span className="text-sm font-semibold text-indigo-900">{practice.title}</span>
        <span className="text-xs text-indigo-600 ml-auto uppercase tracking-wide">
          {practice.language}
        </span>
      </div>
      <div className="p-4 space-y-4">
        {practice.instructions && (
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{practice.instructions}</p>
        )}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full min-h-[160px] font-mono text-sm p-3 rounded-lg border border-slate-300 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
          aria-label="Practice code"
        />
        <div className="flex flex-wrap gap-2">
          {canPreview && (
            <button
              type="button"
              onClick={runPreview}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              <Play className="w-4 h-4" />
              Run preview
            </button>
          )}
          <button
            type="button"
            onClick={() => setCode(practice.starterCode || '')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" />
            Reset starter
          </button>
          {practice.solution ? (
            <button
              type="button"
              onClick={() => setShowSolution((s) => !s)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50"
            >
              {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showSolution ? 'Hide solution' : 'Show solution'}
            </button>
          ) : null}
        </div>
        {showSolution && practice.solution && (
          <pre className="text-xs font-mono p-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 overflow-x-auto whitespace-pre-wrap">
            {practice.solution}
          </pre>
        )}
        {canPreview && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Live preview</p>
            <iframe
              key={previewKey}
              title="Practice preview"
              sandbox="allow-scripts"
              className="w-full min-h-[200px] rounded-lg border border-slate-200 bg-white"
              srcDoc={iframeSrc}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePracticePanel;
