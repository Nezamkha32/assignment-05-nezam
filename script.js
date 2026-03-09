const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const container = document.getElementById("issuesContainer");
const spinner = document.getElementById("spinner");
const modal = document.getElementById("issueModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalAuthor = document.getElementById("modalAuthor");
const modalCategory = document.getElementById("modalCategory");
const modalPriority = document.getElementById("modalPriority");
const modalStatus = document.getElementById("modalStatus");

// Show/Hide Spinner
function showSpinner() { spinner.classList.remove("hidden"); }
function hideSpinner() { spinner.classList.add("hidden"); }

// Load Issues
async function loadIssues(type="all") {
  showSpinner();
  container.innerHTML = "";

  let url = API;
  if(type === "open") url += "?status=open";
  if(type === "closed") url += "?status=closed";

  console.log("Fetching issues from:", url);

  const res = await fetch(url);
  const data = await res.json();

  console.log("API Response:", data);

  hideSpinner();

  // যদি data object হয় {issues: [...]}
  if (data.issues) {
    displayIssues(data.issues);
  } else {
    displayIssues(data);
  }
}

// Display Issues
function displayIssues(issues) {
  console.log("Rendering issues:", issues);

  if (!Array.isArray(issues)) {
    console.warn("Issues is not an array!", issues);
    return;
  }

  issues.forEach(issue => {
    console.log("Issue card:", issue);

    const card = document.createElement("div");
    card.className = `card bg-white shadow-md border-t-4 cursor-pointer ${
      issue.status === "Open" ? "border-green-500" : "border-purple-500"
    }`;
    card.innerHTML = `
      <div class="card-body">
        <h2 class="card-title">${issue.title}</h2>
        <p class="line-clamp-2">${issue.description}</p>
        <div class="badge badge-outline">${issue.category}</div>
        <p class="text-sm">Author: ${issue.author}</p>
        <p class="text-xs">Priority: ${issue.priority}</p>
      </div>
    `;
    card.onclick = () => openIssueModal(issue.id);
    container.appendChild(card);
  });
}

// Modal
async function openIssueModal(issueId) {
  console.log("Opening modal for issue:", issueId);

  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`);
  const issue = await res.json();

  console.log("Single issue response:", issue);

  modalTitle.textContent = issue.title;
  modalDesc.textContent = issue.description;
  modalAuthor.textContent = issue.author;
  modalCategory.textContent = issue.category;
  modalPriority.textContent = issue.priority;
  modalStatus.textContent = issue.status;

  modal.showModal();
}

// Search
document.getElementById("searchBtn").addEventListener("click", async () => {
  const q = document.getElementById("searchInput").value.trim();
  if(!q) return;
  showSpinner();
  container.innerHTML = "";

  console.log("Searching issues for:", q);

  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${q}`);
  const data = await res.json();

  console.log("Search response:", data);

  hideSpinner();

  if (data.issues) {
    displayIssues(data.issues);
  } else {
    displayIssues(data);
  }
});

// Tab Buttons
document.getElementById("allBtn").addEventListener("click", () => loadIssues("all"));
document.getElementById("openBtn").addEventListener("click", () => loadIssues("open"));
document.getElementById("closedBtn").addEventListener("click", () => loadIssues("closed"));

// Default load
loadIssues();
