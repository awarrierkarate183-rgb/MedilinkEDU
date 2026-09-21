// Shared open-one-at-a-time widgets.
// Decks: any .deck of .slab tiles. Click the face to expand a chamber.
// Leftover support: #lens-widget and #comp-widgets if those blocks still exist.
// A non-developer editor only needs to edit the HTML inside a slab.

(function () {
  function bindExclusive(root, itemSelector, buttonSelector, openClass) {
    if (!root) return;
    const items = Array.from(root.querySelectorAll(itemSelector));

    function openItem(target) {
      items.forEach((item) => {
        const isTarget = item === target;
        item.classList.toggle(openClass, isTarget);
        const btn = item.querySelector(buttonSelector);
        if (btn) btn.setAttribute("aria-expanded", isTarget ? "true" : "false");
      });
    }

    items.forEach((item) => {
      const btn = item.querySelector(buttonSelector);
      if (!btn || btn._widgetBound) return;
      btn._widgetBound = true;
      btn.addEventListener("click", () => {
        if (item.classList.contains(openClass)) {
          item.classList.remove(openClass);
          btn.setAttribute("aria-expanded", "false");
          return;
        }
        openItem(item);
        item.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
    });
  }

  function openFromHash(root, itemSelector, openClass) {
    if (!root || !location.hash) return;
    const id = location.hash.slice(1);
    const match = root.querySelector("#" + CSS.escape(id));
    if (!match) return;
    const item = match.closest(itemSelector) || (match.matches(itemSelector) ? match : null);
    if (!item) return;
    Array.from(root.querySelectorAll(itemSelector)).forEach((el) => {
      const on = el === item;
      el.classList.toggle(openClass, on);
      const btn = el.querySelector("button");
      if (btn) btn.setAttribute("aria-expanded", on ? "true" : "false");
    });
    match.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  document.querySelectorAll(".deck").forEach((deck) => {
    bindExclusive(deck, ".slab", ".slab__face", "is-open");
    openFromHash(deck, ".slab", "is-open");
  });

  bindExclusive(document.getElementById("lens-widget"), ".lens-item", ".lens-item__btn", "is-open");
  bindExclusive(document.getElementById("comp-widgets"), ".comp-widget", ".comp-widget__btn", "is-open");
  openFromHash(document.getElementById("comp-widgets"), ".comp-widget", "is-open");

  window.addEventListener("hashchange", () => {
    document.querySelectorAll(".deck").forEach((deck) => {
      openFromHash(deck, ".slab", "is-open");
    });
    openFromHash(document.getElementById("comp-widgets"), ".comp-widget", "is-open");
  });
})();
