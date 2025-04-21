# 📤 Jira JSON Exporter (Chrome Extension)

A minimal and powerful Chrome extension to **export Jira issue data** as JSON or CSV — perfect for backups, reports or integrations.

![Single Issue Tab](./selected-jira.png)
*Export a single issue by detecting it directly from the Jira URL.*

![Multiple Issues Tab](./multiple-jira.png)
*Paste multiple issue keys to export a list of issues at once.*

---

## 🚀 Features

- 🔍 Detects the currently open Jira issue automatically
- ⌨️ Accepts a list of issue keys (e.g. `ISSUE-1, ISSUE-2`)
- 🧾 Exports to:
  - **Pretty JSON**
  - **Clean CSV** (includes type, parent, status, priority, reporter)
- 🖼️ Dark theme with simple UX

---

## 🛠️ How to Install

1. Clone this repository or [Download as ZIP](https://github.com/brunoslribeiro/jira-json-exporter/archive/refs/heads/main.zip)
2. Go to `chrome://extensions/` in your browser
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the extension folder

---

## 📦 How to Use

1. Open a Jira issue in your browser
2. Click the extension icon
3. Choose either:
   - **"History"** tab to export current issue
   - **"Multiple History"** tab to paste issue keys
4. Click to export in **JSON** or **CSV**
5. Files will be automatically downloaded

---

## 📁 CSV Export Format

| Type       | Key      | Summary                | Parent     | Status    | Priority | Reporter     |
|------------|----------|------------------------|------------|-----------|----------|--------------|
| History    | CRM-1234 | Update field mappings  |            | Done      | Medium   | michaelrich  |
| Subtask    | CRM-1235 | Create flow            | CRM-1234   | In Prog.  | Medium   | lindsey      |

---

## 📎 Credits

Created with ❤️ by [Bruno Ribeiro](https://github.com/brunoslribeiro)  
Icons generated via [ChatGPT Image](https://chat.openai.com)

---

## 🧪 License

MIT
