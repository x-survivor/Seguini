import { itemTempale } from "./template.js";

const printItems = (count, limit, entries, container) => {
  container.innerHTML = "";
  for (count; count <= limit; count++) {
    if (entries[count]) {
      const [id, details] = entries[count];
      itemTempale(id, details, container);
    }
  }
};

export function pagination(itemsContainer, paginationContainer, entries) {
  // Counters
  let count = 0;
  let limit = 9;

  // If data is more than 10 timestamps, show pagination
  if (entries.length > 10) {
    paginationContainer.style.display = "flex";

    // Pagination buttons
    const btnNext = document.querySelector(".btnNext");
    const btnPrev = document.querySelector(".btnPrev");
    const btnFirst = document.querySelector(".btnFirst");
    const btnLast = document.querySelector(".btnLast");

    // Add event listeners to pagination buttons
    btnNext.addEventListener("click", () => {
      if (limit >= entries.length - 1) {
        return;
      }
      count = count + 10;
      limit = limit + 10;
      printItems(count, limit, entries, itemsContainer);
      console.log(`Next, Count: ${count}, Limit: ${limit}`);
    });
    btnPrev.addEventListener("click", () => {
      if (count <= 0) {
        return;
      }
      count = count - 10;
      limit = limit - 10;
      printItems(count, limit, entries, itemsContainer);
      console.log(`Previous, Count: ${count}, Limit: ${limit}`);
    });
    btnLast.addEventListener("click", () => {
      if (count >= entries.length - 1) {
        return;
      }
      count = Math.floor(Math.floor(entries.length) - (entries.length % 10));
      limit = count + 9;
      printItems(count, limit, entries, itemsContainer);
      console.log(`Last Page, Count: ${count}, Limit: ${limit}`);
    });
    btnFirst.addEventListener("click", () => {
      if (count <= 0) {
        return;
      }
      count = 0;
      limit = 9;
      printItems(count, limit, entries, itemsContainer);
      console.log(`First Page, Count: ${count}, Limit: ${limit}`);
    });
  }

  itemsContainer.addEventListener("click", async (event) => {
    const deleteBtn = event.target.closest(".deleteBtn");
    if (deleteBtn) {
      const entryId = deleteBtn.getAttribute("id");

      // Remove from entries array
      const index = entries.findIndex(([id]) => id === entryId);
      if (index !== -1) {
        entries.splice(index, 1);
        // Re-render items
        printItems(count, limit, entries, itemsContainer);
      }
    }
  });

  // Print 10 items initially
  printItems(count, limit, entries, itemsContainer);
}
