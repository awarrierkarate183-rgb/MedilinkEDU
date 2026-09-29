// Expandable case-file widgets.
// Any .tiles group of .tile cards. Click .tile__face to open one at a time.
// Hash links (#nationals) open the matching tile.
// A non-developer editor only needs to edit the HTML inside a tile.

(function () {
  function bindExclusive(root) {
    if (!root) return;
    const items = Array.from(root.querySelectorAll(":scope > .tile"));

    function setOpen(target, on) {
      items.forEach((item) => {
        const isTarget = item === target && on;
        item.classList.toggle("is-open", isTarget);
        const btn = item.querySelector(".tile__face");
        if (btn) btn.setAttribute("aria-expanded", isTarget ? "true" : "false");
      });
    }

    items.forEach((item) => {
      const btn = item.querySelector(".tile__face");
      if (!btn || btn._widgetBound) return;
      btn._widgetBound = true;
      if (!btn.getAttribute("aria-expanded")) btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", () => {
        const open = item.classList.contains("is-open");
        setOpen(item, !open);
      });
    });
  }

  function openFromHash() {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    let match;
    try {
      match = document.getElementById(id);
    } catch (err) {
      return;
    }
    if (!match) return;
    const tile = match.classList.contains("tile") ? match : match.closest(".tile");
    if (!tile) return;
    const group = tile.parentElement;
    if (group && group.classList.contains("tiles")) {
      group.querySelectorAll(":scope > .tile").forEach((item) => {
        const on = item === tile;
        item.classList.toggle("is-open", on);
        const btn = item.querySelector(".tile__face");
        if (btn) btn.setAttribute("aria-expanded", on ? "true" : "false");
      });
    } else {
      tile.classList.add("is-open");
    }
    tile.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function init() {
    document.querySelectorAll(".tiles").forEach(bindExclusive);
    openFromHash();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("hashchange", openFromHash);
})();
