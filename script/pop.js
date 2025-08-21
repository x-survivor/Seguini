import { pagination } from "./pagination.js";
import {
  itemsContainer,
  currentVideoSave,
  paginationContainer,
  videoTitle,
  timeStampContainer,
} from "./util.js";

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length === 0) return;
  if (tabs[0].url.includes("://www.youtube.com")) {
    fetch();
  }
  if (tabs[0].url.includes("://www.youtube.com/watch?v")) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getData" }, (response) => {
      let key = response.data;
      !key ? chrome.tabs.reload(tabs[0].id) : null;
      if (chrome.runtime.lastError) {
        console.error("Error:", chrome.runtime.lastError.message);
        return;
      }
      fetch(key);
    });
  } else {
    if (tabs[0].url.includes("://www.youtube.com")) {
      currentVideoSave.innerText = "Play a Video";
    } else {
      currentVideoSave.innerText = "Not a youtube video tab";
      document.querySelector(".itemsView").style.display = "none";
    }
  }
});

const fetch = async (key = null) => {
  if (key) {
    chrome.storage.local.get([key][0]).then((result) => {
      const data = result[key[0]];
      if (data) {
        let hours = Math.floor(data["currentVideoTime"] / 3600);
        let minutes = Math.floor((data["currentVideoTime"] % 3600) / 60);
        let seconds = Math.floor(data["currentVideoTime"] % 60);
        const currentTimeStamp = `<div class="timeStamp" style="color: white;">
        ${hours ? hours + ":" : ""}
        ${minutes < 10 ? "0" + minutes : minutes}:
        ${seconds < 10 ? "0" + seconds : seconds}
        </div>`;
        videoTitle.textContent = `${data["title"]} - ${data["channel_name"]}`;
        timeStampContainer.innerHTML = currentTimeStamp;
      } else {
        videoTitle.textContent = key;
      }
    });
  } else {
    // Fetch all data from storage
    const entries = Object.entries(await chrome.storage.local.get(null));
    pagination(itemsContainer, paginationContainer, entries);

    searchContainer.addEventListener("click", async (event) => {
      const deleteBtn = event.target.closest(".deleteBtn");
      if (deleteBtn) {
        const entryId = deleteBtn.getAttribute("id");

        // Remove from entries array
        const index = entries.findIndex(([id]) => id === entryId);
        if (index !== -1) {
          entries.splice(index, 1);
          // Re-render items
          printDataItems(count, limit, entries, itemsContainer);
        }
      }
    });
  }
};

document.querySelector(".toggleMode").addEventListener("click", () => {
  document.getElementsByTagName("html")[0].classList.toggle("dark");
});
