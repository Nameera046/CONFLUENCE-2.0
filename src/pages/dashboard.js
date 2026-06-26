import { state, generateEnergyHistory, generateWaterHistory } from '../utils/data.js';

let energyChart, waterChart;

export function renderDashboard(container) {
  container.innerHTML = `
    <div class="section-head mb-24">
      <div>
        <h1>Operations Dashboard</h1>
        <p class="muted">Real-time monitoring · Solar + Biomass Hybrid Dewatering System</p>
      </div>
      <div style="margin-left:auto; display:flex; gap:10px;">
        <button class="btn btn-ghost" onclick="exportDataReport()">⬇ Export Report</button>
        <button class="btn btn-primary" onclick="window.router.navigate('analytics')">⚙️ Open Simulator</button>
      </div>
    </div>
 
    <!-- KPI Row -->
    <div class="grid-4 mb-24" id="kpi-row"></div>
 
    <!-- Energy Chart + Alerts Grid -->
    <div class="grid-21 mb-24">
      <div class="card" style="min-height: 380px; display:flex; flex-direction:column;">
        <div class="card-header">
          <span class="card-title">🔌 Energy Grid Balance (24h)</span>
          <div style="display:flex;gap:12px;font-size:.78rem;color:var(--muted); font-weight:600;">
            <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:4px;background:var(--solar);display:inline-block;border-radius:2px;"></span>Solar</span>
            <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:4px;background:var(--green);display:inline-block;border-radius:2px;"></span>Biomass</span>
            <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:4px;background:var(--blue);display:inline-block;border-radius:2px;"></span>Load</span>
          </div>
        </div>
        <div style="flex:1; position:relative; min-height: 250px;">
          <canvas id="energy-chart"></canvas>
        </div>
      </div>
      
      <div class="card" style="display:flex; flex-direction:column; max-height: 380px;">
        <div class="card-header">
          <span class="card-title">⚠️ Active System Alerts</span>
          <span class="badge badge-solar" id="alerts-count-badge">0</span>
        </div>
        <div id="alerts-list" style="flex:1; overflow-y:auto;"></div>
      </div>
    </div>
 
    <!-- Water + Sources + Pumps Grid -->
    <div class="grid-3">
      <!-- Water Levels -->
      <div class="card" style="display:flex; flex-direction:column;">
        <div class="card-header">
          <span class="card-title">💧 Reservoir & Sump Levels</span>
        </div>
        <div id="water-levels" style="margin-bottom: 20px;"></div>
        <div style="margin-top:auto;">
          <div class="card-title mb-8" style="font-size:0.9rem;">Pit Level Trend (12h)</div>
          <div style="position:relative; height: 110px; width:100%;">
            <canvas id="water-chart"></canvas>
          </div>
        </div>
      </div>
 
      <!-- Energy Sources Details -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">⚡ Generation Modules</span>
        </div>
        <div id="energy-sources"></div>
      </div>
 
      <!-- Pump Status mini list -->
      <div class="card" style="display:flex; flex-direction:column;">
        <div class="card-header">
          <span class="card-title">⚙️ Pump Fleet Status</span>
          <span class="badge badge-green" id="pumps-active-badge">0 Running</span>
        </div>
        <div id="pump-status-mini" style="overflow-y:auto; max-height:300px; flex:1;"></div>
      </div>
    </div>
  `;
 
  // Initial page renders
  updateKPIs();
  updateAlerts();
  updateWaterLevels();
  updateEnergySources();
  updatePumpMini();
  initCharts();

  // Bind local functions
  window.exportDataReport = function() {
    alert("Dewatering System Telemetry Exported!\nFormat: CSV (Time-Series Data).\nSent to SCADA server root.");
    addAlert('success', 'Report Exported', 'CSV Telemetry history successfully transferred to SCADA server.');
  };

  // Add the dynamic listener to update fields on tick
  const handleTick = () => {
    updateKPIs();
    updateWaterLevels();
    updateEnergySources();
    updatePumpMini();
    updateAlerts();
    
    // Live update charts with random fluctuation
    if (energyChart && waterChart) {
      // Add dynamic state values to chart data points
      const solDataset = energyChart.data.datasets[0].data;
      const bioDataset = energyChart.data.datasets[1].data;
      const loadDataset = energyChart.data.datasets[2].data;
      
      // Shift and push current state
      solDataset.shift();
      solDataset.push(state.solar.power);
      bioDataset.shift();
      bioDataset.push(state.biomass.power);
      loadDataset.shift();
      loadDataset.push(state.pumps.filter(p => p.status === 'running').reduce((acc, p) => acc + p.power, 0));
      
      energyChart.update('none'); // Update without full animation for performance
      
      const waterDataset = waterChart.data.datasets[0].data;
      waterDataset.shift();
      waterDataset.push(state.water.pit.level);
      waterChart.update('none');
    }
  };

  window.addEventListener('telemetry-tick', handleTick);
  
  // Clean up listener when container content is overwritten
  container.addEventListener('destroy-page', () => {
    window.removeEventListener('telemetry-tick', handleTick);
  }, { once: true });
}

function updateKPIs() {
  const totalGen = (state.solar.power + state.biomass.power).toFixed(1);
  const discharge = state.water.discharge.rate.toFixed(1);
  const pumpsOn = state.pumps.filter(p => p.status === 'running').length;
  const soc = state.battery.soc.toFixed(1);
 
  const kpiRow = document.getElementById('kpi-row');
  if (!kpiRow) return;

  kpiRow.innerHTML = `
    ${kpi('⚡', totalGen, 'kW', 'Total Gen Power', 'Solar + Biomass Hybrid', 'up')}
    ${kpi('💧', discharge, 'L/min', 'Discharge Rate', 'Active pit draw', 'up')}
    ${kpi('⚙️', `${pumpsOn}/${state.pumps.length}`, '', 'Pumps Active', `${state.pumps.filter(p => p.status === 'standby').length} Standby`, 'warning')}
    ${kpi('🔋', soc, '%', 'Battery Charge', `${state.battery.estimatedHours} hrs autonomy`, 'up')}
  `;
}
 
function kpi(icon, value, unit, label, delta, dir) {
  return `
    <div class="card kpi">
      <div class="kpi-value">${value}<span style="font-size:1.1rem;color:var(--muted); font-weight: 500;"> ${unit}</span></div>
      <div class="kpi-label">${label}</div>
      <div class="kpi-delta ${dir}">${delta}</div>
      <div class="kpi-accent">${icon}</div>
    </div>`;
}
 
function updateAlerts() {
  const alertsList = document.getElementById('alerts-list');
  const badge = document.getElementById('alerts-count-badge');
  if (!alertsList) return;

  // Filter unread or display recent 6 alerts
  const displayAlerts = state.alerts.slice(0, 6);
  badge.textContent = state.alerts.length;

  const icons = { warning: '⚠️', info: 'ℹ️', success: '✅', error: '🚨' };
  
  alertsList.innerHTML = displayAlerts.map(a => `
    <div class="alert-item ${a.type}">
      <span class="alert-icon">${icons[a.type]}</span>
      <div class="alert-body">
        <div class="alert-title">${a.title}</div>
        <div class="alert-time">${a.time} · ${a.msg}</div>
      </div>
    </div>`).join('');
}
 
function updateWaterLevels() {
  const w = state.water;
  const container = document.getElementById('water-levels');
  if (!container) return;

  container.innerHTML = `
    ${waterBar('Main Pit Level', w.pit.level, w.pit.level > 75 ? 'red' : w.pit.level > 50 ? '' : 'green')}
    ${waterBar('Sump Alpha (-40m)', w.sump1.level, w.sump1.level > 75 ? 'red' : '')}
    ${waterBar('Sump Beta (-80m)', w.sump2.level, w.sump2.level > 75 ? 'red' : 'green')}
  `;
}
 
function waterBar(label, val, colorClass = '') {
  return `
    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;font-size:.84rem;margin-bottom:4px;">
        <span>${label}</span><span style="font-weight:600;">${val.toFixed(1)}%</span>
      </div>
      <div class="progress-bar"><div class="progress-fill ${colorClass}" style="width:${val}%"></div></div>
    </div>`;
}
 
function updateEnergySources() {
  const s = state.solar, b = state.biomass, bat = state.battery;
  const container = document.getElementById('energy-sources');
  if (!container) return;

  const totalPower = Math.max(1, s.power + b.power);
  
  container.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <!-- Solar -->
      <div style="padding:12px;background:var(--deep);border-radius:8px;border:1px solid var(--border);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:.88rem;font-weight:600;display:flex;align-items:center;gap:6px;">☀️ Solar Array</span>
          <span class="badge ${s.status === 'optimal' ? 'badge-green' : s.status === 'shaded' ? 'badge-solar' : 'badge-red'}">${s.status}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:.8rem;color:var(--muted);">
          <span>Output Power</span><strong style="color:var(--solar)">${s.power.toFixed(1)} kW</strong>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:.8rem;color:var(--muted);margin-top:2px;">
          <span>Solar Irradiance</span><strong style="color:var(--text)">${s.irradiance} W/m²</strong>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:.8rem;color:var(--muted);margin-top:2px;">
          <span>Active Strings</span><strong style="color:var(--text)">${s.active}/${s.panels}</strong>
        </div>
        <div class="progress-bar mt-16"><div class="progress-fill" style="width:${(s.power/totalPower*100).toFixed(0)}%"></div></div>
      </div>

      <!-- Biomass -->
      <div style="padding:12px;background:var(--deep);border-radius:8px;border:1px solid var(--border);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:.88rem;font-weight:600;display:flex;align-items:center;gap:6px;">🌿 Biomass Unit</span>
          <span class="badge ${b.status === 'running' ? 'badge-green' : b.status === 'heating' ? 'badge-solar' : b.status === 'standby' ? 'badge-muted' : 'badge-red'}">${b.status}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:.8rem;color:var(--muted);">
          <span>Output Power</span><strong style="color:var(--green)">${b.power.toFixed(1)} kW</strong>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:.8rem;color:var(--muted);margin-top:2px;">
          <span>Fuel Level</span><strong style="color:var(--text)">${b.fuelLevel.toFixed(1)}%</strong>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:.8rem;color:var(--muted);margin-top:2px;">
          <span>Chamber Temp</span><strong style="color:var(--text)">${b.temperature.toFixed(0)}°C</strong>
        </div>
        <div class="progress-bar mt-16"><div class="progress-fill green" style="width:${(b.power/totalPower*100).toFixed(0)}%"></div></div>
      </div>

      <!-- Battery -->
      <div style="padding:12px;background:var(--deep);border-radius:8px;border:1px solid var(--border);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:.88rem;font-weight:600;display:flex;align-items:center;gap:6px;">🔋 Battery Storage</span>
          <span class="badge ${bat.current < 0 ? 'badge-green' : bat.current > 0 ? 'badge-solar' : 'badge-muted'}">
            ${bat.current < 0 ? 'Charging' : bat.current > 0 ? 'Discharging' : 'Idle'}
          </span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:.8rem;color:var(--muted);">
          <span>State of Charge</span><strong style="color:var(--blue)">${bat.soc.toFixed(1)}%</strong>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:.8rem;color:var(--muted);margin-top:2px;">
          <span>Charge Current</span><strong style="color:var(--text)">${bat.current.toFixed(1)} A</strong>
        </div>
        <div class="progress-bar mt-16"><div class="progress-fill blue" style="width:${bat.soc}%"></div></div>
      </div>
    </div>
  `;
}
 
function updatePumpMini() {
  const runningCount = state.pumps.filter(p => p.status === 'running').length;
  const badge = document.getElementById('pumps-active-badge');
  const container = document.getElementById('pump-status-mini');
  
  if (badge) badge.textContent = `${runningCount} Running`;
  if (!container) return;

  container.innerHTML = state.pumps.map(p => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.04);">
      <div class="sensor-node">
        <div class="pulse-ring" style="border-color:${p.status==='running'?'var(--green)':'var(--muted)'}"></div>
        <div class="pulse-ring" style="border-color:${p.status==='running'?'var(--green)':'var(--muted)'}"></div>
        <div class="sensor-dot ${p.status==='running'?'green':p.status==='fault'?'red':''}"></div>
      </div>
      <div style="flex:1;">
        <div style="font-size:.88rem;font-weight:600;">${p.name} <span style="font-size:.72rem;color:var(--muted); font-weight:400;">[${p.id}]</span></div>
        <div style="font-size:.74rem;color:var(--muted);">${p.zone} · Pri: ${p.priority}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:.85rem;font-weight:700;color:${p.status==='running'?'var(--green)':'var(--muted)'};">
          ${p.status==='running'? p.flow.toFixed(1)+' L/min':'Standby'}
        </div>
        <div style="font-size:.74rem;color:var(--muted);">${p.power.toFixed(1)} kW</div>
      </div>
    </div>`).join('');
}
 
function initCharts() {
  const energy = generateEnergyHistory();
  const water  = generateWaterHistory();
 
  const ctx1 = document.getElementById('energy-chart').getContext('2d');
  if (energyChart) energyChart.destroy();
  energyChart = new Chart(ctx1, {
    type: 'line',
    data: {
      labels: energy.labels,
      datasets: [
        { label: 'Solar', data: energy.solar, borderColor: '#f5a623', backgroundColor: 'rgba(245,166,35,.05)', fill: true, tension: .4, pointRadius: 0, borderWidth: 2 },
        { label: 'Biomass', data: energy.biomass, borderColor: '#10b981', backgroundColor: 'transparent', fill: false, tension: .4, pointRadius: 0, borderWidth: 2 },
        { label: 'Load', data: energy.load, borderColor: '#00b8ff', backgroundColor: 'transparent', fill: false, tension: .4, pointRadius: 0, borderWidth: 2, borderDash: [4,4] },
      ],
    },
    options: {
      responsive: true, 
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#64748b', font: { size: 10, family: 'Outfit' }, maxTicksLimit: 8 } },
        y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#64748b', font: { size: 10, family: 'Outfit' } }, title: { display: true, text: 'kW', color: '#64748b', font: { size: 10, family: 'Outfit' } } },
      },
    },
  });
 
  const ctx2 = document.getElementById('water-chart').getContext('2d');
  if (waterChart) waterChart.destroy();
  waterChart = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: water.labels,
      datasets: [
        { label: 'Pit Level %', data: water.pitLevel, borderColor: '#00b8ff', backgroundColor: 'rgba(0,184,255,.06)', fill: true, tension: .4, pointRadius: 0, borderWidth: 2 }
      ],
    },
    options: {
      responsive: true, 
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8, family: 'Outfit' }, maxTicksLimit: 6 } },
        y: { grid: { color: 'rgba(255,255,255,.03)' }, ticks: { color: '#64748b', font: { size: 8, family: 'Outfit' } } },
      },
    },
  });
}
