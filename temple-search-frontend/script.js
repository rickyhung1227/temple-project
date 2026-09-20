"use strict";

/*
 * ==================== 後端串接設定 ====================
 * 只要先把這兩個路由改成你的後端實際網址。
 * 前後端若不同網域，後端需要允許此網頁來源的 CORS。
 */
const API_ENDPOINTS = Object.freeze({
  search: "https://two026-line-temple.onrender.com/temples/search",
  detail: "https://two026-line-temple.onrender.com/temples/select/{templeId}"
});

const templeStage = document.querySelector(".temple-stage");
const searchForm = document.querySelector("#searchForm");
const regionButtons = [...document.querySelectorAll(".region-button")];
const citySelect = document.querySelector("#citySelect");
const districtSelect = document.querySelector("#districtSelect");
const religionSelect = document.querySelector("#religionSelect");
const deitySelect = document.querySelector("#deitySelect");
const searchButton = document.querySelector("#searchButton");
const statusMessage = document.querySelector("#statusMessage");

const resultsPanel = document.querySelector("#resultsPanel");
const resultCount = document.querySelector("#resultCount");
const resultList = document.querySelector("#resultList");
const closeResultsButton = document.querySelector("#closeResultsButton");

const detailPanel = document.querySelector("#detailPanel");
const detailName = document.querySelector("#detailName");
const detailReligionDeity = document.querySelector("#detailReligionDeity");
const detailAddress = document.querySelector("#detailAddress");
const detailPhone = document.querySelector("#detailPhone");
const detailSummary = document.querySelector("#detailSummary");
const closeDetailButton = document.querySelector("#closeDetailButton");

const mascotLayer = document.querySelector("#mascotLayer");
const leftSpeechBubble = document.querySelector("#leftSpeechBubble");
const rightSpeechBubble = document.querySelector("#rightSpeechBubble");

/*
 * 由 data/filter-options.js 直接載入，不使用 fetch。
 * 所以地區、縣市、教別、神祇的初步選單完全由前端 JavaScript 控制。
 */
const filterData = window.TEMPLE_FILTER_DATA ?? null;

let selectedRegion = "北部";
let dialogueIndex = 0;
let dialogueTimerId = null;
let latestSearchResults = [];

/*
 * 吉祥物輪播文字：speaker 填 "left" 或 "right"。
 */
const MASCOT_DIALOGUES = [
  { speaker: "left", text: "一起去宮廟啊！" },
  { speaker: "right", text: "好啊，走起！" },
  { speaker: "left", text: "先選想去的地區吧！" },
  { speaker: "right", text: "也可以按照神明篩選喔！" }
];

const DIALOGUE_INTERVAL_MS = 3200;

function showDialogue(index) {
  const dialogue = MASCOT_DIALOGUES[index];

  if (!dialogue) {
    return;
  }

  const isLeftSpeaking = dialogue.speaker === "left";
  leftSpeechBubble.classList.toggle("is-speaking", isLeftSpeaking);
  rightSpeechBubble.classList.toggle("is-speaking", !isLeftSpeaking);

  if (isLeftSpeaking) {
    leftSpeechBubble.textContent = dialogue.text;
  } else {
    rightSpeechBubble.textContent = dialogue.text;
  }
}

function showNextDialogue() {
  dialogueIndex = (dialogueIndex + 1) % MASCOT_DIALOGUES.length;
  showDialogue(dialogueIndex);
}

function startDialogue() {
  window.clearInterval(dialogueTimerId);
  showDialogue(dialogueIndex);
  dialogueTimerId = window.setInterval(showNextDialogue, DIALOGUE_INTERVAL_MS);
}

function stopDialogue() {
  window.clearInterval(dialogueTimerId);
  dialogueTimerId = null;
  leftSpeechBubble.classList.remove("is-speaking");
  rightSpeechBubble.classList.remove("is-speaking");
}

mascotLayer.addEventListener("click", (event) => {
  if (
    templeStage.classList.contains("is-result-mode") ||
    !event.target.closest(".mascot")
  ) {
    return;
  }

  showNextDialogue();
  startDialogue();
});

function replaceOptions(selectElement, placeholder, values) {
  selectElement.replaceChildren();
  selectElement.add(new Option(placeholder, ""));

  values.forEach((value) => {
    selectElement.add(new Option(value, value));
  });
}

function updateCityOptions(region) {
  replaceOptions(citySelect, "縣市", filterData?.regions?.[region] ?? []);
  replaceOptions(districtSelect, "行政區", []);
  districtSelect.disabled = true;
}

function updateDistrictOptions(city) {
  const districts = filterData?.districtsByCity?.[city] ?? [];
  replaceOptions(districtSelect, "行政區", districts);
  districtSelect.disabled = districts.length === 0;
}

function initializeFilterData() {
  if (!filterData) {
    replaceOptions(citySelect, "縣市", []);
    replaceOptions(religionSelect, "教別", []);
    replaceOptions(deitySelect, "主祀神祇", []);
    showStatus("找不到篩選資料，請確認 data/filter-options.js 已載入。");
    return;
  }

  replaceOptions(religionSelect, "教別", filterData.religions ?? []);
  replaceOptions(deitySelect, "主祀神祇", filterData.deities ?? []);
  updateCityOptions(selectedRegion);

  regionButtons.forEach((button) => {
    button.disabled = false;
  });
  citySelect.disabled = false;
  religionSelect.disabled = false;
  deitySelect.disabled = false;
  searchButton.disabled = false;

  console.log("完整篩選資料已載入：", filterData.counts);
}

regionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedRegion = button.dataset.region;

    regionButtons.forEach((item) => {
      const isSelected = item === button;
      item.classList.toggle("is-selected", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    updateCityOptions(selectedRegion);
  });
});

citySelect.addEventListener("change", () => {
  updateDistrictOptions(citySelect.value);
});

/*
 * ==================== 第一次傳給後端的資料 ====================
 * 使用者按「開始查詢」後，這個函式接收畫面上的五個篩選值。
 */
function getSearchConditions() {
  return {
    region: selectedRegion,
    city: citySelect.value || null,
    district: districtSelect.value || null,
    religion: religionSelect.value || null,
    deity: deitySelect.value || null
  };
}

async function readJsonResponse(response, defaultMessage) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    // 沒有合法 JSON 時，下面會提供清楚的錯誤訊息。
  }

  if (!response.ok) {
    const backendMessage = data?.message || data?.error;
    throw new Error(backendMessage || `${defaultMessage}（HTTP ${response.status}）`);
  }

  if (data === null) {
    throw new Error(`${defaultMessage}：後端沒有回傳 JSON`);
  }

  return data;
}

/*
 * 傳送位置 1：POST /api/temples/search
 * body: { region, city, district, religion, deity }
 *
 * 後端應回傳清單，每筆至少包含：
 * id（宮廟唯一編號）、name、address、deity。
 */
async function sendSearchRequest(conditions) {
  const params = new URLSearchParams();

  Object.entries(conditions).forEach(([key, value]) => {
    if (value !== null && value !== "") {
      params.set(key, value);
    }
  });

  const response = await fetch(
    `${API_ENDPOINTS.search}?${params.toString()}`,
    {
      headers: {
        "Accept": "application/json"
      }
    }
  );

  return readJsonResponse(response, "查詢失敗");
}

/*
 * 接收位置 1：將搜尋 API 的回傳內容統一成畫面需要的格式。
 * 可接受 data、results、temples 或直接陣列，也能讀取 XML 的中文欄位名稱。
 */
function normalizeSearchResults(payload) {
  const rows = Array.isArray(payload)
    ? payload
    : payload.data ?? payload.results ?? payload.temples ?? [];

  if (!Array.isArray(rows)) {
    throw new Error("搜尋 API 的回傳格式不正確，清單必須是陣列。");
  }

  return rows.map((temple) => ({
    id: temple.id ?? temple.templeId ?? temple["編號"] ?? "",
    name: temple.name ?? temple.templeName ?? temple["寺廟名稱"] ?? "未命名宮廟",
    address: temple.address ?? temple["地址"] ?? "未提供地址",
    deity: temple.deity ?? temple.mainDeity ?? temple["主祀神祇"] ?? "未提供主祀神祇"
  }));
}

/*
 * ==================== 第二次傳給後端的資料 ====================
 * 使用者選擇清單中的宮廟後，只傳送該宮廟的唯一編號。
 */
async function sendDetailRequest(templeId) {
  const detailUrl = API_ENDPOINTS.detail.replace(
    "{templeId}",
    encodeURIComponent(templeId)
  );

  const response = await fetch(detailUrl, {
    headers: {
      "Accept": "application/json"
    }
  });

  return readJsonResponse(response, "詳細資料載入失敗");
}

/*
 * 接收位置 2：將詳細資料 API 的回傳內容統一成詳細畫面需要的格式。
 * 此畫面刻意不接收、不顯示「網頁」欄位。
 */
function normalizeTempleDetail(payload) {
  const temple = payload.data ?? payload.temple ?? payload;

  return {
    id: temple.id ?? temple.templeId ?? temple["編號"] ?? "",
    name: temple.name ?? temple.templeName ?? temple["寺廟名稱"] ?? "未命名宮廟",
    religion: temple.religion ?? temple["教別"] ?? "未提供",
    deity: temple.deity ?? temple.mainDeity ?? temple["主祀神祇"] ?? "未提供",
    address: temple.address ?? temple.location ?? temple["地址"] ?? "未提供",
    phone: temple.phone ?? temple.tel ?? temple["電話"] ?? "未提供",
    summary:
      temple.summary ??
      temple.llmSummary ??
      temple["LLM摘要"] ??
      temple["摘要"] ??
      "目前尚無摘要。"
  };
}

function setSearchLoading(isLoading) {
  searchButton.disabled = isLoading;
  searchButton.classList.toggle("is-loading", isLoading);
  searchButton.setAttribute("aria-busy", String(isLoading));
}

function showStatus(message) {
  statusMessage.textContent = message;
}

function showScreen(screen) {
  const isHome = screen === "home";
  templeStage.classList.toggle("is-result-mode", !isHome);
  resultsPanel.hidden = screen !== "results";
  detailPanel.hidden = screen !== "detail";

  if (isHome) {
    startDialogue();
  } else {
    stopDialogue();
  }
}

function renderSearchResults(temples) {
  resultList.replaceChildren();
  resultCount.textContent = `共找到 ${temples.length} 間宮廟，請選擇一間查看詳細資料`;

  if (temples.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "目前找不到符合條件的宮廟，請關閉視窗後調整篩選條件。";
    resultList.append(emptyState);
    return;
  }

  temples.forEach((temple) => {
    const card = document.createElement("button");
    card.className = "result-card";
    card.type = "button";
    card.dataset.templeId = String(temple.id);
    card.disabled = temple.id === "";

    const name = document.createElement("h3");
    name.textContent = temple.name;

    const address = document.createElement("p");
    address.innerHTML = '<span class="result-card__label">地址：</span>';
    address.append(document.createTextNode(temple.address));

    const deity = document.createElement("p");
    deity.innerHTML = '<span class="result-card__label">主祀神祇：</span>';
    deity.append(document.createTextNode(temple.deity));

    card.append(name, address, deity);

    if (temple.id === "") {
      const warning = document.createElement("p");
      warning.textContent = "後端未提供宮廟編號，暫時無法查看詳細資料。";
      card.append(warning);
    }

    resultList.append(card);
  });
}

function renderDetailLoading() {
  detailName.textContent = "正在載入…";
  detailReligionDeity.textContent = "—";
  detailAddress.textContent = "—";
  detailPhone.textContent = "—";
  detailSummary.textContent = "正在向後端取得宮廟詳細資料。";
}

function renderTempleDetail(temple) {
  detailName.textContent = temple.name;
  detailReligionDeity.textContent = `${temple.religion}／${temple.deity}`;
  detailAddress.textContent = temple.address;
  detailPhone.textContent = temple.phone;
  detailSummary.textContent = temple.summary;
}

function renderDetailError(message) {
  detailName.textContent = "無法載入詳細資料";
  detailReligionDeity.textContent = "—";
  detailAddress.textContent = "—";
  detailPhone.textContent = "—";
  detailSummary.textContent = message;
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const conditions = getSearchConditions();
  console.log("傳給搜尋 API 的篩選條件：", conditions);
  window.dispatchEvent(new CustomEvent("temple-search", { detail: conditions }));

  setSearchLoading(true);
  showStatus("");

  try {
    const payload = await sendSearchRequest(conditions);
    latestSearchResults = normalizeSearchResults(payload);
    console.log("搜尋 API 回傳的宮廟清單：", latestSearchResults);

    renderSearchResults(latestSearchResults);
    showScreen("results");
  } catch (error) {
    console.error(error);
    showStatus(error.message || "目前無法查詢，請稍後再試。");
  } finally {
    setSearchLoading(false);
  }
});

resultList.addEventListener("click", async (event) => {
  const card = event.target.closest(".result-card[data-temple-id]");

  if (!card || card.disabled) {
    return;
  }

  const templeId = card.dataset.templeId;
  console.log("傳給詳細資料 API 的宮廟編號：", templeId);
  window.dispatchEvent(new CustomEvent("temple-detail", { detail: { templeId } }));

  renderDetailLoading();
  showScreen("detail");

  try {
    const payload = await sendDetailRequest(templeId);
    const temple = normalizeTempleDetail(payload);
    console.log("詳細資料 API 回傳的宮廟資料：", temple);
    renderTempleDetail(temple);
  } catch (error) {
    console.error(error);
    renderDetailError(error.message || "目前無法取得詳細資料，請稍後再試。");
  }
});

closeResultsButton.addEventListener("click", () => {
  showScreen("home");
});

closeDetailButton.addEventListener("click", () => {
  renderSearchResults(latestSearchResults);
  showScreen("results");
});

initializeFilterData();
startDialogue();

