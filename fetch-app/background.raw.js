chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get(["running"], function (data) {
    if (!data["running"]) {
      chrome.storage.sync.set(
        { running: true },
        function () {
          console.log("set default running successfully.");
        }
      );
    }
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: ".zalo.me" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});
