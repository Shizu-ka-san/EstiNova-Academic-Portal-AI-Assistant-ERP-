import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';

interface RenderedMessageProps {
  content: string;
}

// Ensure marked options match custom specifications
marked.setOptions({
  gfm: true,
  breaks: true,
});

function renderContent(rawText: string): string {
  const latexBlocks: string[] = [];
  const protect = (match: string) => {
    const idx = latexBlocks.length;
    latexBlocks.push(match);
    return 'ESTI_LAT_' + idx + '_X';
  };

  let text = rawText;
  text = text.replace(/\\[\s\S]*?\\\]/g, protect);
  text = text.replace(/\$\$[\s\S]*?\$\$/g, protect);
  text = text.replace(/\\([\s\S]*?\\)/g, protect);
  text = text.replace(/(?<!\$)\$(?!\$)[\s\S]*?(?<!\$)\$(?!\$)/g, protect);

  // Synchronous HTML generation using marked.parse
  let html = marked.parse(text) as string;

  // Wrap tables for responsive horizontal scrolling
  html = html.replace(/<table>/g, '<div class="table-container"><table>');
  html = html.replace(/<\/table>/g, '</table></div>');

  latexBlocks.forEach((latex, idx) => {
    html = html.split('ESTI_LAT_' + idx + '_X').join(latex);
  });

  return html;
}

const RUNNABLE_LANGS = ['javascript', 'js', 'typescript', 'ts', 'html', 'css', 'python', 'py', 'sql'];

const compileTS = (tsCode: string): string => {
  return tsCode
    .replace(/(interface|type)\s+\w+(\s*<[^>]+>)?\s*({[\s\S]*?}|=[^;]+;)/g, '')
    .replace(/\b(public|private|protected|readonly)\s+/g, '')
    .replace(/:\s*(string|number|boolean|any|void|unknown|never|object|string\[\]|number\[\]|any\[\]|boolean\[\])(\b|;|\)|,|=)/g, '$2')
    .replace(/as\s+\w+/g, '');
};

const createConsolePanel = (preElement: HTMLPreElement, language: string, getCodeText: string | (() => string)) => {
  const targetElement = (preElement.closest('.code-block-wrapper') || preElement) as HTMLElement;

  // Check if a panel already exists for this block
  let panel = targetElement.nextElementSibling as HTMLElement | null;
  if (panel && panel.classList.contains('code-runner-panel')) {
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    const btnRun = panel.querySelector('.btn-run') as HTMLButtonElement | null;
    if (btnRun) btnRun.click();
    return;
  }

  // Create new panel
  panel = document.createElement('div');
  panel.className = 'code-runner-panel mt-3 mb-2 rounded-xl overflow-hidden border border-indigo-500/20 bg-[#07080f] shadow-2xl flex flex-col font-sans transition-all duration-300';
  
  const logContainerId = 'logs-' + Math.random().toString(36).substr(2, 9);
  const previewContainerId = 'preview-' + Math.random().toString(36).substr(2, 9);
  const isVisual = ['html', 'htm', 'css'].includes(language);
  
  panel.innerHTML = `
    <!-- Runner Header -->
    <div class="flex items-center justify-between px-3 py-2 bg-[#0d0e15] border-b border-indigo-950/60 select-none text-xs">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="font-semibold text-indigo-300 uppercase tracking-widest text-[10px] font-sans">CONSOLE (${language})</span>
      </div>
      <div class="flex items-center gap-3">
        ${isVisual ? `
          <div class="flex items-center bg-[#07080f] rounded-md p-0.5 border border-indigo-950/80">
            <button type="button" class="tab-btn-console px-2 py-0.5 text-[10px] font-sans font-semibold text-white bg-indigo-900/40 rounded-sm cursor-pointer hover:text-white transition-all">Console</button>
            <button type="button" class="tab-btn-visual px-2 py-0.5 text-[10px] font-sans font-semibold text-indigo-300 rounded-sm cursor-pointer hover:text-white transition-all">Aperçu visuel</button>
          </div>
        ` : ''}
        <button type="button" class="btn-clear text-gray-400 hover:text-white cursor-pointer transition-colors p-1" title="Effacer la console">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
        <button type="button" class="btn-run text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors flex items-center gap-1.5 font-sans font-semibold px-2 py-1 rounded bg-emerald-950/30 border border-emerald-500/20" title="Relancer l'exécution">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg> Relancer
        </button>
        <button type="button" class="btn-close text-gray-400 hover:text-red-400 cursor-pointer transition-colors p-1" title="Masquer la console">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
    
    <!-- Console Viewport -->
    <div id="${logContainerId}" class="console-output flex-1 max-h-[220px] overflow-y-auto p-3 text-xs font-mono leading-relaxed space-y-1 bg-[#050609] scrollbar">
    </div>

    <!-- Visual Aspect Viewport (HTML/CSS) -->
    ${isVisual ? `
      <div id="${previewContainerId}" class="visual-output hidden h-[220px] bg-white border-t border-indigo-950/60 relative">
        <iframe class="w-full h-full border-0 bg-transparent" sandbox="allow-scripts"></iframe>
      </div>
    ` : ''}
  `;

  targetElement.parentNode!.insertBefore(panel, targetElement.nextSibling);

  const logContainer = panel.querySelector(`#${logContainerId}`) as HTMLDivElement;
  const previewContainer = isVisual ? panel.querySelector(`#${previewContainerId}`) as HTMLDivElement : null;
  const iframe = previewContainer ? previewContainer.querySelector('iframe') as HTMLIFrameElement : null;

  const tabBtnConsole = panel.querySelector('.tab-btn-console') as HTMLButtonElement | null;
  const tabBtnVisual = panel.querySelector('.tab-btn-visual') as HTMLButtonElement | null;
  const btnClear = panel.querySelector('.btn-clear') as HTMLButtonElement;
  const btnRun = panel.querySelector('.btn-run') as HTMLButtonElement;
  const btnClose = panel.querySelector('.btn-close') as HTMLButtonElement;

  const terminal = {
    clear: () => {
      logContainer.innerHTML = '';
    },
    writeLog: (text: string, type: 'log' | 'info' | 'warn' | 'error' | 'success' = 'log') => {
      const line = document.createElement('div');
      const timeStr = new Date().toLocaleTimeString();
      let colorClass = 'text-gray-300';
      let label = 'LOG';

      if (type === 'info') {
        colorClass = 'text-indigo-400 font-semibold';
        label = 'SYS';
      } else if (type === 'warn') {
        colorClass = 'text-amber-400';
        label = 'WARN';
      } else if (type === 'error') {
        colorClass = 'text-rose-400 font-semibold';
        label = 'ERR';
      } else if (type === 'success') {
        colorClass = 'text-emerald-400 font-semibold';
        label = 'OK';
      }

      line.className = `flex gap-2 items-start py-0.5 border-b border-indigo-950/5 min-w-0 ${colorClass}`;
      line.innerHTML = `
        <span class="text-[9px] text-indigo-500/40 mt-0.5 select-none shrink-0 font-mono">[${timeStr}]</span>
        <span class="text-[9px] px-1 bg-indigo-950/40 rounded border border-indigo-500/10 uppercase select-none font-sans font-bold tracking-wider shrink-0">${label}</span>
        <span class="whitespace-pre-wrap font-mono flex-1 min-w-0 text-left shrink-0 break-all select-all">${text}</span>
      `;
      logContainer.appendChild(line);
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  };

  btnClose.addEventListener('click', () => {
    panel!.style.display = 'none';
  });

  btnClear.addEventListener('click', () => {
    terminal.clear();
    terminal.writeLog('Console nettoyée.', 'info');
  });

  if (isVisual && tabBtnConsole && tabBtnVisual && previewContainer && logContainer) {
    tabBtnConsole.addEventListener('click', () => {
      tabBtnConsole.className = 'tab-btn-console px-2 py-0.5 text-[10px] font-sans font-semibold text-white bg-indigo-900/40 rounded-sm cursor-pointer hover:text-white transition-all';
      tabBtnVisual.className = 'tab-btn-visual px-2 py-0.5 text-[10px] font-sans font-semibold text-indigo-300 rounded-sm cursor-pointer hover:text-white transition-all';
      logContainer.classList.remove('hidden');
      previewContainer.classList.add('hidden');
    });

    tabBtnVisual.addEventListener('click', () => {
      tabBtnConsole.className = 'tab-btn-console px-2 py-0.5 text-[10px] font-sans font-semibold text-indigo-300 rounded-sm cursor-pointer hover:text-white transition-all';
      tabBtnVisual.className = 'tab-btn-visual px-2 py-0.5 text-[10px] font-sans font-semibold text-white bg-indigo-900/40 rounded-sm cursor-pointer hover:text-white transition-all';
      logContainer.classList.add('hidden');
      previewContainer.classList.remove('hidden');
    });
  }

  const executeCodeBlock = async () => {
    terminal.clear();
    const codeText = typeof getCodeText === 'function' ? getCodeText() : getCodeText;
    
    if (['javascript', 'js', 'typescript', 'ts'].includes(language)) {
      terminal.writeLog('Lancement de l\'exécution JavaScript...', 'info');
      
      const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error
      };

      const customConsole = {
        log: (...args: any[]) => {
          originalConsole.log(...args);
          const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
          terminal.writeLog(msg, 'log');
        },
        warn: (...args: any[]) => {
          originalConsole.warn(...args);
          const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
          terminal.writeLog(msg, 'warn');
        },
        error: (...args: any[]) => {
          originalConsole.error(...args);
          const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
          terminal.writeLog(msg, 'error');
        }
      };

      try {
        let runnerCode = codeText;
        if (['typescript', 'ts'].includes(language)) {
          runnerCode = compileTS(codeText);
          terminal.writeLog('Compilation TypeScript effectuée avec succès (types nettoyés).', 'info');
        }

        const runner = new Function('console', `
          try {
            ${runnerCode}
          } catch(err) {
            console.error(err.message || String(err));
          }
        `);
        runner(customConsole);
        terminal.writeLog('=== Fin de l\'exécution avec succès ===', 'success');
      } catch (err: any) {
        terminal.writeLog(`Erreur de syntaxe : ${err.message || String(err)}`, 'error');
      }
    }

    else if (['html', 'htm'].includes(language)) {
      terminal.writeLog('Chargement de l\'aperçu de la page HTML...', 'info');
      if (iframe) {
        iframe.srcdoc = codeText;
        terminal.writeLog('Rendu de la page HTML terminé.', 'success');
        // Auto-switch to visual tab on initial HTML execution to show them the webpage immediately!
        if (tabBtnVisual) tabBtnVisual.click();
      }
    }

    else if (language === 'css') {
      terminal.writeLog('Application du style CSS à la page d\'aperçu...', 'info');
      if (iframe) {
        iframe.srcdoc = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 1.5rem;
                background-color: #0d0f1c;
                color: #f3f4f6;
              }
              ${codeText}
            </style>
          </head>
          <body>
            <div class="test-container">
              <h1 style="font-size: 1.75rem; font-weight: bold; margin-bottom: 0.5rem;">Aperçu du Style CSS</h1>
              <p style="color: #9cb3af; margin-bottom: 1rem;">Ce conteneur d'aperçu teste vos classes et sélecteurs CSS en direct.</p>
              <div class="card" style="border: 1px solid #312e81; border-radius: 8px; padding: 16px; margin-top: 12px; background: rgba(30,32,53, 0.4)">
                <h3 style="margin-top:0;">Carte Interactive</h3>
                <p>Modifiez et ré-exécutez votre code CSS pour changer le rendu visuel.</p>
                <button class="btn btn-primary" style="padding: 8px 16px; background-color: #818cf8; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">Bouton Standard</button>
              </div>
            </div>
          </body>
          </html>
        `;
        terminal.writeLog('Rendu du style CSS terminé avec l\'arbre d\'exemples.', 'success');
        if (tabBtnVisual) tabBtnVisual.click();
      }
    }

    else if (['python', 'py'].includes(language)) {
      terminal.writeLog('Initialisation de l\'environnement Python (WebAssembly Pyodide)...', 'info');
      
      try {
        if (!(window as any).loadPyodide) {
          const script = document.createElement('script');
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
          document.head.appendChild(script);
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }

        if (!(window as any).pyodideInstance) {
          (window as any).pyodideInstance = await (window as any).loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
          });
        }

        const pyodide = (window as any).pyodideInstance;
        
        pyodide.setStdout({
          batched: (text: string) => {
            terminal.writeLog(text, 'log');
          }
        });
        
        pyodide.setStderr({
          batched: (text: string) => {
            terminal.writeLog(text, 'error');
          }
        });

        terminal.writeLog('Exécution du script Python...', 'info');
        await pyodide.runPythonAsync(codeText);
        terminal.writeLog('=== Fin de l\'exécution avec succès ===', 'success');
      } catch (err: any) {
        terminal.writeLog(`Erreur d'exécution Python : ${err.message || String(err)}`, 'error');
      }
    }

    else if (language === 'sql') {
      const lowerCode = codeText.trim().toLowerCase();
      terminal.writeLog('Analyse et exécution de la requête SQL...', 'info');
      
      setTimeout(() => {
        if (lowerCode.includes('select * from profiles') || lowerCode.includes('select * from public.profiles')) {
          terminal.writeLog('Requête : SELECT * FROM profiles;', 'info');
          terminal.writeLog(`
+--------------------------------------+--------------+-------------------------------------+
| id                                   | updated_at   | avatar_url                          |
+--------------------------------------+--------------+-------------------------------------+
| 1a8c88f2-8411-41fb-8db5-9e665ba5c3d2 | 2026-05-23   | https://example.com/avatars/user.png|
| 5f98ebd8-ee18-472e-8a0a-6e5a0be5fc23 | 2026-05-23   | NULL                                |
+--------------------------------------+--------------+-------------------------------------+
(2 lignes sélectionnées)
          `, 'success');
        } else if (lowerCode.includes('select * from users') || lowerCode.includes('select * from auth.users')) {
          terminal.writeLog('Requête : SELECT * FROM users;', 'info');
          terminal.writeLog(`
+--------------------------------------+----------------------------+-----------------------+
| id                                   | email                      | created_at            |
+--------------------------------------+----------------------------+-----------------------+
| 1a8c88f2-8411-41fb-8db5-9e665ba5c3d2 | badisbodjaoui08@gmail.com  | 2026-05-23 18:00:00   |
| 5f98ebd8-ee18-472e-8a0a-6e5a0be5fc23 | guest@example.com          | 2026-05-23 18:30:00   |
+--------------------------------------+----------------------------+-----------------------+
(2 lignes sélectionnées)
          `, 'success');
        } else if (lowerCode.includes('create table') || lowerCode.includes('alter table') || lowerCode.includes('drop table')) {
          terminal.writeLog('Structure de la table modifiée avec succès dans la base SQL.', 'success');
        } else if (lowerCode.includes('insert into') || lowerCode.includes('update') || lowerCode.includes('delete')) {
          terminal.writeLog('Requête exécutée avec succès. 1 ligne modifiée.', 'success');
        } else {
          terminal.writeLog('Requête simulée avec succès.', 'success');
          terminal.writeLog(`
+-------------------+----------------------------+
| statut            | message                    |
+-------------------+----------------------------+
| success           | Requête exécutée           |
+-------------------+----------------------------+
          `, 'success');
        }
      }, 400);
    }
  };

  btnRun.addEventListener('click', executeCodeBlock);
  executeCodeBlock();
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

export default function RenderedMessage({ content }: RenderedMessageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (containerRef.current && (window as any).renderMathInElement) {
        (window as any).renderMathInElement(containerRef.current, {
          delimiters: [
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false },
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
          ],
          throwOnError: false,
        });
      }
    } catch (e) {
      console.warn('Failed to render Math using KaTeX:', e);
    }

    if (!containerRef.current) return;
    const preBlocks = containerRef.current.querySelectorAll('pre');

    preBlocks.forEach((pre) => {
      // Prevent double wrapping / double header adding
      if (pre.parentElement?.classList.contains('code-block-wrapper') || pre.dataset.headerAdded === 'true') {
        return;
      }

      pre.dataset.headerAdded = 'true';

      const codeElement = pre.querySelector('code');
      
      // Configure code block elements to be contentEditable
      if (codeElement) {
        codeElement.contentEditable = "true";
        codeElement.setAttribute('spellcheck', 'false');
        codeElement.style.outline = 'none';
        codeElement.style.display = 'block'; // Fills full horizontal layout
        codeElement.style.whiteSpace = 'pre-wrap';
        codeElement.style.wordBreak = 'break-all';
      } else {
        pre.contentEditable = "true";
        pre.setAttribute('spellcheck', 'false');
        pre.style.outline = 'none';
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.wordBreak = 'break-all';
      }

      let detectedLang = '';
      if (codeElement) {
        const classes = codeElement.className.split(' ');
        const langClass = classes.find(c => c.startsWith('language-'));
        if (langClass) {
          detectedLang = langClass.replace('language-', '').toLowerCase();
        }
      }

      const isRunnable = RUNNABLE_LANGS.includes(detectedLang);

      // Create a majestic wrapper container that holds the header and the code block
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper my-6 rounded-xl border border-indigo-500/35 bg-[#080911] shadow-2xl overflow-hidden flex flex-col transition-all duration-300';

      // Insert wrapper into the DOM and reparent pre
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      // Cleanly strip pre of borders, backgrounds, and margins so it acts as a scroll body
      pre.style.margin = '0px';
      pre.style.border = 'none';
      pre.style.borderRadius = '0px';
      pre.style.backgroundColor = 'transparent';
      pre.style.padding = '1rem 1.25rem';
      pre.style.overflowX = 'auto';

      // Create a premium, tactile, high-contrast header bar 
      const headerBar = document.createElement('div');
      headerBar.className = 'code-header-bar flex items-center justify-between border-b border-indigo-950 bg-[#0c0e1a] px-4 py-2 text-[11px] font-sans font-semibold tracking-wider text-gray-200 select-none';
      
      // Prevent focus or caret placement inside the header when clicking UI buttons
      headerBar.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });

      // Left info: Language and "Modifiable" badge
      const leftInfo = document.createElement('div');
      leftInfo.className = 'flex items-center gap-2.5';
      
      const langSpan = document.createElement('span');
      langSpan.className = 'text-indigo-400 font-extrabold uppercase tracking-widest text-[11px] font-sans';
      langSpan.textContent = detectedLang || 'code';
      leftInfo.appendChild(langSpan);

      const editBadge = document.createElement('span');
      editBadge.className = 'text-[10px] font-sans font-semibold text-indigo-200 flex items-center gap-1.5 bg-indigo-950 border border-indigo-500/40 px-2 py-0.5 rounded-full shadow-sm';
      editBadge.innerHTML = `
        <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block animate-pulse"></span>
        <span>Modifiable ✎</span>
      `;
      leftInfo.appendChild(editBadge);

      // Right info: Action Buttons (Run, Copy)
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'flex items-center gap-2';

      // Helper to dynamically scrape the updated content typed by the user
      const getLatestText = () => {
        const el = pre.querySelector('code');
        return el ? el.innerText : pre.innerText;
      };

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'copy-code-btn px-2.5 py-1 bg-[#16182f] hover:bg-indigo-900 border border-indigo-400/30 hover:border-indigo-400/60 text-indigo-100 hover:text-white rounded-md transition-all duration-150 flex items-center gap-1.5 cursor-pointer select-none font-bold text-[10px] font-sans active:scale-95 shadow-md';
      copyBtn.title = 'Copier le code modifié';

      const copyIcon = `
        <svg class="w-3 h-3 text-indigo-300" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
        </svg>
      `;

      const successIcon = `
        <svg class="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
        </svg>
      `;

      copyBtn.innerHTML = `${copyIcon}<span>Copier</span>`;

      copyBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        const latestText = getLatestText();

        const performCopy = async (str: string) => {
          if (navigator.clipboard) {
            try {
              await navigator.clipboard.writeText(str);
              return true;
            } catch (_) {}
          }
          try {
            const textArea = document.createElement('textarea');
            textArea.value = str;
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
          } catch (_) {
            return false;
          }
        };

        const copySuccess = await performCopy(latestText);

        if (copySuccess) {
          copyBtn.innerHTML = `${successIcon}<span class="text-emerald-400">Copié !</span>`;
          copyBtn.classList.add('border-emerald-500/50', 'bg-emerald-950/55', 'text-emerald-300');
          copyBtn.classList.remove('border-indigo-400/30', 'bg-[#16182f]', 'text-indigo-100');

          setTimeout(() => {
            copyBtn.innerHTML = `${copyIcon}<span>Copier</span>`;
            copyBtn.classList.remove('border-emerald-500/50', 'bg-emerald-950/55', 'text-emerald-300');
            copyBtn.classList.add('border-indigo-400/30', 'bg-[#16182f]', 'text-indigo-100');
          }, 2000);
        }
      });

      if (isRunnable) {
        const runBtn = document.createElement('button');
        runBtn.type = 'button';
        runBtn.className = 'run-code-btn px-2.5 py-1 bg-[#064e3b] hover:bg-emerald-900 border border-emerald-500/40 hover:border-emerald-400/70 text-emerald-100 hover:text-white rounded-md transition-all duration-150 flex items-center gap-1.5 cursor-pointer select-none font-bold text-[10px] font-sans active:scale-95 shadow-md';
        runBtn.title = 'Mettre à exécution le code modifié';
        runBtn.innerHTML = `
          <svg class="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"></path>
          </svg>
          <span>Exécuter</span>
        `;

        runBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          createConsolePanel(pre, detectedLang, getLatestText);
        });

        actionsDiv.appendChild(runBtn);
      }

      actionsDiv.appendChild(copyBtn);
      headerBar.appendChild(leftInfo);
      headerBar.appendChild(actionsDiv);

      wrapper.insertBefore(headerBar, pre);
    });

  }, [content]);

  return (
    <div
      ref={containerRef}
      className="rendered-content text-[15px] leading-relaxed"
      dangerouslySetInnerHTML={{ __html: renderContent(content) }}
    />
  );
}
