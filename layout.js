(function () {
  const PLACEHOLDER = "PASTE_YOUR_FORM_URL";

  function isPlaceholder(url) {
    return !url || url === PLACEHOLDER || url.includes("PASTE_YOUR");
  }

  function applyFormLinks() {
    const forms = window.MEDILINK_FORMS || {};
    document.querySelectorAll("[data-form]").forEach(el => {
      const key = el.getAttribute("data-form");
      const url = forms[key];
      if (isPlaceholder(url)) {
        el.addEventListener("click", e => {
          e.preventDefault();
          alert("This form link is not set up yet. Open data/forms.config.js and paste your Google Form URL for: " + key);
        });
        el.setAttribute("href", "#");
        el.setAttribute("aria-disabled", "true");
        return;
      }
      el.setAttribute("href", url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  function setActiveNav(page) {
    if (!page) return;
    document.querySelectorAll("[data-nav]").forEach(el => {
      const keys = (el.getAttribute("data-nav") || "").split(/\s+/);
      el.classList.toggle("is-active", keys.includes(page));
    });
  }

  async function loadPartial(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load " + url);
    return res.text();
  }

  async function initLayout() {
    const headerEl = document.getElementById("site-header");
    const footerEl = document.getElementById("site-footer");
    if (!headerEl || !footerEl) return;

    try {
      const [headerHtml, footerHtml] = await Promise.all([
        loadPartial("/partials/header.html"),
        loadPartial("/partials/footer.html"),
      ]);
      headerEl.innerHTML = headerHtml;
      footerEl.innerHTML = footerHtml;

      const page = document.body.getAttribute("data-page");
      setActiveNav(page);

      applyFormLinks();

      if (typeof window.initMediLinkNav === "function") {
        window.initMediLinkNav();
      }
    } catch (err) {
      console.error("Layout load error:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLayout);
  } else {
    initLayout();
  }
})();
