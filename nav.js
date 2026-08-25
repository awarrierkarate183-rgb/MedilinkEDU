window.initMediLinkNav = function initMediLinkNav() {

  const overlay = document.getElementById('nav-overlay');
  const items   = Array.from(document.querySelectorAll('.nav-item.has-dropdown'));
  if (!overlay) return;

  function closeAll() {
    items.forEach(i => i.classList.remove('is-open'));
    overlay.classList.remove('is-active');
  }

  items.forEach(item => {
    const trigger = item.querySelector(':scope > a');
    if (!trigger || trigger._navBound) return;
    trigger._navBound = true;

    trigger.addEventListener('click', e => {
      const isOpen = item.classList.contains('is-open');
      if (!isOpen) {
        e.preventDefault();
        closeAll();
        item.classList.add('is-open');
        overlay.classList.add('is-active');
      } else {
        closeAll();
      }
    });
  });

  if (!overlay._navBound) {
    overlay._navBound = true;
    overlay.addEventListener('click', closeAll);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
    document.addEventListener('click', e => {
      if (!e.target.closest('.nav-item.has-dropdown') && !e.target.closest('.nav-overlay')) {
        closeAll();
      }
    });
  }

  const revealSelectors = [
    '.card', '.action-card', '.program-card', '.comp-card', '.flagship-card',
    '.sponsor-tier', '.stat-item', '.section-header', '.goals-list li',
    '.stats-row', '.footer-brand', '.footer-col',
    '.chapters-explorer', '.chapters-detail', '.fund-use-card',
    '.ladder-step', '.notice-callout', '.lens-card', '.module-card',
    '.programs-panel', '.involve-tile', '.news-card',
  ];

  const revealEls = document.querySelectorAll(revealSelectors.join(','));
  const staggered = new Set();

  revealEls.forEach(el => {
    if (el.classList.contains('reveal')) return;
    el.classList.add('reveal');
    const parent = el.parentElement;
    if (!staggered.has(parent)) {
      staggered.add(parent);
      parent.querySelectorAll(revealSelectors.join(',')).forEach((sib, i) => {
        sib.style.transitionDelay = `${i * 80}ms`;
      });
    }
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
};
