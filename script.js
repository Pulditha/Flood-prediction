/* =========================================================
   FloodWatch — Dashboard JavaScript
   ========================================================= */

// ── Configuration ──────────────────────────────────────────
const RISK_LEVELS = {
  minimal:  { label: 'Minimal Risk',  color: '#3b82f6', emoji: '🟢', pct: 12,  gaugeStroke: '#3b82f6' },
  low:      { label: 'Low Risk',      color: '#22c55e', emoji: '🟢', pct: 28,  gaugeStroke: '#22c55e' },
  moderate: { label: 'Moderate Risk', color: '#f59e0b', emoji: '🟡', pct: 42,  gaugeStroke: '#f59e0b' },
  high:     { label: 'High Risk',     color: '#ef4444', emoji: '🔴', pct: 68,  gaugeStroke: '#ef4444' },
  extreme:  { label: 'Extreme Risk',  color: '#7f1d1d', emoji: '🔴', pct: 90,  gaugeStroke: '#dc2626' },
};

const CURRENT_RISK = 'moderate'; // change this to test different states

// ── Alert Data ─────────────────────────────────────────────
const ALERTS = [
  {
    type: 'danger',
    icon: '🚨',
    title: 'Flood Warning — Kelani River',
    desc:  'Water level at Nagalagam Street gauge reached 4.8 m. Immediate evacuation advised in low-lying areas.',
    time:  '30 mins ago',
  },
  {
    type: 'warn',
    icon: '⚠️',
    title: 'Heavy Rain Advisory',
    desc:  'Meteorological Department forecasts 150–200 mm rainfall in Western Province over next 24 hours.',
    time:  '1 hr ago',
  },
  {
    type: 'warn',
    icon: '⚠️',
    title: 'Soil Saturation Alert',
    desc:  'Soil moisture index exceeded 75% threshold in Kalu Ganga catchment. Increased surface runoff expected.',
    time:  '2 hrs ago',
  },
  {
    type: 'info',
    icon: '📡',
    title: 'River Level — Rising Trend',
    desc:  'Mahaweli River level at Peradeniya gauge shows continuous rise — currently 3.1 m (normal: 2.2 m).',
    time:  '3 hrs ago',
  },
  {
    type: 'safe',
    icon: '✅',
    title: 'Nilwala River — Normal',
    desc:  'Water levels at Pitabeddara gauge are within normal range. No immediate risk.',
    time:  '5 hrs ago',
  },
];

// ── 7-Day Forecast Data ────────────────────────────────────
const FORECAST = (function () {
  const today = new Date();
  const days  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const rows = [
    { rain: 88,  level: 4.2, wind: 32, risk: 'high',     prob: 68 },
    { rain: 120, level: 4.9, wind: 40, risk: 'high',     prob: 79 },
    { rain: 95,  level: 4.5, wind: 36, risk: 'high',     prob: 72 },
    { rain: 60,  level: 3.8, wind: 28, risk: 'medium',   prob: 45 },
    { rain: 35,  level: 3.2, wind: 22, risk: 'medium',   prob: 31 },
    { rain: 18,  level: 2.8, wind: 18, risk: 'low',      prob: 18 },
    { rain: 8,   level: 2.4, wind: 14, risk: 'minimal',  prob: 8  },
  ];

  return rows.map((r, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      ...r,
      date: `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`,
      isToday: i === 0,
    };
  });
})();

// ── Historical Chart Data ──────────────────────────────────
const HISTORICAL = (function () {
  const days   = [];
  const rain   = [62, 44, 88, 110, 73, 87, 95];
  const levels = [2.8, 2.5, 3.4, 4.1, 3.7, 4.2, 4.5];
  const today  = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(`${d.getDate()}/${d.getMonth() + 1}`);
  }

  return { days, rain, levels };
})();

// ── Utility ────────────────────────────────────────────────
function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}
function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

// ── Live Clock ─────────────────────────────────────────────
function startClock() {
  const clockEl = document.getElementById('clock');
  const dateEl  = document.getElementById('date-display');
  const lastEl  = document.getElementById('last-updated');

  function tick() {
    const now = new Date();
    if (clockEl) clockEl.textContent = formatTime(now);
    if (dateEl)  dateEl.textContent  = formatDate(now);
    if (lastEl)  lastEl.textContent  = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  tick();
  setInterval(tick, 1000);
}

// ── Risk Gauge ─────────────────────────────────────────────
function updateGauge(riskKey) {
  const r           = RISK_LEVELS[riskKey] || RISK_LEVELS.moderate;
  const circumference = 2 * Math.PI * 58; // r=58
  const offset      = circumference * (1 - r.pct / 100);

  const fillEl  = document.getElementById('gauge-fill');
  const pctEl   = document.getElementById('gauge-pct');
  const labelEl = document.getElementById('risk-text');

  if (fillEl) {
    fillEl.style.strokeDashoffset = offset;
    fillEl.style.stroke = r.gaugeStroke;
  }
  if (pctEl)   pctEl.textContent = r.pct + '%';
  if (labelEl) labelEl.textContent = r.label;
}

// ── Alert Banner ───────────────────────────────────────────
window.dismissAlert = function () {
  const el = document.getElementById('top-alert');
  if (el) el.classList.add('hidden');
};

// ── Nav Active State ───────────────────────────────────────
window.setActive = function (el) {
  document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active'));
  el.classList.add('active');
};

// ── Mobile Menu ────────────────────────────────────────────
function initMobileMenu() {
  const btn = document.getElementById('menu-btn');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && e.target !== btn) {
      nav.classList.remove('open');
    }
  });
}

// ── Build Sparklines ───────────────────────────────────────
function buildSparkline(containerId, values) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const max = Math.max(...values) || 1;
  el.innerHTML = '';
  values.forEach((v, i) => {
    const bar = document.createElement('div');
    bar.className = 'sparkline__bar';
    bar.style.height = `${Math.round((v / max) * 28)}px`;
    if (i === values.length - 1) bar.style.opacity = '1';
    el.appendChild(bar);
  });
}

function buildAllSparklines() {
  buildSparkline('spark-rainfall', [62, 44, 88, 110, 73, 87, 95]);
  buildSparkline('spark-level',    [2.8, 2.5, 3.4, 4.1, 3.7, 4.2, 4.5]);
  buildSparkline('spark-soil',     [55, 58, 62, 70, 74, 76, 78]);
  buildSparkline('spark-temp',     [28, 27, 26, 26, 27, 26, 26]);
  buildSparkline('spark-wind',     [18, 22, 28, 35, 30, 32, 34]);
  buildSparkline('spark-prob',     [18, 20, 30, 48, 40, 42, 46]);
}

// ── Render Alerts List ─────────────────────────────────────
function renderAlerts() {
  const list  = document.getElementById('alerts-list');
  const badge = document.getElementById('alert-count-badge');
  if (!list) return;

  const active = ALERTS.filter(a => a.type === 'danger' || a.type === 'warn');
  if (badge) badge.textContent = `${active.length} Active`;

  list.innerHTML = ALERTS.map(a => `
    <div class="alert-item alert-item--${a.type}">
      <span class="alert-item__icon">${a.icon}</span>
      <div class="alert-item__body">
        <div class="alert-item__title">${a.title}</div>
        <div class="alert-item__desc">${a.desc}</div>
        <div class="alert-item__time">${a.time}</div>
      </div>
    </div>
  `).join('');
}

// ── Render Forecast Table ──────────────────────────────────
function renderForecast() {
  const tbody = document.getElementById('forecast-tbody');
  if (!tbody) return;

  const riskMap = {
    high:    { cls: 'risk-pill--high',    label: 'High' },
    medium:  { cls: 'risk-pill--medium',  label: 'Medium' },
    low:     { cls: 'risk-pill--low',     label: 'Low' },
    minimal: { cls: 'risk-pill--minimal', label: 'Minimal' },
  };

  tbody.innerHTML = FORECAST.map(row => {
    const rm  = riskMap[row.risk] || riskMap.low;
    const pct = row.prob;

    return `
      <tr>
        <td>
          <strong>${row.date}</strong>
          ${row.isToday ? '&nbsp;<span class="badge badge--info" style="font-size:0.65rem;padding:0.1rem 0.45rem;">Today</span>' : ''}
        </td>
        <td>${row.rain} mm</td>
        <td>${row.level} m</td>
        <td>${row.wind} km/h</td>
        <td><span class="risk-pill ${rm.cls}">${rm.label}</span></td>
        <td>
          <div class="progress-bar-wrap">
            <div class="progress-bar">
              <div class="progress-bar__fill" style="width:${pct}%; background:${pct > 60 ? '#ef4444' : pct > 35 ? '#f59e0b' : '#22c55e'}"></div>
            </div>
            <span style="font-size:0.78rem;font-weight:700;min-width:32px;">${pct}%</span>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ── Render Charts ──────────────────────────────────────────
function renderCharts() {
  const commonOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#94a3b8',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
    },
  };

  // Rainfall bar chart
  const rainfallCtx = document.getElementById('rainfallChart');
  if (rainfallCtx) {
    new Chart(rainfallCtx, {
      type: 'bar',
      data: {
        labels: HISTORICAL.days,
        datasets: [{
          data:            HISTORICAL.rain,
          backgroundColor: HISTORICAL.rain.map(v =>
            v >= 100 ? 'rgba(239,68,68,0.75)' :
            v >= 70  ? 'rgba(245,158,11,0.75)' :
                       'rgba(14,165,233,0.7)'
          ),
          borderRadius:    4,
          borderSkipped:   false,
        }],
      },
      options: {
        ...commonOpts,
        plugins: {
          ...commonOpts.plugins,
          tooltip: {
            ...commonOpts.plugins.tooltip,
            callbacks: { label: ctx => ` ${ctx.raw} mm` },
          },
        },
      },
    });
  }

  // Water level line chart
  const levelCtx = document.getElementById('levelChart');
  if (levelCtx) {
    new Chart(levelCtx, {
      type: 'line',
      data: {
        labels: HISTORICAL.days,
        datasets: [{
          data:            HISTORICAL.levels,
          borderColor:     '#0ea5e9',
          backgroundColor: 'rgba(14,165,233,0.12)',
          borderWidth:     2.5,
          pointBackgroundColor: '#0ea5e9',
          pointRadius:     4,
          tension:         0.4,
          fill:            true,
        }],
      },
      options: {
        ...commonOpts,
        plugins: {
          ...commonOpts.plugins,
          tooltip: {
            ...commonOpts.plugins.tooltip,
            callbacks: { label: ctx => ` ${ctx.raw} m` },
          },
        },
        scales: {
          ...commonOpts.scales,
          y: {
            ...commonOpts.scales.y,
            min: 2,
          },
        },
      },
    });
  }
}

// ── Live Data Simulation ───────────────────────────────────
// Slightly varies metric values every 10 seconds to simulate live feed
function startLiveSimulation() {
  function vary(base, delta) {
    return (base + (Math.random() * delta * 2 - delta)).toFixed(1);
  }

  setInterval(() => {
    const rainfallEl = document.getElementById('metric-rainfall');
    const levelEl    = document.getElementById('metric-level');
    const probEl     = document.getElementById('metric-prob');
    const windEl     = document.getElementById('metric-wind');

    if (rainfallEl) rainfallEl.textContent = vary(87, 3);
    if (levelEl)    levelEl.textContent    = vary(4.2, 0.2);
    if (probEl)     probEl.textContent     = Math.round(parseFloat(vary(42, 2)));
    if (windEl)     windEl.textContent     = Math.round(parseFloat(vary(32, 2)));
  }, 10000);
}

// ── Smooth Scroll for Nav Links ────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── Scroll-based active nav ────────────────────────────────
function initScrollSpy() {
  const sections = ['dashboard', 'metrics', 'map', 'forecast', 'about'];
  const navLinks  = document.querySelectorAll('.nav__link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  startClock();
  updateGauge(CURRENT_RISK);
  buildAllSparklines();
  renderAlerts();
  renderForecast();
  renderCharts();
  startLiveSimulation();
  initMobileMenu();
  initSmoothScroll();
  initScrollSpy();

  console.log('🌊 FloodWatch dashboard initialised.');
});
