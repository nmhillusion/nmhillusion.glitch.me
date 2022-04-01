// $$(".ytd-video-owner-renderer #text.ytd-channel-name a")

console.log(":: option menu ::");
chrome.storage.sync.get(
  ["intervalTime", "confirmContinueWatching"],
  main
);

function main({ intervalTime, confirmContinueWatching }) {
  // console.log({ intervalTime, confirmContinueWatching });

  const mainForm = window.mainForm;
  const statusEl = document.querySelector("#status");

  if (confirmContinueWatching) {
    mainForm.confirmContinueWatching.setAttribute("checked", true);
  } else {
    mainForm.confirmContinueWatching.removeAttribute("checked");
  }

  mainForm.intervalTime.value = intervalTime;

  mainForm.addEventListener("submit", (e) => {
    statusEl.style.display = "none";

    e.preventDefault();

    intervalTime = mainForm.intervalTime.value;
    confirmContinueWatching = mainForm.confirmContinueWatching.checked;

    chrome.storage.sync.set(
      {
        intervalTime,
        confirmContinueWatching,
      },
      function () {
        statusEl.style.display = "inline-block";
        statusEl.textContent = "saved";
      }
    );
  });
}
