// ============================================================
// COMPETITION EVENTS EXPLORER
// Used on competition.html. Each object in the `events` array is one
// listing in the filterable grid.
//
// TO ADD A NEW LISTING: copy one whole object (from { to },) and edit
// title, competition, format, level, description, deliverables, and judgingCriteria.
//
// Filters:
//   competition: Nationals, Innovation Challenge, Policy Cup,
//                 Research Symposium, or The MediLink Apex
//   format: Team, Pitch, Debate, Poster, Summit
//   level: Regional, State, National, or Annual
//
// Only Nationals uses Regional / State / National.
// Innovation, Policy Cup, and Research Symposium are one Annual listing each.
//
// Do NOT add year-specific dates here. Dates are set by state chapter
// boards and shared through chapter leaders.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("events-grid");
  const count = document.getElementById("events-count");
  const competitionFilter = document.getElementById("competition-filter");
  const formatFilter = document.getElementById("format-filter");
  const levelFilter = document.getElementById("level-filter");

  if (!grid || !count || !competitionFilter || !formatFilter || !levelFilter) {
    return;
  }

  const events = [
    {
      title: "MediLink Nationals, Regional Round",
      competition: "MediLink Nationals",
      format: "Team",
      level: "Regional",
      description:
        "Teams of 3-4 submit a case brief using the three-lens framework (Care, Cost, Code in the packet). Regional rounds run at or near chapters and are open to active high school members.",
      deliverables: [
        "Written case brief covering the clinical need, the financial model, and the tech solution",
        "Team roster of 3-4 high school members",
      ],
      judgingCriteria: [
        "Clarity of the health-system problem",
        "Strength of the three-lens analysis",
        "Feasibility of the proposed solution",
      ],
    },
    {
      title: "MediLink Nationals, State Round",
      competition: "MediLink Nationals",
      format: "Team",
      level: "State",
      description:
        "Top regional teams advance to a state presentation coordinated by the state chapter board. Format details are set each year and shared through chapter leaders.",
      deliverables: [
        "Live or virtual presentation of the case solution",
        "Updated three-lens brief",
      ],
      judgingCriteria: [
        "Presentation quality and teamwork",
        "Depth of analysis",
        "Response to judge questions",
      ],
    },
    {
      title: "MediLink Nationals, National Final and Gala",
      competition: "MediLink Nationals",
      format: "Team",
      level: "National",
      description:
        "State qualifiers compete nationally, ending in an awards gala. This is the yearly flagship and the event where sponsors receive top billing.",
      deliverables: [
        "National final presentation",
        "Final three-lens case package",
      ],
      judgingCriteria: [
        "Overall case excellence",
        "Impact and originality",
        "Professional delivery",
      ],
    },
    {
      title: "Innovation Challenge",
      competition: "Innovation Challenge",
      format: "Pitch",
      level: "Annual",
      description:
        "One annual pitch. An app, device concept, or platform idea. Individual or teams of up to 3. No regional or state qualifier.",
      deliverables: [
        "Pitch deck for a health-tech or digital-health concept",
        "Basic feasibility and impact notes",
      ],
      judgingCriteria: [
        "Feasibility",
        "Impact",
        "Basic business case",
      ],
    },
    {
      title: "Policy Cup",
      competition: "Policy Cup",
      format: "Debate",
      level: "Annual",
      description:
        "One annual brief and debate. Individual or pairs. Topics come from the state chapter board. No regional or state qualifier.",
      deliverables: [
        "Policy brief",
        "Live debate or advocacy presentation",
      ],
      judgingCriteria: [
        "Problem definition",
        "Evidence quality",
        "Practicality of the proposed reform",
      ],
    },
    {
      title: "Research Symposium",
      competition: "Research Symposium",
      format: "Poster",
      level: "Annual",
      description:
        "One annual poster and talk. Built for members who already have a research question. No regional or state qualifier.",
      deliverables: [
        "Research poster",
        "Short oral presentation",
      ],
      judgingCriteria: [
        "Research question clarity",
        "Method and evidence",
        "Poster and talk communication",
      ],
    },
    {
      title: "The MediLink Apex",
      competition: "The MediLink Apex",
      format: "Summit",
      level: "National",
      description:
        "Every other year, that cycle's National round becomes a champions summit. Top performers from Nationals, Innovation Challenge, Policy Cup, and Research Symposium are invited. Same Nationals qualification path. A larger gathering.",
      deliverables: [
        "Invitation earned through that cycle's other four competitions",
        "Championship-round materials, set by the state or national board",
      ],
      judgingCriteria: [
        "Excellence across the four annual disciplines",
        "Professional delivery",
        "Contribution to the summit program",
      ],
    },
  ];

  const unique = (values) => Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));

  unique(events.map((event) => event.competition)).forEach((value) =>
    competitionFilter.add(new Option(value, value))
  );
  unique(events.map((event) => event.format)).forEach((value) =>
    formatFilter.add(new Option(value, value))
  );
  unique(events.map((event) => event.level)).forEach((value) =>
    levelFilter.add(new Option(value, value))
  );

  const render = () => {
    const selectedCompetition = competitionFilter.value;
    const selectedFormat = formatFilter.value;
    const selectedLevel = levelFilter.value;

    const filtered = events.filter((event) => {
      const matchCompetition = selectedCompetition === "all" || event.competition === selectedCompetition;
      const matchFormat = selectedFormat === "all" || event.format === selectedFormat;
      const matchLevel = selectedLevel === "all" || event.level === selectedLevel;
      return matchCompetition && matchFormat && matchLevel;
    });

    count.textContent = `${filtered.length} listing${filtered.length === 1 ? "" : "s"} shown`;
    grid.innerHTML = "";

    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "events-empty";
      empty.textContent = "No listings match your current filters.";
      grid.appendChild(empty);
      return;
    }

    filtered.forEach((event) => {
      const card = document.createElement("article");
      card.className = "event-card";
      card.innerHTML = `
        <div class="event-meta">
          <span class="event-pill">${event.competition}</span>
          <span class="event-pill event-pill--format">${event.format}</span>
          <span class="event-pill">${event.level}</span>
        </div>
        <h3>${event.title}</h3>
        <p class="event-description">${event.description}</p>
        <div class="event-section">
          <h4>Deliverables</h4>
          <ul>${event.deliverables.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div class="event-section">
          <h4>Judging Criteria</h4>
          <ul>${event.judgingCriteria.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
      `;
      grid.appendChild(card);
    });
  };

  [competitionFilter, formatFilter, levelFilter].forEach((select) => {
    select.addEventListener("change", render);
  });

  render();
});
