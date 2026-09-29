// ============================================================
// APEX QUALIFICATION POINTS
//
// This is NOT a live scoring backend. It reads data/apex-points.json,
// which the state chapter board updates by hand after each event.
// Do not assume these totals auto-calculate from competition entries.
//
// Two different point calculations — do not unify them:
//   1. oneTime (Innovation, Policy, Research): one result → one lookup
//   2. nationalsLadder (Nationals only): sum of accumulated line items
//
// Pages that need rankings must call MediLinkApex.computeStandings.
// ============================================================

(function (root) {
  const ONE_TIME_EVENTS = ["innovation", "policy", "research"];

  function pointsForOneTime(schedule, result) {
    // One-time events: the board records a single placement.
    // participation / top10 / top3 / win — pick one. Do not stack them.
    if (!result || !schedule) return 0;
    const value = schedule[result];
    return typeof value === "number" ? value : 0;
  }

  function pointsForNationals(schedule, lineItems) {
    // Nationals: climb items stack as a team advances.
    // nationalTop10 / nationalTop3 / nationalWin are the same finish —
    // take only the best one so a sweep is 230, not 310.
    if (!schedule || !Array.isArray(lineItems)) return 0;
    const FINISH = ["nationalTop10", "nationalTop3", "nationalWin"];
    const seen = new Set();
    let climb = 0;
    let bestFinish = 0;
    lineItems.forEach((key) => {
      if (seen.has(key)) return;
      seen.add(key);
      const value = schedule[key];
      if (typeof value !== "number") return;
      if (FINISH.indexOf(key) !== -1) {
        if (value > bestFinish) bestFinish = value;
        return;
      }
      climb += value;
    });
    return climb + bestFinish;
  }

  function yearTotal(yearBlock, schedules) {
    if (!yearBlock) return 0;
    let total = 0;
    ONE_TIME_EVENTS.forEach((event) => {
      total += pointsForOneTime(schedules.oneTime, yearBlock[event]);
    });
    total += pointsForNationals(schedules.nationalsLadder, yearBlock.nationals);
    return total;
  }

  function findCatalogMeta(catalog, chapterId, fallbackRegion) {
    const states = (catalog && catalog.states) || [];
    for (let i = 0; i < states.length; i += 1) {
      const state = states[i];
      if (state.id === chapterId) {
        return { name: state.name, region: state.id, location: state.location || "" };
      }
      const school = (state.chapters || []).find((ch) => ch.id === chapterId);
      if (school) {
        return { name: school.name, region: state.id, location: school.location || "" };
      }
    }
    return { name: chapterId, region: fallbackRegion || "unassigned", location: "" };
  }

  function compareChapters(a, b) {
    if (b.cycleTotal !== a.cycleTotal) return b.cycleTotal - a.cycleTotal;
    if (b.nationalWins !== a.nationalWins) return b.nationalWins - a.nationalWins;
    if (b.nationalTop3Placements !== a.nationalTop3Placements) {
      return b.nationalTop3Placements - a.nationalTop3Placements;
    }
    return b.teamsFielded - a.teamsFielded;
  }

  function applyRegionalMinimum(ranked, qualification) {
    // ------------------------------------------------------------------
    // REGIONAL MINIMUM-SPOTS OVERRIDE
    // This pass runs AFTER the naive ranking + tie-breakers.
    // It is not pure ranking: a chapter that is outside the top
    // totalApexSpots can still qualify if its region would otherwise
    // have fewer than minSpotsPerRegion qualifiers. That keeps one
    // region from taking every Apex seat.
    // ------------------------------------------------------------------
    const totalSpots = qualification && typeof qualification.totalApexSpots === "number"
      ? qualification.totalApexSpots
      : 0;
    const minPerRegion = qualification && typeof qualification.minSpotsPerRegion === "number"
      ? qualification.minSpotsPerRegion
      : 0;

    ranked.forEach((row, index) => {
      row.naiveRank = index + 1;
      row.qualifies = false;
      row.qualifyVia = null;
    });

    if (!ranked.length || totalSpots <= 0) return ranked;

    const byRegion = {};
    ranked.forEach((row) => {
      if (!byRegion[row.region]) byRegion[row.region] = [];
      byRegion[row.region].push(row);
    });

    const guaranteed = new Set();
    Object.keys(byRegion).forEach((region) => {
      const take = Math.min(minPerRegion, byRegion[region].length);
      byRegion[region].slice(0, take).forEach((row) => guaranteed.add(row.id));
    });

    const remaining = Math.max(0, totalSpots - guaranteed.size);
    const atLarge = ranked.filter((row) => !guaranteed.has(row.id)).slice(0, remaining);
    const qualifierIds = new Set(guaranteed);
    atLarge.forEach((row) => qualifierIds.add(row.id));

    ranked.forEach((row) => {
      if (!qualifierIds.has(row.id)) return;
      row.qualifies = true;
      const madeCutOnRank = row.naiveRank <= totalSpots;
      row.qualifyVia = madeCutOnRank ? "ranking" : "regional-guarantee";
    });

    return ranked;
  }

  function computeStandings(pointsData, catalog) {
    const schedules = (pointsData && pointsData.pointSchedule) || {};
    const entries = (pointsData && pointsData.chapters) || {};
    const qualification = (pointsData && pointsData.qualification) || {};

    const rows = Object.keys(entries).map((id) => {
      const entry = entries[id] || {};
      const meta = findCatalogMeta(catalog, id, entry.region);
      const year1Points = yearTotal(entry.year1, schedules);
      const year2Points = yearTotal(entry.year2, schedules);
      return {
        id,
        name: meta.name,
        location: meta.location,
        region: entry.region || meta.region,
        year1Points,
        year2Points,
        cycleTotal: year1Points + year2Points,
        nationalWins: entry.nationalWins || 0,
        nationalTop3Placements: entry.nationalTop3Placements || 0,
        teamsFielded: entry.teamsFielded || 0,
      };
    });

    rows.sort(compareChapters);
    return applyRegionalMinimum(rows, qualification);
  }

  function lookupChapter(standings, chapterId) {
    if (!standings || !chapterId) return null;
    return standings.find((row) => row.id === chapterId) || null;
  }

  root.MediLinkApex = {
    ONE_TIME_EVENTS,
    pointsForOneTime,
    pointsForNationals,
    yearTotal,
    computeStandings,
    lookupChapter,
  };
})(window);
