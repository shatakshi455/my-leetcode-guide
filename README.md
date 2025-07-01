# My LeetCode Guide

This Chrome extension helps you solve LeetCode problems by fetching **3 progressive AI-generated hints** using the **Gemini API**.

💡 Great for learning step-by-step problem-solving techniques without giving away the full solution.

---

## ✨ Features

- 🧠 AI-powered hints from Google's Gemini API
- 🧩 Automatically detects the current LeetCode problem
- 🔒 API key stored locally (not exposed to GitHub)
- 🧼 Clean UI with progressive hint reveal

---

## 🚀 Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shatakshi455/my-leetcode-guide.git
   cd leetcode-hint-extension
   ```
2. Insert your Gemini API key:

- Go to Google AI Studio
- Get your API key 
- Open popup.template.js, replace the placeholder with your key:

```js
const GEMINI_API_KEY = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY";
```
Rename the file to popup.js


3. Load the extension in Chrome:

- Go to chrome://extensions/
- Enable Developer Mode
- Click Load unpacked and select the folder


## 🛠 Technologies Used
- JavaScript (Vanilla)
- Chrome Extensions API (v3)
- Gemini 1.5 Flash API (Google Generative Language)
- HTML/CSS



Built with ❤️ by Shatakshi
