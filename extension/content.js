function getProblemTitle() {
  const selectors = [
    "h1",
    "[class*='problemTitle']",
    "[class*='ProblemTitle']"
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el?.innerText?.trim()) return el.innerText.trim();
  }

  const title = document.title.replace(/\s*[-|].*$/, "").trim();
  return title || "GFG Problem";
}

function getProblemUrl() {
  return window.location.href.split("?")[0];
}

function getVisibleEditorCode() {
  // GFG uses Monaco. The source is rendered in .view-lines while the textarea
  // is mainly an input surface and often has no useful value.
  const monacoLines = document.querySelector(".monaco-editor .view-lines");
  if (monacoLines) {
    const lines = [...monacoLines.querySelectorAll(".view-line")]
      .map(line => line.innerText || line.textContent || "")
      .join("\n")
      .trim();

    if (lines.length > 20) return lines;
  }

  const selectors = [
    ".monaco-editor textarea",
    "textarea",
    "pre code"
  ];

  for (const selector of selectors) {
    const elements = [...document.querySelectorAll(selector)];
    for (const el of elements) {
      const value = el.value || el.innerText || el.textContent;
      if (value && value.trim().length > 20) return value.trim();
    }
  }

  return "";
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "GET_GFG_SOLUTION") return;

  sendResponse({
    title: getProblemTitle(),
    url: getProblemUrl(),
    code: getVisibleEditorCode()
  });
});
