(function () {
  let map = null;
  let markers = {};
  let data = { states: [] };
  let apexById = {};
  let selected = { type: null, stateId: null, chapterId: null };
  let suppressMapSync = false;

  const STATE_COLOR = "#1B5470";
  const CHAPTER_COLOR = "#E8A020";

  function $(id) { return document.getElementById(id); }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str || "";
    return d.innerHTML;
  }

  function findState(stateId) {
    return data.states.find(s => s.id === stateId);
  }

  function findChapter(stateId, chapterId) {
    const state = findState(stateId);
    if (!state) return null;
    return state.chapters.find(c => c.id === chapterId) || null;
  }

  function markerKey(type, stateId, chapterId) {
    return type === "state" ? "state:" + stateId : "chapter:" + stateId + ":" + chapterId;
  }

  function renderDetail(item, type, state) {
    const detail = $("chapters-detail");
    if (!detail) return;

    const isState = type === "state";
    const label = isState ? "State Chapter" : "School Chapter";
    const parent = isState ? "" : '<p class="chapters-detail__parent">' + escapeHtml(state.name) + " State Chapter</p>";

    detail.innerHTML =
      '<p class="chapters-detail__type">' + label + '</p>' +
      parent +
      '<h3 class="chapters-detail__name">' + escapeHtml(item.name) + '</h3>' +
      '<dl class="chapters-detail__meta">' +
        '<div><dt>Location</dt><dd>' + escapeHtml(item.location || "Not listed") + '</dd></div>' +
        (item.address ? '<div><dt>Address</dt><dd>' + escapeHtml(item.address) + '</dd></div>' : "") +
        (item.status ? '<div><dt>Status</dt><dd>' + escapeHtml(item.status) + '</dd></div>' : "") +
        '<div><dt>Email</dt><dd><a href="mailto:' + escapeHtml(item.email) + '">' + escapeHtml(item.email) + '</a></dd></div>' +
        '<div><dt>Phone</dt><dd><a href="tel:' + escapeHtml((item.phone || "").replace(/\D/g, "")) + '">' + escapeHtml(item.phone || "Not listed") + '</a></dd></div>' +
      '</dl>' +
      apexLine(item.id);
  }

  function apexLine(chapterId) {
    const row = apexById[chapterId];
    const total = row ? row.cycleTotal : 0;
    return '<p class="chapters-detail__apex">Road to Apex cycle total: <strong>' + total +
      '</strong> · <a href="competition.html#road-to-apex">Full standings</a></p>';
  }

  function highlightListItem(type, stateId, chapterId) {
    document.querySelectorAll(".chapters-list__item.is-active").forEach(el => el.classList.remove("is-active"));
    const selector = type === "state"
      ? '.chapters-list__state[data-state-id="' + stateId + '"]'
      : '.chapters-list__chapter[data-state-id="' + stateId + '"][data-chapter-id="' + chapterId + '"]';
    const el = document.querySelector(selector);
    if (el) {
      el.classList.add("is-active");
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function focusMap(type, stateId, chapterId) {
    const key = markerKey(type, stateId, chapterId);
    const marker = markers[key];
    if (!marker || !map) return;

    suppressMapSync = true;
    map.setView(marker.getLatLng(), type === "state" ? 6 : 10, { animate: true });
    marker.openPopup();
    setTimeout(() => { suppressMapSync = false; }, 400);
  }

  function selectItem(type, stateId, chapterId) {
    selected = { type, stateId, chapterId };
    const state = findState(stateId);
    if (!state) return;

    if (type === "state") {
      renderDetail(state, "state", state);
      expandState(stateId);
    } else {
      const chapter = findChapter(stateId, chapterId);
      if (!chapter) return;
      renderDetail(chapter, "chapter", state);
      expandState(stateId);
    }

    highlightListItem(type, stateId, chapterId);
    focusMap(type, stateId, chapterId);
  }

  function expandState(stateId) {
    document.querySelectorAll(".chapters-list__state-group").forEach(group => {
      group.classList.toggle("is-expanded", group.dataset.stateId === stateId);
    });
  }

  function buildPopupHtml(item, type, stateName) {
    const heading = type === "state" ? item.name + " (State)" : item.name;
    const sub = type === "chapter" ? "<br><small>" + escapeHtml(stateName) + "</small>" : "";
    return "<strong>" + escapeHtml(heading) + "</strong>" + sub +
      "<br>" + escapeHtml(item.location || "") +
      "<br><a href=\"mailto:" + escapeHtml(item.email) + "\">" + escapeHtml(item.email) + "</a>";
  }

  function initMap() {
    map = L.map("chapters-map", { scrollWheelZoom: false }).setView([39.8283, -98.5795], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    map.on("click", () => {
      if (!suppressMapSync) map.closePopup();
    });
  }

  function addMarkers() {
    data.states.forEach(state => {
      if (typeof state.lat === "number" && typeof state.lng === "number") {
        const key = markerKey("state", state.id);
        const marker = L.circleMarker([state.lat, state.lng], {
          radius: 10,
          color: STATE_COLOR,
          fillColor: STATE_COLOR,
          fillOpacity: 0.85,
          weight: 2,
        }).addTo(map);
        marker.bindPopup(buildPopupHtml(state, "state", state.name));
        marker.on("click", () => selectItem("state", state.id, null));
        markers[key] = marker;
      }

      state.chapters.forEach(chapter => {
        if (typeof chapter.lat !== "number" || typeof chapter.lng !== "number") return;
        const key = markerKey("chapter", state.id, chapter.id);
        const marker = L.circleMarker([chapter.lat, chapter.lng], {
          radius: 7,
          color: CHAPTER_COLOR,
          fillColor: CHAPTER_COLOR,
          fillOpacity: 0.9,
          weight: 2,
        }).addTo(map);
        marker.bindPopup(buildPopupHtml(chapter, "chapter", state.name));
        marker.on("click", () => selectItem("chapter", state.id, chapter.id));
        markers[key] = marker;
      });
    });

    const bounds = [];
    Object.values(markers).forEach(m => bounds.push(m.getLatLng()));
    if (bounds.length) map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 6 });
  }

  function matchesSearch(state, query) {
    if (!query) return true;
    const q = query.toLowerCase();
    if (state.name.toLowerCase().includes(q)) return true;
    if ((state.location || "").toLowerCase().includes(q)) return true;
    return state.chapters.some(c =>
      c.name.toLowerCase().includes(q) ||
      (c.location || "").toLowerCase().includes(q)
    );
  }

  function renderList(filterQuery) {
    const list = $("chapters-list");
    if (!list) return;
    list.innerHTML = "";

    const filtered = data.states.filter(s => matchesSearch(s, filterQuery));

    if (!filtered.length) {
      list.innerHTML = '<p class="chapters-list__empty">No chapters match your search.</p>';
      return;
    }

    filtered.forEach(state => {
      const group = document.createElement("div");
      group.className = "chapters-list__state-group";
      group.dataset.stateId = state.id;

      const chapterCount = state.chapters.length;
      const countLabel = chapterCount === 1 ? "1 chapter" : chapterCount + " chapters";
      const statePts = apexById[state.id] ? apexById[state.id].cycleTotal : 0;
      const statusBit = state.status ? escapeHtml(state.status) + ' · ' : '';

      group.innerHTML =
        '<button type="button" class="chapters-list__state" data-state-id="' + escapeHtml(state.id) + '">' +
          '<span class="chapters-list__state-name">' + escapeHtml(state.name) + '</span>' +
          '<span class="chapters-list__state-meta">' + statusBit + escapeHtml(state.location || "") +
          ' · ' + countLabel + ' · ' + statePts + ' Apex pts</span>' +
        '</button>' +
        '<div class="chapters-list__chapters"></div>';

      const chaptersEl = group.querySelector(".chapters-list__chapters");

      if (!chapterCount) {
        chaptersEl.innerHTML = '<p class="chapters-list__no-chapters">No school chapters listed yet.</p>';
      } else {
        state.chapters.forEach(chapter => {
          if (filterQuery) {
            const q = filterQuery.toLowerCase();
            const stateMatch = state.name.toLowerCase().includes(q) || (state.location || "").toLowerCase().includes(q);
            const chapterMatch = chapter.name.toLowerCase().includes(q) || (chapter.location || "").toLowerCase().includes(q);
            if (!stateMatch && !chapterMatch) return;
          }
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "chapters-list__chapter";
          btn.dataset.stateId = state.id;
          btn.dataset.chapterId = chapter.id;
          const pts = apexById[chapter.id] ? apexById[chapter.id].cycleTotal : 0;
          const statusBit = chapter.status ? escapeHtml(chapter.status) + ' · ' : '';
          btn.innerHTML =
            '<span class="chapters-list__chapter-name">' + escapeHtml(chapter.name) + '</span>' +
            '<span class="chapters-list__chapter-meta">' + statusBit + escapeHtml(chapter.location || "") +
            ' · ' + pts + ' Apex pts</span>';
          chaptersEl.appendChild(btn);
        });
      }

      list.appendChild(group);
    });

    list.querySelectorAll(".chapters-list__state").forEach(btn => {
      btn.addEventListener("click", () => selectItem("state", btn.dataset.stateId, null));
    });
    list.querySelectorAll(".chapters-list__chapter").forEach(btn => {
      btn.addEventListener("click", () => selectItem("chapter", btn.dataset.stateId, btn.dataset.chapterId));
    });

    if (selected.stateId) expandState(selected.stateId);
  }

  async function init() {
    try {
      const res = await fetch("/data/chapters.json");
      data = await res.json();
    } catch (err) {
      $("chapters-list").innerHTML = '<p class="chapters-list__empty">Unable to load chapter data.</p>';
      console.error(err);
      return;
    }

    try {
      const pointsRes = await fetch("/data/apex-points.json");
      const points = await pointsRes.json();
      if (window.MediLinkApex) {
        window.MediLinkApex.computeStandings(points, data).forEach((row) => {
          apexById[row.id] = row;
        });
      }
    } catch (err) {
      console.error("Apex points ledger could not load.", err);
    }

    initMap();
    addMarkers();
    renderList("");

    const search = $("chapters-search");
    if (search) {
      search.addEventListener("input", () => renderList(search.value.trim()));
    }

    if (data.states.length) {
      selectItem("state", data.states[0].id, null);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
