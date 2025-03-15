let url = window.location.href;
let video = null;
let key = url.split("=")[1];
let intervalID = null;
let source = null;
let observer = null;
let URLObserver = null;

observer = new MutationObserver(() => {
  video = document.querySelector("video");
  if (video) {
    observer.disconnect();
    source = video.src;
    url = window.location.href;
    key = url.split("=")[1];
    initializeVideoState();
  }
});

URLObserver = new MutationObserver(() => {
  if (video.src !== source) {
    url = window.location.href;
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("v")) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
URLObserver.observe(document.body, { childList: true, subtree: true });

function initializeVideoState() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getData" && key != null) {
      sendResponse({ data: [key], url: url });
    } else {
      sendResponse({
        data: "Invalid Message Request or Key is null",
      });
    }
    return true;
  });

  chrome.storage.local.get([key]).then((data) => {
    if (data[key] && data[key] != null) {
      video = document.querySelector("video");
      video.currentTime = data[key]["currentVideoTime"];
    }
  });
  if (!intervalID) {
    intervalID = setInterval(saveVideoProgress, 10000);
  }
}

function saveVideoProgress() {
  let object = null;
  let parentNode = document.getElementById("above-the-fold");
  let title = parentNode.childNodes[1].children[1].innerText;
  let channel_name =
    parentNode.children[1].children[0].children[0].children[1].children[0]
      .innerText;
  video = document.querySelector("video");

  if (video && !video.paused) {
    object = {
      url: url,
      currentVideoTime: video.currentTime,
      title: title,
      channel_name: channel_name,
    };
    chrome.storage.local.set({ [key]: object });
  }
}

function sendData(key) {
  chrome.runtime.sendMessage({
    action: "sendData",
    data: key,
  });
}

function setcookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/;`;
}

function retrieveCookie(name) {
  let cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    let [key, value] = cookie.split("=");
    acc[key] = value;
    return acc;
  }, {});

  return cookies[name] || null;
}
