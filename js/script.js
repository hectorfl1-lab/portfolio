/* =========================================================
   Héctor Fernández López de Coca — Portfolio
   Interacciones: nav móvil, reveal on scroll, scroll-spy,
   tilt de foto, header dinámico, fondo animado (parallax),
   grid de Trabajos + modal con carrusel, copiar email.
   ========================================================= */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header dinámico al hacer scroll ---------- */
  const header = document.getElementById("site-header");
  const onScrollHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Menú móvil ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");

  const closeNav = () => {
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });

  mainNav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  /* ---------- Scroll-spy: resalta el enlace activo ---------- */
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = `#${entry.target.id}`;
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => spyObserver.observe(section));
  }

  /* ---------- Reveal on scroll ---------- */
  const animatedEls = document.querySelectorAll("[data-animate]");
  if ("IntersectionObserver" in window && animatedEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    animatedEls.forEach((el) => revealObserver.observe(el));
  } else {
    animatedEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Tilt sutil sobre el marco de foto ---------- */
  const tiltEl = document.querySelector("[data-tilt]");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (tiltEl && canHover && !prefersReducedMotion) {
    const strength = 10; // grados máximos de inclinación

    const handleMove = (e) => {
      const rect = tiltEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tiltEl.style.transform = `rotateY(${x * strength}deg) rotateX(${-y * strength}deg) scale(1.02)`;
    };

    const resetTilt = () => {
      tiltEl.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
    };

    tiltEl.addEventListener("mousemove", handleMove);
    tiltEl.addEventListener("mouseleave", resetTilt);
  }

  /* ---------- Fondo animado: parallax sutil con el puntero ---------- */
  const bgField = document.getElementById("bg-field");
  if (bgField && canHover && !prefersReducedMotion) {
    const range = 14; // px máximos de desplazamiento
    let ticking = false;
    let targetX = 0;
    let targetY = 0;

    const applyParallax = () => {
      document.documentElement.style.setProperty("--px", targetX.toFixed(2));
      document.documentElement.style.setProperty("--py", targetY.toFixed(2));
      ticking = false;
    };

    window.addEventListener("pointermove", (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      targetX = nx * range;
      targetY = ny * range;
      if (!ticking) {
        window.requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* =========================================================
     TRABAJOS — datos + grid + modal con carrusel
     Para añadir un proyecto nuevo: añade un objeto a `projects`
     y coloca sus imágenes en Images/trabajos/ siguiendo el
     patrón proyecto-{id}-slide-{n}.jpg — aparecerán solas.
     ========================================================= */
  const projects = [
    {
      id: 1,
      category: "Branding",
      title: "Identidad visual — Cliente X",
      teaser: "Construcción de marca desde cero: naming, moodboard y sistema visual.",
      meta: { Categoría: "Branding", Cliente: "Pendiente", Herramientas: "Photoshop · InDesign" },
      slides: 3,
    },
    {
      id: 2,
      category: "Rebranding",
      title: "Rebranding de marca — Cliente Y",
      teaser: "Renovación de identidad visual manteniendo el reconocimiento de marca existente.",
      meta: { Categoría: "Rebranding", Cliente: "Pendiente", Herramientas: "Photoshop · InDesign" },
      slides: 3,
    },
    {
      id: 3,
      category: "Redes sociales",
      title: "Estrategia de contenido — Cliente Z",
      teaser: "Planificación y diseño de contenido para redes: calendario, piezas y tono de marca.",
      meta: { Categoría: "Social Media", Cliente: "Pendiente", Herramientas: "Photoshop · Premiere" },
      slides: 3,
    },
    {
      id: 4,
      category: "Edición IA · Imagen",
      title: "Retoque y composición con IA — Proyecto A",
      teaser: "Edición de imagen apoyada en IA para piezas de marca y campañas visuales.",
      meta: { Categoría: "Edición con IA", Cliente: "Pendiente", Herramientas: "Photoshop · IA" },
      slides: 3,
    },
    {
      id: 5,
      category: "Edición IA · Vídeo",
      title: "Edición de vídeo con IA — Proyecto B",
      teaser: "Montaje y postproducción de vídeo con apoyo de herramientas de inteligencia artificial.",
      meta: { Categoría: "Edición con IA", Cliente: "Pendiente", Herramientas: "Premiere · IA" },
      slides: 3,
    },
  ];

  const workGrid = document.getElementById("work-grid");

  const slidePath = (projectId, slideIndex) => `Images/trabajos/proyecto-${projectId}-slide-${slideIndex}.jpg`;

  const buildThumbHTML = (project) => {
    const path = slidePath(project.id, 1);
    const monogram = project.category.slice(0, 2).toUpperCase();
    return `
      <div class="work-thumb">
        <span class="work-category">${project.category}</span>
        <img
          src="${path}"
          alt="Vista previa del proyecto: ${project.title}"
          loading="lazy"
          onerror="this.classList.add('is-broken'); this.nextElementSibling.classList.remove('is-hidden');"
        >
        <div class="work-thumb-placeholder is-hidden">
          <span class="work-thumb-mono" aria-hidden="true">${monogram}</span>
          <span class="work-thumb-path">${path}</span>
        </div>
      </div>
    `;
  };

  if (workGrid) {
    workGrid.innerHTML = projects
      .map(
        (project) => `
      <button type="button" class="work-card" data-project-id="${project.id}" aria-haspopup="dialog">
        ${buildThumbHTML(project)}
        <div class="work-body">
          <h3 class="work-title">${project.title}</h3>
          <p class="work-teaser">${project.teaser}</p>
          <span class="work-cta">Ver proyecto <span class="arrow" aria-hidden="true">↗</span></span>
        </div>
      </button>
    `
      )
      .join("");
  }

  /* ---------- Modal + carrusel ---------- */
  const modal = document.getElementById("work-modal");
  const modalBackdrop = document.getElementById("work-modal-backdrop");
  const modalClose = document.getElementById("work-modal-close");
  const modalCategory = document.getElementById("work-modal-category");
  const modalTitle = document.getElementById("work-modal-title");
  const modalMeta = document.getElementById("work-modal-meta");
  const modalDesc = document.getElementById("work-modal-desc");
  const track = document.getElementById("carousel-track");
  const dotsWrap = document.getElementById("carousel-dots");
  const arrowPrev = document.getElementById("carousel-prev");
  const arrowNext = document.getElementById("carousel-next");

  let currentSlide = 0;
  let totalSlides = 0;
  let lastFocusedEl = null;

  const buildSlideHTML = (project, index) => {
    const n = index + 1;
    const path = slidePath(project.id, n);
    return `
      <div class="slide" data-index="${index}">
        <img
          src="${path}"
          alt="Imagen ${n} del proyecto ${project.title}"
          class="slide-photo"
          loading="lazy"
          onerror="this.classList.add('is-broken'); this.nextElementSibling.classList.add('is-visible');"
        >
        <div class="slide-placeholder">
          <span class="slide-monogram" aria-hidden="true">${n}</span>
          <span class="slide-mono">${path}</span>
          <span class="slide-hint">↳ coloca aquí la imagen del proyecto</span>
        </div>
      </div>
    `;
  };

  const goToSlide = (index) => {
    if (!totalSlides) return;
    currentSlide = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    Array.from(dotsWrap.children).forEach((dot, i) => {
      dot.classList.toggle("is-active", i === currentSlide);
    });
  };

  const getFocusableEls = () =>
    Array.from(
      modal.querySelectorAll(
        'button, [href], [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null);

  const openModal = (project) => {
    lastFocusedEl = document.activeElement;

    modalCategory.textContent = project.category;
    modalTitle.textContent = project.title;
    modalDesc.textContent = "Descripción pendiente — añade aquí el contexto, el reto y el resultado del proyecto.";

    modalMeta.innerHTML = Object.entries(project.meta)
      .map(([label, value]) => `<span><b>${label}:</b> ${value}</span>`)
      .join("");

    totalSlides = project.slides;
    track.innerHTML = Array.from({ length: totalSlides })
      .map((_, i) => buildSlideHTML(project, i))
      .join("");
    dotsWrap.innerHTML = Array.from({ length: totalSlides })
      .map((_, i) => `<button type="button" class="carousel-dot" data-dot="${i}" aria-label="Ir al slide ${i + 1}"></button>`)
      .join("");
    dotsWrap.querySelectorAll(".carousel-dot").forEach((dot) => {
      dot.addEventListener("click", () => goToSlide(Number(dot.dataset.dot)));
    });

    goToSlide(0);

    modal.removeAttribute("inert");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalClose.focus();

    document.addEventListener("keydown", handleModalKeydown);
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("inert", "");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleModalKeydown);
    if (lastFocusedEl) lastFocusedEl.focus();
  };

  function handleModalKeydown(e) {
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    if (e.key === "ArrowRight") {
      goToSlide(currentSlide + 1);
      return;
    }
    if (e.key === "ArrowLeft") {
      goToSlide(currentSlide - 1);
      return;
    }
    if (e.key === "Tab") {
      const focusable = getFocusableEls();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  if (workGrid) {
    workGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".work-card");
      if (!card) return;
      const project = projects.find((p) => p.id === Number(card.dataset.projectId));
      if (project) openModal(project);
    });
  }

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);
  arrowPrev.addEventListener("click", () => goToSlide(currentSlide - 1));
  arrowNext.addEventListener("click", () => goToSlide(currentSlide + 1));

  /* ---------- Swipe táctil en el carrusel ---------- */
  let touchStartX = 0;
  let touchDeltaX = 0;

  track.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    },
    { passive: true }
  );

  track.addEventListener(
    "touchmove",
    (e) => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    },
    { passive: true }
  );

  track.addEventListener("touchend", () => {
    const threshold = 40;
    if (touchDeltaX > threshold) {
      goToSlide(currentSlide - 1);
    } else if (touchDeltaX < -threshold) {
      goToSlide(currentSlide + 1);
    }
  });

  /* ---------- Copiar email al portapapeles ---------- */
  const copyBtn = document.getElementById("copy-email-btn");
  const copyLabel = document.getElementById("copy-email-label");

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
      } catch (err) {
        // Fallback silencioso si el navegador bloquea el portapapeles
      }
      copyBtn.classList.add("is-copied");
      copyLabel.textContent = "¡Copiado!";
      window.setTimeout(() => {
        copyBtn.classList.remove("is-copied");
        copyLabel.textContent = "Copiar";
      }, 2000);
    });
  }

  /* =========================================================
     CALENDARIO DE DISPONIBILIDAD + MODAL DE RESERVA
     Calendario propio (sin backend): marca lunes-viernes como
     "disponibles" con una regla simple del lado del cliente.
     NO es una sincronización real con Google Calendar — por eso
     el formulario deja claro que el hueco se confirma después
     en el enlace real de Google Calendar Appointment Schedule.
     ========================================================= */
  const calGrid = document.getElementById("cal-grid");
  const monthLabelEl = document.getElementById("cal-month-label");
  const calPrevBtn = document.getElementById("cal-prev");
  const calNextBtn = document.getElementById("cal-next");
  const GOOGLE_CAL_URL = "https://calendar.app.google/QN1JrgWv65KfNtpm8";
  const BOOKING_EMAIL = "hectorfedz11@gmail.com";

  if (calGrid && monthLabelEl && calPrevBtn && calNextBtn) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const baseMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const MAX_MONTHS_AHEAD = 2; // mes actual + 2 siguientes (~3 meses en total)
    let viewOffset = 0;

    const monthFormatter = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" });
    const dayLabelFormatter = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" });
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    // 0 = lunes ... 6 = domingo (la semana del calendario empieza en lunes)
    const weekdayIndexMon0 = (date) => (date.getDay() + 6) % 7;

    const renderMonth = (offset) => {
      const viewDate = new Date(baseMonth.getFullYear(), baseMonth.getMonth() + offset, 1);
      monthLabelEl.textContent = capitalize(monthFormatter.format(viewDate));

      const year = viewDate.getFullYear();
      const month = viewDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstWeekday = weekdayIndexMon0(new Date(year, month, 1));

      let html = "";
      for (let i = 0; i < firstWeekday; i++) {
        html += '<span class="cal-day is-empty" aria-hidden="true"></span>';
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, month, d);
        const isWeekend = weekdayIndexMon0(dateObj) >= 5;
        const isPast = dateObj.getTime() < today.getTime();
        const isToday = dateObj.getTime() === today.getTime();
        const isAvailable = !isWeekend && !isPast;
        const label = capitalize(dayLabelFormatter.format(dateObj));

        if (isAvailable) {
          html += `<button type="button" class="cal-day is-available${isToday ? " is-today" : ""}" data-label="${label}" aria-label="Día disponible: ${label}">${d}</button>`;
        } else {
          const reason = isWeekend ? " — fin de semana" : isPast ? " — fecha pasada" : "";
          html += `<button type="button" class="cal-day${isWeekend ? " is-weekend" : ""}${isPast ? " is-past" : ""}${isToday ? " is-today" : ""}" disabled aria-label="${label} — no disponible${reason}">${d}</button>`;
        }
      }

      calGrid.innerHTML = html;
      calPrevBtn.disabled = offset <= 0;
      calNextBtn.disabled = offset >= MAX_MONTHS_AHEAD;
    };

    renderMonth(viewOffset);

    calPrevBtn.addEventListener("click", () => {
      if (viewOffset > 0) {
        viewOffset -= 1;
        renderMonth(viewOffset);
      }
    });
    calNextBtn.addEventListener("click", () => {
      if (viewOffset < MAX_MONTHS_AHEAD) {
        viewOffset += 1;
        renderMonth(viewOffset);
      }
    });

    /* ---------- Modal de reserva ---------- */
    const bookingModal = document.getElementById("booking-modal");
    const bookingBackdrop = document.getElementById("booking-modal-backdrop");
    const bookingCloseBtn = document.getElementById("booking-modal-close");
    const bookingDateTag = document.getElementById("booking-modal-date");
    const bookingFormWrap = document.getElementById("booking-form-wrap");
    const bookingForm = document.getElementById("booking-form");
    const bookingSuccess = document.getElementById("booking-success");
    const bookingSuccessClose = document.getElementById("booking-success-close");

    let bookingLastFocused = null;
    let selectedDateLabel = "";

    const getBookingFocusable = () =>
      Array.from(
        bookingModal.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((el) => el.offsetParent !== null && !el.disabled);

    const openBookingModal = (label) => {
      bookingLastFocused = document.activeElement;
      selectedDateLabel = label;
      bookingDateTag.textContent = label;

      bookingForm.reset();
      bookingForm.querySelectorAll(".form-field").forEach((f) => f.classList.remove("has-error"));
      bookingFormWrap.style.display = "";
      bookingSuccess.classList.remove("is-visible");

      bookingModal.removeAttribute("inert");
      bookingModal.classList.add("is-open");
      bookingModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      document.getElementById("bf-company").focus();

      document.addEventListener("keydown", handleBookingKeydown);
    };

    const closeBookingModal = () => {
      bookingModal.classList.remove("is-open");
      bookingModal.setAttribute("aria-hidden", "true");
      bookingModal.setAttribute("inert", "");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleBookingKeydown);
      if (bookingLastFocused) bookingLastFocused.focus();
    };

    function handleBookingKeydown(e) {
      if (e.key === "Escape") {
        closeBookingModal();
        return;
      }
      if (e.key === "Tab") {
        const focusable = getBookingFocusable();
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    calGrid.addEventListener("click", (e) => {
      const dayBtn = e.target.closest(".cal-day.is-available");
      if (!dayBtn) return;
      openBookingModal(dayBtn.dataset.label);
    });

    bookingCloseBtn.addEventListener("click", closeBookingModal);
    bookingBackdrop.addEventListener("click", closeBookingModal);
    bookingSuccessClose.addEventListener("click", closeBookingModal);

    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fields = ["company", "role", "name", "reason"];
      let firstInvalid = null;
      let valid = true;

      fields.forEach((name) => {
        const input = bookingForm.elements[name];
        const wrap = bookingForm.querySelector(`[data-field="${name}"]`);
        const isEmpty = !input.value.trim();
        wrap.classList.toggle("has-error", isEmpty);
        if (isEmpty) {
          valid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!valid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const company = bookingForm.elements.company.value.trim();
      const role = bookingForm.elements.role.value.trim();
      const name = bookingForm.elements.name.value.trim();
      const reason = bookingForm.elements.reason.value.trim();

      const subject = `Reserva de llamada — ${company}`;
      const body = [
        "Hola Héctor,",
        "",
        "Me gustaría reservar una llamada contigo. Este es el resumen de la solicitud:",
        "",
        `Fecha propuesta: ${selectedDateLabel}`,
        `Nombre de la empresa: ${company}`,
        `Cargo: ${role}`,
        `Nombre: ${name}`,
        `Motivo de la cita: ${reason}`,
        "",
        "Quedo a la espera de confirmar el hueco exacto en tu Google Calendar.",
      ].join("\n");

      const mailtoUrl = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // 1) Email prellenado con todos los datos + la fecha elegida
      window.location.href = mailtoUrl;
      // 2) Fuente real de disponibilidad: el Google Calendar Appointment Schedule
      window.open(GOOGLE_CAL_URL, "_blank", "noopener");

      bookingFormWrap.style.display = "none";
      bookingSuccess.classList.add("is-visible");
      bookingSuccessClose.focus();
    });
  }
})();
