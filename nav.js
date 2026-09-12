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
};
