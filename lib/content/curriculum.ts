export const tracks = [
  {
    id: "track-1",
    number: 1,
    name: "Foundations of Health Economics",
    summary: "How care is paid for, why it costs what it costs, and who is left out.",
    intro:
      "This track is the public home of the financial lens before Track 3 turns it into budgets and funding plans. No prior economics class is required. Full lessons and the lab worksheet wait until a chapter approves you.",
    lab: "Build a basic insurance-comparison worksheet for a hypothetical family.",
    modules: [
      {
        code: "1.1",
        name: "How Healthcare Gets Paid For",
        description:
          "Insurance basics, premiums, deductibles, and employer vs. government coverage. A student who finishes this module should be able to say who writes the check for a visit, not just that insurance pays.",
      },
      {
        code: "1.2",
        name: "The Cost of Care",
        description:
          "Why healthcare is expensive: administrative costs, drug pricing, and hospital billing. This is the module that stops a team from treating price as a mystery or a moral slogan.",
      },
      {
        code: "1.3",
        name: "Access and Disparities",
        description:
          "Rural care deserts, uninsured populations, and global health gaps. Examples of gaps, not a complete list. If you cannot point to a person or a community, you are not done with this module.",
      },
    ],
  },
  {
    id: "track-2",
    number: 2,
    name: "Health Technology and Systems",
    summary: "Records, data, devices. No coding background required.",
    intro:
      "How software and infrastructure change access. A finished product is not required. The test is outcome, not novelty. The chapter Technology Lead owns this track and digital projects that come out of it.",
    lab: "Wireframe one feature of a telehealth app. Finished product not required.",
    modules: [
      {
        code: "2.1",
        name: "Digital Health 101",
        description:
          "Electronic health records, telehealth, and patient portals. What actually moves between a clinic, a family, and a screen, and what gets stuck.",
      },
      {
        code: "2.2",
        name: "Data and AI in Medicine",
        description:
          "Diagnostics, imaging, and predictive tools, explained conceptually. Students should be able to say what a tool claims to predict and who is left out of the data, not train a model from this module.",
      },
      {
        code: "2.3",
        name: "Medical Devices and Wearables",
        description:
          "How monitoring technology is changing care delivery. A device concept still has to name a user and a gap. Innovation Challenge later tests that as a pitch.",
      },
    ],
  },
  {
    id: "track-3",
    number: 3,
    name: "Financial Modeling for Health Ventures",
    summary: "Budgets, funding paths, and why ROI looks different in health.",
    intro:
      "The chapter Finance and Treasury Lead owns this track, chapter budgets, and finance workshops. Track 1 taught who pays. Track 3 asks whether an idea lasts.",
    lab: "Build a one-page budget and funding plan for a mock community health program.",
    modules: [
      {
        code: "3.1",
        name: "Reading a Budget",
        description:
          "Revenue, expenses, and break-even basics. A one-page budget that a chapter or a mock program could actually run, not a slide full of round numbers.",
      },
      {
        code: "3.2",
        name: "Funding a Health Idea",
        description:
          "Grants, investors, and nonprofit vs. for-profit funding paths. Students should be able to say which path fits the idea and why the others do not.",
      },
      {
        code: "3.3",
        name: "Measuring Impact and ROI",
        description:
          "Why return on investment is measured differently in health than in typical business. A clinical win that nobody can pay for is still unfinished work.",
      },
    ],
  },
  {
    id: "track-4",
    number: 4,
    name: "Applied Capstone and Competition Prep",
    summary: "The yearly capstone becomes that year's Nationals case.",
    intro:
      "Curriculum and competition stay linked on purpose. Packets still use the internal name Care, Cost, Code. Only Nationals has a ladder. The other three events each run once a year.",
    lab: "A full mock case run-through, in teams. New schools should start a chapter, not email for a dump of lessons.",
    modules: [
      {
        code: "4.1",
        name: "Applying the Framework",
        description:
          "One case run through the three-lens framework. Name the patient, the payer, and the system. About is still the only page that explains those lenses at length.",
      },
      {
        code: "4.2",
        name: "Case Analysis Practice",
        description:
          "Guided practice on past-style cases. Teams of 3 to 4 should already be covering clinic, money, and tech before they write a Nationals brief.",
      },
      {
        code: "4.3",
        name: "Competition-Specific Prep",
        description:
          "Pitch (Innovation Challenge), brief (Policy Cup), poster (Research Symposium), case-team (Nationals). Format is not interchangeable. A poster is not a Nationals case restated.",
      },
    ],
  },
];
