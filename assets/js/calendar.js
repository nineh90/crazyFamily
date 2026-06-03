(async function () {
  const grid = document.getElementById('calendarGrid');
  const label = document.getElementById('calMonthLabel');
  const btnPrev = document.getElementById('calPrev');
  const btnNext = document.getElementById('calNext');
  if (!grid) return;

  // Mo=0, Di=1, Mi=2, Do=3, Fr=4, Sa=5, So=6 (nach +6)%7-Konvertierung)
  const STREAM_DAYS = new Set([0, 2, 4]); // Montag, Mittwoch, Freitag

  let specialEvents = [];
  try {
    const res = await fetch('/assets/data/events.json', { cache: 'no-cache' });
    specialEvents = await res.json();
  } catch (e) { /* silent */ }

  const specialMap = {};
  specialEvents.forEach(ev => { specialMap[ev.date] = ev; });

  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth(); // 0-based

  const DE_MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  const DE_DAYS   = ['Mo','Di','Mi','Do','Fr','Sa','So'];

  function render() {
    label.textContent = `${DE_MONTHS[viewMonth]} ${viewYear}`;

    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay  = new Date(viewYear, viewMonth + 1, 0);

    // Wochentag des 1. (Mo=0 … So=6)
    let startOffset = (firstDay.getDay() + 6) % 7;

    let html = DE_DAYS.map(d => `<div class="cal-header">${d}</div>`).join('');

    // Leere Felder vor dem 1.
    for (let i = 0; i < startOffset; i++) {
      html += `<div class="cal-day empty"></div>`;
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(viewYear, viewMonth, d);
      const iso  = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const dow  = (date.getDay() + 6) % 7; // Mo=0

      const isToday   = (d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear());
      const isStream  = STREAM_DAYS.has(dow);
      const special   = specialMap[iso];

      let cls = 'cal-day';
      if (isToday)   cls += ' today';
      if (special)   cls += ' special-event';
      else if (isStream) cls += ' stream-day';

      const title = special ? ` title="${special.title}${special.note ? ' – ' + special.note : ''}"` : (isStream ? ' title="Regulärer Stream – 17 Uhr TikTok"' : '');
      const lbl   = special ? `<span class="day-label">${special.title}</span>` : (isStream ? '<span class="day-label">Stream</span>' : '');

      html += `<div class="${cls}"${title}><span class="day-number">${d}</span>${lbl}</div>`;
    }

    grid.innerHTML = html;
  }

  btnPrev.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    render();
  });
  btnNext.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    render();
  });

  render();
})();
