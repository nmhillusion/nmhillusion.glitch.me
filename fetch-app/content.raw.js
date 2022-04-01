(function zaloTheme() {
  chrome.storage.sync.get(["running"], main);

  function styleContent() {
    return `
    {{ CSS_CONTENT }}    
    `;
  }

  const appClassName = "n2-custome-zalo-theme";

  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (const changeKey in changes) {
      const changeVal = changes[changeKey];
      if ("running" == changeKey) {
        main({ running: changeVal.newValue });
      }
    }
  });

  function main({ running }) {
    console.log("___ main zalo theme process ___ > running: ", running);

    const oldEl = document.querySelector("." + appClassName);
    if (oldEl) {
      document.head.removeChild(oldEl);
    }

    if (running) {
      const styleEl = document.createElement("style");
      styleEl.classList.add(appClassName);

      styleEl.innerHTML = styleContent();

      document.head.appendChild(styleEl);
    }
  }
})();
