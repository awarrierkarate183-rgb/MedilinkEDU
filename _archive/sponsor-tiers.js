(function () {
  const EMAIL = window.MEDILINK_EMAIL || "medi.link.edu@gmail.com";

  function createTierCard(tier) {
    const card = document.createElement("article");
    card.className = "sponsor-tier card" + (tier.highlight ? " sponsor-tier--highlight" : "");

    const subject = encodeURIComponent("Corporate Sponsorship: " + tier.name);
    const mailto = "mailto:" + EMAIL + "?subject=" + subject;

    card.innerHTML =
      '<div class="sponsor-tier__header">' +
        '<h3>' + tier.name + '</h3>' +
        '<p class="sponsor-tier__amount">' + tier.amount + '</p>' +
      '</div>' +
      '<p class="sponsor-tier__desc">' + tier.description + '</p>' +
      '<ul class="sponsor-tier__benefits">' +
        tier.benefits.map(b => "<li>" + b + "</li>").join("") +
      '</ul>' +
      '<a class="btn ' + (tier.highlight ? "btn--primary" : "btn--outline") + '" href="' + mailto + '">' +
        "Become a " + tier.name + " Sponsor" +
      '</a>';

    return card;
  }

  async function init() {
    const grid = document.getElementById("sponsor-tiers-grid");
    if (!grid) return;

    try {
      const res = await fetch("/data/sponsor-tiers.json");
      const data = await res.json();
      grid.innerHTML = "";
      data.tiers.forEach(tier => grid.appendChild(createTierCard(tier)));
      if (typeof window.initMediLinkNav === "function") {
        window.initMediLinkNav();
      }
    } catch (err) {
      grid.innerHTML = '<p class="section-lead">Unable to load sponsorship tiers. Check data/sponsor-tiers.json.</p>';
      console.error(err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
