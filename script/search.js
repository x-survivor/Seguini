// Import the item template function from template.js
import { itemTempale } from "./template.js";
import { searchInput, itemsContainer, searchContainer } from "./util.js";

// Fetch all data from chrome.storage.local
function fetchData(callback) {
  chrome.storage.local.get(null, (items) => {
    callback(items);
  });
}

// Perform search on data based on the query string
function performSearch(data, query) {
  itemsContainer.style.display = "none"; // Hide the main items container
  searchContainer.classList.add("block"); // Show the results container
  const lowerQuery = query.toLowerCase();
  // Filter items where title, channel_name, or value (if string) includes the query
  return Object.entries(data).filter(([key, value]) => {
    return (
      value["title"].toLowerCase().includes(lowerQuery) ||
      value["channel_name"].toLowerCase().includes(lowerQuery) ||
      (typeof value === "string" && value.toLowerCase().includes(lowerQuery))
    );
  });
}

// Render the search results in the results container
function renderResults(results) {
  // Create and append a label showing the number of results
  let printString = `${results.length} Timestamp`;
  const label = document.createElement("label");
  label.style.marginBottom = "10px";
  label.style.fontSize = "14px";
  (results.length >= 2)? printString += "s" : "";
  label.textContent = printString;
  searchContainer.appendChild(label);

  // Render each result using the item template
  results.forEach(([key, value]) => {
    itemTempale(key, value, searchContainer);
  });
}

// Listen for input events on the search box
searchInput.addEventListener("input", () => {
  const query = searchInput.value;
  if (query === "") {
    // If search is cleared, reset containers
    searchContainer.innerHTML = "";
    searchContainer.classList.remove("block");
    itemsContainer.style.display = "block";
    return;
  }
  // Clear previous results and perform new search
  searchContainer.innerHTML = "";
  fetchData((data) => {
    const results = performSearch(data, query);
    renderResults(results);
  });
});
