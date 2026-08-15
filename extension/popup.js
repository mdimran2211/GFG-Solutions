// ================================
// GFG → GitHub Sync
// popup.js
// ================================

const status = document.getElementById("status");

function setStatus(text) {
  status.textContent = text;
}

// --------------------------------
// GitHub settings
// --------------------------------
async function getSettings() {
  return await chrome.storage.local.get([
    "githubToken",
    "repo",
    "branch"
  ]);
}

// --------------------------------
// Detect category
// --------------------------------
function detectCategory(title, url) {

  const text = `${title} ${url}`.toLowerCase();

  const rules = [

    [
      "Arrays",
      [
        "array",
        "subarray",
        "subsequence",
        "two sum",
        "kadane",
        "rotate array"
      ]
    ],

    [
      "Strings",
      [
        "string",
        "palindrome",
        "anagram",
        "substring"
      ]
    ],

    [
      "LinkedList",
      [
        "linked list",
        "doubly linked",
        "circular linked"
      ]
    ],

    [
      "Stack",
      [
        "stack",
        "parenthesis",
        "balanced brackets"
      ]
    ],

    [
      "Queue",
      [
        "queue",
        "deque"
      ]
    ],

    [
      "Trees",
      [
        "binary tree",
        "bst",
        "binary search tree",
        "tree traversal"
      ]
    ],

    [
      "Graphs",
      [
        "graph",
        "bfs",
        "dfs",
        "dijkstra",
        "topological"
      ]
    ],

    [
      "Dynamic Programming",
      [
        "dynamic programming",
        "knapsack",
        "memoization",
        "dp"
      ]
    ],

    [
      "Searching",
      [
        "binary search",
        "search in",
        "searching"
      ]
    ],

    [
      "Sorting",
      [
        "sort",
        "sorting",
        "merge sort",
        "quick sort"
      ]
    ],

    [
      "Mathematics",
      [
        "prime",
        "factorial",
        "gcd",
        "lcm",
        "fibonacci",
        "number",
        "divisor",
        "power"
      ]
    ],

    [
      "Bit Manipulation",
      [
        "bit manipulation",
        "bitwise",
        "xor",
        "set bit"
      ]
    ],

    [
      "Greedy",
      [
        "greedy"
      ]
    ],

    [
      "Heap",
      [
        "heap",
        "priority queue",
        "kth largest",
        "kth smallest"
      ]
    ]

  ];

  for (const [category, keywords] of rules) {

    if (
      keywords.some(keyword =>
        text.includes(keyword)
      )
    ) {
      return category;
    }
  }

  return "Miscellaneous";
}

// --------------------------------
// Detect programming language
// --------------------------------
function detectLanguage(code, detectedLanguage) {

  if (detectedLanguage) {
    return detectedLanguage;
  }

  if (
    /\bclass\s+Solution\b/.test(code) ||
    /System\.out\.println/.test(code) ||
    /import\s+java\./.test(code)
  ) {
    return "Java";
  }

  if (
    /\bdef\s+\w+\s*\(/.test(code) ||
    /import\s+(numpy|pandas)/.test(code) ||
    /\bprint\s*\(/.test(code)
  ) {
    return "Python";
  }

  if (
    /#include\s*</.test(code) ||
    /std::cout/.test(code) ||
    /using\s+namespace\s+std/.test(code)
  ) {
    return "C++";
  }

  if (
    /console\.log\s*\(/.test(code) ||
    /function\s+\w+\s*\(/.test(code)
  ) {
    return "JavaScript";
  }

  return "Java";
}

// --------------------------------
// File extension
// --------------------------------
function getExtension(language) {

  const extensions = {
    Java: "java",
    Python: "py",
    "C++": "cpp",
    JavaScript: "js"
  };

  return extensions[language] || "txt";
}

// --------------------------------
// README
// --------------------------------
function makeReadme(
  title,
  url,
  language,
  category,
  code
) {

  const hasLoop =
    /\b(for|while)\s*\(/.test(code);

  const complexityHint = hasLoop
    ? "Analyze the loops in the solution to determine the exact time and space complexity."
    : "Analyze the operations in the solution to determine the exact time and space complexity.";

  return (
    `# ${title}\n\n` +

    `- **Platform:** GeeksForGeeks\n` +
    `- **Category:** ${category}\n` +
    `- **Language:** ${language}\n` +
    `- **Problem:** ${url}\n\n` +

    `## Approach\n\n` +
    `Solution submitted on GeeksForGeeks.\n\n` +

    `## Complexity\n\n` +
    `${complexityHint}\n\n` +

    `## Notes\n\n` +
    `This solution was automatically synced from the GFG editor.\n`
  );
}

// --------------------------------
// Upload file to GitHub
// --------------------------------
async function putFile(
  repo,
  path,
  content,
  message,
  branch,
  token
) {

  const encoded = btoa(
    unescape(
      encodeURIComponent(content)
    )
  );

  const url =
    `https://api.github.com/repos/${repo}/contents/` +
    path
      .split("/")
      .map(encodeURIComponent)
      .join("/");

  const response = await fetch(url, {
    method: "PUT",

    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      message,
      content: encoded,
      branch
    })
  });

  const data = await response.json();

  if (!response.ok) {

    // If file already exists, GitHub requires SHA.
    if (
      response.status === 422 &&
      data?.message?.includes("already exists")
    ) {
      throw new Error(
        `File already exists: ${path}`
      );
    }

    throw new Error(
      data.message ||
      `GitHub HTTP ${response.status}`
    );
  }

  return data;
}

// --------------------------------
// Read GFG using content.js
// --------------------------------
async function readGfgPage(tabId) {

  // --------------------------------
  // Method 1: content.js
  // --------------------------------
  try {

    console.log(
      "Trying content script..."
    );

    const response =
      await chrome.tabs.sendMessage(
        tabId,
        {
          type: "GET_GFG_SOLUTION"
        }
      );

    if (
      response?.success &&
      response?.code &&
      response.code.trim().length >= 10
    ) {

      console.log(
        "Content script succeeded"
      );

      return response;
    }

  } catch (error) {

    console.log(
      "Content script unavailable:",
      error
    );
  }

  // --------------------------------
  // Method 2: Direct page inspection
  // --------------------------------
  try {

    console.log(
      "Trying direct page inspection..."
    );

    const results =
      await chrome.scripting.executeScript({

        target: {
          tabId
        },

        func: () => {

          function visible(el) {

            const rect =
              el.getBoundingClientRect();

            const style =
              getComputedStyle(el);

            return (
              rect.width > 0 &&
              rect.height > 0 &&
              style.display !== "none" &&
              style.visibility !== "hidden"
            );
          }

          function clean(value) {

            return (value || "")
              .replace(/\u00a0/g, " ")
              .replace(/\r/g, "")
              .trim();
          }

          // ----------------------------
          // Monaco
          // ----------------------------
          const editors = [
            ...document.querySelectorAll(
              ".monaco-editor"
            )
          ].filter(visible);

          let bestCode = "";

          for (const editor of editors) {

            const lines = [
              ...editor.querySelectorAll(
                ".view-lines .view-line"
              )
            ];

            const code = lines
              .map(line =>
                clean(
                  line.innerText ||
                  line.textContent ||
                  ""
                )
              )
              .join("\n")
              .trim();

            if (
              code.length >
              bestCode.length
            ) {
              bestCode = code;
            }
          }

          // ----------------------------
          // Fallback editors
          // ----------------------------
          if (bestCode.length < 10) {

            const candidates = [
              ...document.querySelectorAll(
                "textarea"
              ),

              ...document.querySelectorAll(
                "pre code"
              ),

              ...document.querySelectorAll(
                "[contenteditable='true']"
              )
            ];

            for (const el of candidates) {

              if (!visible(el)) {
                continue;
              }

              const value = clean(
                el.value ||
                el.innerText ||
                el.textContent ||
                ""
              );

              if (
                value.length >
                bestCode.length
              ) {
                bestCode = value;
              }
            }
          }

          // ----------------------------
          // Title
          // ----------------------------
          const heading =
            document.querySelector("h1");

          const title =
            heading?.innerText?.trim() ||
            document.title
              .replace(/\s*[-|].*$/, "")
              .trim() ||
            "GFG Problem";

          return {
            success:
              bestCode.length >= 10,

            title,

            url:
              window.location.href
                .split("?")[0],

            code:
              bestCode,

            language:
              "Java"
          };
        }
      });

    return (
      results?.[0]?.result ||
      null
    );

  } catch (error) {

    console.error(
      "Direct page inspection failed:",
      error
    );

    return null;
  }
}

// --------------------------------
// Save solution
// --------------------------------
async function saveSolution() {

  try {

    setStatus(
      "Reading GFG page..."
    );

    // ----------------------------
    // Settings
    // ----------------------------
    const settings =
      await getSettings();

    if (
      !settings.githubToken ||
      !settings.repo
    ) {

      setStatus(
        "GitHub settings are missing. " +
        "Open Extension Options and save them once."
      );

      return;
    }

    // ----------------------------
    // Current tab
    // ----------------------------
    const [tab] =
      await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

    if (
      !tab?.id ||
      !tab.url ||
      !tab.url.includes(
        "geeksforgeeks.org"
      )
    ) {

      setStatus(
        "Open a GeeksForGeeks problem page first."
      );

      return;
    }

    // ----------------------------
    // Read GFG
    // ----------------------------
    const page =
      await readGfgPage(tab.id);

    if (
      !page ||
      !page.code ||
      page.code.trim().length < 10
    ) {

      setStatus(
        "Could not read the GFG editor.\n\n" +
        "Make sure the code editor is open and your solution is visible."
      );

      return;
    }

    // ----------------------------
    // Detect details
    // ----------------------------
    const branch =
      settings.branch || "main";

    const category =
      detectCategory(
        page.title,
        page.url
      );

    const language =
      detectLanguage(
        page.code,
        page.language
      );

    const extension =
      getExtension(language);

    const safeTitle =
      page.title
        .replace(
          /[^a-zA-Z0-9 _-]/g,
          ""
        )
        .trim() ||
      "solution";

    const folder =
      `${category}/${safeTitle}`;

    // ----------------------------
    // Upload status
    // ----------------------------
    setStatus(
      `Detected: ${category}\n` +
      `Language: ${language}\n` +
      `Code: ${page.code.length} characters\n\n` +
      `Uploading...`
    );

    // ----------------------------
    // Solution
    // ----------------------------
    await putFile(
      settings.repo,

      `${folder}/Solution.${extension}`,

      page.code + "\n",

      `feat: add GFG solution - ${page.title}`,

      branch,

      settings.githubToken
    );

    // ----------------------------
    // README
    // ----------------------------
    await putFile(
      settings.repo,

      `${folder}/README.md`,

      makeReadme(
        page.title,
        page.url,
        language,
        category,
        page.code
      ),

      `docs: add README for GFG - ${page.title}`,

      branch,

      settings.githubToken
    );

    // ----------------------------
    // Success
    // ----------------------------
    setStatus(
      `Saved successfully!\n\n` +
      `${folder}/Solution.${extension}\n` +
      `${folder}/README.md`
    );

  } catch (error) {

    console.error(
      "Save Solution Error:",
      error
    );

    setStatus(
      `Error: ${error.message}`
    );
  }
}

// --------------------------------
// Button
// --------------------------------
const saveButton =
  document.getElementById("save");

if (saveButton) {

  saveButton.addEventListener(
    "click",
    saveSolution
  );
}
