// ================================
// GFG → GitHub Sync
// popup.js
// ================================

const status = document.getElementById("status");

function setStatus(text) {
  status.textContent = text;
}


// ========================================
// GitHub Settings
// ========================================

async function getSettings() {
  return await chrome.storage.local.get([
    "githubToken",
    "repo",
    "branch"
  ]);
}


// ========================================
// Detect Problem Category
// ========================================

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


// ========================================
// Detect Programming Language
// ========================================

function detectLanguage(code, detectedLanguage) {

  // Use editor-detected language if available
  if (
    detectedLanguage &&
    detectedLanguage !== "text"
  ) {
    return detectedLanguage;
  }

  // Java
  if (
    /\bclass\s+Solution\b/.test(code) ||
    /System\.out\.println/.test(code) ||
    /import\s+java\./.test(code) ||
    /\bpublic\s+static\s+/.test(code)
  ) {
    return "Java";
  }

  // Python
  if (
    /\bdef\s+\w+\s*\(/.test(code) ||
    /import\s+(numpy|pandas)/.test(code) ||
    /\bprint\s*\(/.test(code)
  ) {
    return "Python";
  }

  // C++
  if (
    /#include\s*</.test(code) ||
    /std::cout/.test(code) ||
    /using\s+namespace\s+std/.test(code)
  ) {
    return "C++";
  }

  // JavaScript
  if (
    /console\.log\s*\(/.test(code) ||
    /function\s+\w+\s*\(/.test(code)
  ) {
    return "JavaScript";
  }

  // GFG default
  return "Java";
}


// ========================================
// File Extension
// ========================================

function getExtension(language) {

  const extensions = {
    Java: "java",
    Python: "py",
    "C++": "cpp",
    JavaScript: "js"
  };

  return extensions[language] || "txt";
}


// ========================================
// Generate README
// ========================================

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


// ========================================
// Base64 Encode UTF-8
// ========================================

function encodeBase64(content) {

  return btoa(
    unescape(
      encodeURIComponent(content)
    )
  );
}


// ========================================
// Get Existing GitHub File SHA
// ========================================

async function getExistingFile(
  repo,
  path,
  branch,
  token
) {

  const url =
    `https://api.github.com/repos/${repo}/contents/` +
    path
      .split("/")
      .map(encodeURIComponent)
      .join("/") +
    `?ref=${encodeURIComponent(branch)}`;

  const response = await fetch(url, {

    method: "GET",

    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json"
    }
  });

  if (response.status === 404) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      `GitHub HTTP ${response.status}`
    );
  }

  return data;
}


// ========================================
// Upload / Update File on GitHub
// ========================================

async function putFile(
  repo,
  path,
  content,
  message,
  branch,
  token
) {

  const encoded =
    encodeBase64(content);

  const url =
    `https://api.github.com/repos/${repo}/contents/` +
    path
      .split("/")
      .map(encodeURIComponent)
      .join("/");

  // Check whether file already exists
  let existing = null;

  try {

    existing =
      await getExistingFile(
        repo,
        path,
        branch,
        token
      );

  } catch (error) {

    console.log(
      "Could not check existing file:",
      error
    );
  }

  const body = {
    message,
    content: encoded,
    branch
  };

  // GitHub requires SHA when updating an existing file
  if (existing?.sha) {
    body.sha = existing.sha;
  }

  const response =
    await fetch(url, {

      method: "PUT",

      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json"
      },

      body: JSON.stringify(body)
    });

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      data.message ||
      `GitHub HTTP ${response.status}`
    );
  }

  return data;
}


// ========================================
// Read GFG Page
// ========================================

async function readGfgPage(tabId) {

  // ========================================
  // METHOD 1
  // Ask content.js
  // ========================================

  try {

    console.log(
      "GFG Sync: asking content.js..."
    );

    const response =
      await chrome.tabs.sendMessage(
        tabId,
        {
          type: "GET_GFG_SOLUTION"
        }
      );

    console.log(
      "Content script response:",
      response
    );

    if (
      response?.success &&
      response?.code &&
      response.code.trim().length >= 10
    ) {

      return response;
    }

  } catch (error) {

    console.log(
      "Content script unavailable:",
      error
    );
  }


  // ========================================
  // METHOD 2
  // Direct ACE Editor extraction
  // ========================================

  try {

    console.log(
      "GFG Sync: trying ACE editor directly..."
    );

    const results =
      await chrome.scripting.executeScript({

        target: {
          tabId
        },

        func: () => {

          function clean(value) {

            return (value || "")
              .replace(/\u00a0/g, " ")
              .replace(/\r/g, "")
              .trim();
          }


          // ==================================
          // Find ACE Editors
          // ==================================

          const editors = [
            ...document.querySelectorAll(
              ".ace_editor"
            )
          ];


          let bestCode = "";


          // ==================================
          // Read ACE rendered lines
          // ==================================

          for (const editor of editors) {

            const lines = [
              ...editor.querySelectorAll(
                ".ace_text-layer .ace_line"
              )
            ];

            const code = lines
              .map(line => {

                return (
                  line.innerText ||
                  line.textContent ||
                  ""
                );

              })
              .join("\n")
              .trim();


            if (
              code.length >
              bestCode.length
            ) {

              bestCode = code;
            }
          }


          // ==================================
          // ACE textarea fallback
          // ==================================

          if (
            bestCode.length < 10
          ) {

            const aceTextareas = [
              ...document.querySelectorAll(
                ".ace_editor textarea"
              )
            ];


            for (
              const textarea
              of aceTextareas
            ) {

              const value =
                clean(
                  textarea.value ||
                  textarea.textContent ||
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


          // ==================================
          // Generic textarea fallback
          // ==================================

          if (
            bestCode.length < 10
          ) {

            const textareas = [
              ...document.querySelectorAll(
                "textarea"
              )
            ];


            for (
              const textarea
              of textareas
            ) {

              const value =
                clean(
                  textarea.value ||
                  textarea.textContent ||
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


          // ==================================
          // Contenteditable fallback
          // ==================================

          if (
            bestCode.length < 10
          ) {

            const editable = [
              ...document.querySelectorAll(
                "[contenteditable='true']"
              )
            ];


            for (
              const element
              of editable
            ) {

              const value =
                clean(
                  element.innerText ||
                  element.textContent ||
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


          // ==================================
          // Find title
          // ==================================

          const heading =
            document.querySelector("h1");


          const title =
            heading?.innerText?.trim() ||

            document.title
              .replace(/\s*[-|].*$/, "")
              .trim() ||

            "GFG Problem";


          // ==================================
          // Detect language
          // ==================================

          let language = "Java";

          const languageElements = [
            ...document.querySelectorAll(
              ".ace_editor"
            )
          ];


          for (
            const editor
            of languageElements
          ) {

            const className =
              typeof editor.className === "string"
                ? editor.className.toLowerCase()
                : "";


            if (
              className.includes("python")
            ) {

              language = "Python";
              break;

            }


            if (
              className.includes("java")
            ) {

              language = "Java";
              break;

            }


            if (
              className.includes("c_cpp") ||
              className.includes("cpp")
            ) {

              language = "C++";
              break;

            }


            if (
              className.includes(
                "javascript"
              )
            ) {

              language = "JavaScript";
              break;

            }
          }


          return {

            success:
              bestCode.length >= 10,

            title,

            url:
              window.location.href
                .split("?")[0],

            code:
              bestCode,

            language
          };
        }
      });


    const result =
      results?.[0]?.result;


    console.log(
      "Direct ACE result:",
      result
    );


    return result || null;

  } catch (error) {

    console.error(
      "Direct ACE extraction failed:",
      error
    );

    return null;
  }
}


// ========================================
// Main Save Function
// ========================================

async function saveSolution() {

  try {

    // --------------------------------
    // Step 1
    // --------------------------------

    setStatus(
      "Reading GFG page..."
    );


    // --------------------------------
    // Step 2
    // GitHub settings
    // --------------------------------

    const settings =
      await getSettings();


    if (
      !settings.githubToken ||
      !settings.repo
    ) {

      setStatus(
        "GitHub settings are missing.\n\n" +
        "Open Extension Options and save them once."
      );

      return;
    }


    // --------------------------------
    // Step 3
    // Current tab
    // --------------------------------

    const [tab] =
      await chrome.tabs.query({

        active: true,

        currentWindow: true
      });


    if (
      !tab?.id
    ) {

      setStatus(
        "Could not find the current browser tab."
      );

      return;
    }


    if (
      !tab.url ||
      !(
        tab.url.includes(
          "geeksforgeeks.org"
        )
      )
    ) {

      setStatus(
        "Open a GeeksForGeeks problem page first."
      );

      return;
    }


    // --------------------------------
    // Step 4
    // Read GFG
    // --------------------------------

    const page =
      await readGfgPage(tab.id);


    if (
      !page
    ) {

      setStatus(
        "Could not communicate with the GFG page.\n\n" +
        "Reload the extension and GFG page once."
      );

      return;
    }


    if (
      !page.code ||
      page.code.trim().length < 10
    ) {

      setStatus(
        "Could not read the GFG editor.\n\n" +
        "The ACE editor was found, but no code could be extracted."
      );

      console.log(
        "Full GFG page result:",
        page
      );

      return;
    }


    // --------------------------------
    // Step 5
    // Detect details
    // --------------------------------

    const title =
      page.title ||
      "GFG Problem";


    const url =
      page.url ||
      tab.url;


    const code =
      page.code.trim();


    const branch =
      settings.branch ||
      "main";


    const category =
      detectCategory(
        title,
        url
      );


    const language =
      detectLanguage(
        code,
        page.language
      );


    const extension =
      getExtension(
        language
      );


    // --------------------------------
    // Step 6
    // Safe filename
    // --------------------------------

    const safeTitle =
      title
        .replace(
          /[^a-zA-Z0-9 _-]/g,
          ""
        )
        .trim()
        .replace(
          /\s+/g,
          " "
        ) ||
      "solution";


    const folder =
      `${category}/${safeTitle}`;


    // --------------------------------
    // Step 7
    // Show detection
    // --------------------------------

    setStatus(

      `Detected successfully!\n\n` +

      `Problem: ${title}\n` +

      `Category: ${category}\n` +

      `Language: ${language}\n` +

      `Code: ${code.length} characters\n\n` +

      `Uploading to GitHub...`

    );


    // --------------------------------
    // Step 8
    // Upload Solution
    // --------------------------------

    await putFile(

      settings.repo,

      `${folder}/Solution.${extension}`,

      code + "\n",

      `feat: add GFG solution - ${title}`,

      branch,

      settings.githubToken

    );


    // --------------------------------
    // Step 9
    // Upload README
    // --------------------------------

    await putFile(

      settings.repo,

      `${folder}/README.md`,

      makeReadme(
        title,
        url,
        language,
        category,
        code
      ),

      `docs: add README for GFG - ${title}`,

      branch,

      settings.githubToken

    );


    // --------------------------------
    // Step 10
    // Success
    // --------------------------------

    setStatus(

      `✅ Saved successfully!\n\n` +

      `${folder}/Solution.${extension}\n` +

      `${folder}/README.md`

    );


  } catch (error) {

    console.error(
      "GFG → GitHub Error:",
      error
    );


    setStatus(

      `❌ Error:\n${error.message}`

    );
  }
}


// ========================================
// Save Button
// ========================================

const saveButton =
  document.getElementById("save");


if (saveButton) {

  saveButton.addEventListener(
    "click",
    saveSolution
  );

}
