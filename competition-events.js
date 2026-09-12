// ============================================================
// COMPETITION EVENTS EXPLORER
// Used on competition.html. Each object in the `events` array is one
// listing in the filterable grid.
//
// TO ADD A NEW LISTING: copy one whole object (from { to },) and edit
// title, competition, format, level, description, deliverables, and judgingCriteria.
//
// Filters:
//   competition — Nationals, Innovation Challenge, Policy Cup,
//                 Research Symposium, or The MediLink Apex
//   format — Team, Pitch, Debate, Poster, etc.
//   level — Regional, State, or National
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
      title: "MediLink Nationals — Regional Round",
      competition: "MediLink Nationals",
      format: "Team",
      level: "Regional",
      description:
        "Teams of 3–4 submit a case brief using the Care / Cost / Code framework. Regional rounds are run at or near chapters and are open to all active high school members.",
      deliverables: [
        "Written case brief covering clinical need, financial model, and tech solution",
        "Team roster of 3–4 high school members",
      ],
      judgingCriteria: [
        "Clarity of the health-system problem",
        "Strength of the Care / Cost / Code analysis",
        "Feasibility of the proposed solution",
      ],
    },
    {
      title: "MediLink Nationals — State Round",
      competition: "MediLink Nationals",
      format: "Team",
      level: "State",
      description:
        "Top regional teams advance to a state presentation round coordinated by the state chapter board. Format details are set each year and shared through chapter leaders.",
      deliverables: [
        "Live or virtual presentation of the case solution",
        "Updated Care / Cost / Code brief",
      ],
      judgingCriteria: [
        "Presentation quality and teamwork",
        "Depth of analysis",
        "Response to judge questions",
      ],
    },
    {
      title: "MediLink Nationals — National Final & Gala",
      competition: "MediLink Nationals",
      format: "Team",
      level: "National",
      description:
        "The signature event. State qualifiers compete nationally, culminating in an awards gala. This is MediLink’s flagship competition and the event where sponsors receive top billing.",
      deliverables: [
        "National final presentation",
        "Final Care / Cost / Code case package",
      ],
      judgingCriteria: [
        "Overall case excellence",
        "Impact and originality",
        "Professional delivery",
      ],
    },
    {
      title: "Innovation Challenge — Regional",
      competition: "Innovation Challenge",
      format: "Pitch",
      level: "Regional",
      description:
        "The entry point for tech-minded members. Teams pitch a health-tech product or digital-health concept — an app, device concept, or platform idea — at the regional level.",
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
      title: "Innovation Challenge — State",
      competition: "Innovation Challenge",
      format: "Pitch",
      level: "State",
      description:
        "Regional winners advance to a state pitch round. State boards set presentation length and materials each year.",
      deliverables: [
        "Refined pitch deck",
        "Live pitch to state judges",
      ],
      judgingCriteria: [
        "Product-market fit",
        "Clarity of the pitch",
        "Implementation realism",
      ],
    },
    {
      title: "Innovation Challenge — National",
      competition: "Innovation Challenge",
      format: "Pitch",
      level: "National",
      description:
        "State qualifiers compete nationally with a polished health-tech pitch judged on feasibility, impact, and a basic business case.",
      deliverables: [
        "National pitch presentation",
        "One-page concept summary",
      ],
      judgingCriteria: [
        "Feasibility",
        "Impact",
        "Business case strength",
      ],
    },
    {
      title: "Policy Cup — Regional",
      competition: "Policy Cup",
      format: "Debate",
      level: "Regional",
      description:
        "Students argue for a real fix to a health-economics problem such as insurance access, rural care deserts, or drug pricing. Regional rounds introduce the brief and advocacy format.",
      deliverables: [
        "Short policy brief",
        "Opening advocacy statement",
      ],
      judgingCriteria: [
        "Problem definition",
        "Evidence quality",
        "Clarity of the proposed fix",
      ],
    },
    {
      title: "Policy Cup — State",
      competition: "Policy Cup",
      format: "Debate",
      level: "State",
      description:
        "Top regional advocates advance to a state debate or presentation round coordinated by the state chapter board.",
      deliverables: [
        "Full policy brief",
        "Live debate or advocacy presentation",
      ],
      judgingCriteria: [
        "Argument quality",
        "Use of evidence",
        "Rebuttal and advocacy skill",
      ],
    },
    {
      title: "Policy Cup — National",
      competition: "Policy Cup",
      format: "Debate",
      level: "National",
      description:
        "State qualifiers compete nationally, presenting a policy brief and arguing for a concrete health-economics reform.",
      deliverables: [
        "National policy brief",
        "Advocacy presentation or debate round",
      ],
      judgingCriteria: [
        "Policy rigor",
        "Persuasion",
        "Practicality of the proposed reform",
      ],
    },
    {
      title: "Research Symposium — Regional",
      competition: "Research Symposium",
      format: "Poster",
      level: "Regional",
      description:
        "A lower-barrier entry point for newer members already doing independent research on a health-economics or health-tech topic. Regional rounds are poster-focused.",
      deliverables: [
        "Research poster",
        "Short oral overview",
      ],
      judgingCriteria: [
        "Research question clarity",
        "Method and evidence",
        "Poster communication",
      ],
    },
    {
      title: "Research Symposium — State",
      competition: "Research Symposium",
      format: "Poster",
      level: "State",
      description:
        "Regional poster presenters advance to a state symposium with poster and presentation components.",
      deliverables: [
        "Updated research poster",
        "State-level oral presentation",
      ],
      judgingCriteria: [
        "Depth of analysis",
        "Presentation quality",
        "Contribution to the topic",
      ],
    },
    {
      title: "Research Symposium — National",
      competition: "Research Symposium",
      format: "Presentation",
      level: "National",
      description:
        "State qualifiers present independent research to a national audience in poster and presentation format.",
      deliverables: [
        "National poster",
        "Formal research presentation",
      ],
      judgingCriteria: [
        "Originality and rigor",
        "Clarity of findings",
        "Professional delivery",
      ],
    },
    {
      title: "The MediLink Apex — Biennial Summit",
      competition: "The MediLink Apex",
      format: "Summit",
      level: "National",
      description:
        "Every other year, that cycle’s National round is upgraded into a champions-of-champions summit. Top performers from Nationals, Innovation Challenge, Policy Cup, and Research Symposium are invited. Same qualification pipeline — larger gathering.",
      deliverables: [
        "Invitation earned through that cycle’s annual competitions",
        "Championship-round materials, set by the state / national board",
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
