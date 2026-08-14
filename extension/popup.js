const status = document.getElementById("status");

function setStatus(text) {
  status.textContent = text;
}

async function getSettings() {
  return await chrome.storage.local.get(["githubToken", "repo", "branch"]);
}

function detectCategory(title, url) {
  const text = `${title} ${url}`.toLowerCase();
  const rules = [
    ["Arrays", ["array", "subarray", "subsequence", "two sum", "kadane"]],
    ["Strings", ["string", "palindrome", "anagram", "substring"]],
    ["LinkedList", ["linked list", "doubly linked", "circular linked"]],
    ["Stack", ["stack", "parenthesis", "balanced brackets"]],
    ["Queue", ["queue", "deque"]],
    ["Trees", ["binary tree", "bst", "binary search tree", "tree traversal"]],
    ["Graphs", ["graph", "bfs", "dfs", "dijkstra", "topological"]],
    ["Dynamic Programming", ["dynamic programming", "dp", "knapsack", "memoization"]],
    ["Searching", ["binary search", "search in", "searching"]],
    ["Sorting", ["sort", "sorting", "merge sort", "quick sort"]],
    ["Mathematics", ["prime", "factorial", "gcd", "lcm", "fibonacci", "number", "divisor", "power"]],
    ["Bit Manipulation", ["bit manipulation", "bitwise", "xor", "set bit"]],
    ["Greedy", ["greedy"]],
    ["Heap", ["heap", "priority queue", "kth largest", "kth smallest"]]
  ];
  for (const [category, keywords] of rules) {
    if (keywords.some(keyword => text.includes(keyword))) return category;
  }
  return "Miscellaneous";
}

function detectLanguage(code) {
  if (/\bclass\s+Solution\b|System\.out\.println|import\s+java\./.test(code)) return "Java";
  if (/\bdef\s+\w+\s*\(|print\s*\(|import\s+(numpy|pandas)/.test(code)) return "Python";
  if (/#include\s*<|std::cout|using\s+namespace\s+std/.test(code)) return "C++";
  if (/\bconsole\.log\s*\(|function\s+\w+\s*\(/.test(code)) return "JavaScript";
  return "Java";
}

function getExtension(language) {
  return { Java: "java", Python: "py", "C++": "cpp", JavaScript: "js" }[language] || "txt";
}

function makeReadme(title, url, language, category, code) {
  const complexityHint = /\b(for|while)\s*\(/.test(code)
    ? "Analyze the loops in the solution to determine the exact complexity."
    : "Analyze the operations in the solution to determine the exact complexity.";

  return `# ${title}\n\n` +
    `- **Platform:** GeeksForGeeks\n` +
    `- **Category:** ${category}\n` +
    `- **Language:** ${language}\n` +
    `- **Problem:** ${url}\n\n` +
    `## Approach\n\n` +
    `Solution submitted on GeeksForGeeks.\n\n` +
    `## Complexity\n\n` +
    `${complexityHint}\n\n` +
    `## Notes\n\n` +
    `This solution was automatically synced from the GFG editor.\n`;
}

async function putFile(repo, path, content, message, branch, token) {
  const encoded = btoa(unescape(encodeURIComponent(content)));
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path.split("/").map(encodeURIComponent).join("/")}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message, content: encoded, branch })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `GitHub HTTP ${response.status}`);
  return data;
}

async function readGfgPage(tabId) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      function visible(el) {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
      }

      function cleanCode(lines) {
        return lines
          .map(line => (line.innerText || line.textContent || "").replace(/\u00a0/g, " "))
          .join("\n")
          .replace(/\r/g, "")
          .trim();
      }

      // GFG currently renders its editor with Monaco. Read the rendered
      // .view-line elements instead of the hidden Monaco textarea.
      const editors = [...document.querySelectorAll(".monaco-editor")].filter(visible);
      let code = "";

      for (const editor of editors) {
        const lines = [...editor.querySelectorAll(".view-lines .view-line")];
        const candidate = cleanCode(lines);
        if (candidate.length > code.length) code = candidate;
      }

      // Fallbacks for editor markup changes.
      if (!code) {
        const candidates = [
          ...document.querySelectorAll(".view-lines .view-line"),
          ...document.querySelectorAll("pre code"),
          ...document.querySelectorAll("[contenteditable='true']")
        ];
        code = cleanCode(candidates);
      }

      const heading = document.querySelector("h1")?.innerText?.trim();
      const title = heading || document.title.replace(/\s*[-|].*$/, "").trim() || "GFG Problem";

      return {
        title,
        url: window.location.href.split("?")[0],
        code
      };
    }
  });

  return results?.[0]?.result || null;
}

async function saveSolution() {
  try {
    setStatus("Reading GFG page...");

    const settings = await getSettings();
    if (!settings.githubToken || !settings.repo) {
      setStatus("GitHub settings are missing. Open Extension Options and save them once.");
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url?.includes("geeksforgeeks.org")) {
      setStatus("Open a GeeksForGeeks problem page first.");
      return;
    }

    const page = await readGfgPage(tab.id);
    if (!page?.title || !page?.code || page.code.length < 10) {
      setStatus("Could not read the GFG editor. Keep the code visible and click Save Solution again.");
      return;
    }

    const branch = settings.branch || "main";
    const category = detectCategory(page.title, page.url);
    const language = detectLanguage(page.code);
    const extension = getExtension(language);
    const safeTitle = page.title.replace(/[^a-zA-Z0-9 _-]/g, "").trim() || "solution";
    const folder = `${category}/${safeTitle}`;

    setStatus(`Detected: ${category}\nLanguage: ${language}\nUploading...`);

    await putFile(settings.repo, `${folder}/Solution.${extension}`, page.code + "\n", `feat: add GFG solution - ${page.title}`, branch, settings.githubToken);
    await putFile(settings.repo, `${folder}/README.md`, makeReadme(page.title, page.url, language, category, page.code), `docs: add README for GFG - ${page.title}`, branch, settings.githubToken);

    setStatus(`Saved!\n${folder}/Solution.${extension}\n${folder}/README.md`);
  } catch (error) {
    setStatus(`Error: ${error.message}`);
  }
}

document.getElementById("save").addEventListener("click", saveSolution);
