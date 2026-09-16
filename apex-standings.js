// Renders Road to Apex standings. All numbers come from
// data/apex-points.json via MediLinkApex.computeStandings.

(function () {
  const ONE_TIME_LABELS = {
    participation: "Participation",
    top10: "Top 10 finish",
    top3: "Top 3 finish",
    win: "Win (1st place)",
  };

  const NATIONALS_LABELS = {
    regionalParticipation: "Regional participation",
    regionalToState: "Advance Regional → State",
    stateTop3: "Top 3 at State",
    stateToNational: "Advance State → National",
    nationalCompete: "Compete at the National round",
    nationalTop10: "Top 10 nationally",
    nationalTop3: "Top 3 nationally",
    nationalWin: "Win (1st place) nationally",
  };

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
  }

  function scheduleList(schedule, labels) {
    return Object.keys(labels).map((key) => {
      const pts = schedule && typeof schedule[key] === "number" ? schedule[key] : 0;
      return "<li><span>" + escapeHtml(labels[key]) + "</span><strong>" + pts + " pts</strong></li>";
    }).join("");
  }

  function qualifyBadge(row) {
    if (!row.qualifies) return '<span class="apex-badge">Not yet qualified</span>';
    if (row.qualifyVia === "regional-guarantee") {
      return '<span class="apex-badge apex-badge--region">Qualified: regional guarantee</span>';
    }
    return '<span class="apex-badge apex-badge--rank">Qualified: ranking</span>';
  }

  function render(root, points, catalog) {
    const schedule = points.pointSchedule || {};
    const oneTime = schedule.oneTime || {};
    const nationals = schedule.nationalsLadder || {};
    const standings = window.MediLinkApex.computeStandings(points, catalog);
    const cycle = points.cycle || "";
    const spots = points.qualification || {};

    const oneTimeMax = window.MediLinkApex.pointsForOneTime(oneTime, "win");
    const nationalsMax = window.MediLinkApex.pointsForNationals(nationals, Object.keys(nationals));

    root.innerHTML =
      '<p class="section-lead">Current cycle <strong>' + escapeHtml(cycle) + "</strong>. " +
      "Top-ranked chapters by cycle total qualify, with at least " +
      escapeHtml(spots.minSpotsPerRegion) + " guaranteed spot(s) per active region, " +
      "up to " + escapeHtml(spots.totalApexSpots) + " Apex seats. " +
      "The board updates the ledger after each event. These numbers are not live scores.</p>" +

      '<div class="apex-schedules">' +
        '<article class="apex-schedule">' +
          "<h3>One-time events</h3>" +
          "<p>Innovation Challenge, Policy Cup, and Research Symposium. Each is one event per year. The board records a single placement, not a ladder.</p>" +
          '<ul class="apex-schedule__list">' + scheduleList(oneTime, ONE_TIME_LABELS) + "</ul>" +
          "<p class=\"apex-schedule__max\">Maximum from one of these events: <strong>" + oneTimeMax + " pts</strong></p>" +
        "</article>" +
        '<article class="apex-schedule">' +
          "<h3>Nationals ladder</h3>" +
          "<p>Nationals is the only multi-stage climb. Points add up as a team advances Regional to State to National. That is why Nationals is worth more. There is no extra multiplier.</p>" +
          '<ul class="apex-schedule__list">' + scheduleList(nationals, NATIONALS_LABELS) + "</ul>" +
          "<p class=\"apex-schedule__max\">Maximum from a full Nationals sweep: <strong>" + nationalsMax + " pts</strong></p>" +
        "</article>" +
      "</div>" +

      '<p class="notice-callout">Tie-breakers, in order: most Nationals wins in the cycle, then most Nationals Top 3 placements, then most teams fielded. A new 2-year cycle starts at zero after each Apex.</p>' +

      (standings.length
        ? '<ol class="apex-board">' + standings.map((row) => (
          '<li class="apex-board__card' + (row.qualifies ? " is-qualified" : "") + '">' +
            '<div class="apex-board__rank">' + escapeHtml(row.naiveRank) + "</div>" +
            '<div class="apex-board__body">' +
              "<h3>" + escapeHtml(row.name) + "</h3>" +
              '<p class="apex-board__meta">' + escapeHtml(row.location || row.region) + "</p>" +
              qualifyBadge(row) +
            "</div>" +
            '<dl class="apex-board__pts">' +
              "<div><dt>Year 1</dt><dd>" + row.year1Points + "</dd></div>" +
              "<div><dt>Year 2</dt><dd>" + row.year2Points + "</dd></div>" +
              "<div><dt>Cycle total</dt><dd>" + row.cycleTotal + "</dd></div>" +
            "</dl>" +
          "</li>"
        )).join("") + "</ol>"
        : '<p class="apex-empty">No chapter results are on the ledger yet. Standings appear here when the state board records the first event of the cycle.</p>');
  }

  async function init() {
    const root = document.getElementById("apex-standings");
    if (!root || !window.MediLinkApex) return;

    try {
      const [pointsRes, chaptersRes] = await Promise.all([
        fetch("/data/apex-points.json"),
        fetch("/data/chapters.json"),
      ]);
      const points = await pointsRes.json();
      const catalog = await chaptersRes.json();
      render(root, points, catalog);
    } catch (err) {
      root.innerHTML = "<p>Standings could not be loaded. Check data/apex-points.json.</p>";
      console.error(err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
