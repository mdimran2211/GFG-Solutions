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
// READ GFG ACE EDITOR
// ========================================

function getAceEditorCode() {

  const editors = [
    ...document.querySelectorAll(".ace_editor")
  ];

  let bestCode = "";

  for (const editor of editors) {

    const code = cleanCode(
      editor.innerText ||
      editor.textContent ||
      ""
    );

    if (code.length > bestCode.length) {
      bestCode = code;
    }
  }

  return bestCode;
}


// ========================================
// REMOVE ACE LINE NUMBERS
// ========================================

function removeLineNumbers(code) {

  const lines = code.split("\n");

  // Your screenshot/console shows:
  //
  // 1
  // 2
  // 3
  // ...
  // 20
  // class Solution {
  //
  // Remove those standalone numbers.

  let startIndex = 0;

  while (
    startIndex < lines.length &&
    /^\s*\d+\s*$/.test(lines[startIndex])
  ) {
    startIndex++;
  }

  return lines
    .slice(startIndex)
    .join("\n")
    .trim();
}


// ========================================
// MAIN EDITOR CODE
// ========================================

function getEditorCode() {

  // 1. ACE editor
  let code = getAceEditorCode();

  if (code.length >= 10) {

    code = removeLineNumbers(code);

    if (code.length >= 10) {

      console.log(
        "GFG Sync: ACE editor detected"
      );

      console.log(
        "Code length:",
        code.length
      );

      console.log(
        "Code:",
        code
      );

      return code;
    }
  }


  // 2. ACE textarea fallback
  const aceTextarea =
    document.querySelector(
      ".ace_editor textarea"
    );

  if (aceTextarea) {

    code = cleanCode(
      aceTextarea.value ||
      aceTextarea.textContent ||
      ""
    );

    if (code.length >= 10) {

      console.log(
        "GFG Sync: ACE textarea detected"
      );

      return code;
    }
  }


  // 3. Generic textarea fallback
  const textareas = [
    ...document.querySelectorAll("textarea")
  ];

  for (const textarea of textareas) {

    code = cleanCode(
      textarea.value ||
      textarea.textContent ||
      ""
    );

    if (code.length >= 10) {

      console.log(
        "GFG Sync: generic textarea detected"
      );

      return code;
    }
  }


  return "";
}


// ========================================
// LANGUAGE
// ========================================

function detectLanguage(code) {

  if (
    /\bclass\s+Solution\b/.test(code) ||
    /System\.out\.println/.test(code) ||
    /import\s+java\./.test(code) ||
    /\bpublic\s+static\s+/.test(code)
  ) {
    return "Java";
  }


  if (
    /\bdef\s+\w+\s*\(/.test(code) ||
    /\bprint\s*\(/.test(code) ||
    /import\s+(numpy|pandas)/.test(code)
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
        detectLanguage(code);


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
