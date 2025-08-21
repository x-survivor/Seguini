import { itemsContainer, searchContainer } from "./util.js";

document.getElementById("deleteAll").addEventListener("click", function () {
  const confirmed = window.confirm("Are you sure you want to delete all items?");
  if (!confirmed) {
    return;
  }
  chrome.storage.local.clear(function () {
    if (chrome.runtime.lastError) {
      console.error("Error clearing storage:", chrome.runtime.lastError);
    } else {
      alert("All data in chrome.storage.local has been deleted.");
    }
  });
});

// Function to delete an item from storage and remove it from the DOM
const deleteHandler = (container) => (event) => {
  let deleteBtn = event.target.closest(".deleteBtn");
  if (deleteBtn) {
    let itemID = deleteBtn.getAttribute("id");
    let articleID = itemID + container.id + "125";
    let item = document.getElementById(articleID);
    chrome.storage.local.remove([itemID], function () {
      if (item && container.contains(item)) {
        item.style.transform = `translateX(100px)`;
        item.remove();
      }
      return "success";
    });
  }
};

// Function to play a video from the saved data
const playHandler = () => (event) => {
  let playBtn = event.target.closest(".playBtn");
  if (playBtn) {
    let itemID = playBtn.getAttribute("id");
    chrome.storage.local.get([itemID], (result) => {
      if (result[itemID]) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            let loadURL = `https://www.youtube.com/watch?v=${itemID}`
            chrome.tabs.update(tabs[0].id, { url: loadURL });
            window.close();
          }
        });
      }
    });
  }
};

itemsContainer.addEventListener("click", deleteHandler(itemsContainer));
searchContainer.addEventListener("click", deleteHandler(itemsContainer));
itemsContainer.addEventListener("click", playHandler());
searchContainer.addEventListener("click", playHandler());
