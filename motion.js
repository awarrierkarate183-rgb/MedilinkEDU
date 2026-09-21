// Scroll reveal for section headlines and marked blocks.
// Add class="reveal" to any element that should fade up once.
// Homepage hero already animates on load in CSS. Do not also mark the hero.

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
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach((el) => io.observe(el));
})();
