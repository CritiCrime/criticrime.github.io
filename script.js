// ===== Menú móvil =====
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');

menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

// ===== Filtro por formato =====
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.card');
const empty = document.getElementById('empty');

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');

    const filter = chip.dataset.filter;
    let visible = 0;
    cards.forEach((card) => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.hidden = !show;
      if (show) visible++;
    });
    empty.hidden = visible > 0;
  });
});

// ===== Cuenta atrás hasta la mesa redonda (30/11) con animación =====
const eventDate = new Date(2026, 10, 30, 0, 0, 0); // mes 10 = noviembre
const cdD = document.getElementById('cd-d');
const cdH = document.getElementById('cd-h');
const cdM = document.getElementById('cd-m');
let isFirstLoad = true; // Variabile per tracciare il primo caricamento

// Funzione per l'animazione fluida dei numeri
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    // Calcola il progresso da 0 a 1
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // Effetto ease-out (rallenta alla fine)
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    
    element.textContent = Math.floor(easeOutProgress * (end - start) + start);
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = end; // Assicura che finisca sul numero esatto
    }
  };
  window.requestAnimationFrame(step);
}

function updateCountdown() {
  if (!cdD || !cdH || !cdM) return;
  const diff = Math.max(eventDate - new Date(), 0);
  
  // Calcola i valori target
  const targetD = Math.floor(diff / 86400000);
  const targetH = Math.floor(diff / 3600000) % 24;
  const targetM = Math.floor(diff / 60000) % 60;

  if (isFirstLoad) {
    // Se è il primo caricamento, avvia l'animazione da 0 al valore target in 1.5s
    animateValue(cdD, 0, targetD, 1500);
    animateValue(cdH, 0, targetH, 1500);
    animateValue(cdM, 0, targetM, 1500);
    isFirstLoad = false;
  } else {
    // Aggiornamenti successivi istantanei (ogni minuto)
    cdD.textContent = targetD;
    cdH.textContent = targetH;
    cdM.textContent = targetM;
  }
}

updateCountdown();
setInterval(updateCountdown, 30000); // Aggiorna in background ogni 30 secondi
// ===== Validación del formulario =====
const form = document.getElementById('contact-form');
const ok = document.getElementById('ok');

function setError(id, message) {
  const field = document.getElementById(id);
  document.getElementById('err-' + id).textContent = message;
  field.classList.toggle('invalid', Boolean(message));
  return !message;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const msg = form.msg.value.trim();

  const validName = setError('name', name.length < 2 ? 'Escribe tu nombre.' : '');
  const validEmail = setError('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Escribe un correo electrónico válido.');
  const validMsg = setError('msg', msg.length < 10 ? 'Escribe al menos 10 caracteres.' : '');

  if (validName && validEmail && validMsg) {
    // Aquí puedes conectar un backend o un servicio como Formspree con fetch()
    ok.hidden = false;
    form.reset();
  } else {
    ok.hidden = true;
  }
});

// ===== Aparición suave de los bloques al hacer scroll =====
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// ===== Aviso de Instagram: tarjeta abajo a la derecha, se queda hasta que se cierra =====
const igToast = document.getElementById('ig-toast');
if (igToast) {
  setTimeout(() => { igToast.hidden = false; }, 1200); // aparece 1,2 s después de cargar la página
  igToast.querySelector('.ig-close').addEventListener('click', () => { igToast.hidden = true; });
}