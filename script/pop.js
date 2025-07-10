const itemsContainer = document.getElementById("itemContainer");
const currendVideoSave = document.getElementById("currentVideoSave");
const searchBar = document.getElementById("search");
const searchContainer = document.getElementById("searchContainer");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length === 0) return;
  if (tabs[0].url.includes("://www.youtube.com")) {
    fetch();
  }
  if (tabs[0].url.includes("://www.youtube.com/watch?v")) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getData" }, (response) => {
      let key = response.data;
      (!key) ? chrome.tabs.reload(tabs[0].id) : null;
      if (chrome.runtime.lastError) {
        console.error("Error:", chrome.runtime.lastError.message);
        return;
      }
      fetch(key);
    });
  } else {
    if (tabs[0].url.includes("://www.youtube.com")) {
      currendVideoSave.innerText = "Play a Video";
    } else {
      currendVideoSave.innerText = "Not a youtube video tab";
    }
  }
});

const deleteTime = (id, container) => {
  let articleID = id + container.id + "125";
  let item = document.getElementById(articleID);
  chrome.storage.local.remove([id], function () {
    if (item && container.contains(item)) {
      item.style.transform = `translateX(100px)`;
      item.remove();
    }
    return "success";
  });
}
const deleteHandler = (container) => (event) => {
  let deleteBtn = event.target.closest(".deleteBtn");
  if (deleteBtn) {
    let itemID = deleteBtn.getAttribute("id");
    deleteTime(itemID, container);
  }
}

const itemTempale = (id, details, container) => {
  let articleID = id + container.id + "125";
  container.innerHTML += `
  <article class=${"item"} id=${articleID}>
    <div>
      <label class=${"title"}>${details.title
    }</label> 
      <br> 
      <label class=${"stamp"}> ${Math.floor(
      details.currentVideoTime / 60
    )} : ${(details.currentVideoTime % 60).toFixed(
      0
    )}</label> 
    </div>
    <div>
      <button class=${"deleteBtn"} id=${id}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000">
        <g id="SVGRepo_bgCarrier" stroke-width="1"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M14 11V17" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M4 7H20" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> 
          <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> 
        </g>
      </svg>
      </button>
    </div>
  </article>`;
}

const fetch = (key = null, search = null) => {
  if (key) {
    chrome.storage.local.get([key][0]).then((result) => {
      if (result[key[0]]) {
        currentVideoSave.innerHTML =
          "<div> <label> " +
          result[key[0]]["title"] +
          " " +
          Math.floor(result[key[0]]["currentVideoTime"] / 60) +
          ":" +
          (result[key[0]]["currentVideoTime"] % 60).toFixed(0) +
          "</label></div><br>";
      } else {
        currendVideoSave.innerText = key;
      }
    });
  }
  else {
    chrome.storage.local.get(null).then((data) => {
      let count = 1
      let limit = 4
      Object.entries(data).forEach(([id, details]) => {
        if (count == limit) {
          console.log(count, limit)
        }
        else {
          if (search == null) {
            itemTempale(id, details, itemsContainer);
          }
          else {
            if (details.title.toLowerCase().includes(search) || details["channel_name"].toLowerCase().includes(search)) {
              itemTempale(id, details, searchContainer);
            }
          }
        }
      });
    });
  }
}

function piggybag(value) {
  value = value.toLowerCase();
  searchContainer.innerHTML = '';
  fetch(null, value);
}
searchBar.addEventListener("input", (e) => {
  let value = e.target.value;
  if (value == '') {
    searchContainer.innerHTML = '';
  }
  else {
    piggybag(value);
  }
});

itemsContainer.addEventListener("click", deleteHandler(itemsContainer));
searchContainer.addEventListener("click", deleteHandler(searchContainer));

