
chrome.runtime.onInstalled.addListener(() => {
  console.log("Jira JSON Exporter instalado.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Mensagem recebida:", message);
  if (message.openPopupAt) {
    const width = 360;
    const height = 600;
    const screenW = message.openPopupAt.screenWidth || 1920;
    const screenH = message.openPopupAt.screenHeight || 1080;

    const x = Math.min(screenW - width - 20, Math.max(0, Math.floor(message.openPopupAt.x || 100)));
    const y = Math.min(screenH - height - 20, Math.max(0, Math.floor(message.openPopupAt.y || 100)));

    console.log("Abrindo popup dentro da tela visível:", x, y);

    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width,
      height,
      top: y,
      left: x
    });
  }
});
