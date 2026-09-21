// Scroll reveal for marked blocks. Add class="reveal" to fade a block up.
// Optional: reveal-delay-1, reveal-delay-2, reveal-delay-3 for stagger.
// Homepage hero already animates on load. Do not also mark the hero.

(function () {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  nodes.forEach((el) => io.observe(el));
})();
