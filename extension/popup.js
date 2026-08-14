const status = document.getElementById("status");

function setStatus(text) {
  status.textContent = text;
}

async function getSettings() {
  return await chrome.storage.local.get(["githubToken", "repo", "branch"]);
}

async function saveSolution() {
  try {
    setStatus("Reading GFG page...");

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const page = await chrome.tabs.sendMessage(tab.id, { type: "GET_GFG_SOLUTION" });

    if (!page?.title || !page?.code) {
      setStatus("Could not detect the problem/code. Make sure the GFG editor is visible.");
      return;
    }

    const settings = await getSettings();
    if (!settings.githubToken || !settings.repo) {
      setStatus("Open extension Options and configure GitHub first.");
      return;
    }

    const branch = settings.branch || "main";
    const safeTitle = page.title.replace(/[^a-zA-Z0-9 _-]/g, "").trim() || "solution";
    const path = `Uncategorized/${safeTitle}/Solution.java`;

    const content = page.code + "\n";
    const encoded = btoa(unescape(encodeURIComponent(content)));

    const response = await fetch(`https://api.github.com/repos/${settings.repo}/contents/${encodeURIComponent(path)}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${settings.githubToken}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `feat: add GFG solution - ${page.title}`,
        content: encoded,
        branch
      })
    });

    const data = await response.json();
    if (!response.ok) {
      setStatus(`GitHub error: ${data.message || response.status}`);
      return;
    }

    setStatus(`Saved!\n${path}`);
  } catch (error) {
    setStatus(`Error: ${error.message}`);
  }
}

document.getElementById("save").addEventListener("click", saveSolution);
