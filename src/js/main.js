import "../scss/main.scss";

/* ==========================
   DOM ЭЛЕМЕНТЫ
========================== */
const tempTitle = document.querySelector(".temp__title");
const tempDesc = document.querySelector(".temp__description");
const spinBtn = document.querySelector(".wheel__button");
const wheelBase = document.querySelector(".wheel__base");
const godzilla = document.querySelector(".spin-block__godzilla");

/* ==========================
   СЕКТОРА КОЛЕСА
========================== */
const sectors = [
  { name: "200 000 ₸", start: 337.5, end: 22.5 },
  { name: "Повтор", start: 22.5, end: 67.5 },
  { name: "100 000 ₸", start: 67.5, end: 112.5 },
  { name: "Бонус +", start: 112.5, end: 157.5 },
  { name: "150 000 ₸", start: 157.5, end: 202.5 },
  { name: "Повтор", start: 202.5, end: 247.5 },
  { name: "Повтор", start: 247.5, end: 292.5 },
  { name: "100 000 ₸", start: 292.5, end: 337.5 },
];

function getSectorByAngle(angle) {
  const normalized = (angle % 360 + 360) % 360;
  return sectors.find((s) =>
    s.start < s.end
      ? normalized >= s.start && normalized < s.end
      : normalized >= s.start || normalized < s.end
  );
}

/* ==========================
   ТЕМПЕРАТУРА
========================== */
function initTemperatureBlock() {
  tempTitle.classList.add("temp__title--loading");
  tempTitle.textContent = "Загрузка температуры...";
}

async function fetchTemperature() {
  try {
    const res = await fetch("http://localhost:3000/api/weather");
    const data = await res.json();

    if (!data.current) throw new Error("No temperature data");

    tempTitle.textContent = `${data.current.temperature}°C`;
    tempTitle.classList.remove("temp__title--loading");
  } catch {
    tempTitle.textContent = "Температура недоступна";
  }
}

/* ==========================
   АНИМАЦИЯ КОЛЕСА
========================== */
let isSpinning = false;

spinBtn.addEventListener("click", () => {
  if (isSpinning) return;
  isSpinning = true;
  spinWheel();
});

function spinWheel() {
  const randomDeg = Math.floor(Math.random() * 360);
  const totalRotation = 360 * 6 + randomDeg;
  const duration = 5000;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const start = performance.now();

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const rotation = easeOutCubic(progress) * totalRotation;

    wheelBase.style.transform = `rotate(${rotation}deg)`;

    if (progress < 1) requestAnimationFrame(animate);
    else finishSpin(rotation);
  }

  requestAnimationFrame(animate);
}

function finishSpin(rotation) {
  const sector = getSectorByAngle(rotation);
  const isPrize = sector.name.includes("₸") || sector.name.includes("Бонус");
  godzillaRoar(isPrize, sector.name);
}

/* ==========================
   АНИМАЦИЯ GODZILLA
========================== */
function godzillaRoar(isPrize, prize) {
  godzilla.classList.add("roar");

  setTimeout(() => {
    godzilla.classList.remove("roar");
    if (isPrize) showModal(prize);
    isSpinning = false;
  }, 1000);
}

/* ==========================
   МОДАЛКА
========================== */
function showModal(prize) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal__content modal--prize">
      <button class="modal__close">×</button>
      <h2 class="modal__title">Вы выиграли</h2>

      <div class="modal__prize-box">
        <img src="img/prize-banner.png" alt="Приз" class="modal__banner" />
        <div class="modal__amount">${prize}</div>
      </div>

      <button class="modal__claim">Забрать бонус</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector(".modal__close").addEventListener("click", () => modal.remove());
  modal.querySelector(".modal__claim").addEventListener("click", () => {
    alert("Бонус отправлен!");
    modal.remove();
  });
}

/* ==========================
   СТАРТ
========================== */
initTemperatureBlock();
fetchTemperature();
