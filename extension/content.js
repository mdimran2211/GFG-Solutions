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

  return document.title.replace(/\s*[-|].*$/, "").trim();
}

function getProblemUrl() {
  return window.location.href.split("?")[0];
}

function getVisibleEditorCode() {
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
