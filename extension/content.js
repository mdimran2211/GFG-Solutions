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

  return (
    document.title
      .replace(/\s*[-|].*$/, "")
      .trim() || "GFG Problem"
  );
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


// ========================================
// ACE EDITOR
// ========================================

function getAceCode() {
  try {
    const editors = [
      ...document.querySelectorAll(".ace_editor")
    ];

    let bestCode = "";

    for (const editor of editors) {

      const lines = [
        ...editor.querySelectorAll(
          ".ace_text-layer .ace_line"
        )
      ];

      if (!lines.length) {
        continue;
      }

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

      if (code.length > bestCode.length) {
        bestCode = code;
      }
    }

    return cleanCode(bestCode);

  } catch (error) {

    console.error(
      "ACE editor read error:",
      error
    );

    return "";
  }
}


// ========================================
// ACE textarea fallback
// ========================================

function getAceTextareaCode() {
  try {

    const textareas = [
      ...document.querySelectorAll(
        ".ace_editor textarea"
      )
    ];

    let bestCode = "";

    for (const textarea of textareas) {

      const value =
        textarea.value ||
        textarea.textContent ||
        "";

      if (value.trim().length > bestCode.length) {
        bestCode = value.trim();
      }
    }

    return cleanCode(bestCode);

  } catch (error) {

    console.error(
      "ACE textarea error:",
      error
    );

    return "";
  }
}


// ========================================
// Generic textarea fallback
// ========================================

function getGenericTextareaCode() {

  try {

    const textareas = [
      ...document.querySelectorAll("textarea")
    ];

    let bestCode = "";

    for (const textarea of textareas) {

      const value =
        textarea.value ||
        textarea.textContent ||
        "";

      if (
        value.trim().length >
        bestCode.length
      ) {
        bestCode = value.trim();
      }
    }

    return cleanCode(bestCode);

  } catch (error) {

    return "";
  }
}


// ========================================
// MAIN CODE DETECTION
// ========================================

function getEditorCode() {

  // 1. ACE rendered lines
  let code = getAceCode();

  if (code.length >= 10) {
    console.log(
      "GFG Sync: ACE code detected"
    );

    return code;
  }


  // 2. ACE textarea
  code = getAceTextareaCode();

  if (code.length >= 10) {
    console.log(
      "GFG Sync: ACE textarea detected"
    );

    return code;
  }


  // 3. Generic textarea
  code = getGenericTextareaCode();

  if (code.length >= 10) {
    console.log(
      "GFG Sync: textarea code detected"
    );

    return code;
  }


  return "";
}


// ========================================
// LANGUAGE DETECTION
// ========================================

function detectLanguage() {

  try {

    const editor =
      document.querySelector(".ace_editor");

    if (editor) {

      const classes =
        editor.className || "";

      if (
        classes.includes("java")
      ) {
        return "Java";
      }

      if (
        classes.includes("python")
      ) {
        return "Python";
      }

      if (
        classes.includes("cpp") ||
        classes.includes("c_cpp")
      ) {
        return "C++";
      }

      if (
        classes.includes("javascript")
      ) {
        return "JavaScript";
      }
    }

  } catch (error) {

    console.log(
      "Language detection error:",
      error
    );
  }

  return "Java";
}


// ========================================
// MESSAGE LISTENER
// ========================================

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {

    if (
      message?.type !==
      "GET_GFG_SOLUTION"
    ) {
      return;
    }

    try {

      const title =
        getProblemTitle();

      const url =
        getProblemUrl();

      const code =
        getEditorCode();

      const language =
        detectLanguage();

      console.log(
        "========== GFG SYNC =========="
      );

      console.log(
        "Title:",
        title
      );

      console.log(
        "Language:",
        language
      );

      console.log(
        "Code length:",
        code.length
      );

      console.log(
        "Code:",
        code
      );

      console.log(
        "=============================="
      );


      sendResponse({

        success:
          code.length >= 10,

        title,

        url,

        code,

        language

      });

    } catch (error) {

      console.error(
        "GFG Sync error:",
        error
      );

      sendResponse({

        success: false,

        title: "",

        url:
          window.location.href,

        code: "",

        language: "Java",

        error:
          error.message

      });
    }

    return true;
  }
);
