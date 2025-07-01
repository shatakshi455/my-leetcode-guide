console.log("✅ content.js injected");

function waitForSelector(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let elapsed = 0;

    const check = () => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      elapsed += interval;
      if (elapsed >= timeout) return reject("⏰ Timeout waiting for " + selector);
      setTimeout(check, interval);
    };

    check();
  });
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "getProblem") {
    Promise.all([
      waitForSelector("h1"), // Title
      waitForSelector('[data-key="description-content"]') // Description
    ])
      .then(([titleEl, descEl]) => {
        const title = titleEl.innerText.trim();
        const description = descEl.innerText.trim();
        console.log("📦 Title:", title);
        console.log("📦 Description snippet:", description.slice(0, 100));
        sendResponse({ title, description });
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        sendResponse({ title: "No title found", description: "No description found" });
      });

    // Let Chrome know this will be an async response
    return true;
  }
});
