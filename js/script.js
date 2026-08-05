/* =========================================================
   Héctor Fernández López de Coca — Portfolio
   Interacciones: nav móvil, reveal on scroll, scroll-spy,
   tilt de foto, header dinámico.
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
})();
