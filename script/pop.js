let itemContainer = document.getElementById("itemContainer");
console.log(itemContainer);
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendData") {
    console.log("Received in popup:", message.data);
    itemContainer.innerText = message.data;
    sendResponse({ success: true });
  }
});
