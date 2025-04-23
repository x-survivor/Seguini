let key = getKey();
let video = null;
let intervalID = null;
let source = null;

let observer = new MutationObserver(() => {
  video = document.querySelector("video");
  if (video) {
    observer.disconnect();
    source = video.src;
    key = getKey();
    initializeVideoState();
  }
});

let URLObserver = new MutationObserver(() => {
  video == null ? getVideo() : null;
  if (video && video.src !== source) {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("v")) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
});


if (window.location.href.includes("://www.youtube.com/watch?v")) {
  observer.observe(document.body, { childList: true, subtree: true });
}

URLObserver.observe(document.body, { childList: true, subtree: true });

function initializeVideoState() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getData" && key != null) {
      sendResponse({ data: [key], url: window.location.href });
    } else {
      sendResponse({
        data: "Invalid Message Request or Key is null",
      });
    }
    return true;
  });

  chrome.storage.local.get([key]).then((data) => {
    if (data[key] && data[key] != null) {
      video = getVideo();
      video.currentTime = data[key]["currentVideoTime"];
    }
  });
  if (!intervalID) {
    intervalID = setInterval(saveVideoProgress, 10000);
  }
}

function saveVideoProgress() {
  let parentNode = document.getElementById("above-the-fold");
  let title = parentNode.childNodes[1].children[1].innerText;
  let channel_name =
    parentNode.children[1].children[0].children[0].children[1].children[0]
      .innerText;
  video = document.querySelector("video");

  if (video && !video.paused) {
    chrome.storage.local.set({
      [key]: {
        url: window.location.href,
        currentVideoTime: video.currentTime,
        title: title,
        channel_name: channel_name,
      },
    });
  }
}

function getVideo() {
  video = document.querySelector("video");
  return video;
}
function getKey() {
  return window.location.href.split("=")[1];
}
