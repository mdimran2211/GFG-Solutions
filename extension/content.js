// ================================
// GFG → GitHub Sync
// content.js
// ================================

function getProblemTitle() {
  const selectors = [
    "h1",
    "[class*='problemTitle']",
    "[class*='ProblemTitle']",
    "[class*='problem-title']"
  ];

  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);

    for (const el of elements) {
      const text = el?.innerText?.trim();

      if (text && text.length > 2) {
        return text;
      }
    }
  }

  const title = document.title
    .replace(/\s*[-|].*$/, "")
    .trim();

  return title || "GFG Problem";
}

function getProblemUrl() {
  return window.location.href.split("?")[0];
}

function cleanCode(code) {
  return (code || "")
    .replace(/\u00a0/g, " ")
    .replace(/\r/g, "")
    .trim();
}

// --------------------------------
// Try Monaco rendered editor
// --------------------------------
function getMonacoRenderedCode() {
  try {
    const editors = [
      ...document.querySelectorAll(".monaco-editor")
    ];

    let bestCode = "";

    for (const editor of editors) {
      const lines = [
        ...editor.querySelectorAll(".view-lines .view-line")
      ];

      if (!lines.length) continue;

      const code = lines
        .map(line =>
          cleanCode(
            line.innerText ||
            line.textContent ||
            ""
          )
        )
        .join("\n")
        .trim();

      if (code.length > bestCode.length) {
        bestCode = code;
      }
    }

    return bestCode;
  } catch (error) {
    console.log("Monaco rendered code error:", error);
    return "";
  }
}

// --------------------------------
// Try textarea/editor fallback
// --------------------------------
function getTextareaCode() {
  const selectors = [
    "textarea",
    "pre code",
    "[contenteditable='true']"
  ];

  let bestCode = "";

  for (const selector of selectors) {
    const elements = [
      ...document.querySelectorAll(selector)
    ];

    for (const el of elements) {
      const code = cleanCode(
        el.value ||
        el.innerText ||
        el.textContent ||
        ""
      );

      if (code.length > bestCode.length) {
        bestCode = code;
      }
    }
  }

  return bestCode;
}

// --------------------------------
// Get current editor code
// --------------------------------
function getVisibleEditorCode() {

  // 1. Monaco rendered code
  let code = getMonacoRenderedCode();

  if (code.length >= 10) {
    return code;
  }

  // 2. Textarea/contenteditable fallback
  code = getTextareaCode();

  if (code.length >= 10) {
    return code;
  }

  return "";
}

// --------------------------------
// Detect language
// --------------------------------
function detectLanguage() {

  try {
    const editors = [
      ...document.querySelectorAll(".monaco-editor")
    ];

    for (const editor of editors) {

      const classes = editor.className || "";

      if (classes.includes("language-java")) {
        return "Java";
      }

      if (classes.includes("language-python")) {
        return "Python";
      }

      if (
        classes.includes("language-cpp") ||
        classes.includes("language-c++")
      ) {
        return "C++";
      }

      if (
        classes.includes("language-javascript") ||
        classes.includes("language-js")
      ) {
        return "JavaScript";
      }
    }

  } catch (error) {
    console.log("Language detection failed:", error);
  }

  return "Java";
}

// --------------------------------
// Message listener
// --------------------------------
chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {

    if (message?.type !== "GET_GFG_SOLUTION") {
      return;
    }

    try {

      const title = getProblemTitle();
      const url = getProblemUrl();
      const code = getVisibleEditorCode();
      const language = detectLanguage();

      console.log("GFG Sync:");
      console.log("Title:", title);
      console.log("Language:", language);
      console.log("Code length:", code.length);

      sendResponse({
        success: code.length >= 10,
        title,
        url,
        code,
        language
      });

    } catch (error) {

      console.error(
        "GFG content script error:",
        error
      );

      sendResponse({
        success: false,
        title: "",
        url: window.location.href,
        code: "",
        language: "Java",
        error: error.message
      });
    }

    return true;
  }
);
