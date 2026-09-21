// Scroll cinema. Mark blocks with class="reveal" (optional reveal-left / reveal-right).
// Stage children with class="anim" rise on load. Gold .rule lines grow when visible.
// Images inside .scene__media ease from a slight zoom.

(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".rule").forEach((el) => {
    if (el.closest(".stage")) el.classList.add("is-on");
  });

  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;

  if (reduce) {
    nodes.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        const rule = entry.target.querySelector(".rule");
        if (rule) rule.classList.add("is-on");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach((el) => io.observe(el));
})();
