const token = document.getElementById("token");
const repo = document.getElementById("repo");
const branch = document.getElementById("branch");
const status = document.getElementById("status");

chrome.storage.local.get(["githubToken", "repo", "branch"], (data) => {
  token.value = data.githubToken || "";
  repo.value = data.repo || "mdimran2211/GFG-Solutions";
  branch.value = data.branch || "main";
});

document.getElementById("save").addEventListener("click", async () => {
  await chrome.storage.local.set({
    githubToken: token.value.trim(),
    repo: repo.value.trim(),
    branch: branch.value.trim() || "main"
  });
  status.textContent = " Saved!";
});
