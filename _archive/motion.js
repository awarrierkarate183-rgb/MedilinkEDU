// Gentle entrance. Content stays readable if motion fails.
// Add class="reveal" to a band or tile group. Hero children use class="anim".

(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nodes = document.querySelectorAll(".reveal");

  if (!nodes.length || reduce) {
    nodes.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("js-motion");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
  );

  nodes.forEach((el) => io.observe(el));

  window.setTimeout(() => {
    nodes.forEach((el) => el.classList.add("is-visible"));
  }, 900);
})();
