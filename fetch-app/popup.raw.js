console.log(":: popup ::");

chrome.storage.sync.get(["running"], main);

function main({ running }) {
  console.log({ running });
  running = String(running) !== "false";

  const btnSwitch = document.querySelector("#btn-switch");
  function fillSwitchText(running, btn) {
    if (running) {
      btn.innerText = "Pause";
      btn.className = "pause";
    } else {
      btn.innerText = "Start";
      btn.className = "start";
    }
  }

  fillSwitchText(running, btnSwitch);
  btnSwitch.addEventListener("click", (e) => {
    running = !running;
    chrome.storage.sync.set({ running }, function (...err) {
      console.log({ err });
    });

    fillSwitchText(running, btnSwitch);
  });
}
