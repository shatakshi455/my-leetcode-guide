const GEMINI_API_KEY = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY";

let currentHintIndex = 0;
let allHints = [];
let url = "";

document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  url = tab.url;

  if (!url.includes("leetcode.com/problems/")) {
    document.getElementById("status").innerText = "Not a LeetCode problem.";
    return;
  }

  // Check visited links
  const visited = sessionStorage.getItem("visitedLinks");
  let visitedLinks = visited ? JSON.parse(visited) : [];

  if (visitedLinks.includes(url)) {
    document.getElementById("status").innerText = "Loading saved hints...";
  } else {
    visitedLinks.push(url);
    sessionStorage.setItem("visitedLinks", JSON.stringify(visitedLinks));
    sessionStorage.setItem(url, "0"); // init progress
  }

  // Load previously seen hints index for this problem
  currentHintIndex = parseInt(sessionStorage.getItem(url) || "0", 10);

  const prompt = `Give me 3 progressive hints to solve the LeetCode problem at this link: ${url}. Format each hint as a separate line. Do not use **bold** or markdown formatting.`;

  const res = await fetch(`${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    })
  });

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Could not get hints from Gemini.";

  displayHints(text);
});

document.getElementById("nextHint").addEventListener("click", () => {
  currentHintIndex++;
  if (currentHintIndex < allHints.length) {
    document.getElementById(`hint${currentHintIndex + 1}`).innerText = allHints[currentHintIndex];
    document.getElementById(`hint${currentHintIndex + 1}`).style.display = "block";

    // Save progress for current problem
    sessionStorage.setItem(url, currentHintIndex.toString());

    if (currentHintIndex === allHints.length - 1) {
      document.getElementById("nextHint").style.display = "none";
    }
  }
});

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/^- /gm, '')
    .replace(/^\d+\.\s/gm, '')
    .trim();
}

function displayHints(rawText) {
  const cleanedText = stripMarkdown(rawText);
  allHints = cleanedText.split(/\n+/).filter(line => line.trim().length > 0).slice(0, 3);

  for (let i = 0; i <= currentHintIndex && i < allHints.length; i++) {
    const hintEl = document.getElementById(`hint${i + 1}`);
    hintEl.innerText = allHints[i];
    hintEl.style.display = "block";
  }

  if (currentHintIndex < allHints.length - 1) {
    document.getElementById("nextHint").style.display = "inline-block";
  } else {
    document.getElementById("nextHint").style.display = "none";
  }

  document.getElementById("status").innerText = "";
}
