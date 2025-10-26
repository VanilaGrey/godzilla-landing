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
   ИНИЦИАЛИЗАЦИЯ ТЕМПЕРАТУРЫ
========================== */
function initTemperatureBlock() {
  tempTitle.classList.add("temp__title--loading");
  tempTitle.textContent = "Загрузка температуры...";
  tempDesc.innerHTML = `
    <svg class="temp__icon" width="24" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C7 0 3 4 3 9C3 15 12 34 12 34C12 34 21 15 21 9C21 4 17 0 12 0Z" fill="#ffffff"/>
      <circle cx="12" cy="9" r="3" fill="rgba(76, 76, 76, 0.4)"/>
    </svg>
    <span class="temp__city-text">Almaty</span>
  `;
}

/* ==========================
   ЗАПРОС ПОГОДЫ
========================== */
async function fetchTemperature() {
  try {
    const res = await fetch("http://localhost:3000/api/weather");
    const data = await res.json();

    if (!data.current) throw new Error("No temperature data");

    tempTitle.textContent = `${data.current.temperature}°C`;
    tempTitle.classList.remove("temp__title--loading");
  } catch (err) {
    tempTitle.textContent = "Температура недоступна";
    console.error("Ошибка при получении температуры:", err);
  }
}

/* ==========================
   АНИМАЦИЯ ВРАЩЕНИЯ КОЛЕСА
========================== */
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

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      godzillaRoar();
    }
  }

  requestAnimationFrame(animate);
}

/* ==========================
   АНИМАЦИЯ ГОДЗИЛЛЫ
========================== */
function godzillaRoar() {
  godzilla.classList.add("roar");

  setTimeout(() => {
    godzilla.classList.remove("roar");
    showModal();
    isSpinning = false;
  }, 1000);
}

/* ==========================
   МОДАЛЬНОЕ ОКНО
========================== */
function showModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal__content">
      <h2>Поздравляем!</h2>
      <p>Вы получили главный приз! Зарегистрируйтесь, чтобы забрать бонус.</p>
      <button class="modal__close">Закрыть</button>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector(".modal__close").addEventListener("click", () => modal.remove());
}

/* ==========================
   ОБРАБОТЧИК НАЖАТИЯ
========================== */
let isSpinning = false;

spinBtn.addEventListener("click", () => {
  if (isSpinning) return;
  isSpinning = true;
  spinWheel();
});

/* ==========================
   СТАРТ ПРИ ЗАГРУЗКЕ
========================== */
initTemperatureBlock();
fetchTemperature();
