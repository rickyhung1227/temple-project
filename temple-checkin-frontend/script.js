"use strict";

const CONFIG = window.TEMPLE_CHECKIN_CONFIG ?? {};
const FILTER_DATA = window.TEMPLE_FILTER_DATA ?? {};
const REGIONS = ["北部", "中部", "南部", "東部", "離島"];
const PAGE_SIZE = 4;
const MOCK_DELAY_MS = 420;

const MOCK_TEMPLES = [
  {
    id: "DEMO-N01",
    name: "霞海城隍廟",
    region: "北部",
    city: "臺北市",
    district: "大同區",
    religion: "道教",
    deity: "霞海城隍",
    address: "臺北市大同區迪化街一段61號",
    phone: "02-2558-0346",
    summary: "示範資料：地方信仰中心，以城隍信仰及祈求良緣聞名。"
  },
  {
    id: "DEMO-N02",
    name: "艋舺龍山寺",
    region: "北部",
    city: "臺北市",
    district: "萬華區",
    religion: "佛教",
    deity: "觀世音菩薩",
    address: "臺北市萬華區廣州街211號",
    phone: "02-2302-5162",
    summary: "示範資料：主祀觀世音菩薩，融合佛、道與民間信仰。"
  },
  {
    id: "DEMO-N03",
    name: "慈祐宮",
    region: "北部",
    city: "臺北市",
    district: "松山區",
    religion: "道教",
    deity: "天上聖母",
    address: "臺北市松山區八德路四段761號",
    phone: "02-2766-3012",
    summary: "示範資料：主祀天上聖母，是地方重要的媽祖信仰據點。"
  },
  {
    id: "DEMO-N04",
    name: "指南宮",
    region: "北部",
    city: "臺北市",
    district: "文山區",
    religion: "道教",
    deity: "孚佑帝君",
    address: "臺北市文山區萬壽路115號",
    phone: "02-2939-9922",
    summary: "示範資料：又稱仙公廟，主祀孚佑帝君。"
  },
  {
    id: "DEMO-N05",
    name: "新莊地藏庵",
    region: "北部",
    city: "新北市",
    district: "新莊區",
    religion: "佛教",
    deity: "地藏王菩薩",
    address: "新北市新莊區中正路84號",
    phone: "02-2993-6774",
    summary: "示範資料：主祀地藏王菩薩，承載深厚的地方信仰。"
  },
  {
    id: "DEMO-C01",
    name: "臺中樂成宮",
    region: "中部",
    city: "臺中市",
    district: "東區",
    religion: "道教",
    deity: "天上聖母",
    address: "臺中市東區旱溪街48號",
    phone: "04-2211-1928",
    summary: "示範資料：地方媽祖信仰中心，俗稱旱溪媽祖廟。"
  },
  {
    id: "DEMO-C02",
    name: "鹿港天后宮",
    region: "中部",
    city: "彰化縣",
    district: "鹿港鎮",
    religion: "道教",
    deity: "天上聖母",
    address: "彰化縣鹿港鎮中山路430號",
    phone: "04-777-9899",
    summary: "示範資料：歷史悠久的媽祖廟，也是鹿港重要地標。"
  },
  {
    id: "DEMO-S01",
    name: "臺南祀典武廟",
    region: "南部",
    city: "臺南市",
    district: "中西區",
    religion: "道教",
    deity: "關聖帝君",
    address: "臺南市中西區永福路二段229號",
    phone: "06-229-4401",
    summary: "示範資料：主祀關聖帝君，具有深厚的府城歷史文化。"
  },
  {
    id: "1746804",
    name: "竹圍仔福德祠",
    region: "南部",
    city: "臺南市",
    district: "白河區",
    religion: "道教",
    deity: "福德正神",
    address: "臺南市白河區大竹里14鄰大排竹206號",
    phone: "06-6851562",
    summary: "預覽資料取自你提供的宮廟 XML，正式上線後改由後端資料庫回傳。"
  },
  {
    id: "1746805",
    name: "福德祠",
    region: "南部",
    city: "臺南市",
    district: "白河區",
    religion: "道教",
    deity: "福德正神",
    address: "臺南市白河區河東里3鄰糞箕湖33之2號",
    phone: "06-6858651",
    summary: "預覽資料取自你提供的宮廟 XML，正式上線後改由後端資料庫回傳。"
  },
  {
    id: "1746807",
    name: "永安宮",
    region: "南部",
    city: "臺南市",
    district: "麻豆區",
    religion: "道教",
    deity: "石府千歲",
    address: "臺南市麻豆區北勢里3鄰加輦邦29號",
    phone: "06-5719598",
    summary: "預覽資料取自你提供的宮廟 XML，正式上線後改由後端資料庫回傳。"
  },
  {
    id: "1746832",
    name: "宇宙光普音寺",
    region: "南部",
    city: "臺南市",
    district: "白河區",
    religion: "佛教",
    deity: "觀世音菩薩",
    address: "臺南市白河區大林里檨子林5之6號",
    phone: "06-6857103",
    summary: "預覽資料取自你提供的宮廟 XML，正式上線後改由後端資料庫回傳。"
  },
  {
    id: "1746833",
    name: "萬福宮",
    region: "南部",
    city: "臺南市",
    district: "麻豆區",
    religion: "道教",
    deity: "張府千歲",
    address: "臺南市麻豆區新建里4鄰興民街83號",
    phone: "06-5727064",
    summary: "預覽資料取自你提供的宮廟 XML，正式上線後改由後端資料庫回傳。"
  },
  {
    id: "1746858",
    name: "善主公廟",
    region: "南部",
    city: "臺南市",
    district: "白河區",
    religion: "道教",
    deity: "善主公",
    address: "臺南市白河區番子園竹門里13鄰20-17號",
    phone: "06-6850393",
    summary: "預覽資料取自你提供的宮廟 XML，正式上線後改由後端資料庫回傳。"
  },
  {
    id: "1746859",
    name: "大安宮",
    region: "南部",
    city: "臺南市",
    district: "白河區",
    religion: "道教",
    deity: "保生大帝",
    address: "臺南市白河區廣蓮里9鄰8-16號",
    phone: "06-6877457",
    summary: "預覽資料取自你提供的宮廟 XML，正式上線後改由後端資料庫回傳。"
  },
  {
    id: "1746860",
    name: "護濟宮",
    region: "南部",
    city: "臺南市",
    district: "麻豆區",
    religion: "道教",
    deity: "天上聖母",
    address: "臺南市麻豆區新興里光復路106號",
    phone: "06-5720993",
    summary: "預覽資料取自你提供的宮廟 XML，正式上線後改由後端資料庫回傳。"
  },
  {
    id: "DEMO-S02",
    name: "北港朝天宮",
    region: "南部",
    city: "雲林縣",
    district: "北港鎮",
    religion: "道教",
    deity: "天上聖母",
    address: "雲林縣北港鎮中山路178號",
    phone: "05-783-2055",
    summary: "示範資料：臺灣重要媽祖信仰中心之一。"
  },
  {
    id: "DEMO-E01",
    name: "花蓮慈天宮",
    region: "東部",
    city: "花蓮縣",
    district: "花蓮市",
    religion: "道教",
    deity: "天上聖母",
    address: "花蓮縣花蓮市忠孝街81號",
    phone: "03-832-2965",
    summary: "示範資料：花蓮市歷史悠久的媽祖信仰中心。"
  },
  {
    id: "DEMO-I01",
    name: "澎湖天后宮",
    region: "離島",
    city: "澎湖縣",
    district: "馬公市",
    religion: "道教",
    deity: "天上聖母",
    address: "澎湖縣馬公市正義街1號",
    phone: "06-926-2819",
    summary: "示範資料：見證澎湖海洋文化與媽祖信仰的歷史廟宇。"
  }
];

const MOCK_CHECKIN_IDS = [
  "DEMO-N01",
  "DEMO-N02",
  "DEMO-N03",
  "DEMO-N04",
  "DEMO-N05",
  "DEMO-C01",
  "DEMO-S01",
  "DEMO-E01",
  "DEMO-I01"
];

const appShell = document.querySelector("#appShell");
const openAddButton = document.querySelector("#openAddButton");
const userGreeting = document.querySelector("#userGreeting");
const addModal = document.querySelector("#addModal");
const closeAddButton = document.querySelector("#closeAddButton");
const filterView = document.querySelector("#filterView");
const resultsView = document.querySelector("#resultsView");
const backToFiltersButton = document.querySelector("#backToFiltersButton");
const searchForm = document.querySelector("#searchForm");
const regionButtons = [...document.querySelectorAll(".region-button")];
const citySelect = document.querySelector("#citySelect");
const districtSelect = document.querySelector("#districtSelect");
const religionSelect = document.querySelector("#religionSelect");
const deitySelect = document.querySelector("#deitySelect");
const searchButton = document.querySelector("#searchButton");
const formStatus = document.querySelector("#formStatus");
const resultSummary = document.querySelector("#resultSummary");
const resultList = document.querySelector("#resultList");
const detailModal = document.querySelector("#detailModal");
const closeDetailButton = document.querySelector("#closeDetailButton");
const detailRegion = document.querySelector("#detailRegion");
const detailName = document.querySelector("#detailName");
const detailReligionDeity = document.querySelector("#detailReligionDeity");
const detailAddress = document.querySelector("#detailAddress");
const detailPhone = document.querySelector("#detailPhone");
const detailCheckedAt = document.querySelector("#detailCheckedAt");
const detailSummary = document.querySelector("#detailSummary");
const deleteCheckinButton = document.querySelector("#deleteCheckinButton");
const loadingCover = document.querySelector("#loadingCover");
const loadingText = document.querySelector("#loadingText");
const toast = document.querySelector("#toast");

let selectedRegion = "北部";
let idToken = null;
let currentUser = null;
let checkins = [];
let latestSearchResults = [];
let toastTimer = null;
let isSavingCheckin = false;
let isDeletingCheckin = false;
let activeDetailTemple = null;
const pageByRegion = Object.fromEntries(REGIONS.map((region) => [region, 0]));

function sleep(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function loadLiffSdk() {
  if (window.liff) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://static.line-scdn.net/liff/edge/2/sdk.js";
    script.charset = "utf-8";
    script.onload = resolve;
    script.onerror = () => reject(new Error("LIFF SDK 載入失敗，請檢查網路連線"));
    document.head.append(script);
  });
}

function endpoint(name) {
  const base = String(CONFIG.API_BASE_URL ?? "").replace(/\/$/, "");
  const path = CONFIG.API_ENDPOINTS?.[name];
  if (!path) {
    throw new Error(`缺少 API_ENDPOINTS.${name} 設定`);
  }
  return `${base}${path}`;
}

function showLoading(message) {
  loadingText.textContent = message;
  loadingCover.hidden = false;
}

function hideLoading() {
  loadingCover.hidden = true;
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function setModalOpen(modal, shouldOpen) {
  modal.hidden = !shouldOpen;
  document.body.classList.toggle(
    "has-modal",
    !addModal.hidden || !detailModal.hidden
  );
}

function replaceOptions(selectElement, placeholder, values) {
  selectElement.replaceChildren(new Option(placeholder, ""));
  [...new Set(values)].forEach((value) => selectElement.add(new Option(value, value)));
}

function updateCityOptions(region) {
  replaceOptions(citySelect, "縣市", FILTER_DATA.regions?.[region] ?? []);
  replaceOptions(districtSelect, "行政區", []);
  districtSelect.disabled = true;
}

function updateDistrictOptions(city) {
  const districts = FILTER_DATA.districtsByCity?.[city] ?? [];
  replaceOptions(districtSelect, "行政區", districts);
  districtSelect.disabled = districts.length === 0;
}

function initializeFilters() {
  if (!FILTER_DATA.regions) {
    formStatus.textContent = "找不到 data/filter-options.js，篩選選單無法載入。";
    searchButton.disabled = true;
    return;
  }

  replaceOptions(religionSelect, "教別", FILTER_DATA.religions ?? []);
  replaceOptions(deitySelect, "主祀神祇", FILTER_DATA.deities ?? []);
  updateCityOptions(selectedRegion);
}

function setSelectedRegion(region) {
  selectedRegion = region;
  regionButtons.forEach((button) => {
    const selected = button.dataset.region === region;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  updateCityOptions(region);
}

function firstNonEmptyText(...values) {
  for (const value of values) {
    if (value === null || value === undefined) {
      continue;
    }
    const text = String(value).trim();
    if (text) {
      return text;
    }
  }
  return "";
}

function normalizeTaiwanText(value = "") {
  return String(value).trim().replaceAll("台", "臺");
}

function findCityFromAddress(address = "") {
  const normalizedAddress = normalizeTaiwanText(address);
  const cities = Object.values(FILTER_DATA.regions ?? {}).flat();
  return cities.find((city) => normalizedAddress.includes(normalizeTaiwanText(city))) ?? "";
}

function canonicalCity(city = "", address = "") {
  const normalizedCity = normalizeTaiwanText(city);
  const cities = Object.values(FILTER_DATA.regions ?? {}).flat();
  return (
    cities.find((candidate) => normalizeTaiwanText(candidate) === normalizedCity) ??
    (findCityFromAddress(address) || firstNonEmptyText(city))
  );
}

function regionFromCity(city = "") {
  const normalizedCity = normalizeTaiwanText(city);
  return (
    REGIONS.find((region) =>
      FILTER_DATA.regions?.[region]?.some(
        (candidate) => normalizeTaiwanText(candidate) === normalizedCity
      )
    ) ?? ""
  );
}

function normalizeRegion(value = "") {
  const region = firstNonEmptyText(value);
  if (!region) {
    return "";
  }
  if (REGIONS.includes(region)) {
    return region;
  }

  const normalized = normalizeTaiwanText(region).toLowerCase();
  if (normalized.includes("離島") || normalized.includes("外島") || normalized.includes("island")) {
    return "離島";
  }
  if (normalized.includes("北") || normalized.includes("north")) {
    return "北部";
  }
  if (normalized.includes("中") || normalized.includes("central")) {
    return "中部";
  }
  if (normalized.includes("南") || normalized.includes("south")) {
    return "南部";
  }
  if (normalized.includes("東") || normalized.includes("east")) {
    return "東部";
  }
  return "";
}

function unwrapTemple(payload) {
  if (!payload || typeof payload !== "object") {
    return {};
  }
  if (payload.temple && typeof payload.temple === "object") {
    return {
      ...payload.temple,
      checkInAt: payload.checkInAt ?? payload.temple.checkInAt,
      checkedInAt: payload.checkedInAt ?? payload.temple.checkedInAt
    };
  }
  if (payload.data && !Array.isArray(payload.data) && typeof payload.data === "object") {
    if (payload.data.temple) {
      return {
        ...payload.data.temple,
        checkInAt:
          payload.data.checkInAt ?? payload.checkInAt ?? payload.data.temple.checkInAt,
        checkedInAt:
          payload.data.checkedInAt ?? payload.checkedInAt ?? payload.data.temple.checkedInAt
      };
    }
    return payload.data;
  }
  return payload;
}

function normalizeTemple(payload) {
  const temple = unwrapTemple(payload);
  const address = firstNonEmptyText(temple.address, temple.location, temple["地址"]);
  const city = canonicalCity(
    firstNonEmptyText(temple.city, temple.county, temple["縣市"]),
    address
  );
  const region =
    normalizeRegion(firstNonEmptyText(temple.region, temple.area, temple["地區"])) ||
    regionFromCity(city) ||
    regionFromCity(findCityFromAddress(address));

  return {
    id: String(temple.id ?? temple.templeId ?? temple.temple_id ?? temple["編號"] ?? ""),
    name: temple.name ?? temple.templeName ?? temple.temple_name ?? temple["寺廟名稱"] ?? "未命名宮廟",
    region,
    city,
    district: temple.district ?? temple["行政區"] ?? "",
    religion: temple.religion ?? temple["教別"] ?? "",
    deity: temple.deity ?? temple.mainDeity ?? temple.main_deity ?? temple["主祀神祇"] ?? "",
    address,
    phone: temple.phone ?? temple.tel ?? temple["電話"] ?? "",
    summary: temple.summary ?? temple.description ?? temple.llmSummary ?? temple["摘要"] ?? "",
    checkedInAt:
      temple.checkInAt ??
      temple.checkedInAt ??
      temple.checked_in_at ??
      temple.createdAt ??
      temple.created_at ??
      ""
  };
}

function looksLikeTemple(payload) {
  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }
  const temple = unwrapTemple(payload);
  return Boolean(
    temple.id ??
      temple.templeId ??
      temple.temple_id ??
      temple.name ??
      temple.templeName ??
      temple.temple_name ??
      temple.address
  );
}

function extractList(payload, keys, visited = new Set()) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (!payload || typeof payload !== "object" || visited.has(payload)) {
    return [];
  }
  visited.add(payload);

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key];
    }
  }

  // 後端只有一筆紀錄時，即使回傳單一物件也能正常顯示。
  if (looksLikeTemple(payload)) {
    return [payload];
  }

  // 相容 data、result 等不同包裝層，以及更深層的 records 陣列。
  const preferredWrappers = ["data", "result", "payload", "response"];
  for (const key of preferredWrappers) {
    if (payload[key] && typeof payload[key] === "object") {
      const nested = extractList(payload[key], keys, visited);
      if (nested.length) {
        return nested;
      }
    }
  }
  for (const value of Object.values(payload)) {
    if (value && typeof value === "object") {
      const nested = extractList(value, keys, visited);
      if (nested.length) {
        return nested;
      }
    }
  }
  return [];
}

async function apiFetch(url, options = {}) {
  const headers = new Headers(options.headers ?? {});
  headers.set("Accept", "application/json");
  if (options.body) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include"
  });
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.detail ?? payload?.message ?? `伺服器回應 HTTP ${response.status}`;
    throw new Error(message);
  }
  return payload;
}

function mockMatches(temple, filters) {
  return (
    temple.region === filters.region &&
    (!filters.city || temple.city === filters.city) &&
    (!filters.district || temple.district === filters.district) &&
    (!filters.religion || temple.religion === filters.religion) &&
    (!filters.deity || temple.deity === filters.deity)
  );
}

async function searchTemples(filters) {
  if (CONFIG.USE_MOCK_API) {
    await sleep(MOCK_DELAY_MS);
    return MOCK_TEMPLES.filter((temple) => mockMatches(temple, filters));
  }

  // 沿用原本「找找宮廟」的查詢方式：GET + query string。
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== "") {
      params.set(key, value);
    }
  });

  const payload = await apiFetch(`${endpoint("search")}?${params.toString()}`, {
    method: "GET"
  });
  return extractList(payload, ["results", "temples", "items"]).map(normalizeTemple);
}

async function loadCheckins() {
  if (CONFIG.USE_MOCK_API) {
    await sleep(MOCK_DELAY_MS);
    const now = new Date().toISOString();
    return MOCK_CHECKIN_IDS.map((id) => ({
      ...MOCK_TEMPLES.find((temple) => temple.id === id),
      checkedInAt: now
    }));
  }

  if (!idToken) {
    throw new Error("目前沒有取得 LINE ID token");
  }

  const payload = await apiFetch(endpoint("login"), {
    method: "POST",
    body: JSON.stringify({ id_token: idToken })
  });
  return extractList(payload, ["records", "checkins", "temples", "items"]).map(normalizeTemple);
}

async function saveCheckin(temple) {
  if (CONFIG.USE_MOCK_API) {
    await sleep(MOCK_DELAY_MS);
    return { ...temple, checkedInAt: new Date().toISOString() };
  }

  const numericId = Number(temple.id);
  if (!Number.isInteger(numericId)) {
    throw new Error("宮廟 id 必須是整數");
  }

  const payload = await apiFetch(endpoint("records"), {
    method: "POST",
    body: JSON.stringify({
      id: numericId,
      checkInAt: new Date().toISOString()
    })
  });
  return normalizeTemple(payload);
}

async function deleteCheckin(temple) {
  if (CONFIG.USE_MOCK_API) {
    await sleep(MOCK_DELAY_MS);
    return;
  }

  await apiFetch(`${endpoint("records")}/${encodeURIComponent(temple.id)}`, {
    method: "DELETE"
  });
}

function renderShelf(region) {
  const row = document.querySelector(`.shelf-row[data-region="${region}"]`);
  const grid = row.querySelector("[data-orb-grid]");
  const nextButton = row.querySelector("[data-next-page]");
  const indicator = row.querySelector("[data-page-indicator]");
  const temples = checkins.filter((temple) => temple.region === region);
  const pageCount = Math.max(1, Math.ceil(temples.length / PAGE_SIZE));

  pageByRegion[region] %= pageCount;
  const page = pageByRegion[region];
  const visibleTemples = temples.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  grid.replaceChildren();

  visibleTemples.forEach((temple, index) => {
    const button = document.createElement("button");
    const label = document.createElement("span");
    button.type = "button";
    button.className = "temple-orb";
    button.style.animationDelay = `${index * 55}ms`;
    button.setAttribute("aria-label", `查看${temple.name}詳細資料`);
    label.textContent = temple.name;
    button.append(label);
    button.addEventListener("click", () => openTempleDetail(temple));
    grid.append(button);
  });

  const hasMultiplePages = pageCount > 1;
  nextButton.hidden = !hasMultiplePages;
  indicator.hidden = !hasMultiplePages;
  indicator.textContent = `${page + 1}/${pageCount}`;
}

function renderAllShelves() {
  REGIONS.forEach(renderShelf);
}

function showFilterView() {
  filterView.hidden = false;
  resultsView.hidden = true;
  formStatus.textContent = "";
}

function renderSearchResults(temples) {
  latestSearchResults = temples;
  resultList.replaceChildren();
  resultSummary.textContent = `共找到 ${temples.length} 間宮廟，點選後會加入你的打卡收藏架。`;

  if (temples.length === 0) {
    const empty = document.createElement("p");
    empty.className = "modal-intro";
    empty.textContent = "目前沒有符合條件的資料，請返回調整篩選。";
    resultList.append(empty);
    return;
  }

  temples.forEach((temple) => {
    const button = document.createElement("button");
    const name = document.createElement("strong");
    const address = document.createElement("span");
    const deity = document.createElement("span");
    button.type = "button";
    button.className = "result-item";
    name.textContent = temple.name;
    address.textContent = `地址：${temple.address || "未提供"}`;
    deity.textContent = `主祀神祇：${temple.deity || "未提供"}`;
    button.append(name, address, deity);
    button.addEventListener("click", () => addSelectedTemple(temple, button));
    resultList.append(button);
  });
}

async function addSelectedTemple(temple, button) {
  if (isSavingCheckin) {
    return;
  }
  isSavingCheckin = true;
  button.disabled = true;
  showLoading("正在保存這次打卡…");

  try {
    const savedTemple = normalizeTemple(await saveCheckin(temple));
    if (!savedTemple.id) {
      throw new Error("後端回傳資料缺少 id");
    }
    if (!savedTemple.region) {
      savedTemple.region = temple.region || selectedRegion;
    }

    const oldIndex = checkins.findIndex((item) => item.id === savedTemple.id);
    if (oldIndex >= 0) {
      checkins[oldIndex] = { ...checkins[oldIndex], ...savedTemple };
    } else {
      checkins.push(savedTemple);
    }

    pageByRegion[savedTemple.region] = Math.floor(
      Math.max(0, checkins.filter((item) => item.region === savedTemple.region).length - 1) / PAGE_SIZE
    );
    renderAllShelves();
    setModalOpen(addModal, false);
    showFilterView();
    showToast(`${savedTemple.name} 已放上${savedTemple.region}層架`);
  } catch (error) {
    showToast(`保存失敗：${error.message}`);
    button.disabled = false;
  } finally {
    hideLoading();
    isSavingCheckin = false;
  }
}

function fillDetail(temple) {
  detailRegion.textContent = temple.region || "地區未提供";
  detailName.textContent = temple.name;
  detailReligionDeity.textContent = [temple.religion, temple.deity].filter(Boolean).join("／") || "未提供";
  detailAddress.textContent = temple.address || "未提供";
  detailPhone.textContent = temple.phone || "未提供";
  detailCheckedAt.textContent = formatDateTime(temple.checkedInAt);
  detailSummary.textContent = temple.summary || "後端尚未提供這間宮廟的摘要。";
}

function formatDateTime(value) {
  if (!value) {
    return "未提供";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

async function openTempleDetail(temple) {
  activeDetailTemple = temple;
  fillDetail(temple);
  setModalOpen(detailModal, true);
  closeDetailButton.focus();
}

function closeDetailModal() {
  setModalOpen(detailModal, false);
  activeDetailTemple = null;
}

async function removeActiveCheckin() {
  const temple = activeDetailTemple;
  if (!temple || isDeletingCheckin) {
    return;
  }

  const confirmed = window.confirm(`確定要將「${temple.name}」從收藏架移除嗎？`);
  if (!confirmed) {
    return;
  }

  isDeletingCheckin = true;
  deleteCheckinButton.disabled = true;
  showLoading("正在移除這筆打卡…");

  try {
    await deleteCheckin(temple);
    checkins = checkins.filter((item) => item.id !== temple.id);
    renderAllShelves();
    closeDetailModal();
    showToast(`${temple.name} 已從收藏架移除`);
  } catch (error) {
    showToast(`刪除失敗：${error.message}`);
  } finally {
    hideLoading();
    isDeletingCheckin = false;
    deleteCheckinButton.disabled = false;
  }
}

async function initializeLineIdentity() {
  if (CONFIG.USE_MOCK_API) {
    currentUser = { name: "預覽使用者" };
    userGreeting.textContent = "預覽模式｜資料重新整理後會重設";
    return;
  }

  if (!CONFIG.LIFF_ID || CONFIG.LIFF_ID === "YOUR_LIFF_ID") {
    throw new Error("請先在 config.js 填入 LIFF_ID");
  }
  await loadLiffSdk();
  if (!window.liff) {
    throw new Error("LIFF SDK 載入失敗，請檢查網路連線");
  }

  await window.liff.init({
    liffId: CONFIG.LIFF_ID,
    withLoginOnExternalBrowser: true
  });

  if (!window.liff.isLoggedIn()) {
    window.liff.login({ redirectUri: window.location.href });
    return new Promise(() => {});
  }

  idToken = window.liff.getIDToken();
  const decoded = window.liff.getDecodedIDToken();
  currentUser = { name: decoded?.name ?? "LINE 使用者" };
  userGreeting.textContent = `${currentUser.name} 的宮廟足跡`;
}

regionButtons.forEach((button) => {
  button.addEventListener("click", () => setSelectedRegion(button.dataset.region));
});

citySelect.addEventListener("change", () => updateDistrictOptions(citySelect.value));

document.querySelectorAll("[data-next-page]").forEach((button) => {
  button.addEventListener("click", () => {
    const region = button.closest(".shelf-row").dataset.region;
    pageByRegion[region] += 1;
    renderShelf(region);
  });
});

openAddButton.addEventListener("click", () => {
  showFilterView();
  setModalOpen(addModal, true);
  closeAddButton.focus();
});

closeAddButton.addEventListener("click", () => setModalOpen(addModal, false));
closeDetailButton.addEventListener("click", closeDetailModal);
deleteCheckinButton.addEventListener("click", removeActiveCheckin);
backToFiltersButton.addEventListener("click", showFilterView);

addModal.addEventListener("click", (event) => {
  if (event.target === addModal) {
    setModalOpen(addModal, false);
  }
});

detailModal.addEventListener("click", (event) => {
  if (event.target === detailModal) {
    closeDetailModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }
  if (!detailModal.hidden) {
    closeDetailModal();
  } else if (!addModal.hidden) {
    setModalOpen(addModal, false);
  }
});

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const filters = {
    region: selectedRegion,
    city: citySelect.value || null,
    district: districtSelect.value || null,
    religion: religionSelect.value || null,
    deity: deitySelect.value || null
  };

  searchButton.disabled = true;
  formStatus.textContent = "正在尋找符合條件的宮廟…";
  try {
    const results = (await searchTemples(filters)).map(normalizeTemple);
    renderSearchResults(results);
    filterView.hidden = true;
    resultsView.hidden = false;
  } catch (error) {
    formStatus.textContent = `查詢失敗：${error.message}`;
  } finally {
    searchButton.disabled = false;
  }
});

async function startApp() {
  initializeFilters();
  renderAllShelves();
  showLoading("正在讀取你的宮廟足跡…");

  try {
    await initializeLineIdentity();
    checkins = (await loadCheckins()).map(normalizeTemple).filter((temple) => temple.id);
    renderAllShelves();
  } catch (error) {
    userGreeting.textContent = "目前無法載入個人打卡資料";
    showToast(error.message);
  } finally {
    hideLoading();
    appShell.setAttribute("aria-busy", "false");
  }
}

startApp();
