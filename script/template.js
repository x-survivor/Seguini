export const itemTempale = (id, details, container) => {
  let articleID = id + container.id + "125";
  container.innerHTML += `
  <article class=${"item"} id=${articleID}>
  <div class="itemRecord" style="width: 75%;">
    <label class=${"timeStamp"}> ${Math.floor(details.currentVideoTime / 60)} : ${(
    details.currentVideoTime % 60
  ).toFixed(0)}</label>
    <label class=${"title"}>${details.title} - ${details.channel_name}</label>
  </div>
  <div style="width: 25%;" class="itemBtn">
    <button class=${"deleteBtn"} id=${id}>
      <svg class="deleteSVG" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffffff">
        <g id="SVGRepo_bgCarrier" stroke-width="1"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M10 11V17" stroke="#ffffff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M14 11V17" stroke="#ffffff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M4 7H20" stroke="#ffffff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#ffffff"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#ffffff" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"></path>
        </g>
      </svg>
    </button>
    <button class=${"playBtn"} id=${id}>
      <svg class="playSVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
        <style>
          
        </style>
        <path class="st0" d="M241.08,158.5L93.58,243.7c-2.68,1.55-5.98,1.55-8.66,0
          c-2.68-1.55-4.33-4.4-4.33-7.5V65.79c0-3.09,1.65-5.95,4.33-7.5
          c2.68-1.55,5.98-1.55,8.66,0l147.51,85.2c2.68,1.55,4.33,4.41,4.33,7.5
          S243.76,156.95,241.08,158.5z" />
      </svg>
    </button>
  </div>
</article>`;
};