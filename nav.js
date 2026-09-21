// Desktop: first click on About / Competitions / Chapters / Get Involved
// opens a roomy mega menu. Second click on the same label goes to that page.
// Mobile: Menu toggles the bar; dropdowns open as accordions in place.

window.initMediLinkNav = function initMediLinkNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const overlay = document.getElementById("nav-overlay");
  const items = Array.from(document.querySelectorAll(".nav-item.has-dropdown"));

  function isMobile() {
    return window.matchMedia("(max-width: 980px)").matches;
  }

  function closeMenus() {
    items.forEach((item) => {
      item.classList.remove("is-open");
      const trigger = item.querySelector(":scope > a");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
    if (overlay) overlay.classList.remove("is-active");
  }

  function closeMobileNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
    closeMenus();
  }

  items.forEach((item) => {
    const trigger = item.querySelector(":scope > a");
    if (!trigger || trigger._navBound) return;
    trigger._navBound = true;
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-haspopup", "true");

    trigger.addEventListener("click", (e) => {
      const open = item.classList.contains("is-open");
      if (!open) {
        e.preventDefault();
        items.forEach((other) => {
          if (other !== item) {
            other.classList.remove("is-open");
            const otherTrigger = other.querySelector(":scope > a");
            if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
          }
        });
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        if (overlay && !isMobile()) overlay.classList.add("is-active");
        return;
      }
      if (isMobile()) {
        e.preventDefault();
        item.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        return;
      }
      closeMenus();
    });
  });

  if (overlay && !overlay._navBound) {
    overlay._navBound = true;
    overlay.addEventListener("click", closeMenus);
  }

  if (toggle && nav && !toggle._navBound) {
    toggle._navBound = true;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
      if (!open) closeMenus();
    });
  }

  if (nav && !nav._linkBound) {
    nav._linkBound = true;
    nav.querySelectorAll(".mega-link, .mega-banner__cta").forEach((link) => {
      link.addEventListener("click", closeMobileNav);
    });
    nav.querySelectorAll(":scope > a").forEach((link) => {
      link.addEventListener("click", closeMobileNav);
    });
  }

  if (!document._navEscBound) {
    document._navEscBound = true;
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobileNav();
    });
    document.addEventListener("click", (e) => {
      if (isMobile()) return;
      if (e.target.closest(".nav-item.has-dropdown") || e.target.closest(".nav-overlay")) return;
      closeMenus();
    });
    window.addEventListener("resize", () => {
      closeMenus();
      if (!isMobile()) {
        if (nav) nav.classList.remove("is-open");
        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
          toggle.textContent = "Menu";
        }
      }
    });
  }
};
