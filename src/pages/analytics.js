import { state, addAlert } from '../utils/data.js';

export function renderAnalytics(container) {
  container.innerHTML = `
    <div class="section-head mb-24">
      <div>
        <h1>Environmental Simulator & AI Analytics</h1>
        <p class="muted">Stress test hybrid power balance · Inspect predictive asset health forecasts</p>
      </div>
      <div style="margin-left:auto;">
        <button class="btn btn-ghost" onclick="resetSimulationSettings()">🔄 Reset Simulator</button>
      </div>
    </div>

    <div class="grid-21 mb-24" style="grid-template-columns: 1.2fr 1fr; gap: 20px;">
      <!-- Simulation Controls -->
      <div class="card">
        <div class="card-header"><span class="card-title">⛈️ Environmental Telemetry Disturbance Injector</span></div>
        <p class="muted mb-24">Inject variables to test the SCADA automation loop's load-balancing and grid resilience in real-time.</p>
        
        <div style="display:flex; flex-direction:column; gap:20px;">
          <!-- Rain Slide -->
          <div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.88rem;">
              <span>Injected Rainfall Intensity</span>
              <strong id="rain-val" style="color:var(--blue);">0.0 mm/h</strong>
            </div>
            <input type="range" min="0" max="50" step="1" value="${state.environment.rainfall}" class="slider" id="rain-slider" oninput="adjustRain(this.value)" style="width:100%; height:6px; border-radius:5px; background:var(--deep); outline:none; -webkit-appearance:none; border: 1px solid var(--border);">
            <div style="display:flex; gap:6px; margin-top:8px;">
              <button class="btn btn-ghost" style="padding:4px 8px; font-size:0.7rem;" onclick="setRainPreset(0)">Clear Skies</button>
              <button class="btn btn-ghost" style="padding:4px 8px; font-size:0.7rem;" onclick="setRainPreset(15)">Light Rain (15 mm/h)</button>
              <button class="btn btn-danger" style="padding:4px 8px; font-size:0.7rem;" onclick="setRainPreset(45)">Heavy Storm (45 mm/h)</button>
            </div>
          </div>

          <!-- Solar Shading Slide -->
          <div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.88rem;">
              <span>Cloud/Dust Solar Shading</span>
              <strong id="shading-val" style="color:var(--solar);">0% Shading</strong>
            </div>
            <input type="range" min="0" max="100" step="5" value="${state.environment.solarShading}" class="slider" id="shading-slider" oninput="adjustShading(this.value)" style="width:100%; height:6px; border-radius:5px; background:var(--deep); outline:none; -webkit-appearance:none; border: 1px solid var(--border);">
            <div style="display:flex; gap:6px; margin-top:8px;">
              <button class="btn btn-ghost" style="padding:4px 8px; font-size:0.7rem;" onclick="setShadingPreset(0)">Direct Sunlight</button>
              <button class="btn btn-ghost" style="padding:4px 8px; font-size:0.7rem;" onclick="setShadingPreset(50)">Overcast Shading</button>
              <button class="btn btn-danger" style="padding:4px 8px; font-size:0.7rem;" onclick="setShadingPreset(95)">Sandstorm (95% Shading)</button>
            </div>
          </div>

          <!-- Biomass status info -->
          <div style="padding: 16px; background: var(--deep); border-radius:10px; border:1px solid var(--border); display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-size:0.88rem; font-weight:600; color:var(--green);">Biomass Reserves</div>
              <div style="font-size:0.75rem; color:var(--muted); margin-top:4px;" id="sim-biomass-fuel">Hopper Fuel level: 0%</div>
            </div>
            <button class="btn btn-primary" style="padding:8px 16px; font-size:0.78rem;" onclick="refillHopper()">Refill Fuel</button>
          </div>
        </div>
      </div>

      <!-- Simulation Logs Panel -->
      <div class="card" style="display:flex; flex-direction:column; max-height: 430px;">
        <div class="card-header">
          <span class="card-title">📟 SCADA Automation Event Log</span>
          <span class="badge badge-blue">Real-time</span>
        </div>
        <div id="sim-event-logs" style="flex:1; overflow-y:auto; font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.6; color:#a7f3d0; background: rgba(0,0,0,0.4); padding: 14px; border-radius: 8px; border:1px solid rgba(255,255,255,0.03);">
        </div>
      </div>
    </div>

    <!-- AI Asset Management Section -->
    <div class="card">
      <div class="card-header"><span class="card-title">🤖 AI Predictive Maintenance Analytics</span></div>
      <p class="muted mb-24">Predictive Health Score index calculated from pump running hours, impeller mechanical vibrations, and core motor winding temperatures.</p>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>Asset ID</th>
            <th>Equipment Name</th>
            <th>Vibration Index</th>
            <th>Winding Temp</th>
            <th>Historical Hours</th>
            <th>Health Score</th>
            <th>AI Recommendation</th>
          </tr>
        </thead>
        <tbody id="predictive-table">
        </tbody>
      </table>
    </div>
  `;

  // Render initial components
  updateSliderLabels();
  renderPredictiveTable();
  updateSimulationLogs();

  // Local bindings
  window.adjustRain = function(val) {
    state.environment.rainfall = parseFloat(val);
    updateSliderLabels();
    if (state.environment.rainfall > 35) {
      addSimLog("Environment: Torrential rainfall detected. Inflows spiked.");
    }
  };

  window.setRainPreset = function(val) {
    const slider = document.getElementById('rain-slider');
    if (slider) {
      slider.value = val;
      adjustRain(val);
    }
  };

  window.adjustShading = function(val) {
    state.environment.solarShading = parseInt(val);
    updateSliderLabels();
    if (state.environment.solarShading > 70) {
      addSimLog(`Environment: Dense cloud shading injected (${val}%). Solar output degraded.`);
    }
  };

  window.setShadingPreset = function(val) {
    const slider = document.getElementById('shading-slider');
    if (slider) {
      slider.value = val;
      adjustShading(val);
    }
  };

  window.refillHopper = function() {
    state.biomass.fuelLevel = 100.0;
    addAlert('success', 'Biomass Replenished', 'Dewatering Biomass hopper refilled to 100%.');
    addSimLog('Control: Biomass fuel level replenished to 100.0%.');
    window.dispatchEvent(new CustomEvent('telemetry-tick'));
  };

  window.resetSimulationSettings = function() {
    state.environment.rainfall = 0;
    state.environment.solarShading = 0;
    state.biomass.fuelLevel = 68.0;
    
    const rSlider = document.getElementById('rain-slider');
    const sSlider = document.getElementById('shading-slider');
    if (rSlider) rSlider.value = 0;
    if (sSlider) sSlider.value = 0;
    
    updateSliderLabels();
    addSimLog('Control: Environmental simulator settings reset to default.');
    window.dispatchEvent(new CustomEvent('telemetry-tick'));
  };

  // Add the dynamic listener to update fields on tick
  const handleTick = () => {
    updateSliderLabels();
    renderPredictiveTable();
    updateSimulationLogs();
  };

  window.addEventListener('telemetry-tick', handleTick);

  // Clean up listener
  container.addEventListener('destroy-page', () => {
    window.removeEventListener('telemetry-tick', handleTick);
  }, { once: true });
}

function updateSliderLabels() {
  const rVal = document.getElementById('rain-val');
  const sVal = document.getElementById('shading-val');
  const bioFuel = document.getElementById('sim-biomass-fuel');
  
  if (rVal) rVal.textContent = `${state.environment.rainfall.toFixed(1)} mm/h`;
  if (sVal) sVal.textContent = `${state.environment.solarShading}% Shading`;
  if (bioFuel) bioFuel.textContent = `Hopper Fuel Level: ${state.biomass.fuelLevel.toFixed(1)}%`;
}

// Simulated logger helper
const logHistory = [
  "System: SCADA monitoring loop connected to local telemetry node.",
  "System: Primary electrical bus active. Solar arrays ready.",
  "System: Autoregulation subroutines compiled. Standing by."
];

function addSimLog(text) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  logHistory.unshift(`[${time}] ${text}`);
  if (logHistory.length > 30) logHistory.pop();
  updateSimulationLogs();
}

function updateSimulationLogs() {
  const logsDiv = document.getElementById('sim-event-logs');
  if (!logsDiv) return;

  // Let's also check if telemetry states trigger log notifications in real-time
  // (We'll check state variables to automatically log decisions)
  const totalLoad = state.pumps.filter(p => p.status === 'running').reduce((acc, p) => acc + p.power, 0);
  const totalGen = state.solar.power + state.biomass.power;
  
  if (state.autoMode && Math.random() > 0.85) {
    if (state.battery.soc < 60 && state.biomass.running && totalGen > totalLoad) {
      addSimLog(`Automation: Solar power low (${state.solar.power.toFixed(1)} kW). Biomass supplementing. Battery charging at ${state.battery.current.toFixed(1)}A.`);
    }
    if (state.water.sump1.level > 70) {
      addSimLog(`Automation: Sump Alpha level is high (${state.water.sump1.level.toFixed(0)}%). Prioritizing Pump Alpha flow rates.`);
    }
  }

  logsDiv.innerHTML = logHistory.map(log => `
    <div style="margin-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.01); padding-bottom: 2px;">
      ${log}
    </div>
  `).join('');
}

function renderPredictiveTable() {
  const container = document.getElementById('predictive-table');
  if (!container) return;

  container.innerHTML = state.pumps.map(p => {
    // Calculate simulated vibration index and health score
    let vibration = 0.05 + (p.hours / 3000) * 0.4;
    if (p.status === 'running') vibration += (Math.random() - 0.5) * 0.03;
    
    // Health score: 100 - hours-factor - temp-factor
    const hoursLoss = (p.hours / 3000) * 15;
    const tempLoss = p.temp > 68 ? (p.temp - 60) * 0.8 : 0;
    const health = Math.max(10, Math.min(100, +(100 - hoursLoss - tempLoss).toFixed(0)));
    
    let healthColor = 'color: var(--green);';
    let recommendation = '✅ Optimal telemetry. Normal inspection cycle.';
    
    if (health < 60) {
      healthColor = 'color: var(--red); font-weight:700;';
      recommendation = '🚨 CRITICAL: Schedule impeller replacement immediately.';
    } else if (health < 80) {
      healthColor = 'color: var(--solar); font-weight:700;';
      recommendation = '⚠️ WARNING: Bearing lubrication cycle overdue. Inspect within 48h.';
    }

    return `
      <tr>
        <td style="font-family: var(--font-mono); font-weight:600;">${p.id}</td>
        <td><strong>${p.name}</strong></td>
        <td style="font-family: var(--font-mono);">${p.status === 'running' ? vibration.toFixed(3) + ' mm/s' : '—'}</td>
        <td style="font-family: var(--font-mono);">${p.temp.toFixed(0)}°C</td>
        <td style="font-family: var(--font-mono);">${p.hours.toFixed(0)} hrs</td>
        <td style="${healthColor}">${health}% Health</td>
        <td style="font-size:0.82rem; font-weight:500;">${recommendation}</td>
      </tr>`;
  }).join('');
}
