import "../scss/main.scss";

/* ==========================
   ЭЛЕМЕНТЫ DOM
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

/* ==========================
   ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
========================== */
function getSectorByAngle(angle) {
  const normalized = (angle % 360 + 360) % 360;
  return sectors.find((s) =>
    s.start < s.end
      ? normalized >= s.start && normalized < s.end
      : normalized >= s.start || normalized < s.end
  );
}

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
  const totalRotation = 360 * 6 + randomDeg; // 6 оборотов + случайный угол
  const duration = 5000; // 5 секунд

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

/* ==========================
   РЕЗУЛЬТАТ ВРАЩЕНИЯ
========================== */
function finishSpin(rotation) {
  const sector = getSectorByAngle(rotation);
  console.log("Результат:", sector.name);

  const isPrize = sector.name.includes("₸") || sector.name.includes("Бонус");
  godzillaRoar(isPrize, sector.name);
}

/* ==========================
   АНИМАЦИЯ ГОДЗИЛЛЫ
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
   МОДАЛКА ВЫИГРЫША (HTML-версия)
========================== */
function showModal(prize) {
  const modal = document.getElementById("prizeModal");
  const prizeAmount = document.getElementById("modalPrizeAmount");
  const closeBtn = modal.querySelector(".modal__close");
  const claimBtn = document.getElementById("modalClaimBtn");

  // Обновляем приз
  prizeAmount.textContent = prize;

  // Показываем модалку
  modal.classList.add("active");

  // Закрытие
  closeBtn.onclick = () => modal.classList.remove("active");
  claimBtn.onclick = () => {
    alert("Бонус отправлен!");
    modal.classList.remove("active");
  };
}

/* ==========================
   СТАРТ
========================== */
initTemperatureBlock();
fetchTemperature();
