(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&c(n)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function c(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}})();const s=document.querySelector(".temp__title"),f=document.querySelector(".temp__description"),p=document.querySelector(".wheel__button"),h=document.querySelector(".wheel__base"),d=document.querySelector(".spin-block__godzilla");function _(){s.classList.add("temp__title--loading"),s.textContent="Загрузка температуры...",f.innerHTML=`
    <svg class="temp__icon" width="24" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C7 0 3 4 3 9C3 15 12 34 12 34C12 34 21 15 21 9C21 4 17 0 12 0Z" fill="#ffffff"/>
      <circle cx="12" cy="9" r="3" fill="rgba(76, 76, 76, 0.4)"/>
    </svg>
    <span class="temp__city-text">Almaty</span>
  `}async function y(){try{const r=await(await fetch("http://localhost:3000/api/weather")).json();if(!r.current)throw new Error("No temperature data");s.textContent=`${r.current.temperature}°C`,s.classList.remove("temp__title--loading")}catch(o){s.textContent="Температура недоступна",console.error("Ошибка при получении температуры:",o)}}function g(){const o=Math.floor(Math.random()*360),r=360*6+o,i=5e3,c=n=>1-Math.pow(1-n,3),e=performance.now();function t(n){const u=n-e,l=Math.min(u/i,1),m=c(l)*r;h.style.transform=`rotate(${m}deg)`,l<1?requestAnimationFrame(t):w()}requestAnimationFrame(t)}function w(){d.classList.add("roar"),setTimeout(()=>{d.classList.remove("roar"),v(),a=!1},1e3)}function v(){const o=document.createElement("div");o.className="modal",o.innerHTML=`
    <div class="modal__content">
      <h2>Поздравляем!</h2>
      <p>Вы получили главный приз! Зарегистрируйтесь, чтобы забрать бонус.</p>
      <button class="modal__close">Закрыть</button>
    </div>
  `,document.body.appendChild(o),o.querySelector(".modal__close").addEventListener("click",()=>o.remove())}let a=!1;p.addEventListener("click",()=>{a||(a=!0,g())});_();y();
