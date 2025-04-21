
document.addEventListener("DOMContentLoaded", () => {
	 
     // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });
	
	
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab || !tab.url) return;
    let match = tab.url.match(/browse\/(\w+-\d+)/) ||
                tab.url.match(/selectedIssue=(\w+-\d+)/) ||
                tab.url.match(/issue=(\w+-\d+)/) ||
                tab.url.match(/\b(\w+-\d+)\b/);
    if (match) {
      document.getElementById("currentKey").value = match[1];
    } else {
      document.getElementById("currentKey").value = "No history detected";
      document.getElementById("exportCurrent").disabled = true;
    }
  
  });

  document.getElementById("exportCurrent").addEventListener("click", () => {
    const key = document.getElementById("currentKey").value;
    if (!key || key.includes("detectada")) return alert("Nenhuma história detectada.");
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [key],
        func: (issueKey) => {
          const baseUrl = window.location.origin;
          const url = `${baseUrl}/rest/api/2/search?jql=issuekey=${issueKey}&fields=summary,description,status,subtasks`;
          fetch(url, { credentials: "include" })
            .then(res => res.json())
            .then(data => chrome.runtime.sendMessage({ json: JSON.stringify(data.issues[0], null, 2) }));
        }
      });
    });
  });

  document.getElementById("downloadJson").addEventListener("click", () => {
    const content = document.getElementById("output").value;
    if (!content.trim()) return alert("Nothing to export");
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({ url, filename: "jira-export.json", saveAs: true });
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.json) {
      document.getElementById("output").value = message.json;
    }
  });	
  
});


document.getElementById("downloadCsv").addEventListener("click", () => {
  const content = document.getElementById("output").value;
  if (!content.trim()) {
    document.getElementById("output").value = "Nothing to export";
    return;
  }

  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    document.getElementById("output").value = "Failed parse JSON.";
    return;
  }

  const list = Array.isArray(data) ? data : [data];
  const rows = [["Type", "Key", "Summary", "Parent", "Status", "Priority", "Reporter"]];

  for (const issue of list) {
    // Linha da História principal
    rows.push([
      "História",
      issue.key,
      (issue.fields.summary || "").replace(/"/g, '""'),
      "",
      issue.fields.status?.name || "",
      issue.fields.priority?.name || "",
      issue.fields.reporter?.displayName || issue.fields.reporter?.name || ""
    ]);

    // Subtarefas se houver
    const subtasks = issue.fields.subtasks || [];
    for (const sub of subtasks) {
      rows.push([
        "Subtarefa",
        sub.key,
        (sub.fields?.summary || "").replace(/"/g, '""'),
        issue.key,
        sub.fields?.status?.name || "",
        sub.fields?.priority?.name || "",
        sub.fields?.reporter?.displayName || sub.fields?.reporter?.name || ""
      ]);
    }
  }

  const csv = rows.map(row => row.map(col => `"${col}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({ url, filename: "jira-export.csv", saveAs: true });
});

document.getElementById("exportList").addEventListener("click", () => {
    const keys = document.getElementById("keys").value
      .split(/[\s,]+/)
      .map(k => k.trim())
      .filter(Boolean);
    if (!keys.length) return alert("Informe ao menos uma chave.");
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [keys],
        func: (keys) => {
          const baseUrl = window.location.origin;
          const jql = `issuekey in (${keys.join(",")})`;
          const url = `${baseUrl}/rest/api/2/search?jql=${encodeURIComponent(jql)}&fields=summary,description,status,subtasks`;
          fetch(url, { credentials: "include" })
            .then(res => res.json())
            .then(data => chrome.runtime.sendMessage({ json: JSON.stringify(data.issues, null, 2) }));
        }
      });
    });
  });

  