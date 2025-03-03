let url = window.location.href;
let cookie_name = new URL(url).searchParams.get("id") || "default_cookie";
let video = null;

// MutationObserver to detect video element
const observer = new MutationObserver(() => {
  video = document.querySelector("video");
  if (video) {
    observer.disconnect(); // Stop observing once video is found
    url = window.location.href;
    cookie_name = new URL(url).searchParams.get("id") || "default_cookie";
    initializeVideoState();
  }
});

// Start observing changes in the DOM
observer.observe(document.body, { childList: true, subtree: true });

// Function to initialize video state from cookies
async function initializeVideoState() {
  let cookieData = retrieveCookie(cookie_name);
  if (cookieData) {
    try {
      let savedState = JSON.parse(decodeURIComponent(cookieData));
      if (savedState && savedState.currentVideoTime) {
        video.currentTime = savedState.currentVideoTime;
      }
    } catch (error) {
      console.error("Error parsing cookie data:", error);
    }
  }

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
    let cookieData = retrieveCookie(cookie_name);
    setcookie(cookie_name, JSON.stringify(object));
    console.log(JSON.parse(decodeURIComponent(cookieData)));
  }
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
