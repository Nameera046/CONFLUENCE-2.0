import { state } from '../utils/data.js';

export function renderPumpControl(container) {
  container.innerHTML = `
    <div class="section-head mb-24">
      <div>
        <h1>Pump Control Center</h1>
        <p class="muted">Manual & automated pump management · Zone-based dewatering control</p>
      </div>
      <div style="margin-left:auto;display:flex;gap:10px;">
        <button class="btn ${state.autoMode ? 'btn-primary' : 'btn-ghost'}" id="auto-mode-btn" onclick="toggleAutoMode(this)">
          🤖 Auto Mode: ${state.autoMode ? 'ON' : 'OFF'}
        </button>
        <button class="btn btn-ghost" id="diag-btn" onclick="runDiagnosticsTrigger()">
          📋 Run Diagnostics
        </button>
      </div>
    </div>

    <!-- Diagnostics Console (Conditional Display) -->
    <div id="diagnostics-panel" class="card mb-24" style="display: none; background: #070a11; border-color: var(--blue);">
      <div class="card-header">
        <span class="card-title" style="color: var(--blue); font-family: var(--font-mono); font-size: 0.9rem;">
          📟 SCADA Diagnostic Subsystem Terminal v2.0
        </span>
        <button class="btn btn-ghost" style="padding: 2px 8px; font-size: 0.7rem;" onclick="closeDiagnostics()">Close</button>
      </div>
      <div id="diagnostics-console" style="font-family: var(--font-mono); font-size: 0.82rem; line-height: 1.5; color: #38bdf8; height: 160px; overflow-y: auto; background: rgba(0,0,0,0.5); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
      </div>
    </div>

    <!-- Pump Cards Grid -->
    <div class="grid-2 mb-24" id="pump-cards"></div>

    <!-- System Power Balance + Schedule -->
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">🔌 Active Power Balance</span></div>
        <div style="display:flex;flex-direction:column;gap:10px;" id="power-balance"></div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">📅 Pump Schedule (24h)</span>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Zone</th><th>Pump</th><th>Start</th><th>End</th><th>Priority</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>Level -40m</td><td>P-01 (Alpha)</td><td>06:00</td><td>18:00</td><td>High</td><td><span class="badge badge-green">Active</span></td></tr>
            <tr><td>Level -80m</td><td>P-02 (Beta)</td><td>00:00</td><td>24:00</td><td>High</td><td><span class="badge badge-green">Active</span></td></tr>
            <tr><td>Level -40m</td><td>P-03 (Gamma)</td><td>18:00</td><td>06:00</td><td>Medium</td><td><span class="badge badge-muted">Scheduled</span></td></tr>
            <tr><td>Level -120m</td><td>P-04 (Delta)</td><td>00:00</td><td>24:00</td><td>Critical</td><td><span class="badge badge-green">Active</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Render child components
  renderPumpCards();
  renderPowerBalance();
  updateDiagnosticsConsole();

  // Diagnostics triggers
  window.runDiagnosticsTrigger = function() {
    const diagPanel = document.getElementById('diagnostics-panel');
    if (diagPanel) diagPanel.style.display = 'block';
    
    const consoleDiv = document.getElementById('diagnostics-console');
    if (consoleDiv) consoleDiv.innerHTML = 'Starting diagnostic sweep...';
    
    window.runSystemDiagnostics();
  };

  window.closeDiagnostics = function() {
    const diagPanel = document.getElementById('diagnostics-panel');
    if (diagPanel) diagPanel.style.display = 'none';
  };

  // Add the dynamic listener to update fields on tick
  const handleTick = () => {
    renderPumpCards();
    renderPowerBalance();
  };

  const handleDiagUpdate = () => {
    updateDiagnosticsConsole();
  };

  window.addEventListener('telemetry-tick', handleTick);
  window.addEventListener('diagnostics-update', handleDiagUpdate);
  
  // Clean up listener when container content is overwritten
  container.addEventListener('destroy-page', () => {
    window.removeEventListener('telemetry-tick', handleTick);
    window.removeEventListener('diagnostics-update', handleDiagUpdate);
  }, { once: true });
}

function renderPowerBalance() {
  const container = document.getElementById('power-balance');
  if (!container) return;

  const solarPower = state.solar.power;
  const biomassPower = state.biomass.power;
  const totalLoad = state.pumps.filter(p => p.status === 'running').reduce((acc, p) => acc + p.power, 0);
  const netPower = solarPower + biomassPower - totalLoad;
  const netGlow = netPower >= 0 ? 'color: var(--green)' : 'color: var(--red)';

  container.innerHTML = `
    ${powerRow('Solar Array Generation', solarPower.toFixed(1), 'kW', 'solar')}
    ${powerRow('Biomass Engine Generation', biomassPower.toFixed(1), 'kW', 'green')}
    ${powerRow('Total Dewatering Pump Load', totalLoad.toFixed(1), 'kW', 'blue')}
    <div style="display:flex;justify-content:space-between;padding:12px;background:var(--deep);border-radius:8px; border: 1px solid rgba(255,255,255,0.03); margin-top: 6px;">
      <span style="font-size:.88rem; font-weight: 600;">Net Grid Balance</span>
      <strong style="${netGlow}">${netPower >= 0 ? '+' : ''}${netPower.toFixed(1)} kW</strong>
    </div>
    <div style="font-size: 0.78rem; color: var(--muted); text-align: center; margin-top: 4px;">
      ${netPower >= 0 ? '⚡ Surplus charging battery storage' : '🔋 Deficit drawing from battery storage'}
    </div>
  `;
}

function powerRow(label, val, unit, color) {
  const colors = { solar: 'var(--solar)', green: 'var(--green)', blue: 'var(--blue)', '': 'var(--text)' };
  return `
    <div style="display:flex;justify-content:space-between;padding:10px 12px;background:var(--deep);border-radius:6px;">
      <span style="font-size:.84rem; color:#cbd5e1;">${label}</span>
      <strong style="color:${colors[color]}">${val} ${unit}</strong>
    </div>`;
}

function renderPumpCards() {
  const container = document.getElementById('pump-cards');
  if (!container) return;

  container.innerHTML = state.pumps.map(p => {
    const isRunning = p.status === 'running';
    const isFault = p.status === 'fault';
    const borderGlow = isRunning ? 'var(--green)' : isFault ? 'var(--red)' : 'var(--border)';
    
    return `
      <div class="card" style="border-color: ${borderGlow};">
        <div class="card-header" style="margin-bottom: 16px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="sensor-node">
              <div class="pulse-ring" style="border-color:${isRunning ? 'var(--green)' : 'var(--muted)'}"></div>
              <div class="pulse-ring" style="border-color:${isRunning ? 'var(--green)' : 'var(--muted)'}"></div>
              <div class="sensor-dot ${isRunning ? 'green' : isFault ? 'red' : ''}"></div>
            </div>
            <div>
              <h3 style="font-size: 1.05rem; display:flex; align-items:center; gap:6px;">
                ${p.name} 
                <span style="font-size:.76rem;color:var(--muted); font-weight:400;">[${p.id}]</span>
              </h3>
              <div style="font-size:.74rem;color:var(--muted); font-weight: 500;">${p.zone} · priority: ${p.priority}</div>
            </div>
          </div>
          <span class="badge ${isRunning ? 'badge-green' : isFault ? 'badge-red' : 'badge-muted'}">${p.status}</span>
        </div>

        <div class="grid-3 mb-16" style="gap:10px;">
          ${metric('Flow Rate', isRunning ? p.flow.toFixed(1) + ' L/min' : '—', 'var(--blue)')}
          ${metric('Power Draw', p.power.toFixed(1) + ' kW', 'var(--solar)')}
          ${metric('Discharge Pres.', isRunning ? p.pressure.toFixed(1) + ' bar' : '—', 'var(--text)')}
          ${metric('Motor Temp', p.temp.toFixed(0) + '°C', p.temp > 70 ? 'var(--red)' : 'var(--green)')}
          ${metric('Accum. Hours', p.hours.toFixed(0) + ' h', 'var(--muted)')}
          ${metric('Component Health', p.hours < 1500 ? '✅ Good' : p.hours < 2500 ? '⚠️ Due' : '🚨 Critical', p.hours < 1500 ? 'var(--green)' : p.hours < 2500 ? 'var(--solar)' : 'var(--red)')}
        </div>

        <div style="display:flex;gap:8px;">
          ${isRunning
            ? `<button class="btn btn-danger" style="flex:1; justify-content:center;" onclick="setPumpStatus('${p.id}','standby')">⏸ Stop Pump</button>`
            : `<button class="btn btn-primary" style="flex:1; justify-content:center;" onclick="setPumpStatus('${p.id}','running')">▶ Start Pump</button>`
          }
          <button class="btn btn-ghost" onclick="viewServiceLog('${p.id}')">🔧 Logs</button>
          <button class="btn btn-ghost" onclick="viewAnalytics('${p.id}')">📊 Charts</button>
        </div>
      </div>`;
  }).join('');

  // Bind inline functions
  window.viewServiceLog = function(pumpId) {
    const pump = state.pumps.find(p => p.id === pumpId);
    alert(`Service Logs for ${pump.name} (${pump.id}):\n-------------------------\n* Install date: 14-Oct-2025\n* Current Hours: ${pump.hours.toFixed(1)} h\n* Maintenance Status: ${pump.hours < 1500 ? 'Normal' : 'Inspection Required'}\n* Last Log: Impeller vibration scan normal.`);
  };

  window.viewAnalytics = function(pumpId) {
    alert(`Navigating to AI analytics profile for ${pumpId}. Data streams online.`);
    window.router.navigate('analytics');
  };
}

function metric(label, value, color) {
  return `
    <div style="text-align:center;padding:8px 4px;background:var(--deep);border-radius:8px; border: 1px solid rgba(255,255,255,0.02);">
      <div style="font-size:.7rem;color:var(--muted);margin-bottom:4px; font-weight: 600; text-transform: uppercase;">${label}</div>
      <div style="font-size:.88rem;font-weight:700;color:${color};">${value}</div>
    </div>`;
}

function updateDiagnosticsConsole() {
  const consoleDiv = document.getElementById('diagnostics-console');
  if (!consoleDiv) return;

  const panel = document.getElementById('diagnostics-panel');
  if (state.diagnosticsRunning && panel) {
    panel.style.display = 'block';
  }

  consoleDiv.innerHTML = state.diagnosticLogs.map(log => `
    <div style="margin-bottom: 4px;">
      <span style="color: var(--muted); font-size: 0.75rem;">[${log.time}]</span> 
      <span style="${log.text.includes('WARNING') || log.text.includes('overdue') ? 'color: var(--solar)' : log.text.includes('Complete') ? 'color: var(--green)' : 'color: #cbd5e1'}">
        ${log.text}
      </span>
    </div>
  `).join('');
  
  // Scroll to bottom
  consoleDiv.scrollTop = consoleDiv.scrollHeight;
}
