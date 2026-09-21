// Flat mobile menu only. No dropdown submenus.
// The Menu button toggles the same six links used on desktop.

window.initMediLinkNav = function initMediLinkNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  if (toggle._navBound) return;
  toggle._navBound = true;

  function closeNav() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
  }

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? "Close" : "Menu";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
};
