/* =================================================================
   Coco Şenol — app.js
   Reine Vanilla-JS-Dynamik, keine Abhängigkeiten.
   ================================================================= */
(function () {
  "use strict";

  /* ---------- 1. Lade-Screen ausblenden ---------- */
  var preloader = document.getElementById("preloader");
  function hidePreloader() {
    if (preloader) preloader.classList.add("done");
  }
  // nach vollständigem Laden, mit kleiner Mindestdauer für den Effekt
  window.addEventListener("load", function () {
    setTimeout(hidePreloader, 650);
  });
  // Sicherheitsnetz: spätestens nach 3 s wegblenden
  setTimeout(hidePreloader, 3000);

  /* ---------- 2. Scroll-Reveals (Elemente sanft einblenden) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(function (el, i) {
      // kleiner gestaffelter Versatz für benachbarte Elemente
      el.style.transitionDelay = (Math.min(i % 6, 5) * 60) + "ms";
      io.observe(el);
    });
  } else {
    // Fallback: alles direkt sichtbar
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 3. Sticky-Header: Schatten beim Scrollen ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 4. Sprachumschalter DE / EN ---------- */
  var langBtn = document.getElementById("langToggle");
  var current = "de";
  var i18nEls = Array.prototype.slice.call(document.querySelectorAll("[data-de][data-en]"));

  function setLang(lang) {
    current = lang;
    document.documentElement.lang = lang;
    i18nEls.forEach(function (el) {
      var val = el.getAttribute("data-" + lang);
      if (val !== null) el.textContent = val;
    });
    if (langBtn) {
      // aktive Sprache hervorheben
      var on = langBtn.querySelector(".lang__on");
      var off = langBtn.querySelector(".lang__off");
      if (lang === "de") { on.textContent = "DE"; off.textContent = "EN"; on.style.color = ""; off.style.color = "var(--soft)"; }
      else { on.textContent = "EN"; off.textContent = "DE"; }
      langBtn.setAttribute("aria-label", lang === "de" ? "Switch language to English" : "Sprache auf Deutsch wechseln");
    }
  }

  if (langBtn) {
    langBtn.addEventListener("click", function () {
      setLang(current === "de" ? "en" : "de");
    });
  }

  /* ---------- 5. Scroll-Spy: aktiven Menüpunkt markieren ---------- */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
  var spyMap = {};
  spyLinks.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    if (id) spyMap[id] = a;
  });
  var spyTargets = Object.keys(spyMap)
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && spyTargets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          spyLinks.forEach(function (a) { a.classList.remove("active"); });
          var link = spyMap[entry.target.id];
          if (link) link.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    spyTargets.forEach(function (t) { spy.observe(t); });
  }
})();
