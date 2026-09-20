const blessingModes = [
  { id: "jiaobei", name: "擲筊", image: "images/jiaobei.webp", imageAlt: "兩個筊" },
  { id: "wooden-fish", name: "敲木魚", image: "images/wooden-fish.webp", imageAlt: "木魚" },
];

const jiaobeiFaceImages = {
  front: "images/jiaobei-front.webp",
  back: "images/jiaobei-back.webp",
};

const selectorView = document.querySelector("#selectorView");
const jiaobeiView = document.querySelector("#jiaobeiView");
const woodenFishView = document.querySelector("#woodenFishView");
const backButton = document.querySelector("#backButton");
const blessingName = document.querySelector("#blessingName");
const activityButton = document.querySelector("#activityButton");
const activityImage = document.querySelector("#activityImage");
const previousButton = document.querySelector("#previousButton");
const nextButton = document.querySelector("#nextButton");
const modeStatus = document.querySelector("#modeStatus");
const indicators = [...document.querySelectorAll(".mode-indicator")];
const leftJiaobei = document.querySelector("#leftJiaobei");
const rightJiaobei = document.querySelector("#rightJiaobei");
const leftJiaobeiImage = document.querySelector("#leftJiaobeiImage");
const rightJiaobeiImage = document.querySelector("#rightJiaobeiImage");
const tossButton = document.querySelector("#tossButton");
const tossButtonLabel = document.querySelector("#tossButtonLabel");
const jiaobeiResult = document.querySelector("#jiaobeiResult");
const meritCount = document.querySelector("#meritCount");
const muyuButton = document.querySelector("#muyuButton");
const muyuImage = document.querySelector("#muyuImage");
const muyuStick = document.querySelector("#muyuStick");
const muyuEffects = document.querySelector("#muyuEffects");
const muyuAudio = document.querySelector("#muyuAudio");

const TOSS_DURATION = 950;
let currentModeIndex = 0;
let activeFeature = null;
let changeTimer;
let tossTimer;
let isTossing = false;
let merit = 0;

// 先載入切換與互動會使用的素材。
[
  ...blessingModes.map(({ image }) => image),
  ...Object.values(jiaobeiFaceImages),
  "images/wooden-fish-stick.webp",
].forEach((imagePath) => {
  const preloadImage = new Image();
  preloadImage.src = imagePath;
});

function renderMode(nextIndex) {
  currentModeIndex = (nextIndex + blessingModes.length) % blessingModes.length;
  const mode = blessingModes[currentModeIndex];

  window.clearTimeout(changeTimer);
  activityButton.classList.add("is-changing");

  changeTimer = window.setTimeout(() => {
    blessingName.textContent = mode.name;
    activityImage.src = mode.image;
    activityImage.alt = mode.imageAlt;
    activityButton.dataset.mode = mode.id;
    activityButton.className = `activity-button mode-${mode.id}`;
    activityButton.setAttribute("aria-label", `開始${mode.name}`);

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("is-active", index === currentModeIndex);
    });
    modeStatus.textContent = `目前選擇：${mode.name}`;
  }, 150);
}

function showOnlyFeature(featureElement) {
  selectorView.hidden = true;
  jiaobeiView.hidden = featureElement !== jiaobeiView;
  woodenFishView.hidden = featureElement !== woodenFishView;
  backButton.hidden = false;
}

function resetJiaobei() {
  window.clearTimeout(tossTimer);
  isTossing = false;
  tossButton.disabled = false;
  tossButton.removeAttribute("aria-busy");
  tossButtonLabel.textContent = "擲筊";
  leftJiaobei.classList.remove("is-tossing");
  rightJiaobei.classList.remove("is-tossing");
  leftJiaobeiImage.src = jiaobeiFaceImages.front;
  leftJiaobeiImage.alt = "左筊正面";
  rightJiaobeiImage.src = jiaobeiFaceImages.back;
  rightJiaobeiImage.alt = "右筊反面";
  jiaobeiResult.textContent = "";
  jiaobeiResult.classList.remove("is-visible");
}

function resetMerit() {
  merit = 0;
  meritCount.textContent = "0";
  muyuStick.classList.remove("is-striking");
  muyuImage.classList.remove("is-hit");
  muyuEffects.replaceChildren();
}

function openFeature(modeId) {
  activeFeature = modeId;

  if (modeId === "jiaobei") {
    resetJiaobei();
    showOnlyFeature(jiaobeiView);
    tossButton.focus({ preventScroll: true });
    return;
  }

  resetMerit();
  showOnlyFeature(woodenFishView);
  muyuButton.focus({ preventScroll: true });
}

function closeFeature() {
  if (activeFeature === "wooden-fish") resetMerit();
  if (activeFeature === "jiaobei") resetJiaobei();

  activeFeature = null;
  jiaobeiView.hidden = true;
  woodenFishView.hidden = true;
  selectorView.hidden = false;
  backButton.hidden = true;
  activityButton.focus({ preventScroll: true });
}

function randomJiaobeiFace() {
  return Math.random() < 0.5 ? "front" : "back";
}

function getJiaobeiResult(leftFace, rightFace) {
  if (leftFace !== rightFace) return "聖筊";
  return leftFace === "front" ? "笑筊" : "陰筊";
}

function setJiaobeiImage(imageElement, sideName, face) {
  const faceName = face === "front" ? "正面" : "反面";
  imageElement.src = jiaobeiFaceImages[face];
  imageElement.alt = `${sideName}${faceName}`;
}

function tossJiaobei() {
  if (isTossing) return;

  isTossing = true;
  tossButton.disabled = true;
  tossButton.setAttribute("aria-busy", "true");
  jiaobeiResult.textContent = "";
  jiaobeiResult.classList.remove("is-visible");

  const leftFace = randomJiaobeiFace();
  const rightFace = randomJiaobeiFace();

  leftJiaobei.classList.remove("is-tossing");
  rightJiaobei.classList.remove("is-tossing");
  void leftJiaobei.offsetWidth;
  leftJiaobei.classList.add("is-tossing");
  rightJiaobei.classList.add("is-tossing");

  tossTimer = window.setTimeout(() => {
    setJiaobeiImage(leftJiaobeiImage, "左筊", leftFace);
    setJiaobeiImage(rightJiaobeiImage, "右筊", rightFace);
    leftJiaobei.classList.remove("is-tossing");
    rightJiaobei.classList.remove("is-tossing");

    jiaobeiResult.textContent = getJiaobeiResult(leftFace, rightFace);
    void jiaobeiResult.offsetWidth;
    jiaobeiResult.classList.add("is-visible");

    tossButtonLabel.textContent = "再擲一次！";
    tossButton.disabled = false;
    tossButton.removeAttribute("aria-busy");
    isTossing = false;
  }, TOSS_DURATION);
}

function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function createMuyuEffects() {
  const spark = document.createElement("span");
  spark.className = "impact-spark";
  spark.textContent = "✦";
  spark.addEventListener("animationend", () => spark.remove(), { once: true });
  muyuEffects.append(spark);

  const meritFloat = document.createElement("span");
  meritFloat.className = "merit-float";
  meritFloat.textContent = "功德 +1";
  meritFloat.style.setProperty("--float-x", `${Math.round(Math.random() * 46 - 23)}px`);
  meritFloat.addEventListener("animationend", () => meritFloat.remove(), { once: true });
  muyuEffects.append(meritFloat);
}

function playMuyuSound() {
  if (!muyuAudio.currentSrc) return;

  const hitSound = muyuAudio.cloneNode(true);
  hitSound.volume = 0.82;
  hitSound.play().catch(() => {
    // 音效尚未載入時，不影響其他互動。
  });
}

function hitMuyu() {
  merit += 1;
  meritCount.textContent = String(merit);
  restartAnimation(muyuStick, "is-striking");
  restartAnimation(muyuImage, "is-hit");
  createMuyuEffects();
  playMuyuSound();
}

previousButton.addEventListener("click", () => renderMode(currentModeIndex - 1));
nextButton.addEventListener("click", () => renderMode(currentModeIndex + 1));
activityButton.addEventListener("click", () => openFeature(blessingModes[currentModeIndex].id));
backButton.addEventListener("click", closeFeature);
tossButton.addEventListener("click", tossJiaobei);
muyuButton.addEventListener("click", hitMuyu);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeFeature) {
    closeFeature();
    return;
  }
  if (activeFeature) return;
  if (event.key === "ArrowLeft") renderMode(currentModeIndex - 1);
  if (event.key === "ArrowRight") renderMode(currentModeIndex + 1);
});
