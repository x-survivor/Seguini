let url = window.location.href;
let cookie_name = url.split("=")[1];
let localChromeStorage = chrome.storage.local;
let video;

// MutationObserver to detect video element
const observer = new MutationObserver(() => {
  video = document.querySelector("video");
  if (video) {
    url = window.location.href;
    cookie_name = url.split("=")[1];
    initializeVideoState();
  }
});

// Start observing changes in the DOM
observer.observe(document.body, { childList: true, subtree: true });

// Function to initialize video state from cookies
async function initializeVideoState() {
  localChromeStorage.get([cookie_name]).then((data)=>{
    console.log(data);
  });
  // Periodically save video progress
  setInterval(saveVideoProgress, 10000);
}

// Function to save video progress in cookies
function saveVideoProgress() {
  if (video && !video.paused) {
    let object = {
      url: url,
      currentVideoTime: video.currentTime,
    };
    setcookie(cookie_name, JSON.stringify(object));
    let cookieData = retrieveCookie(cookie_name);
    console.log(JSON.parse(decodeURIComponent(cookieData)));
    chrome.storage.local.set({ [cookie_name]: object }).then(() => {});
  }
}

//Send data to Popup script
function sendData(cookie_name) {
  chrome.runtime.sendMessage({
    action: "sendData",
    data: cookie_name,
  });
}
// Function to set a cookie
function setcookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/;`;
}

// Function to retrieve a cookie by name
function retrieveCookie(name) {
  let cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    let [key, value] = cookie.split("=");
    acc[key] = value;
    return acc;
  }, {});

  return cookies[name] || null;
}
