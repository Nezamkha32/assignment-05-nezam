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
const modalAssignee = document.getElementById("modalAssignee");
const modalCreated = document.getElementById("modalCreated");

// Spinner control
function showSpinner() { spinner.classList.remove("hidden"); }
function hideSpinner() { spinner.classList.add("hidden"); }

// Load Issues
async function loadIssues(type="all") {
  showSpinner();
  container.innerHTML = "";

  let url = API;
  if(type === "open") url += "?status=open";
  if(type === "closed") url += "?status=closed";

  const res = await fetch(url);
  const data = await res.json();
  hideSpinner();

  const issues = Array.isArray(data.data) ? data.data : data.issues;
  displayIssues(issues);
}

// Display Issues
function displayIssues(issues) {
  if (!Array.isArray(issues)) return;

  container.innerHTML = "";

  issues.forEach(issue => {
    const card = document.createElement("div");
    card.className = `card bg-white shadow-md border-t-4 cursor-pointer ${
      issue.status.toLowerCase() === "open" ? "border-green-500" : "border-purple-500"
    }`;

    card.innerHTML = `
      <div class="card-body">
        <h2 class="card-title">${issue.title}</h2>
        <p class="text-sm text-gray-600">${issue.description}</p>

        <div class="flex flex-wrap gap-2 my-2">
          ${issue.labels.map(label => `<span class="badge badge-outline">${label}</span>`).join(" ")}
        </div>

        <p><span class="font-bold">Status:</span> ${issue.status}</p>
        <p><span class="font-bold">Priority:</span> ${issue.priority}</p>
        <p><span class="font-bold">Author:</span> ${issue.author}</p>
        <p><span class="font-bold">Assignee:</span> ${issue.assignee}</p>
        <p class="text-xs text-gray-400">Created: ${new Date(issue.createdAt).toLocaleString()}</p>
      </div>
    `;

    card.onclick = () => openIssueModal(issue.id);
    container.appendChild(card);
  });
}

// Modal
async function openIssueModal(issueId) {
  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`);
  const issue = await res.json();

  modalTitle.textContent = issue.title;
  modalDesc.textContent = issue.description;
  modalAuthor.textContent = issue.author;
  modalCategory.textContent = issue.category || "N/A";
  modalPriority.textContent = issue.priority;
  modalStatus.textContent = issue.status;
  modalAssignee.textContent = issue.assignee || "N/A";
  modalCreated.textContent = new Date(issue.createdAt).toLocaleString();

  modal.showModal();
}

// Search
document.getElementById("searchBtn").addEventListener("click", async () => {
  const q = document.getElementById("searchInput").value.trim();
  if(!q) return;
  showSpinner();
  container.innerHTML = "";

  const res = await fetch(`${API}/search?q=${q}`);
  const data = await res.json();
  hideSpinner();

  const issues = Array.isArray(data.data) ? data.data : data.issues;
  displayIssues(issues);
});

// Tabs
document.getElementById("allBtn").addEventListener("click", () => loadIssues("all"));
document.getElementById("openBtn").addEventListener("click", () => loadIssues("open"));
document.getElementById("closedBtn").addEventListener("click", () => loadIssues("closed"));

// Default load
loadIssues();
